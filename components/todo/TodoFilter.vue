<template>
  <div class="mb-6 p-4 bg-gray-50 rounded-lg">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <!-- 検索機能 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          🔍 Todo検索
        </label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Todoを検索..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <p v-if="searchQuery" class="text-xs text-gray-500 mt-1">
          "{{ searchQuery }}" で検索中... ({{ filteredCount }}件見つかりました)
        </p>
      </div>

      <!-- ソート機能 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          🔄 並び順
        </label>
        <select v-model="sortOrder" class="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="newest">新しい順</option>
          <option value="oldest">古い順</option>
          <option value="priority">優先度順</option>
          <option value="alphabetical">アルファベット順</option>
        </select>
      </div>
    </div>

    <!-- フィルターボタン群 -->
    <div class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          📊 完了状態フィルター
        </label>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="filterOption in filterOptions"
            :key="filterOption.value"
            @click="currentFilter = filterOption.value"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              currentFilter === filterOption.value
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ filterOption.icon }} {{ filterOption.label }}
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          🏷️ カテゴリフィルター
        </label>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="category in categoryOptions"
            :key="category.value"
            @click="selectedCategoryFilter = selectedCategoryFilter === category.value ? '' : category.value"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              selectedCategoryFilter === category.value
                ? 'bg-green-500 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ category.icon }} {{ category.label }}
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          🎯 優先度フィルター
        </label>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="priority in priorityOptions"
            :key="priority.value"
            @click="selectedPriorityFilter = selectedPriorityFilter === priority.value ? '' : priority.value"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              selectedPriorityFilter === priority.value
                ? 'bg-red-500 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ priority.icon }} {{ priority.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TodoFilterType, TodoCategory, TodoPriority, TodoSortType } from '~/types/todo'
import { FILTER_OPTIONS, CATEGORY_OPTIONS, PRIORITY_OPTIONS } from '~/types/todo'

// props
const props = defineProps<{
  filteredCount: number
  searchQuery?: string
  currentFilter?: TodoFilterType
  selectedCategoryFilter?: TodoCategory | ''
  selectedPriorityFilter?: TodoPriority | ''
  sortOrder?: TodoSortType
}>()

// emits
const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:currentFilter', value: TodoFilterType): void
  (e: 'update:selectedCategoryFilter', value: TodoCategory | ''): void
  (e: 'update:selectedPriorityFilter', value: TodoPriority | ''): void
  (e: 'update:sortOrder', value: TodoSortType): void
}>()

// 静的なオプションデータ
const filterOptions = FILTER_OPTIONS
const categoryOptions = CATEGORY_OPTIONS
const priorityOptions = PRIORITY_OPTIONS

// リアクティブなプロパティ - v-model対応の双方向バインディング
const searchQuery = computed({
  get: () => props.searchQuery || '',
  set: (value) => emit('update:searchQuery', value)
})

const currentFilter = computed({
  get: () => props.currentFilter || 'all',
  set: (value) => emit('update:currentFilter', value as TodoFilterType)
})

const selectedCategoryFilter = computed({
  get: () => props.selectedCategoryFilter || '',
  set: (value) => emit('update:selectedCategoryFilter', value as TodoCategory | '')
})

const selectedPriorityFilter = computed({
  get: () => props.selectedPriorityFilter || '',
  set: (value) => emit('update:selectedPriorityFilter', value as TodoPriority | '')
})

const sortOrder = computed({
  get: () => props.sortOrder || 'newest',
  set: (value) => emit('update:sortOrder', value as TodoSortType)
})
</script>