import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role for backend operations

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveAccount(email: string, refreshToken: string) {
    const { data, error } = await supabase
        .from('accounts')
        .upsert({ email, refresh_token: refreshToken, updated_at: new Date() }, { onConflict: 'email' });

    if (error) throw error;
    return data;
}

export async function getAccount(email: string) {
    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('email', email)
        .single();

    if (error) return null;
    return data;
}
