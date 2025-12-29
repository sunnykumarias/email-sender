import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedGmail } from '@/lib/gmail-authorized';
import { constructRawEmail } from '@/lib/gmail';
import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/db';

export async function POST(request: NextRequest) {
    const session = await getSession();
    const gmail = await getAuthorizedGmail();
    if (!gmail || !session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { to, cc, bcc, subject, body, threadId, messageId, attachments } = await request.json();

        if (!to || !subject || !body) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Fetch settings
        const { data: settings } = await supabase
            .from('accounts')
            .select('sender_name, signature_html')
            .eq('email', session.email)
            .single();

        const fromName = settings?.sender_name;
        const fromHeader = fromName ? `"${fromName}" <${session.email}>` : session.email;

        const raw = constructRawEmail({
            to,
            cc,
            bcc,
            from: fromHeader,
            subject,
            body,
            threadId,
            messageId,
            customFooter: settings?.signature_html || undefined,
            attachments
        });


        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw,
                threadId,
            },
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Gmail send error:', error);
        return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 });
    }
}
