import { NextResponse } from 'next/server';
import { getOAuthClient } from '@/lib/gmail';

export async function GET() {
    const client = getOAuthClient();
    const url = client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ],
    });

    return NextResponse.redirect(url);
}
