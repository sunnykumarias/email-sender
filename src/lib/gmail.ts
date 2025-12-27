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
}) {
    const boundary = "__boundary__";
    const footer = customFooter || FOOTER_HTML;
    const fullBody = `${body}${footer}`;

    const headers = [
        `From: ${from}`,
        `To: ${to}`,
    ];

    if (cc) headers.push(`Cc: ${cc}`);
    if (bcc) headers.push(`Bcc: ${bcc}`);

    headers.push(`Subject: ${subject}`);
    headers.push(`Content-Type: text/html; charset=utf-8`);
    headers.push(`MIME-Version: 1.0`);

    if (messageId) {
        headers.push(`In-Reply-To: ${messageId}`);
        headers.push(`References: ${messageId}`);
    }

    const email = [
        ...headers,
        '',
        fullBody,
    ].join('\r\n');

    return Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
