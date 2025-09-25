<template>
  <div
    :class="[
      'group relative flex items-start gap-4 p-4 border-2 rounded-lg transition-all duration-200',
      'hover:shadow-md hover:border-blue-200',
      todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300',
      priorityClass
    ]"
  >
    <!-- 優先度インジケーター -->
    <div :class="['w-1 h-full absolute left-0 top-0 rounded-l-lg', priorityBorderClass]"></div>

    <!-- チェックボックス -->
    <div class="flex items-center mt-1">
      <input
        v-model="isCompleted"
        type="checkbox"
        @click.stop
        class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
      />
    </div>

    <!-- メインコンテンツ -->
    <div class="flex-1 min-w-0">
      <!-- タイトルとメタ情報 -->
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h4
            :class="[
              'text-lg font-medium transition-colors',
              todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
            ]"
          >
            {{ todo.text }}
          </h4>

          <!-- メタ情報 -->
          <div class="flex flex-wrap items-center gap-3 mt-2 text-sm">
            <!-- カテゴリ -->
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', categoryBadgeClass]">
              {{ categoryIcon }} {{ categoryLabel }}
            </span>

            <!-- 優先度 -->
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', priorityBadgeClass]">
              {{ priorityIcon }} {{ priorityLabel }}
            </span>

            <!-- タグ -->
            <div v-if="todo.tags.length > 0" class="flex gap-1">
              <span
                v-for="tag in todo.tags"
                :key="tag"
                class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
              >
                #{{ tag }}
              </span>
            </div>

            <!-- 作成日時 -->
            <span class="text-gray-400">
              📅 {{ formattedCreatedAt }}
            </span>

            <!-- 期限 -->
            <span v-if="todo.dueDate" :class="[
              'font-medium',
              isOverdue ? 'text-red-600' : 'text-orange-600'
            ]">
              ⏰ {{ formattedDueDate }}
              <span v-if="isOverdue"> (期限切れ)</span>
            </span>
          </div>
        </div>

        <!-- 操作ボタン -->
        <div class="flex items-center gap-2 ml-4">
          <!-- 詳細ページへのリンク -->
          <NuxtLink
            :to="`/todos/${todo.id}`"
            class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all"
            title="詳細を表示"
          >
            👁️
          </NuxtLink>
          
          <!-- 編集ページへのリンク -->
          <NuxtLink
            :to="`/todos/${todo.id}/edit`"
            class="opacity-0 group-hover:opacity-100 p-1 text-blue-400 hover:text-blue-600 transition-all"
            title="編集"
          >
            ✏️
          </NuxtLink>

          <!-- 削除ボタン -->
          <button
            @click="handleDelete"
            class="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all"
            title="削除"
          >
            🗑️
          </button>
        </div>
      </div>

      <!-- 説明（展開状態の場合のみ表示） -->
      <div v-if="isExpanded" class="mt-4 pt-4 border-t border-gray-200">
        <div v-if="todo.description" class="mb-3">
          <h5 class="text-sm font-medium text-gray-700 mb-1">📋 詳細説明</h5>
          <p class="text-sm text-gray-600 whitespace-pre-wrap">{{ todo.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Todo } from '~/types/todo'
import { useUiHelpers } from '~/composables/useUiHelpers'
import { useDateUtils } from '~/composables/useUiHelpers'

const props = defineProps<{
  todo: Todo
  expanded?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:completed', completed: boolean): void
  (e: 'delete'): void
  (e: 'expand'): void
}>()

// UIヘルパー関数
const { 
  getPriorityClass, 
  getPriorityBorderClass, 
  getPriorityBadgeClass,
  getCategoryBadgeClass,
  getPriorityLabel,
  getPriorityIcon,
  getCategoryLabel,
  getCategoryIcon
} = useUiHelpers()

// 日付ユーティリティ
const { formatDate, isOverdue: checkOverdue } = useDateUtils()

// 計算プロパティ
const priorityClass = computed(() => getPriorityClass(props.todo.priority))
const priorityBorderClass = computed(() => getPriorityBorderClass(props.todo.priority))
const priorityBadgeClass = computed(() => getPriorityBadgeClass(props.todo.priority))
const categoryBadgeClass = computed(() => getCategoryBadgeClass(props.todo.category))
const priorityLabel = computed(() => getPriorityLabel(props.todo.priority))
const priorityIcon = computed(() => getPriorityIcon(props.todo.priority))
const categoryLabel = computed(() => getCategoryLabel(props.todo.category))
const categoryIcon = computed(() => getCategoryIcon(props.todo.category))

const formattedCreatedAt = computed(() => formatDate(props.todo.createdAt))
const formattedDueDate = computed(() => props.todo.dueDate ? formatDate(new Date(props.todo.dueDate)) : '')
const isOverdue = computed(() => props.todo.dueDate ? checkOverdue(props.todo.dueDate) : false)

// 展開状態
const isExpanded = ref(props.expanded || false)

// 完了状態を双方向バインディングで管理
const isCompleted = computed({
  get: () => props.todo.completed,
  set: (value) => emit('update:completed', value)
})

// 削除処理
const handleDelete = () => {
  if (confirm('このTodoを削除しますか？')) {
    emit('delete')
  }
}

// 親から展開状態が変更された場合に更新
watch(() => props.expanded, (newVal) => {
  isExpanded.value = !!newVal
})
</script>