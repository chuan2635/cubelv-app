-- CubeLV schema. No subscription/credits/payment tables by design —
-- see docs/PRD.md section 10. All features are free for any signed-in user;
-- row-level security only separates each user's own workspace data.

create extension if not exists "pgcrypto";

create table folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'department' check (type in ('workspace', 'department')),
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table agents (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid not null references folders(id) on delete cascade,
  name text not null,
  instructions text not null default '',
  ai_model text not null default 'Auto',
  max_rounds int not null default 30,
  schedule_cron text[] not null default '{}',
  schedule_enabled boolean not null default false,
  notifications_enabled boolean not null default true,
  avatar_icon text not null default '🤖',
  status_label text not null default '開置',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table agent_memories (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade unique,
  content text not null default '',
  updated_at timestamptz not null default now()
);

create table agent_skills (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  skill_type text not null,
  label text not null,
  enabled boolean not null default true,
  config jsonb not null default '{}'::jsonb
);

-- Monitoring-only usage stats: no monthly_limit / credits_used columns,
-- nothing here is ever checked to block or throttle an Agent run.
create table agent_usage_stats (
  agent_id uuid primary key references agents(id) on delete cascade,
  tokens_used_total bigint not null default 0,
  executions_count int not null default 0,
  last_7_days_avg_tokens numeric not null default 0
);

create table execution_logs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  triggered_by text not null check (triggered_by in ('手動', 'chat', '排程')),
  status text not null check (status in ('success', 'cancelled', 'failed', 'running')),
  duration_seconds int not null default 0,
  tokens_used bigint not null default 0,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table notes (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid not null references folders(id) on delete cascade,
  title text not null,
  content text not null default '',
  created_by_agent_id uuid references agents(id) on delete set null,
  created_at timestamptz not null default now()
);

create table todos (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid not null references folders(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  parent_id uuid references todos(id) on delete cascade,
  assigned_to_agent_id uuid references agents(id) on delete set null,
  due_at timestamptz,
  created_at timestamptz not null default now()
);

create table charts (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid not null references folders(id) on delete cascade,
  title text not null,
  chart_type text not null default 'line' check (chart_type in ('line', 'bar')),
  series text[] not null default '{}',
  data jsonb not null default '[]'::jsonb,
  created_by_agent_id uuid references agents(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Row Level Security: every table is scoped back to folders.owner_id = auth.uid().
-- No plan/tier check anywhere — being signed in is the only gate.

alter table folders enable row level security;
alter table agents enable row level security;
alter table agent_memories enable row level security;
alter table agent_skills enable row level security;
alter table agent_usage_stats enable row level security;
alter table execution_logs enable row level security;
alter table notes enable row level security;
alter table todos enable row level security;
alter table charts enable row level security;

create policy "folders_owner_all" on folders
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "agents_owner_all" on agents
  for all using (
    exists (select 1 from folders f where f.id = agents.folder_id and f.owner_id = auth.uid())
  ) with check (
    exists (select 1 from folders f where f.id = agents.folder_id and f.owner_id = auth.uid())
  );

create policy "agent_memories_owner_all" on agent_memories
  for all using (
    exists (
      select 1 from agents a join folders f on f.id = a.folder_id
      where a.id = agent_memories.agent_id and f.owner_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from agents a join folders f on f.id = a.folder_id
      where a.id = agent_memories.agent_id and f.owner_id = auth.uid()
    )
  );

create policy "agent_skills_owner_all" on agent_skills
  for all using (
    exists (
      select 1 from agents a join folders f on f.id = a.folder_id
      where a.id = agent_skills.agent_id and f.owner_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from agents a join folders f on f.id = a.folder_id
      where a.id = agent_skills.agent_id and f.owner_id = auth.uid()
    )
  );

create policy "agent_usage_stats_owner_all" on agent_usage_stats
  for all using (
    exists (
      select 1 from agents a join folders f on f.id = a.folder_id
      where a.id = agent_usage_stats.agent_id and f.owner_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from agents a join folders f on f.id = a.folder_id
      where a.id = agent_usage_stats.agent_id and f.owner_id = auth.uid()
    )
  );

create policy "execution_logs_owner_all" on execution_logs
  for all using (
    exists (
      select 1 from agents a join folders f on f.id = a.folder_id
      where a.id = execution_logs.agent_id and f.owner_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from agents a join folders f on f.id = a.folder_id
      where a.id = execution_logs.agent_id and f.owner_id = auth.uid()
    )
  );

create policy "notes_owner_all" on notes
  for all using (
    exists (select 1 from folders f where f.id = notes.folder_id and f.owner_id = auth.uid())
  ) with check (
    exists (select 1 from folders f where f.id = notes.folder_id and f.owner_id = auth.uid())
  );

create policy "todos_owner_all" on todos
  for all using (
    exists (select 1 from folders f where f.id = todos.folder_id and f.owner_id = auth.uid())
  ) with check (
    exists (select 1 from folders f where f.id = todos.folder_id and f.owner_id = auth.uid())
  );

create policy "charts_owner_all" on charts
  for all using (
    exists (select 1 from folders f where f.id = charts.folder_id and f.owner_id = auth.uid())
  ) with check (
    exists (select 1 from folders f where f.id = charts.folder_id and f.owner_id = auth.uid())
  );
