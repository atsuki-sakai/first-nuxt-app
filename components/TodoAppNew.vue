<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">📝 Todoリスト</h2>
      <NuxtLink 
        to="/todos/create" 
        class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
      >
        ➕ 新規作成
      </NuxtLink>
    </div>

    <!-- フィルタリングとソート -->
    <TodoFilter
      v-model:searchQuery="searchQuery"
      v-model:currentFilter="currentFilter"
      v-model:selectedCategoryFilter="selectedCategoryFilter"
      v-model:selectedPriorityFilter="selectedPriorityFilter"
      v-model:sortOrder="sortOrder"
      :filtered-count="filteredTodos.length"
    />

    <!-- Todoリスト表示部分 -->
    <div v-if="filteredTodos.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">{{ getEmptyStateIcon(currentFilter, !!searchQuery.trim()) }}</div>
      <h3 class="text-lg font-medium text-gray-800 mb-2">{{ getEmptyMessage(currentFilter, !!searchQuery.trim()) }}</h3>
      <p class="text-gray-500">{{ getEmptySubMessage(currentFilter, !!searchQuery.trim()) }}</p>
    </div>

    <div v-else class="space-y-3">
      <!-- リスト統計情報 -->
      <div class="flex justify-between items-center text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-md">
        <span>
          📊 表示中: {{ filteredTodos.length }}件 / 全{{ todos.length }}件
          (完了: {{ completedCount }}件)
        </span>
        <span v-if="searchQuery">
          🔍 "{{ searchQuery }}" の検索結果
        </span>
      </div>

      <!-- Todoアイテム表示 -->
      <TransitionGroup name="todo-list" tag="div" class="space-y-3">
        <TodoItem
          v-for="todo in filteredTodos"
          :key="todo.id"
          :todo="todo"
          :expanded="expandedTodos.includes(todo.id)"
          @update:completed="toggleTodoCompletion(todo.id)"
          @delete="removeTodo(todo.id)"
          @expand="toggleTodoExpand(todo.id)"
        />
      </TransitionGroup>
    </div>

    <!-- 統計と一括操作 -->
    <TodoStats
      v-if="todos.length > 0"
      :total-count="todos.length"
      :completed-count="completedCount"
      :active-count="todos.length - completedCount"
      :progress-percentage="Math.round((completedCount / todos.length) * 100)"
      @clear-completed="clearCompleted"
      @complete-all="completeAll"
      @uncomplete-all="uncompleteAll"
      @export="exportTodos"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTodos } from '../composables/useTodos'
import { useUiHelpers } from '../composables/useUiHelpers'
import type { TodoFormData } from '../types/todo'

// Todoロジック
const {
  todos,
  currentFilter,
  selectedCategoryFilter,
  selectedPriorityFilter, 
  searchQuery,
  sortOrder,
  expandedTodos,
  
  filteredTodos,
  completedCount,
  activeCount,
  progressPercentage,
  
  loadTodos,
  addTodo,
  removeTodo,
  toggleTodoCompletion,
  toggleTodoExpand,
  clearCompleted,
  completeAll,
  uncompleteAll,
  exportTodos
} = useTodos()

// UIヘルパー
const { 
  getEmptyMessage, 
  getEmptySubMessage, 
  getEmptyStateIcon 
} = useUiHelpers()

// UIヘルパー関数を利用するための準備は完了

// 新しいTodoを追加
const addNewTodo = (formData: TodoFormData) => {
  addTodo(formData)
}

// ページ読み込み時にデータを取得
onMounted(() => {
  loadTodos()
})
</script>

<style scoped>
/* アニメーション用のCSS */
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter-from,
.todo-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.todo-list-move {
  transition: transform 0.3s ease;
}
</style>