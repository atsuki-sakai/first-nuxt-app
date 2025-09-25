# 環境構築ガイド

## 🔧 前提条件

- Node.js 20.19.0 以上または22.12.0 以上（Nuxt 4.1.2の要件）
- パッケージマネージャー: npm, pnpm, yarn のいずれか
- 推奨エディタ: VS Code + Vue Language Features拡張機能

## 🚀 ローカル開発環境のセットアップ

### 依存関係のインストール

```bash
# 推奨: pnpm (高速・効率的)
pnpm install

# 代替: npm
npm install

# 代替: yarn
yarn install
```

### 開発サーバーの起動

```bash
# 開発サーバーを起動（http://localhost:3000）
npm run dev

# 詳細ログ付きで起動
DEBUG=nuxt:* npm run dev

# 特定ポートで起動
PORT=4000 npm run dev
```

### ビルドコマンド

```bash
# 本番用ビルド
npm run build

# 本番モードでプレビュー
npm run preview

# 静的サイト生成（SSG）
npm run generate
```

## 🐳 Docker 開発環境（オプション）

```bash
# Docker Composeで起動（推奨）
npm run docker:up

# 個別コマンドでの起動
npm run docker:build  # Dockerイメージをビルド
npm run docker:run    # コンテナを起動

# その他のDockerコマンド
npm run docker:down   # コンテナを停止
npm run docker:logs   # ログを表示
npm run docker:shell  # コンテナ内のシェルにアクセス
```

## 🔍 開発ツール

Nuxt DevTools が自動的に有効化され、以下の機能が利用可能:
- コンポーネントツリー可視化
- ルーティング構造の確認
- パフォーマンス分析
- ストアの状態管理
- API ルートのテスト

アクセス方法: ブラウザで開発サーバーにアクセス後、`Shift + Option + D`キーを押す

## 🧪 TypeScript の検証

```bash
# 型チェック
npm run typecheck

# TypeScript設定の検証
npx vue-tsc --noEmit
```

## ⚠️ トラブルシューティング

- **ビルドエラーが発生する場合**: `.nuxt`フォルダを削除して再度ビルドする
- **依存関係の問題**: `node_modules`と`package-lock.json`を削除して再インストール
- **Docker関連のエラー**: Docker Desktopが起動していることを確認
- **Node.js バージョンエラー**: `.nvmrc`ファイルで指定されたバージョンを使用する