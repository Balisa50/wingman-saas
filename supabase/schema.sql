-- Wingman Database Schema
-- Run this in your Supabase SQL editor

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  subscription_status text default 'free',
  sessions_used_this_month integer default 0,
  created_at timestamp with time zone default now()
);

create table sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  mode text not null, -- 'dating' | 'sales' | 'negotiation' | 'difficult'
  started_at timestamp with time zone default now(),
  ended_at timestamp with time zone,
  duration_seconds integer,
  score integer, -- 1-100
  transcript text,
  coaching_tips jsonb default '[]',
  debrief jsonb,
  created_at timestamp with time zone default now()
);

create table coaching_tips (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references sessions(id) on delete cascade,
  timestamp_seconds integer,
  tip_text text,
  trigger_text text, -- what was said that triggered this tip
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table sessions enable row level security;
alter table coaching_tips enable row level security;

-- RLS Policies
create policy "Users can only access own data"
  on profiles for all
  using (auth.uid() = id);

create policy "Users can only access own sessions"
  on sessions for all
  using (auth.uid() = user_id);

create policy "Users can access own tips"
  on coaching_tips for all
  using (
    session_id in (select id from sessions where user_id = auth.uid())
  );

-- Indexes for performance
create index idx_sessions_user_id on sessions(user_id);
create index idx_sessions_created_at on sessions(created_at desc);
create index idx_coaching_tips_session_id on coaching_tips(session_id);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
