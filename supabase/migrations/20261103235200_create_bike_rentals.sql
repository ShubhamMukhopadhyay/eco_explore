create table public.bike_rentals (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  phone text not null,
  email text,
  bike_id text not null check (bike_id in ('city', 'mountain', 'ebike')),
  bike_name text not null,
  quantity integer not null check (quantity between 1 and 10),
  duration_id text not null check (duration_id in ('hour', 'half', 'full')),
  duration_label text not null,
  duration_hours integer not null check (duration_hours > 0),
  pickup_location text not null check (pickup_location in ('Anjuna', 'Vagator', 'Assagao', 'Panjim', 'Palolem', 'Morjim')),
  pickup_date date not null,
  estimated_total numeric(10, 2) not null check (estimated_total >= 0),
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now()
);

alter table public.bike_rentals enable row level security;

revoke all on table public.bike_rentals from anon, authenticated;
grant insert on table public.bike_rentals to anon, authenticated;

create policy "Customers can create bike rental bookings"
  on public.bike_rentals for insert
  to anon, authenticated
  with check (user_id is not distinct from auth.uid());
