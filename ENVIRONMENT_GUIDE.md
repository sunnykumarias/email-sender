# Environment Variables Guide

To run this application, you need to set the following environment variables in Vercel or your local `.env.local` file:

### Google OAuth (from Google Cloud Console)
- `GOOGLE_CLIENT_ID`: `1003340652698-f2e770qai0htb8c1rqed2m5ffnj3vbr9.apps.googleusercontent.com`
- `GOOGLE_CLIENT_SECRET`: `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`
- `GOOGLE_REDIRECT_URI`: `http://localhost:3000/auth/callback` (local) or `https://your-domain.vercel.app/auth/callback` (production).

### Database (Supabase)
- `SUPABASE_URL`: `https://gmlijdvrmqwxgemcyimi.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY`: `sb_publishable_SmHH2sizuc_WgSMBlZZj8A_tVOYvXpp`

### Authentication & Security
- `JWT_SECRET`: A random 32+ character string for signing session cookies.
- `ENCRYPTION_KEY`: A 32-character string for encrypting refresh tokens.

### Database Schema
Run this SQL in your Supabase SQL Editor:
```sql
create table accounts (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  refresh_token text not null,
  sender_name text,
  signature_html text,
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);
```
