import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { MockInstance } from 'vitest'
import { nextTick } from 'vue'
import { useTodos } from '~/composables/useTodos'
import type { TodoFormData } from '~/types/todo'

// localStorage の読み書きを観察できるようにモック化した型を定義
// 各メソッドの引数・戻り値まで型で縛り、テスト中の誤用を検知できるようにしている
type LocalStorageMock = Storage & {
  clear: MockInstance<() => void>
  getItem: MockInstance<(key: string) => string | null>
  key: MockInstance<(index: number) => string | null>
  removeItem: MockInstance<(key: string) => void>
  setItem: MockInstance<(key: string, value: string) => void>
}

// 実際の localStorage を意識したミニマルなモック実装
// Map を内部ストアとして保持し、Vitest のモック関数で呼び出し履歴を追えるようにしている
const createLocalStorage = (): LocalStorageMock => {
  const store = new Map<string, string>()

  const storage = {
    get length() {
      return store.size
    },
    clear: vi.fn(() => {
      store.clear()
    }) as LocalStorageMock['clear'],
    getItem: vi.fn((key: string) => store.get(key) ?? null) as LocalStorageMock['getItem'],
    key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null) as LocalStorageMock['key'],
    removeItem: vi.fn((key: string) => {
      store.delete(key)
    }) as LocalStorageMock['removeItem'],
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value)
    }) as LocalStorageMock['setItem']
  }

  return storage as unknown as LocalStorageMock
}

describe('useTodos', () => {
  let originalWindow: typeof window | undefined
  let originalLocalStorage: Storage | undefined
  let mockedStorage: LocalStorageMock

  beforeEach(() => {
    // JSDOM が提供する window/localStorage をバックアップしてからモックに差し替える
    originalWindow = typeof window === 'undefined' ? undefined : window
    originalLocalStorage = typeof localStorage === 'undefined' ? undefined : localStorage

    mockedStorage = createLocalStorage()

    if (originalWindow) {
      // 既にブラウザ環境がある場合は window.localStorage を直接上書き
      Object.defineProperty(originalWindow, 'localStorage', {
        value: mockedStorage,
        configurable: true
      })
    } else {
      // SSR コンテキストでもテストできるよう window 自体を仮作成
      // @ts-expect-error creating window mock for tests
      globalThis.window = { localStorage: mockedStorage }
    }

    // グローバルに localStorage を求めるコードのために globalThis にも同じモックを差し込む
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockedStorage,
      configurable: true
    })
  })

  afterEach(() => {
    // テスト完了後に元の window/localStorage を復元し、他テストへの影響を避ける
    if (originalWindow) {
      Object.defineProperty(originalWindow, 'localStorage', {
        value: originalLocalStorage,
        configurable: true
      })
    } else {
      // @ts-expect-error cleanup mocked window
      delete globalThis.window
    }

    if (originalLocalStorage) {
      Object.defineProperty(globalThis, 'localStorage', {
        value: originalLocalStorage,
        configurable: true
      })
    } else {
      // @ts-expect-error cleanup mocked localStorage
      delete globalThis.localStorage
    }

    // vi.fn で生成したモックの呼び出し履歴をリセット
    vi.restoreAllMocks()
  })

  // テストで利用する TodoFormData を組み立てるヘルパー
  // 必須プロパティを埋めつつ、オプションで上書きできるようにしている
  const createFormData = (overrides: Partial<TodoFormData> = {}): TodoFormData => ({
    text: 'Write documentation',
    priority: 'medium',
    category: 'personal',
    tags: [],
    description: 'Document testing setup',
    dueDate: '',
    ...overrides
  })

  it('adds a todo and updates derived counts', async () => {
    const {
      addTodo,
      todos,
      completedCount,
      activeCount,
      progressPercentage
    } = useTodos()

    // addTodo が Todo を生成し配列へ追加すること、派生的な computed が整合することを検証
    const todo = addTodo(createFormData({ text: 'Ship contributor guide' }))
    await nextTick()

    expect(todo.text).toBe('Ship contributor guide')
    expect(todos.value).toHaveLength(1)
    expect(completedCount.value).toBe(0)
    expect(activeCount.value).toBe(1)
    expect(progressPercentage.value).toBe(0)
    // localStorage 持続化が行われたかどうかをモックの呼び出しから検証
    expect(mockedStorage.setItem).toHaveBeenCalledWith('nuxt-todos', expect.stringContaining('Ship contributor guide'))
  })

  it('updates an existing todo while trimming incoming fields', async () => {
    const { addTodo, updateTodo, todos } = useTodos()
    // 事前に Todo を追加し、トリム対象の空白文字を含む更新データを用意
    const todo = addTodo(createFormData({ text: 'Initial title', description: '  raw  ' }))
    await nextTick()

    // updateTodo が空白トリムやタグの深いコピーを正しく行うか確認
    const updated = updateTodo(todo.id, {
      text: '  Renamed title  ',
      description: '  Updated description  ',
      tags: ['urgent']
    })

    expect(updated).not.toBeNull()
    expect(updated?.text).toBe('Renamed title')
    expect(updated?.description).toBe('Updated description')
    expect(updated?.tags).toEqual(['urgent'])
    expect(todos.value[0]?.text).toBe('Renamed title')
    // 存在しない ID を渡した場合は null が返るガードもテスト
    expect(updateTodo(999, { text: 'Missing todo' })).toBeNull()
  })

  it('hydrates from persisted storage when loadTodos is called', () => {
    // localStorage に保存済みの Todo 群を想定し、JSON 文字列を戻すようにモックを設定
    const storedTodos = [{
      id: 1,
      text: 'Persisted task',
      completed: false,
      createdAt: new Date('2024-01-01T10:00:00').toISOString(),
      priority: 'high',
      category: 'work',
      tags: ['important'],
      description: 'Restored from storage'
    }]

    mockedStorage.getItem.mockReturnValueOnce(JSON.stringify(storedTodos))
    const { todos, loadTodos } = useTodos()

    // loadTodos が JSON を復元し、Date へ再変換しているか確認
    loadTodos()

    expect(mockedStorage.getItem).toHaveBeenCalledWith('nuxt-todos')
    expect(todos.value).toHaveLength(1)
    expect(todos.value[0]?.createdAt).toBeInstanceOf(Date)
    expect(todos.value[0]?.priority).toBe('high')
  })

  it('filters and sorts todos according to UI state', async () => {
    const {
      todos,
      filteredTodos,
      currentFilter,
      selectedPriorityFilter,
      selectedCategoryFilter,
      searchQuery,
      sortOrder
    } = useTodos()

    // フィルタリング・ソート条件が複雑に重なるシナリオを準備
    const now = Date.now()
    todos.value = [
      {
        id: 1,
        text: 'Alpha task',
        completed: false,
        createdAt: new Date(now - 10_000),
        priority: 'low',
        category: 'personal',
        tags: [],
        description: ''
      },
      {
        id: 2,
        text: 'Gamma report',
        completed: false,
        createdAt: new Date(now - 1_000),
        priority: 'high',
        category: 'work',
        tags: ['urgent'],
        description: 'Needs review'
      },
      {
        id: 3,
        text: 'Beta retrospective',
        completed: true,
        createdAt: new Date(now - 5_000),
        priority: 'medium',
        category: 'work',
        tags: [],
        description: ''
      }
    ]

    // 指定した条件を満たす Todo が 1 件だけになることを確認
    currentFilter.value = 'active'
    selectedPriorityFilter.value = 'high'
    selectedCategoryFilter.value = 'work'
    searchQuery.value = 'report'
    sortOrder.value = 'alphabetical'
    await nextTick()

    expect(filteredTodos.value.map(todo => todo.id)).toEqual([2])

    // 条件をリセットしてソート順を oldest に変え、結果の並びが想定通りか検証
    sortOrder.value = 'oldest'
    searchQuery.value = ''
    selectedPriorityFilter.value = ''
    selectedCategoryFilter.value = ''
    currentFilter.value = 'all'
    await nextTick()

    expect(filteredTodos.value.map(todo => todo.id)).toEqual([1, 3, 2])
  })
})
