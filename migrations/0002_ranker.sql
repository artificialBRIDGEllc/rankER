create table if not exists audits (
  id text primary key,
  user_id text not null,
  host text not null,
  url text not null,
  source text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists audits_user_id_idx on audits (user_id);
create index if not exists audits_host_idx on audits (host);

create table if not exists orders (
  id text primary key,
  user_id text not null,
  kind text not null,
  sku text not null,
  label text not null,
  amount_cents integer not null,
  status text not null,
  stripe_session_id text,
  payload jsonb,
  created_at timestamptz not null default now()
);
create index if not exists orders_user_id_idx on orders (user_id);

create table if not exists generated_sites (
  id text primary key,
  user_id text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists generated_sites_user_id_idx on generated_sites (user_id);

create table if not exists domain_orders (
  id text primary key,
  user_id text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists domain_orders_user_id_idx on domain_orders (user_id);

create table if not exists counsel_engagements (
  id text primary key,
  user_id text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists counsel_engagements_user_id_idx on counsel_engagements (user_id);

create table if not exists nonprofit_requests (
  id text primary key,
  user_id text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists nonprofit_requests_user_id_idx on nonprofit_requests (user_id);
