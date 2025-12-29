import { NextRequest, NextResponse } from 'next/server';
import { getOAuthClient } from '@/lib/gmail';
import { saveAccount } from '@/lib/db';
import { createSession, encryptToken } from '@/lib/auth';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/?error=no_code', request.url));
    }

    try {
        const client = getOAuthClient();
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        // Get user info
        const oauth2 = google.oauth2({ version: 'v2', auth: client });
        const { data: userInfo } = await oauth2.userinfo.get();

        if (!userInfo.email) {
            throw new Error('No email found in user info');
        }

        // Save refresh token if available
        if (tokens.refresh_token) {
            const encryptedToken = await encryptToken(tokens.refresh_token);
            await saveAccount(userInfo.email, encryptedToken);
        }

        // Create session
        await createSession(userInfo.id || userInfo.email, userInfo.email);

        return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(new URL('/#error=auth_failed', request.url));
    }
}
