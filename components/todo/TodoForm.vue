<template>
  <div class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">
      <slot name="title">{{ isEdit ? 'Todo を編集' : '新しいTodoを追加' }}</slot>
    </h3>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- メインのTodoテキスト -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            📝 Todoタイトル *
          </label>
          <input
            v-model.trim="form.text"
            type="text"
            placeholder="例: 書類を整理する"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxlength="100"
          />
          <p class="text-xs text-gray-500 mt-1">{{ form.text.length }}/100文字</p>
        </div>

        <!-- 優先度選択 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            🎯 優先度
          </label>
          <select 
            v-model="form.priority" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option 
              v-for="option in priorityOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.icon }} {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- カテゴリ選択 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            📂 カテゴリ
          </label>
          <div class="flex gap-4">
            <label 
              v-for="option in categoryOptions" 
              :key="option.value"
              class="flex items-center"
            >
              <input 
                v-model="form.category" 
                type="radio" 
                :value="option.value" 
                class="mr-2"
              />
              <span class="text-sm">{{ option.icon }} {{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- 期限設定 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            📅 期限（オプション）
          </label>
          <input
            v-model="form.dueDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <!-- タグ選択 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          🏷️ タグ（複数選択可）
        </label>
        <div class="flex flex-wrap gap-3">
          <label 
            v-for="option in tagOptions" 
            :key="option.value"
            class="flex items-center"
          >
            <input 
              v-model="form.tags" 
              type="checkbox" 
              :value="option.value" 
              class="mr-2" 
            />
            <span class="text-sm">{{ option.label }}</span>
          </label>
        </div>
      </div>

      <!-- 詳細説明 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          📋 詳細説明（オプション）
        </label>
        <textarea
          v-model="form.description"
          rows="3"
          placeholder="詳細な説明や手順を入力..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
          maxlength="500"
        ></textarea>
        <p class="text-xs text-gray-500 mt-1">{{ form.description.length }}/500文字</p>
      </div>

      <!-- 送信ボタン -->
      <div class="flex justify-between items-center">
        <Button
          type="button"
          variant="secondary"
          @click="resetForm"
        >
          🗑️ フォームをクリア
        </Button>

        <Button
          type="submit"
          :disabled="!isValid"
          :variant="isValid ? 'primary' : 'secondary'"
        >
          {{ isEdit ? '✅ 保存' : '➕ Todoを追加' }}
        </Button>
      </div>

      <!-- リアルタイムプレビュー -->
      <div v-if="showPreview && form.text.trim()" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <h4 class="text-sm font-semibold text-yellow-800 mb-2">👀 プレビュー</h4>
        <div class="text-sm text-yellow-700">
          <p><strong>タイトル:</strong> {{ form.text }}</p>
          <p><strong>優先度:</strong> {{ getPriorityLabel(form.priority) }}</p>
          <p><strong>カテゴリ:</strong> {{ getCategoryLabel(form.category) }}</p>
          <p v-if="form.dueDate"><strong>期限:</strong> {{ formatDate(new Date(form.dueDate)) }}</p>
          <p v-if="form.tags.length > 0"><strong>タグ:</strong> {{ form.tags.join(', ') }}</p>
          <p v-if="form.description">
            <strong>説明:</strong> {{ form.description.substring(0, 100) }}{{ form.description.length > 100 ? '...' : '' }}
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Todo, TodoFormData } from '~/types/todo'
import { PRIORITY_OPTIONS, CATEGORY_OPTIONS, TAG_OPTIONS } from '~/types/todo'
import { useTodoForm } from '~/composables/useTodoForm'
import { useUiHelpers } from '~/composables/useUiHelpers'
import { useDateUtils } from '~/composables/useUiHelpers'

// UIヘルパー関数
const { getPriorityLabel, getCategoryLabel } = useUiHelpers()

// 日付ユーティリティ
const { formatDate } = useDateUtils()

const props = defineProps({
  // 編集モードの場合、初期データとしてTodoを受け取る
  initialData: {
    type: Object as () => Partial<TodoFormData>,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  showPreview: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits<{
  (e: 'submit', formData: TodoFormData): void
  (e: 'cancel'): void
}>()

// 静的なオプションデータ
const priorityOptions = PRIORITY_OPTIONS
const categoryOptions = CATEGORY_OPTIONS
const tagOptions = TAG_OPTIONS

// フォームロジック
const { form, isValid, resetForm } = useTodoForm(props.initialData)

// フォーム送信ハンドラ
const handleSubmit = () => {
  if (isValid.value) {
    emit('submit', { ...form.value })
  }
}
</script>