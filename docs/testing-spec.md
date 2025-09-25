# テスト仕様書（Nuxt 4 Todo アプリ）

## 目的とスコープ
このドキュメントは Nuxt 4 Todo アプリにおける単体テスト・結合テストの指針をまとめたものです。既存の `tests/` ディレクトリ構成と新規テストファイルを前提に、今後の追加開発でも一貫した品質水準を保てるようガイドラインを明文化します。

## 利用ツール
- **テストランナー**: Vitest (`npm run test`)
- **Vue テストユーティリティ**: `@vue/test-utils`
- **Nuxt 公式テスト補助**: `@nuxt/test-utils`（ユニット・E2E）
- **DOM エミュレーション**: `happy-dom`
- **型チェック**: `npx vue-tsc --noEmit`

Node は `v22.20.0` を使用してください。古いバージョンでは Vitest がモダン構文を解釈できません。

## ディレクトリ構成
```
tests/
├─ unit/
│  └─ composables/
│     ├─ useTodoForm.spec.ts
│     ├─ useTodos.spec.ts
│     └─ useUiHelpers.spec.ts
└─ integration/
   └─ todos-page.spec.ts
```
- 単体テスト: Composable ごとに 1 ファイルを原則とし、ハッピーパスとエッジケース（例: バリデーション失敗、null ガード）を最低 1 ケースずつ収録します。
- 結合テスト: Nuxt Test Utils の `setup/$fetch` や Playwright プロジェクトを用い、SSR/CSR の差異を検証します。現在は `/todos` の SSR 応答確認を実装済みです。

## モックとスタブ
- 自動インポートされる Nuxt API を差し替える場合は `@nuxt/test-utils/runtime` の `mockNuxtImport` を使います。
- ブラウザ固有オブジェクト（`localStorage`, `window` など）はテスト内で明示的に差し替え・復元します。`useTodos.spec.ts` に Map ベースの localStorage モック実装例があります。

## コマンドと実行手順
1. `rm -rf node_modules package-lock.json && npm install`（依存関係の取りこぼしが疑われる場合）
2. `npm run test`（ユニット・統合テスト全体）
3. `npx vue-tsc --noEmit`（型の逸脱チェック）

CI 未整備のため、PR 前に上記 3 ステップをローカルで実行してください。テストが長時間化する場合は `vitest --watch` で対象ファイルのみに絞り込みます。

## テスト追加時の指針
- 新規 Composable: 入出力のバリエーションと副作用（例: ストレージ書き込み）を分離して検証すること。
- UI ロジック: 可能ならロジック関数を切り出して単体テストでカバーし、render テストは E2E に限定。
- 結合テスト: SSR と CSR 双方の振る舞いを意識し、`nuxt.config.ts` の設定差によるレグレッションを補足します。

## 将来の拡張
- Playwright を利用したブラウザ E2E の導入
- Vitest `--coverage` オプションによるメトリクス収集
- GitHub Actions 等による CI 自動化
