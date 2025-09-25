import type { TodoPriority, TodoCategory } from '~/types/todo'
import { PRIORITY_OPTIONS, CATEGORY_OPTIONS } from '~/types/todo'

/**
 * 日付フォーマット関連のユーティリティ
 */
export const useDateUtils = () => {
  // 日付をフォーマットして表示する関数
  const formatDate = (date: Date) => {
    // SSRとクライアントサイドで一貫したフォーマットを使用する
    if (typeof window === 'undefined') {
      // サーバーサイドでの単純なフォーマット
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      return `${month}月${day}日 ${hour}:${minute}`;
    } else {
      // クライアントサイドでのフォーマット
      return date.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  // 期限切れかどうかチェックする関数
  const isOverdue = (dueDate: string) => {
    // 日付比較をシンプルに実行 - サーバーとクライアントで一貫した結果になるように
    const dueTime = new Date(dueDate).getTime();
    const nowTime = Date.now();
    return dueTime < nowTime;
  }

  return {
    formatDate,
    isOverdue
  }
}

/**
 * UIヘルパー関数
 */
export const useUiHelpers = () => {
  // 優先度に応じたクラス名を返す関数
  const getPriorityClass = (priority: TodoPriority) => {
    switch (priority) {
      case 'high': return 'ring-2 ring-red-200'
      case 'medium': return 'ring-1 ring-yellow-200'
      default: return ''
    }
  }

  // 優先度に応じたボーダークラス名を返す関数
  const getPriorityBorderClass = (priority: TodoPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
    }
  }

  // 優先度に応じたバッジクラス名を返す関数
  const getPriorityBadgeClass = (priority: TodoPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
    }
  }

  // カテゴリに応じたバッジクラス名を返す関数
  const getCategoryBadgeClass = (category: TodoCategory) => {
    switch (category) {
      case 'work': return 'bg-blue-100 text-blue-800'
      case 'personal': return 'bg-purple-100 text-purple-800'
      case 'other': return 'bg-gray-100 text-gray-800'
    }
  }

  // 優先度ラベルを返す関数
  const getPriorityLabel = (priority: TodoPriority) => {
    const option = PRIORITY_OPTIONS.find(opt => opt.value === priority)
    return option ? option.label : ''
  }

  // 優先度アイコンを返す関数
  const getPriorityIcon = (priority: TodoPriority) => {
    const option = PRIORITY_OPTIONS.find(opt => opt.value === priority)
    return option ? option.icon : ''
  }

  // カテゴリラベルを返す関数
  const getCategoryLabel = (category: TodoCategory) => {
    const option = CATEGORY_OPTIONS.find(opt => opt.value === category)
    return option ? option.label : ''
  }

  // カテゴリアイコンを返す関数
  const getCategoryIcon = (category: TodoCategory) => {
    const option = CATEGORY_OPTIONS.find(opt => opt.value === category)
    return option ? option.icon : ''
  }

  // フィルター状態に応じた空メッセージを返す関数
  const getEmptyMessage = (filter: string, hasSearchQuery: boolean) => {
    if (hasSearchQuery) {
      return '検索結果が見つかりません'
    }
    switch (filter) {
      case 'active':
        return '未完了のTodoはありません'
      case 'completed':
        return '完了済みのTodoはありません'
      default:
        return 'Todoが登録されていません'
    }
  }

  // 空状態のサブメッセージを返す関数
  const getEmptySubMessage = (filter: string, hasSearchQuery: boolean) => {
    if (hasSearchQuery) {
      return '別のキーワードで検索してみてください'
    }
    switch (filter) {
      case 'active':
        return '新しいTodoを追加するか、完了済みタブをチェックしてみてください'
      case 'completed':
        return 'Todoを完了してここに表示しましょう'
      default:
        return '上のフォームから最初のTodoを追加してみてください'
    }
  }

  // 空状態のアイコンを返す関数
  const getEmptyStateIcon = (filter: string, hasSearchQuery: boolean) => {
    if (hasSearchQuery) {
      return '🔍'
    }
    switch (filter) {
      case 'active':
        return '⏳'
      case 'completed':
        return '🎉'
      default:
        return '📝'
    }
  }

  return {
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
  }
}