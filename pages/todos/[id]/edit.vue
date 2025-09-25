<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Todoを編集</h1>
      <NuxtLink 
        :to="`/todos/${id}`" 
        class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
      >
        ↩️ 詳細に戻る
      </NuxtLink>
    </div>

    <div v-if="todo" class="bg-white rounded-lg shadow-md p-6">
      <TodoForm 
        :initial-data="formData" 
        :is-edit="true" 
        @submit="updateTodo"
        @cancel="navigateBack"
      />
    </div>
    
    <div v-else class="bg-white rounded-lg shadow-md p-6 text-center py-12">
      <div class="text-6xl mb-4">❓</div>
      <h3 class="text-lg font-medium text-gray-800 mb-2">Todoが見つかりません</h3>
      <p class="text-gray-500 mb-6">指定されたIDのTodoは存在しないか、削除された可能性があります</p>
      <NuxtLink 
        to="/todos" 
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        📋 Todo一覧に戻る
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTodos } from '~/composables/useTodos'
import type { Todo, TodoFormData } from '~/types/todo'

// ルートパラメータからIDを取得
const route = useRoute()
const router = useRouter()
const id = parseInt(route.params.id as string)

// Todo操作ロジック
const { todos, loadTodos, getTodoById, updateTodo: updateTodoData } = useTodos()

// 現在のTodo
const todo = ref<Todo | undefined>()

// フォーム用データ
const formData = computed<TodoFormData>(() => {
  if (!todo.value) return {
    text: '',
    priority: 'medium',
    category: 'personal',
    tags: [],
    description: '',
    dueDate: ''
  }
  
  return {
    text: todo.value.text,
    priority: todo.value.priority,
    category: todo.value.category,
    tags: [...todo.value.tags],
    description: todo.value.description,
    dueDate: todo.value.dueDate || ''
  }
})

// 初期化
onMounted(() => {
  loadTodos()
  todo.value = getTodoById(id)
})

// Todoを更新
function updateTodo(data: TodoFormData) {
  updateTodoData(id, data)
  router.push(`/todos/${id}`)
}

// 戻る
function navigateBack() {
  router.push(`/todos/${id}`)
}
</script>