import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback';

export function getOAuthClient() {
    return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
}

export function getGmailClient(auth: OAuth2Client) {
    return google.gmail({ version: 'v1', auth });
}

import { FOOTER_HTML } from './constants';

export function constructRawEmail({
    to,
    cc,
    bcc,
    from,
    subject,
    body,
    threadId,
    messageId,
    customFooter,
    attachments,
}: {
    to: string;
    cc?: string;
    bcc?: string;
    from: string;
    subject: string;
    body: string;
    threadId?: string;
    messageId?: string;
    customFooter?: string;
    attachments?: { filename: string; mimeType: string; content: string }[];
}) {
    const boundary = "signature_pro_boundary_v1";
    const footer = customFooter || FOOTER_HTML;
    const fullBody = `${body}${footer}`;

    const headers = [
        `From: ${from}`,
        `To: ${to}`,
    ];

    if (cc) headers.push(`Cc: ${cc}`);
    if (bcc) headers.push(`Bcc: ${bcc}`);

    headers.push(`Subject: ${subject}`);
    headers.push(`MIME-Version: 1.0`);

    if (messageId) {
        headers.push(`In-Reply-To: ${messageId}`);
        headers.push(`References: ${messageId}`);
    }

    let email = "";

    if (attachments && attachments.length > 0) {
        headers.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
        email += headers.join('\r\n') + '\r\n\r\n';

        // Body part
        email += `--${boundary}\r\n`;
        email += `Content-Type: text/html; charset=utf-8\r\n\r\n`;
        email += fullBody + '\r\n\r\n';

        // Attachment parts
        for (const attachment of attachments) {
            email += `--${boundary}\r\n`;
            email += `Content-Type: ${attachment.mimeType}; name="${attachment.filename}"\r\n`;
            email += `Content-Disposition: attachment; filename="${attachment.filename}"\r\n`;
            email += `Content-Transfer-Encoding: base64\r\n\r\n`;
            email += attachment.content + '\r\n\r\n';
        }
        email += `--${boundary}--`;
    } else {
        headers.push(`Content-Type: text/html; charset=utf-8`);
        email = [
            ...headers,
            '',
            fullBody,
        ].join('\r\n');
    }

    return Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
