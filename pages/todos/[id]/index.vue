<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Todo詳細</h1>
      <div class="space-x-2">
        <NuxtLink 
          :to="`/todos/${id}/edit`" 
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          ✏️ 編集
        </NuxtLink>
        <NuxtLink 
          to="/todos" 
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          📋 一覧に戻る
        </NuxtLink>
      </div>
    </div>

    <div v-if="todo" class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2 flex items-center">
          <span :class="[
            'inline-block w-3 h-3 rounded-full mr-3',
            todo.completed ? 'bg-green-500' : 'bg-yellow-500'
          ]"></span>
          {{ todo.text }}
        </h2>
        <div class="text-sm text-gray-500">
          ID: {{ todo.id }}
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-medium mb-3 border-b pb-2">📊 基本情報</h3>
          <table class="w-full">
            <tr>
              <td class="py-2 font-medium text-gray-600">ステータス</td>
              <td class="py-2">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]">
                  {{ todo.completed ? '完了' : '未完了' }}
                </span>
              </td>
            </tr>
            <tr>
              <td class="py-2 font-medium text-gray-600">優先度</td>
              <td class="py-2">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getPriorityBadgeClass(todo.priority)
                ]">
                  {{ getPriorityIcon(todo.priority) }} {{ getPriorityLabel(todo.priority) }}
                </span>
              </td>
            </tr>
            <tr>
              <td class="py-2 font-medium text-gray-600">カテゴリ</td>
              <td class="py-2">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getCategoryBadgeClass(todo.category)
                ]">
                  {{ getCategoryIcon(todo.category) }} {{ getCategoryLabel(todo.category) }}
                </span>
              </td>
            </tr>
            <tr v-if="todo.dueDate">
              <td class="py-2 font-medium text-gray-600">期限</td>
              <td class="py-2">
                <span :class="[
                  'font-medium',
                  isOverdue(todo.dueDate) ? 'text-red-600' : 'text-orange-600'
                ]">
                  ⏰ {{ formatDate(new Date(todo.dueDate)) }}
                  <span v-if="isOverdue(todo.dueDate)"> (期限切れ)</span>
                </span>
              </td>
            </tr>
            <tr>
              <td class="py-2 font-medium text-gray-600">作成日時</td>
              <td class="py-2">📅 {{ formatDate(todo.createdAt) }}</td>
            </tr>
          </table>
        </div>
        
        <div>
          <h3 class="text-lg font-medium mb-3 border-b pb-2">📝 詳細情報</h3>
          
          <div v-if="todo.tags.length > 0" class="mb-4">
            <div class="font-medium text-gray-600 mb-1">タグ:</div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in todo.tags"
                :key="tag"
                class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
          
          <div>
            <div class="font-medium text-gray-600 mb-1">詳細説明:</div>
            <div v-if="todo.description" class="bg-gray-50 p-3 rounded whitespace-pre-wrap text-sm">
              {{ todo.description }}
            </div>
            <div v-else class="text-gray-400 text-sm italic">
              詳細説明はありません
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-8 pt-4 border-t flex justify-between">
        <button
          @click="toggleCompleted"
          class="px-4 py-2 rounded-md text-white transition-colors"
          :class="todo.completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'"
        >
          {{ todo.completed ? '🔄 未完了に戻す' : '✅ 完了にする' }}
        </button>
        
        <button
          @click="deleteTodo"
          class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          🗑️ 削除
        </button>
      </div>
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTodos } from '~/composables/useTodos'
import { useUiHelpers } from '~/composables/useUiHelpers'
import { useDateUtils } from '~/composables/useUiHelpers'
import type { Todo } from '~/types/todo'

// ルートパラメータからIDを取得
const route = useRoute()
const router = useRouter()
const id = parseInt(route.params.id as string)

// Todo操作ロジック
const { todos, loadTodos, getTodoById, toggleTodoCompletion, removeTodo } = useTodos()

// UIヘルパー関数
const { 
  getPriorityBadgeClass, 
  getPriorityLabel, 
  getPriorityIcon,
  getCategoryBadgeClass,
  getCategoryLabel,
  getCategoryIcon 
} = useUiHelpers()

// 日付ユーティリティ
const { formatDate, isOverdue } = useDateUtils()

// 現在のTodo
const todo = ref<Todo | undefined>()

// 初期化
onMounted(() => {
  loadTodos()
  updateTodo()
})

// 現在のTodoを更新
function updateTodo() {
  todo.value = getTodoById(id)
}

// 完了状態切り替え
function toggleCompleted() {
  toggleTodoCompletion(id)
  updateTodo()
}

// Todo削除
function deleteTodo() {
  if (confirm('このTodoを削除してもよろしいですか？')) {
    removeTodo(id)
    router.push('/todos')
  }
}
</script>