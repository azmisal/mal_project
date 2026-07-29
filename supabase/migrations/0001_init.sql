create extension if not exists "pgcrypto";

create type referral_source as enum (
  'facebook', 'instagram', 'tiktok', 'google_search',
  'friend_family', 'whatsapp_group', 'other'
);

create type market as enum ('pakistan');

create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text,
  phone text,
  referral_source referral_source not null,
  market market not null default 'pakistan',
  created_at timestamptz not null default now()
);

alter table public.waitlist_signups enable row level security;

alter table public.waitlist_signups
add constraint exactly_one_contact
check ((email is not null)::int + (phone is not null)::int = 1);

create unique index waitlist_unique_email_market
  on public.waitlist_signups (lower(email), market)
  where email is not null;

create unique index waitlist_unique_phone_market
  on public.waitlist_signups (phone, market)
  where phone is not null;