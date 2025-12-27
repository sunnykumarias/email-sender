import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/db';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
        .from('accounts')
        .select('sender_name, signature_html')
        .eq('email', session.email)
        .single();

    if (error && error.code !== 'PGRST116') return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
        email: session.email,
        sender_name: data?.sender_name || '',
        signature_html: data?.signature_html || ''
    });
}

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { sender_name, signature_html } = await request.json();

    const { error } = await supabase
        .from('accounts')
        .upsert({
            email: session.email,
            sender_name,
            signature_html,
            updated_at: new Date()
        }, { onConflict: 'email' });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
