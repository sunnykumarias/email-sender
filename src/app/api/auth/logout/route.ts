import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export async function GET() {
    await deleteSession();
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
