alter table public.profiles
  add column username text;

update public.profiles
set username = coalesce(
  nullif(btrim(full_name), ''),
  nullif(split_part(email, '@', 1), '')
)
where username is null;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_username text;
  profile_name text;
begin
  profile_username := coalesce(
    nullif(btrim(new.raw_user_meta_data->>'username'), ''),
    nullif(btrim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(btrim(new.raw_user_meta_data->>'name'), ''),
    split_part(new.email, '@', 1)
  );
  profile_name := coalesce(
    nullif(btrim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(btrim(new.raw_user_meta_data->>'name'), ''),
    profile_username
  );

  insert into public.profiles (id, email, username, full_name, avatar_url)
  values (
    new.id,
    new.email,
    profile_username,
    profile_name,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

insert into public.profiles (id, email, username, full_name, avatar_url)
select
  users.id,
  users.email,
  coalesce(
    nullif(btrim(users.raw_user_meta_data->>'username'), ''),
    nullif(btrim(users.raw_user_meta_data->>'full_name'), ''),
    nullif(btrim(users.raw_user_meta_data->>'name'), ''),
    split_part(users.email, '@', 1)
  ),
  coalesce(
    nullif(btrim(users.raw_user_meta_data->>'full_name'), ''),
    nullif(btrim(users.raw_user_meta_data->>'name'), ''),
    split_part(users.email, '@', 1)
  ),
  users.raw_user_meta_data->>'avatar_url'
from auth.users as users
on conflict (id) do nothing;
