import { ref, computed, watch } from 'vue'
import type { Todo, TodoPriority, TodoCategory, TodoFilterType, TodoSortType, TodoFormData } from '~/types/todo'

/**
 * Todo管理のための再利用可能なロジック
 * 実務ではこのようにUIとロジックを分離することが一般的
 */
export const useTodos = () => {
  // Todoリストの状態
  const todos = ref<Todo[]>([])
  
  // フィルター状態
  const currentFilter = ref<TodoFilterType>('all')
  const selectedCategoryFilter = ref<TodoCategory | ''>('')
  const selectedPriorityFilter = ref<TodoPriority | ''>('')
  const searchQuery = ref('')
  const sortOrder = ref<TodoSortType>('newest')
  
  // UI状態
  const expandedTodos = ref<number[]>([])
  
  // フィルター・ソート済みTodoリスト
  const filteredTodos = computed(() => {
    let filtered = todos.value

    // 1. 完了状態でフィルター
    switch (currentFilter.value) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed)
        break
      case 'completed':
        filtered = filtered.filter(todo => todo.completed)
        break
    }

    // 2. 検索クエリでフィルター
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(query) ||
        todo.description.toLowerCase().includes(query) ||
        todo.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 3. カテゴリでフィルター
    if (selectedCategoryFilter.value) {
      filtered = filtered.filter(todo => todo.category === selectedCategoryFilter.value)
    }

    // 4. 優先度でフィルター
    if (selectedPriorityFilter.value) {
      filtered = filtered.filter(todo => todo.priority === selectedPriorityFilter.value)
    }

    // 5. ソート
    switch (sortOrder.value) {
      case 'oldest':
        return filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
      case 'alphabetical':
        return filtered.sort((a, b) => a.text.localeCompare(b.text))
      default: // newest
        return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
  })

  /*
    computed(): Vue.jsの計算プロパティ
    React/Next.jsのuseMemo()に相当
    依存する値が変更された時のみ再計算される（パフォーマンス最適化）
    */


  // 完了済みTodoの数
  const completedCount = computed(() => {
    return todos.value.filter(todo => todo.completed).length
  })
  
  // 未完了のTodoの数
  const activeCount = computed(() => {
    return todos.value.length - completedCount.value
  })
  
  // 進捗率
  const progressPercentage = computed(() => {
    return todos.value.length > 0
      ? Math.round((completedCount.value / todos.value.length) * 100)
      : 0
  })

  // ローカルストレージからデータを読み込む
  const loadTodos = () => {
    if (typeof window === 'undefined') return
    
    const saved = localStorage.getItem('nuxt-todos')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        todos.value = parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          priority: todo.priority || 'medium',
          category: todo.category || 'personal',
          tags: todo.tags || [],
          description: todo.description || ''
        }))
      } catch (error) {
        console.error('Todoデータの読み込みに失敗:', error)
      }
    }
  }
  
  // クライアント側のみでTodoデータを監視して保存
  if (typeof window !== 'undefined') {
    watch(todos, (newTodos) => {
      localStorage.setItem('nuxt-todos', JSON.stringify(newTodos))
    }, {
      deep: true
    })
  }

  // 新しいTodoを追加
  const addTodo = (formData: TodoFormData) => {
    const newTodo: Todo = {
      id: Date.now(),
      text: formData.text.trim(),
      completed: false,
      createdAt: new Date(),
      priority: formData.priority,
      category: formData.category,
      tags: [...formData.tags],
      description: formData.description.trim(),
      dueDate: formData.dueDate || undefined
    }
    
    todos.value.push(newTodo)
    return newTodo
  }
  
  // Todoを更新
  const updateTodo = (id: number, formData: Partial<TodoFormData>) => {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index === -1) {
      return null
    }

    const existingTodo = todos.value[index]
    if (!existingTodo) {
      return null
    }

    const updatedTodo: Todo = {
      ...existingTodo,
      priority: formData.priority ?? existingTodo.priority,
      category: formData.category ?? existingTodo.category,
      tags: formData.tags ? [...formData.tags] : existingTodo.tags,
      dueDate: formData.dueDate !== undefined ? (formData.dueDate || undefined) : existingTodo.dueDate,
      text: formData.text?.trim() ?? existingTodo.text,
      description: formData.description?.trim() ?? existingTodo.description
    }

    todos.value[index] = updatedTodo
    return updatedTodo
  }
  
  // Todoを削除
  const removeTodo = (id: number) => {
    todos.value = todos.value.filter(todo => todo.id !== id)
    // 展開リストからも削除
    expandedTodos.value = expandedTodos.value.filter(expandedId => expandedId !== id)
  }
  
  // Todoの完了状態を切り替え
  const toggleTodoCompletion = (id: number) => {
    const todo = todos.value.find(todo => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  // 特定のIDのTodoを取得
  const getTodoById = (id: number): Todo | undefined => {
    return todos.value.find(todo => todo.id === id)
  }
  
  // Todoの展開/縮小を切り替える
  const toggleTodoExpand = (id: number) => {
    const index = expandedTodos.value.indexOf(id)
    if (index > -1) {
      expandedTodos.value.splice(index, 1) // 配列から削除
    } else {
      expandedTodos.value.push(id) // 配列に追加
    }
  }
  
  // 完了済みのTodoをすべて削除
  const clearCompleted = () => {
    const completedIds = todos.value.filter(todo => todo.completed).map(todo => todo.id)
    todos.value = todos.value.filter(todo => !todo.completed)
    // 展開リストからも削除
    expandedTodos.value = expandedTodos.value.filter(id => !completedIds.includes(id))
  }
  
  // すべてのTodoを完了にする
  const completeAll = () => {
    todos.value.forEach(todo => {
      if (!todo.completed) todo.completed = true
    })
  }
  
  // すべてのTodoを未完了にする
  const uncompleteAll = () => {
    todos.value.forEach(todo => {
      if (todo.completed) todo.completed = false
    })
  }
  
  // Todoデータをエクスポート
  const exportTodos = () => {
    if (typeof window === 'undefined') return
    
    const dataStr = JSON.stringify(todos.value, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `todos-${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return {
    // 状態
    todos,
    currentFilter,
    selectedCategoryFilter,
    selectedPriorityFilter, 
    searchQuery,
    sortOrder,
    expandedTodos,
    
    // 計算プロパティ
    filteredTodos,
    completedCount,
    activeCount,
    progressPercentage,
    
    // メソッド
    loadTodos,
    addTodo,
    updateTodo,
    removeTodo,
    toggleTodoCompletion,
    getTodoById,
    toggleTodoExpand,
    clearCompleted,
    completeAll,
    uncompleteAll,
    exportTodos
  }
}