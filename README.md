# Pati App

パチンコの収支を保存して、カレンダーでその日の収支を確認できる Next.js アプリです。

## 機能

- Clerk によるログイン/ログアウト
- 収支入力（日時 / 店舗 / 機種 / 投資 / 回収）
- 履歴一覧（「日付 / 店舗 / 機種 / 収支」）
- 全期間の累計と月別合計
- 月別収支グラフ
- Server Actions で保存/削除
- Prisma を用意（`DATABASE_URL` 未設定ならメモリ保存にフォールバック）

## 技術構成

- Next.js (App Router)
- Clerk
- Server Actions
- Prisma

## セットアップ

### 1) 依存関係

```bash
npm install
```

### 2) 環境変数

`.env.example` を参考に `.env.local` を作成し、Clerk のキーを設定してください。

### 3) DB（任意）

永続化したい場合は `DATABASE_URL` を設定して Prisma を有効化してください（デフォルトは SQLite）。

```bash
npx prisma generate
npx prisma db push
```

`DATABASE_URL` を設定しない場合、アプリはメモリに一時保存します（開発サーバー再起動で消えます）。

### 4) 起動

```bash
npm run dev
```

`http://localhost:3000` を開き、ログイン後に `/dashboard` で収支を登録できます。

## Prisma スキーマ

- `prisma/schema.prisma`
