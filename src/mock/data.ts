import type {
  Agent,
  AgentMemory,
  AgentSkill,
  AgentUsageStats,
  Chart,
  ExecutionLog,
  Folder,
  Note,
  Todo,
} from '../types'

export const mockFolders: Folder[] = [
  { id: 'f-invest', name: '投資研究部', type: 'department', ownerId: 'me', createdAt: '2026-01-01T00:00:00Z' },
]

export const mockAgents: Agent[] = [
  {
    id: 'c92d7afd54a92c9d56f6d636',
    folderId: 'f-invest',
    name: '消息監控員',
    instructions: '1. 每日監控台股相關新聞與公告\n2. 篩選出可能影響持股的重大訊息\n3. 摘要整理後存入 📋 投資研究筆記',
    aiModel: 'Auto',
    maxRounds: 30,
    scheduleCron: ['每日 08:00'],
    scheduleEnabled: true,
    notificationsEnabled: true,
    avatarIcon: '📰',
    statusLabel: '開置',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z',
  },
  {
    id: '20112556a7db67e2a57d053e',
    folderId: 'f-invest',
    name: '技術研究員',
    instructions:
      '3. 分析K線走勢，找出關鍵支撐/壓力、突破訊號、反轉型態\n4. 撰寫每週技術面研究報告，存入 📋 投資研究筆記\n5. 若有值得關注的技術訊號，建立圖表存入 🗃 技術圖表',
    aiModel: 'Auto',
    maxRounds: 50,
    scheduleCron: ['每週五 15:30'],
    scheduleEnabled: false,
    notificationsEnabled: true,
    avatarIcon: '📈',
    statusLabel: '開置',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z',
  },
]

export const mockAgentMemories: Record<string, AgentMemory> = {
  c92d7afd54a92c9d56f6d636: {
    id: 'mem-1',
    agentId: 'c92d7afd54a92c9d56f6d636',
    content: `# 消息監控員長期記憶

## 團隊結構
- 投資研究部 AI 公司（AICOMPANY_FOLDER:217965997d8a05ff95fac640）
- 消息監控員 agent（c92d7afd54a92c9d56f6d636）：每日監控台股消息
- 技術研究員 agent（20112556a7db67e2a57d053e）：每週五 15:30 執行技術分析報告
- 協作任務 TODO（6a4284bb541cdaa187d6d935）：統一歸檔所有子任務

## 關鍵資料夾 ID
- 投資研究筆記（NOTE_FOLDER）：084d9b6185c99bde8f842bee
- 投資待辦（TODO_FOLDER）：5b5ef6f89a3c72b165476ac3
`,
    updatedAt: '2026-07-01T00:00:00Z',
  },
  '20112556a7db67e2a57d053e': {
    id: 'mem-2',
    agentId: '20112556a7db67e2a57d053e',
    content: `# 技術研究員長期記憶

## 團隊結構
- 投資研究部 AI 公司（AICOMPANY_FOLDER:217965997d8a05ff95fac640）
- 消息監控員 agent（c92d7afd54a92c9d56f6d636）
- 技術研究員 agent（20112556a7db67e2a57d053e）

## 關鍵資料夾 ID
- 技術圖表（CHART_FOLDER）：9a1c2b3d4e5f60718293a4b5
`,
    updatedAt: '2026-07-01T00:00:00Z',
  },
}

export const mockAgentSkills: Record<string, AgentSkill[]> = {
  c92d7afd54a92c9d56f6d636: [
    { id: 's1', agentId: 'c92d7afd54a92c9d56f6d636', skillType: 'read_folder', label: '讀取資料夾內容', enabled: true, config: {} },
    { id: 's2', agentId: 'c92d7afd54a92c9d56f6d636', skillType: 'create_note', label: '新增筆記', enabled: true, config: {} },
    { id: 's3', agentId: 'c92d7afd54a92c9d56f6d636', skillType: 'web_search', label: '搜尋網路資訊', enabled: true, config: {} },
    { id: 's4', agentId: 'c92d7afd54a92c9d56f6d636', skillType: 'create_todo', label: '新增待辦', enabled: false, config: {} },
  ],
  '20112556a7db67e2a57d053e': [
    { id: 's5', agentId: '20112556a7db67e2a57d053e', skillType: 'read_folder', label: '讀取資料夾內容', enabled: true, config: {} },
    { id: 's6', agentId: '20112556a7db67e2a57d053e', skillType: 'create_chart', label: '新增圖表（帶 JSON 資料）', enabled: true, config: {} },
    { id: 's7', agentId: '20112556a7db67e2a57d053e', skillType: 'fetch_stock_data', label: '抓取台股資料', enabled: true, config: {} },
  ],
}

/** Monitoring-only, no limits/billing. */
export const mockUsageStats: Record<string, AgentUsageStats> = {
  c92d7afd54a92c9d56f6d636: {
    agentId: 'c92d7afd54a92c9d56f6d636',
    tokensUsedTotal: 1_284_300,
    executionsCount: 42,
    last7DaysAvgTokens: 8700,
  },
  '20112556a7db67e2a57d053e': {
    agentId: '20112556a7db67e2a57d053e',
    tokensUsedTotal: 3_620_900,
    executionsCount: 18,
    last7DaysAvgTokens: 15400,
  },
}

export const mockExecutionLogs: Record<string, ExecutionLog[]> = {
  '20112556a7db67e2a57d053e': [
    { id: 'e1', agentId: '20112556a7db67e2a57d053e', triggeredBy: '手動', status: 'success', durationSeconds: 172, tokensUsed: 314_200, startedAt: '2026-06-29T22:44:00Z', endedAt: '2026-06-29T22:46:52Z' },
    { id: 'e2', agentId: '20112556a7db67e2a57d053e', triggeredBy: '手動', status: 'cancelled', durationSeconds: 219, tokensUsed: 336_900, startedAt: '2026-06-28T11:31:00Z', endedAt: '2026-06-28T11:34:39Z' },
    { id: 'e3', agentId: '20112556a7db67e2a57d053e', triggeredBy: '手動', status: 'success', durationSeconds: 358, tokensUsed: 0, startedAt: '2026-06-27T09:34:00Z', endedAt: '2026-06-27T09:39:58Z' },
    { id: 'e4', agentId: '20112556a7db67e2a57d053e', triggeredBy: 'chat', status: 'success', durationSeconds: 214, tokensUsed: 631_100, startedAt: '2026-06-27T01:58:00Z', endedAt: '2026-06-27T02:01:34Z' },
  ],
  c92d7afd54a92c9d56f6d636: [
    { id: 'e5', agentId: 'c92d7afd54a92c9d56f6d636', triggeredBy: '排程', status: 'success', durationSeconds: 96, tokensUsed: 41_200, startedAt: '2026-07-05T08:00:00Z', endedAt: '2026-07-05T08:01:36Z' },
  ],
}

export const mockNotes: Note[] = [
  {
    id: 'n1',
    folderId: 'f-invest',
    title: '重點追蹤標的技術面週報（6/22-6/26）',
    content: `## 本週重點
- ⚠️ 大盤本週回檔，權值股普遍下跌
- 台積電（2330）跌破月線支撐
- 聯發科（2454）技術面轉弱，量縮價跌

## 資料與工具
使用 📈 技術研究員 產出，資料來源見 🗃 技術圖表
`,
    createdByAgentId: '20112556a7db67e2a57d053e',
    createdAt: '2026-06-29T22:46:00Z',
  },
]

export const mockCharts: Chart[] = [
  {
    id: 'c1',
    folderId: 'f-invest',
    title: '重點追蹤標的的本週漲跌幅比較（6/22-6/26）',
    chartType: 'line',
    series: ['週漲跌幅(%)'],
    data: [
      { label: '加權指數', '週漲跌幅(%)': -6.64 },
      { label: '台積電 2330', '週漲跌幅(%)': -6.02 },
      { label: '聯發科 2454', '週漲跌幅(%)': -14.4 },
      { label: '台達電 2308', '週漲跌幅(%)': -15.8 },
      { label: '鴻海 2317', '週漲跌幅(%)': -6.5 },
    ],
    createdByAgentId: '20112556a7db67e2a57d053e',
    createdAt: '2026-06-29T22:46:00Z',
  },
]

export const mockTodos: Todo[] = [
  {
    id: 't1',
    folderId: 'f-invest',
    title: '統一歸檔所有子任務',
    completed: false,
    parentId: null,
    assignedToAgentId: null,
    dueAt: null,
    createdAt: '2026-06-01T00:00:00Z',
  },
]
