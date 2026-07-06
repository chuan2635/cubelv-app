// Supabase Edge Function: run-agent
//
// Executes one Agent run: loads its instructions/memory/enabled skills,
// drives the Claude API tool-use loop up to `max_rounds`, and logs the
// result. Every request is scoped to the caller's own JWT (forwarded from
// the client), so every read/write goes through the same RLS policies as
// the rest of the app — there is no service-role bypass and no billing
// check anywhere in this file (see docs/PRD.md section 10).
//
// Deploy: supabase functions deploy run-agent
// Secrets: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

const MODEL_ALIASES: Record<string, string> = {
  Auto: 'claude-sonnet-5',
  'claude-sonnet-5': 'claude-sonnet-5',
  'claude-opus-4-8': 'claude-opus-4-8',
  'claude-haiku-4-5': 'claude-haiku-4-5-20251001',
}

const TOOL_DEFINITIONS: Record<string, unknown> = {
  read_folder: {
    name: 'read_folder',
    description: '讀取指定資料夾內的筆記、待辦、圖表摘要',
    input_schema: {
      type: 'object',
      properties: { folder_id: { type: 'string' } },
      required: ['folder_id'],
    },
  },
  create_note: {
    name: 'create_note',
    description: '在指定資料夾新增一篇筆記',
    input_schema: {
      type: 'object',
      properties: {
        folder_id: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string', description: 'Markdown 內容' },
      },
      required: ['folder_id', 'title', 'content'],
    },
  },
  update_note: {
    name: 'update_note',
    description: '更新既有筆記的內容',
    input_schema: {
      type: 'object',
      properties: { note_id: { type: 'string' }, content: { type: 'string' } },
      required: ['note_id', 'content'],
    },
  },
  create_todo: {
    name: 'create_todo',
    description: '在指定資料夾新增一則待辦',
    input_schema: {
      type: 'object',
      properties: {
        folder_id: { type: 'string' },
        title: { type: 'string' },
        due_at: { type: 'string', description: 'ISO 8601，可省略' },
      },
      required: ['folder_id', 'title'],
    },
  },
  create_chart: {
    name: 'create_chart',
    description: '在指定資料夾新增一個圖表',
    input_schema: {
      type: 'object',
      properties: {
        folder_id: { type: 'string' },
        title: { type: 'string' },
        chart_type: { type: 'string', enum: ['line', 'bar'] },
        series: { type: 'array', items: { type: 'string' } },
        data: { type: 'array', items: { type: 'object' }, description: '每筆為 { label, [series]: number }' },
      },
      required: ['folder_id', 'title', 'chart_type', 'series', 'data'],
    },
  },
  web_search: {
    name: 'web_search',
    description: '搜尋網路上的公開資訊',
    input_schema: {
      type: 'object',
      properties: { query: { type: 'string' } },
      required: ['query'],
    },
  },
  fetch_stock_data: {
    name: 'fetch_stock_data',
    description: '抓取台股個股當月每日成交資訊（資料來源：證交所公開資訊）',
    input_schema: {
      type: 'object',
      properties: {
        stock_no: { type: 'string', description: '股票代號，例如 2330' },
        date: { type: 'string', description: 'YYYYMMDD，代表該月份，例如 20260701' },
      },
      required: ['stock_no', 'date'],
    },
  },
}

type SupabaseClient = ReturnType<typeof createClient>

async function executeTool(supabase: SupabaseClient, name: string, input: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'read_folder': {
      const folderId = input.folder_id as string
      const [notes, todos, charts] = await Promise.all([
        supabase.from('notes').select('id, title, created_at').eq('folder_id', folderId),
        supabase.from('todos').select('id, title, completed').eq('folder_id', folderId),
        supabase.from('charts').select('id, title, chart_type').eq('folder_id', folderId),
      ])
      return { notes: notes.data ?? [], todos: todos.data ?? [], charts: charts.data ?? [] }
    }
    case 'create_note': {
      const { data, error } = await supabase
        .from('notes')
        .insert({ folder_id: input.folder_id, title: input.title, content: input.content })
        .select()
        .single()
      if (error) return { error: error.message }
      return data
    }
    case 'update_note': {
      const { data, error } = await supabase
        .from('notes')
        .update({ content: input.content })
        .eq('id', input.note_id)
        .select()
        .single()
      if (error) return { error: error.message }
      return data
    }
    case 'create_todo': {
      const { data, error } = await supabase
        .from('todos')
        .insert({ folder_id: input.folder_id, title: input.title, due_at: input.due_at ?? null })
        .select()
        .single()
      if (error) return { error: error.message }
      return data
    }
    case 'create_chart': {
      const { data, error } = await supabase
        .from('charts')
        .insert({
          folder_id: input.folder_id,
          title: input.title,
          chart_type: input.chart_type,
          series: input.series,
          data: input.data,
        })
        .select()
        .single()
      if (error) return { error: error.message }
      return data
    }
    case 'web_search':
      return { error: '此環境尚未設定網路搜尋服務，無法執行 web_search。' }
    case 'fetch_stock_data': {
      const stockNo = input.stock_no as string
      const date = input.date as string
      const url = `https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=${date}&stockNo=${stockNo}`
      const res = await fetch(url)
      if (!res.ok) return { error: `證交所 API 回應失敗：${res.status}` }
      return await res.json()
    }
    default:
      return { error: `未知的 tool：${name}` }
  }
}

async function callClaude(model: string, system: string, messages: unknown[], tools: unknown[]) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model, max_tokens: 4096, system, messages, tools: tools.length > 0 ? tools : undefined }),
  })
  if (!res.ok) {
    throw new Error(`Claude API 錯誤：${res.status} ${await res.text()}`)
  }
  return res.json()
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }
  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), { status: 500 })
  }

  const authHeader = req.headers.get('Authorization') ?? ''
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  })

  const { agentId } = await req.json()

  const { data: agent, error: agentError } = await supabase.from('agents').select('*').eq('id', agentId).single()
  if (agentError || !agent) {
    return new Response(JSON.stringify({ error: 'Agent not found or not accessible' }), { status: 404 })
  }

  const [{ data: memory }, { data: skills }] = await Promise.all([
    supabase.from('agent_memories').select('*').eq('agent_id', agentId).single(),
    supabase.from('agent_skills').select('*').eq('agent_id', agentId).eq('enabled', true),
  ])

  const { data: log } = await supabase
    .from('execution_logs')
    .insert({ agent_id: agentId, triggered_by: '手動', status: 'running', started_at: new Date().toISOString() })
    .select()
    .single()

  const startedAt = Date.now()
  const system = [agent.instructions, memory?.content].filter(Boolean).join('\n\n')
  const tools = (skills ?? []).map((s) => TOOL_DEFINITIONS[s.skill_type]).filter(Boolean)
  const messages: unknown[] = [{ role: 'user', content: '請依照你的指令與長期記憶開始執行本次任務。' }]

  let totalTokens = 0
  let status: 'success' | 'failed' = 'success'
  let round = 0

  try {
    while (round < agent.max_rounds) {
      round += 1
      const response = await callClaude(MODEL_ALIASES[agent.ai_model] ?? 'claude-sonnet-5', system, messages, tools)
      totalTokens += (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0)
      messages.push({ role: 'assistant', content: response.content })

      const toolUseBlocks = (response.content ?? []).filter((b: { type: string }) => b.type === 'tool_use')
      if (toolUseBlocks.length === 0) break

      const toolResults = await Promise.all(
        toolUseBlocks.map(async (block: { id: string; name: string; input: Record<string, unknown> }) => ({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify(await executeTool(supabase, block.name, block.input)),
        })),
      )
      messages.push({ role: 'user', content: toolResults })
    }
  } catch (err) {
    status = 'failed'
    console.error(err)
  }

  const durationSeconds = Math.round((Date.now() - startedAt) / 1000)
  const endedAt = new Date().toISOString()

  if (log) {
    await supabase
      .from('execution_logs')
      .update({ status, duration_seconds: durationSeconds, tokens_used: totalTokens, ended_at: endedAt })
      .eq('id', log.id)
  }

  const { data: existingStats } = await supabase.from('agent_usage_stats').select('*').eq('agent_id', agentId).single()
  await supabase.from('agent_usage_stats').upsert({
    agent_id: agentId,
    tokens_used_total: (existingStats?.tokens_used_total ?? 0) + totalTokens,
    executions_count: (existingStats?.executions_count ?? 0) + 1,
    last_7_days_avg_tokens: existingStats?.last_7_days_avg_tokens ?? 0,
  })

  return new Response(JSON.stringify({ status, durationSeconds, tokensUsed: totalTokens, rounds: round }), {
    headers: { 'content-type': 'application/json' },
  })
})
