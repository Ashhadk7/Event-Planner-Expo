create extension if not exists pgcrypto;

create table if not exists speakers (
  id            uuid primary key default gen_random_uuid(),
  invite_token  text unique not null,
  password_hash text not null,
  email         text not null,
  status        text not null default 'invited',
  approved_data jsonb,
  pending_data  jsonb,
  has_pending   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists speakers_approved_idx on speakers ((approved_data is not null));
create index if not exists speakers_pending_idx  on speakers (has_pending);
