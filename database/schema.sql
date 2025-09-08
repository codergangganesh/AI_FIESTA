-- Create profiles table for user data
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.profiles enable row level security;

-- Create policy for profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Create conversations table
create table public.conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for conversations
alter table public.conversations enable row level security;

-- Create policies for conversations
create policy "Users can view own conversations" on public.conversations
  for select using (auth.uid() = user_id);

create policy "Users can insert own conversations" on public.conversations
  for insert with check (auth.uid() = user_id);

create policy "Users can update own conversations" on public.conversations
  for update using (auth.uid() = user_id);

create policy "Users can delete own conversations" on public.conversations
  for delete using (auth.uid() = user_id);

-- Create AI responses table
create table public.ai_responses (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  model_name text not null,
  response text not null,
  is_best_response boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for ai_responses
alter table public.ai_responses enable row level security;

-- Create policies for ai_responses
create policy "Users can view responses for own conversations" on public.ai_responses
  for select using (
    auth.uid() in (
      select user_id from public.conversations where id = conversation_id
    )
  );

create policy "Users can insert responses for own conversations" on public.ai_responses
  for insert with check (
    auth.uid() in (
      select user_id from public.conversations where id = conversation_id
    )
  );

create policy "Users can update responses for own conversations" on public.ai_responses
  for update using (
    auth.uid() in (
      select user_id from public.conversations where id = conversation_id
    )
  );

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();