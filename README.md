# 📋 Nuxt Todo アプリ

<div align="center">
  <img src="https://img.shields.io/badge/Vue.js-3-42b883" alt="Vue.js 3"/>
  <img src="https://img.shields.io/badge/Nuxt-4-00DC82" alt="Nuxt 4"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6" alt="TypeScript 5"/>
  <img src="https://img.shields.io/badge/Node-22.20.0-339933" alt="Node 22.20.0"/>
</div>

Vue 3 + Nuxt 4 + TypeScript で構築した実践的な Todo アプリケーションです。React/Next.js 開発者が Nuxt のファイルベースルーティング、SSR、Auto Imports、Composables、型安全設計を効率的に学べるよう設計されています。

## 📚 目次

- [🚀 クイックスタート](#-クイックスタート)
- [📖 プロジェクト概要](#-プロジェクト概要)
- [⚙️ セットアップ](#-セットアップ)
- [📂 ディレクトリ構成](#-ディレクトリ構成)
- [📝 ドキュメント](#-ドキュメント)
- [🧪 テスト](#-テスト)
- [⚠️ トラブルシューティング](#-トラブルシューティング)
- [💡 Tips](#-tips)

## 🚀 クイックスタート

```bash
# Nodeバージョン設定（nvm使用）
nvm use

# 依存関係インストール
npm install

# 開発サーバー起動（http://localhost:3000）
npm run dev

# または Docker で起動
npm run docker:up
```

## 📖 プロジェクト概要

本プロジェクトの特徴:

- **学習目的**: Vue 3 Composition API と Nuxt 4 の実践的理解
- **技術スタック**: SSR/CSR、Auto Imports、TypeScript、Tailwind CSS
- **設計手法**: Composable パターンによる再利用可能なロジック
- **想定対象**: React/Next.js 経験者、Vue/Nuxt を体系的に学びたい開発者

詳細は [プロジェクト概要ドキュメント](docs/project-overview.md) をご覧ください。

## ⚙️ セットアップ

### 1. Node.js 環境

```bash
# .nvmrc に指定された Node v22.20.0 を使用
nvm install 22.20.0
nvm use
```

### 2. 依存関係のインストール

```bash
# クリーンインストール（推奨）
rm -rf node_modules package-lock.json
npm install
```

### 3. 開発サーバーの起動

```bash
# 開発モード
npm run dev  # http://localhost:3000

# 本番ビルド＆プレビュー
npm run build
npm run preview
```

### 4. Docker 環境（オプション）

```bash
# Docker環境で起動
npm run docker:up

# 停止・確認コマンド
npm run docker:down  # 停止
npm run docker:logs  # ログ確認
```

## 📂 ディレクトリ構成

```
first-nuxt/
├── app/
│   └── app.vue              # アプリケーションルート
├── pages/                   # ファイルベースルーティング
│   ├── index.vue            # ホームページ
│   └── todos/               # Todo機能ルート群
├── components/              # コンポーネント
│   ├── ui/                  # 汎用UIコンポーネント
│   └── todo/                # Todo機能コンポーネント
├── composables/             # 再利用可能なロジック
├── types/                   # 型定義
├── layouts/                 # レイアウトテンプレート
├── public/                  # 静的ファイル
└── docs/                    # ドキュメント
```

詳細な構成は [アーキテクチャドキュメント](docs/architecture.md) をご参照ください。

## 📝 ドキュメント

プロジェクトの詳細について、以下のドキュメントを用意しています：

| ドキュメント | 内容 |
|------------|------|
| [📘 プロジェクト概要](docs/project-overview.md) | 目的・特徴・技術スタック |
| [🔧 セットアップガイド](docs/setup-guide.md) | 環境構築の詳細手順 |
| [🏗️ アーキテクチャ](docs/architecture.md) | 設計思想・ディレクトリ構造・責務分担 |
| [🔄 Vue vs React](docs/vue-react-comparison.md) | フレームワーク比較・移行のポイント |
| [🚀 デプロイガイド](docs/deployment-guide.md) | デプロイ方法・本番環境設定 |
| [🧪 テスト仕様書](docs/testing-spec.md) | テスト方針・実装方法 |

AI アシスタントガイドライン：
- [AGENTS.md](AGENTS.md) - リポジトリガイドライン
- [CLAUDE.md](CLAUDE.md) - AI アシスタント利用ガイド

## 🧪 テスト

テストフレームワークとして Vitest を採用しています：

```bash
# 全テスト実行
npm run test

# 型チェックのみ
npx vue-tsc --noEmit

# 特定のテストのみ実行
vitest --project unit
vitest path/to/spec.ts
```

## ⚠️ トラブルシューティング

よくある問題と解決策：

| 問題 | 解決策 |
|-----|-------|
| npm依存関係エラー | `rm -rf node_modules package-lock.json && npm install` |
| Vitest構文エラー | Nodeバージョンが古い → `.nvmrc` の v22.20.0 に合わせる |
| SSR警告 | HTML標準に準拠したマークアップに修正（例: `<table>` → `<tbody>` → `<tr>`） |
| Docker起動エラー | `npm run docker:down && docker system prune -f && npm run docker:up` |

## 💡 Tips

開発効率を高めるTips：

- **型チェック**: `npx vue-tsc --noEmit`
- **特定テスト実行**: `vitest path/to/spec.ts`
- **コンポーネント設計**: `PascalCase.vue`、Composableは `useFeature.ts`
- **コミット規約**: Conventional Commits（`feat:`、`fix:`、`docs:`）
- **PRテンプレート**: 意図/変更点/テスト内容/スクリーンショット

---

**📌 まとめ**: 本リポジトリは Vue 3 / Nuxt 4 を Todo アプリを通して実践的に学ぶための教材です。詳細は各ドキュメントを参照し、`.nvmrc` に従った環境で `npm run dev` から始めてください。