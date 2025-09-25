import { describe, expect, test } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

// Nuxt Test Utils の E2E API を使い、SSR レンダリングされた HTML が期待通りかを検証
// Playwright などのブラウザを立ち上げずに SSR 出力だけを確認する軽量な統合テスト
describe('Todos page SSR', async () => {
  await setup({
    browser: false, // ブラウザは不要。SSR 応答のみを対象にする
    server: true,
    setupTimeout: 20_000
  })

  test('renders the todos heading on first paint', async () => {
    // `/todos` へ SSR リクエストを送り、Nuxt が出力する HTML 断片を取得
    const html = await $fetch('/todos')

    // 初回描画で Todo 一覧の見出しが含まれていることを確認し、コンポーネントが SSR で組み込まれているかチェック
    expect(html).toContain('📝 Todo一覧')
  })
})
