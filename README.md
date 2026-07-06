# CubeLV - AI Employee Management System

打造你的一人 AI 團隊 — 用自然語言創建 AI 員工，指派重複性任務，讓 AI 定期自動執行。

**完全免費使用：無訂閱、無 Credits 充值、無付費牆。** 詳見 [docs/PRD.md](docs/PRD.md)。

## 技術棧

React 18 + TypeScript + Vite + Tailwind CSS + React Router + React Query + Zustand + Supabase + Recharts

## 開發

```bash
npm install
npm run dev
```

目前無需設定 Supabase 專案即可執行 — 未設定 `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` 時，
App 會自動使用 `src/mock/data.ts` 的假資料與本機登入（不需要後端）跑通整個 UI。

要接上真實 Supabase 專案：

1. 建立 Supabase 專案，於 SQL editor 執行 `supabase/migrations/0001_init.sql`
2. 複製 `.env.example` 為 `.env.local` 並填入專案的 URL / anon key
3. `npm run dev`

介面現在是完全可互動的（新增員工、儲存設定/記憶、切換技能、手動觸發執行），
未接 Supabase 前這些操作都寫入前端記憶體中的 mock store（重新整理頁面會重置）。

## Agent 執行引擎（Supabase Edge Function）

`supabase/functions/run-agent` 是實際呼叫 Claude API 執行 Agent 的引擎：載入
instructions + 長期記憶組成 system prompt，依已啟用的技能組出對應 tools，跑
tool-use 迴圈直到 `max_rounds` 或模型不再呼叫工具為止，並寫回 `execution_logs`
與 `agent_usage_stats`（純統計，不做任何用量限制或扣款）。所有讀寫都用呼叫者
自己的 JWT 過 RLS，沒有 service-role 後門。

部署方式：

```bash
supabase functions deploy run-agent
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

前端 `triggerAgentRun`（`src/lib/repository.ts`）在偵測到 Supabase 已設定時，
會直接呼叫這支 Edge Function；未設定 Supabase 時則用 mock 模擬一次執行結果。

## 專案結構

```
src/
  pages/            路由頁面（Workspace、Agent 詳情、筆記、圖表）
  components/        共用元件（Toggle、Badge、Mention Pill、Agent 各 Tab）
  hooks/             React Query hooks（含新增/更新/觸發執行的 mutations）
  lib/               Supabase client、資料存取層（repository.ts）、格式化工具
  store/             Zustand（auth）
  mock/              假資料 + 可變的記憶體 store（mock/store.ts），尚未接 Supabase 時使用
  types/             共用 TypeScript 型別
supabase/migrations/       資料庫 schema（無訂閱/付費相關資料表）
supabase/functions/run-agent/  真實 Agent 執行引擎（Claude API tool-use 迴圈）
docs/PRD.md                產品需求文件與技術規格
```
