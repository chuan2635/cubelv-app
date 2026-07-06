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

## 專案結構

```
src/
  pages/            路由頁面（Workspace、Agent 詳情、筆記、圖表）
  components/        共用元件（Toggle、Badge、Mention Pill、Agent 各 Tab）
  hooks/             React Query hooks
  lib/               Supabase client、資料存取層（repository.ts）、格式化工具
  store/             Zustand（auth）
  mock/              假資料，尚未接 Supabase 時使用
  types/             共用 TypeScript 型別
supabase/migrations/  資料庫 schema（無訂閱/付費相關資料表）
docs/PRD.md           產品需求文件與技術規格
```
