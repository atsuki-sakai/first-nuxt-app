/*
  TypeScript型定義ファイル
  Vue.js/Nuxt.js では types/ ディレクトリに型定義をまとめる

  React/Next.js との型定義の違い:
  - Vue.jsでは interface と type の使い分けが重要
  - Nuxt.js では自動インポートが効くため、export が重要
  - Props や Emits の型定義も Vue 独特の記法がある

  React/Next.js:
  interface Props {
    todo: Todo;
    onUpdate: (todo: Todo) => void;
  }

  Vue.js:
  interface Props {
    todo: Todo;
  }
  interface Emits {
    (e: 'update', todo: Todo): void;
  }
*/

/*
  メインのTodo型定義
  React/Next.js と同じような型定義だが、Vue.js特有の考慮点:
  - Date型はSSRとクライアントで扱いが異なる場合がある
  - オプショナルプロパティ（?）の使い方
  - Nuxt.js の自動インポートで使用される
*/
export interface Todo {
  id: number              // 一意識別子（通常はタイムスタンプを使用）
  text: string           // Todoの内容（必須項目）
  completed: boolean     // 完了状態（true: 完了, false: 未完了）
  createdAt: Date       // 作成日時（Date型、SSR時要注意）
  priority: TodoPriority  // 優先度（低・中・高の3段階）
  category: TodoCategory  // カテゴリ（仕事・個人・その他）
  tags: string[]        // タグ（配列、複数選択可能）
  description: string   // 詳細説明（空文字も許可）
  dueDate?: string     // 期限（オプション、ISO文字列形式）
}

/*
  Union Types: TypeScript の強力な機能
  React/Next.js でも Vue.js でも同じように使える
  文字列リテラル型で値を制限することで型安全性を確保

  使用例:
  const priority: TodoPriority = 'high' // OK
  const priority: TodoPriority = 'urgent' // エラー！
*/
export type TodoPriority = 'low' | 'medium' | 'high'
export type TodoCategory = 'work' | 'personal' | 'other'
export type TodoFilterType = 'all' | 'active' | 'completed'
export type TodoSortType = 'newest' | 'oldest' | 'priority' | 'alphabetical'

/*
  フォーム用の型定義
  新規作成と編集で共通利用するためのインターフェース

  React/Next.js では通常 useState の初期値として使用:
  const [formData, setFormData] = useState<TodoFormData>({...})

  Vue.js では ref() の型として使用:
  const form = ref<TodoFormData>({...})
*/
export interface TodoFormData {
  text: string            // 入力されたTodoテキスト
  priority: TodoPriority  // 選択された優先度
  category: TodoCategory  // 選択されたカテゴリ
  tags: string[]         // 選択されたタグの配列
  description: string    // 入力された詳細説明
  dueDate?: string      // 選択された期限（ISO文字列）
}

// カテゴリオプション
export const CATEGORY_OPTIONS = [
  { value: 'work' as TodoCategory, label: '仕事', icon: '🏢' },
  { value: 'personal' as TodoCategory, label: '個人', icon: '👤' },
  { value: 'other' as TodoCategory, label: 'その他', icon: '📌' }
]

// 優先度オプション
export const PRIORITY_OPTIONS = [
  { value: 'high' as TodoPriority, label: '高', icon: '🔴' },
  { value: 'medium' as TodoPriority, label: '中', icon: '🟡' },
  { value: 'low' as TodoPriority, label: '低', icon: '🟢' }
]

// フィルターオプション
export const FILTER_OPTIONS = [
  { value: 'all' as TodoFilterType, label: 'すべて', icon: '📋' },
  { value: 'active' as TodoFilterType, label: '未完了', icon: '⏳' },
  { value: 'completed' as TodoFilterType, label: '完了済み', icon: '✅' }
]

// タグオプション
export const TAG_OPTIONS = [
  { value: 'urgent', label: '🚨 急ぎ' },
  { value: 'important', label: '⭐ 重要' },
  { value: 'easy', label: '😊 簡単' },
  { value: 'research', label: '🔍 調査' }
]