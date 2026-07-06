# CubeLV App PRD + 技術規格

給 Claude Code 使用的產品需求文件與技術規格。

> **重要：本專案不採用訂閱／Credits 充值付費模式。所有功能對登入使用者完全免費開放，無方案分級、無金流串接。**

---

## 一、產品定位

**名稱：** CubeLV（AI 筆記、待辦、自動化）
**核心概念：** 「打造你的一人 AI 團隊」—— 用自然語言創建 AI 員工，指派重複性任務，讓 AI 定期自動執行。
**目標用戶：** 獨立接案者、自媒體、個人投資者、電商賣家等「超級個體」
**商業模式：** 免費使用，無訂閱、無 Credits 充值、無付費牆。使用量統計僅供自我監控參考，不做任何限制或扣款。

---

## 二、核心概念模型

```
Workspace（工作區）
└── Folder（資料夾 / 部門）
    ├── Agent（AI 員工）
    │   ├── 設定：名稱、指令、AI 模型、執行輪數、排程、通知
    │   ├── 記憶：長期 context 文字
    │   ├── 技能：可呼叫的 Tools/Functions
    │   ├── 用量：僅顯示消耗統計（無上限、不扣款）
    │   └── 執行紀錄：每次 run 的 log
    ├── Note（筆記）
    ├── Todo（待辦 / 含子待辦）
    └── Chart（圖表）
```

Agent 可以跨 Folder 讀寫 Note/Todo/Chart，靠 Folder ID 連結。

---

## 三、畫面逐頁規格

### 3.1 主列表頁（Workspace 首頁）

**用途：** 列出所有 AI 員工（Agent）卡片
**元件：**
- Header：漢堡選單 + Folder 名稱 + 新增模板 + 分享 + 更多
- Agent 卡片：名稱（大）+ 狀態標籤（小，灰色）+ 頭像 icon
- 新增員工：虛線框 dashed border 按鈕
- FAB：右下角，CubeLV logo icon，白色圓形

### 3.2 Agent 詳情頁

**Tab Bar（5個）：** 總覽 ／ 設定 ／ 記憶 ／ 技能 ／ 用量

### 3.3 Tab：總覽

**統計卡（3格橫排）：** 平均 Tokens 消耗 / 平均 Tokens / 平均執行時長

**執行紀錄 table：** 日期、觸發原因、狀態、時長、Tokens
Badge 顏色：成功=綠色 `#30D158`，已取消=灰色 `#636366`

### 3.4 Tab：設定

- 員工名稱
- 員工指令（多行 textarea，支援 inline mention pill 連結其他 Folder 的筆記/圖表）
- AI 模型（下拉選單）
- 最大執行輪數
- 定期排程（toggle + cron 排程列表）
- 開啟通知（toggle）

### 3.5 Tab：記憶

長文字區塊，Markdown 格式呈現 Agent 的 long-term memory（團隊結構、關鍵資料夾 ID 等）。

### 3.6 Tab：技能

可勾選/設定 Agent 可呼叫的 tools（讀寫 Note/Todo/Chart、web search、外部資料抓取等）。

### 3.7 Tab：用量

- 顯示累計 tokens / 執行次數等統計
- 過去 7 天平均消耗趨勢
- **不設上限、不扣款、不限制執行** —— 純粹讓使用者了解自己的使用情況

### 3.8 筆記/報告頁（Agent 產出內容）

純閱讀頁面，Markdown 渲染，支援標題、清單、粗體、emoji、inline link pill。

### 3.9 圖表頁（Agent 產出內容）

折線圖等，Recharts 渲染，資料表格對照。

---

## 四、視覺設計規格

### 色彩系統

```
背景        #1C1C1E  (iOS dark bg)
次背景       #2C2C2E  (cards)
分隔線       #3A3A3C
主文字       #FFFFFF
次文字       #8E8E93  (開置、labels)
品牌色/紫    #7B61FF / #6C47FF  (toggle on, tab underline)
成功綠       #30D158
取消灰       #636366 (badge)
互動藍       #0A84FF (links)
```

### 字體規格

- 系統字：SF Pro Display / SF Pro Text (iOS native，網頁以 -apple-system fallback)
- Agent 名稱：~18-20pt semibold
- 統計大數字：~28-32pt bold
- 表格內容：~14pt regular
- 標籤/badge：~12pt medium

### 關鍵元件

1. Agent 卡片：`border-radius: 12px`，深灰背景，2欄 grid
2. Tab Bar：底線 underline indicator，紫色，無背景填充
3. Badge pill：`border-radius: 6px`，小 padding，成功綠 / 灰
4. Toggle：iOS 風格，ON = 紫色
5. Inline Mention Pill：icon + 文字，圓角卡片，灰底
6. FAB：右下角，白色圓形，CubeLV logo，有 shadow
7. Stats 卡片：3等分橫排，數字大 label 小

---

## 五、資料結構（Supabase Schema，無付費表）

```sql
-- Folders（工作區資料夾）
folders: id, name, type, owner_id, created_at

-- Agents（AI 員工）
agents: id, folder_id, name, instructions,
        ai_model, max_rounds, schedule_cron,
        notifications_enabled, avatar_icon,
        created_at, updated_at

-- Agent Memory
agent_memories: id, agent_id, content (text), updated_at

-- Agent Skills
agent_skills: id, agent_id, skill_type, config (jsonb)

-- Agent Usage（僅監控用途，無上限、無扣款欄位）
agent_usage_stats: id, agent_id, period_start, period_end,
                   tokens_used, executions_count

-- Execution Logs
execution_logs: id, agent_id, triggered_by (手動/chat/排程),
                status (success/cancelled/failed),
                duration_seconds, tokens_used,
                started_at, ended_at

-- Notes
notes: id, folder_id, title, content (markdown), created_by_agent_id, created_at

-- Todos
todos: id, folder_id, title, completed, parent_id,
       assigned_to_agent_id, due_at, created_at

-- Charts
charts: id, folder_id, title, chart_type, data (jsonb), created_by_agent_id, created_at
```

刻意移除：`subscriptions`、`credits`、`plans`、`payments` 等任何與付費相關的資料表。

---

## 六、前端技術棧

```
前端：React 18 + TypeScript
建構：Vite
狀態：Zustand + React Query
路由：React Router v6
UI：Tailwind CSS（dark theme）
圖表：Recharts
Markdown：react-markdown + remark-gfm
部署：Vercel
資料庫 / 驗證：Supabase（Auth + Postgres）
AI：Anthropic Claude API
排程：Vercel Cron Jobs 或 Supabase Edge Functions
```

---

## 七、AI Agent 執行流程

```
觸發（手動 / chat / 排程 cron）
  ↓
建立 execution_log（status: running）
  ↓
載入 Agent 設定 + 記憶 + 技能清單
  ↓
呼叫 Claude API
  system = agent.instructions + agent_memory.content
  tools = agent.skills（讀寫 Note/Todo/Chart）
  max_rounds = agent.max_rounds
  ↓
Agent 自主執行（讀取資料 → 分析 → 寫入 Note/Chart/Todo）
  ↓
更新 execution_log（status, duration, tokens）
更新 agent_usage_stats（純統計，無扣款/無上限判斷）
  ↓
發送通知（若 notifications_enabled）
```

**Agent Tools（技能）範例：**

```
tools: [
  { name: "read_folder", description: "讀取資料夾內容" },
  { name: "create_note", description: "新增筆記" },
  { name: "update_note", description: "更新筆記" },
  { name: "create_todo", description: "新增待辦" },
  { name: "create_chart", description: "新增圖表（帶 JSON 資料）" },
  { name: "web_search", description: "搜尋網路資訊" },
  { name: "fetch_stock_data", description: "抓取台股資料" },
]
```

---

## 八、存取控制

- 使用 Supabase Auth 做簡單登入（email/密碼或 magic link）
- 登入後即可完整使用所有功能，無方案分級、無功能鎖定
- 每個使用者的 workspace 資料以 `owner_id` / RLS 隔離；分享給別人使用時，對方註冊登入即可，不需要任何付款流程

---

## 九、MVP 開發順序

1. **Phase 1 — 基礎架構**
   - Supabase tables 建立（folders, agents, notes, todos, execution_logs）
   - Agent 建立/編輯 UI（設定 tab）
   - 手動觸發執行 + execution log
2. **Phase 2 — 核心 Agent 功能**
   - 記憶 tab（讀寫 long-term memory）
   - 技能設定（選擇可用 tools）
   - 執行紀錄顯示（總覽 tab）
3. **Phase 3 — 自動化**
   - 定期排程（Vercel Cron）
   - 用量統計顯示（無限制）
   - 通知推播
4. **Phase 4 — 資料視覺化**
   - Chart 元件（Recharts）
   - 筆記 Markdown 渲染
   - Inline Mention Pill

---

## 十、與原始設計文件的差異

原始文件包含「Pro 訂閱（月 NT$290 / 年 NT$2,990）+ Credits 充值」的商業模式與 `agent_budgets`（含 monthly_limit / credits_used 扣款邏輯）。本專案版本移除所有付費相關設計：

- 不做訂閱方案、不做 Credits 購買/儲值
- 預算 tab 改為「用量」tab，只顯示統計數據，不設上限、不阻擋執行
- 資料庫不建立 subscriptions / payments / plans 表
- 不需要串接任何金流（Stripe 等）
- 使用者存取僅靠登入區分 workspace 歸屬，不做方案分級
