import { getSession, decryptToken } from '@/lib/auth';
import { getAccount } from '@/lib/db';
import { getOAuthClient, getGmailClient } from '@/lib/gmail';

export async function getAuthorizedGmail() {
    const session = await getSession();
    if (!session) return null;

    const account = await getAccount(session.email);
    if (!account || !account.refresh_token) return null;

    const refreshToken = await decryptToken(account.refresh_token);
    const client = getOAuthClient();
    client.setCredentials({ refresh_token: refreshToken });

    return getGmailClient(client);
}
