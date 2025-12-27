import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedGmail } from '@/lib/gmail-authorized';

export async function GET(request: NextRequest) {
    const gmail = await getAuthorizedGmail();
    if (!gmail) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Message ID required' }, { status: 400 });
    }

    try {
        const response = await gmail.users.messages.get({
            userId: 'me',
            id,
        });

        const msg = response.data;
        const headers = msg.payload?.headers || [];

        // Extract body
        let body = '';
        const parts = [msg.payload];
        while (parts.length > 0) {
            const part = parts.shift();
            if (part?.parts) {
                parts.push(...part.parts);
            }
            if (part?.mimeType === 'text/html' && part.body?.data) {
                body = Buffer.from(part.body.data, 'base64').toString('utf-8');
                break;
            }
            if (part?.mimeType === 'text/plain' && part.body?.data && !body) {
                body = Buffer.from(part.body.data, 'base64').toString('utf-8').replace(/\n/g, '<br>');
            }
        }

        // Mark as read
        if (msg.labelIds?.includes('UNREAD')) {
            await gmail.users.messages.batchModify({
                userId: 'me',
                ids: [id],
                removeLabelIds: ['UNREAD'],
            });
        }

        return NextResponse.json({
            id: msg.id,
            threadId: msg.threadId,
            snippet: msg.snippet,
            from: headers.find((h) => h.name === 'From')?.value,
            to: headers.find((h) => h.name === 'To')?.value,
            subject: headers.find((h) => h.name === 'Subject')?.value,
            date: headers.find((h) => h.name === 'Date')?.value,
            messageId: headers.find((h) => h.name === 'Message-ID')?.value,
            body: body,
        });
    } catch (error) {
        console.error('Gmail read error:', error);
        return NextResponse.json({ error: 'Failed to read message' }, { status: 500 });
    }
}
