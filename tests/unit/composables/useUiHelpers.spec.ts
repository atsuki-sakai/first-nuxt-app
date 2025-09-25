import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useUiHelpers, useDateUtils } from '~/composables/useUiHelpers'

// UI ヘルパー群のテスト: トークン・カテゴリーごとのクラス/ラベル変換に破綻がないか網羅する
// ここで一度 useUiHelpers() を実行して取得した関数を使い回すことで、テストごとの呼び出し負荷を減らしている
describe('useUiHelpers', () => {
  const {
    getPriorityClass,
    getPriorityBorderClass,
    getPriorityBadgeClass,
    getCategoryBadgeClass,
    getPriorityLabel,
    getPriorityIcon,
    getCategoryLabel,
    getCategoryIcon,
    getEmptyMessage,
    getEmptySubMessage,
    getEmptyStateIcon
  } = useUiHelpers()

  it('returns semantic classes for priority tokens', () => {
    // 優先度ごとに異なるCSSクラスが返却され、ハイライト/枠線/バッジが期待通りになるか確認
    expect(getPriorityClass('high')).toBe('ring-2 ring-red-200')
    expect(getPriorityBorderClass('medium')).toBe('bg-yellow-500')
    expect(getPriorityBadgeClass('low')).toBe('bg-green-100 text-green-800')
  })

  it('maps categories to localized labels and icons', () => {
    // カテゴリー・優先度のラベルとアイコンが types/todo.ts の定義と一致するか検証
    expect(getCategoryBadgeClass('work')).toBe('bg-blue-100 text-blue-800')
    expect(getPriorityLabel('high')).toBe('高')
    expect(getPriorityIcon('low')).toBe('🟢')
    expect(getCategoryLabel('personal')).toBe('個人')
    expect(getCategoryIcon('other')).toBe('📌')
  })

  it('supplies empty state messaging helpers', () => {
    // 空状態メッセージがフィルター種別・検索有無に応じて切り替わることを確認
    expect(getEmptyMessage('active', false)).toBe('未完了のTodoはありません')
    expect(getEmptyMessage('completed', true)).toBe('検索結果が見つかりません')
    expect(getEmptySubMessage('completed', false)).toBe('Todoを完了してここに表示しましょう')
    expect(getEmptyStateIcon('active', false)).toBe('⏳')
  })
})

// 日付ユーティリティは SSR/CSR で分岐するため、SSR パス側が正しく動作するかを重点的に検証
describe('useDateUtils', () => {
  let originalWindow: typeof window | undefined

  beforeEach(() => {
    originalWindow = typeof window === 'undefined' ? undefined : window
    // SSR 分岐を強制するため window を一時的に削除
    // @ts-expect-error temporarily unset window
    delete globalThis.window
  })

  afterEach(() => {
    if (originalWindow) {
      Object.defineProperty(globalThis, 'window', {
        value: originalWindow,
        configurable: true
      })
    }
  })

  it('formats dates consistently in SSR mode and flags overdue values', () => {
    const { formatDate, isOverdue } = useDateUtils()
    // SSR サイドのフォーマットが 0 埋め込み含め想定通りか、期限切れ判定が正しいかを確認
    const formatted = formatDate(new Date(2024, 0, 2, 3, 4))

    expect(formatted).toBe('1月2日 03:04')
    expect(isOverdue('2000-01-01')).toBe(true)
    expect(isOverdue('2999-01-01')).toBe(false)
  })
})
