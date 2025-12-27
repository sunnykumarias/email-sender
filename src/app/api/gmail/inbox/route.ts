import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedGmail } from '@/lib/gmail-authorized';

export async function GET(request: NextRequest) {
    const gmail = await getAuthorizedGmail();
    if (!gmail) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const pageToken = searchParams.get('pageToken');

    try {
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 20,
            pageToken: pageToken || undefined,
            q: 'label:INBOX',
        });

        const messages = await Promise.all(
            (response.data.messages || []).map(async (msg) => {
                const detail = await gmail.users.messages.get({
                    userId: 'me',
                    id: msg.id!,
                    format: 'metadata',
                    metadataHeaders: ['From', 'Subject', 'Date'],
                });

                const headers = detail.data.payload?.headers || [];
                return {
                    id: msg.id,
                    threadId: msg.threadId,
                    snippet: detail.data.snippet,
                    from: headers.find((h) => h.name === 'From')?.value,
                    subject: headers.find((h) => h.name === 'Subject')?.value,
                    date: headers.find((h) => h.name === 'Date')?.value,
                    isUnread: detail.data.labelIds?.includes('UNREAD'),
                };
            })
        );

        return NextResponse.json({
            messages,
            nextPageToken: response.data.nextPageToken,
        });
    } catch (error) {
        console.error('Gmail inbox error:', error);
        return NextResponse.json({ error: 'Failed to fetch inbox' }, { status: 500 });
    }
}
