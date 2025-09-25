<template>
  <div v-if="totalCount > 0" class="mt-8 pt-6 border-t-2 border-gray-200">
    <!-- 詳細統計 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="text-center p-3 bg-blue-50 rounded-lg">
        <div class="text-2xl font-bold text-blue-600">{{ totalCount }}</div>
        <div class="text-sm text-blue-800">総数</div>
      </div>
      <div class="text-center p-3 bg-green-50 rounded-lg">
        <div class="text-2xl font-bold text-green-600">{{ completedCount }}</div>
        <div class="text-sm text-green-800">完了</div>
      </div>
      <div class="text-center p-3 bg-yellow-50 rounded-lg">
        <div class="text-2xl font-bold text-yellow-600">{{ activeCount }}</div>
        <div class="text-sm text-yellow-800">未完了</div>
      </div>
      <div class="text-center p-3 bg-purple-50 rounded-lg">
        <div class="text-2xl font-bold text-purple-600">{{ progressPercentage }}%</div>
        <div class="text-sm text-purple-800">進捗</div>
      </div>
    </div>

    <!-- プログレスバー -->
    <div class="mb-6">
      <div class="flex justify-between text-sm text-gray-600 mb-2">
        <span>進捗状況</span>
        <span>{{ completedCount }} / {{ totalCount }}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div
          class="h-3 rounded-full transition-all duration-500"
          :class="completedCount === totalCount ? 'bg-green-500' : 'bg-blue-500'"
          :style="{width: progressPercentage + '%'}"
        ></div>
      </div>
    </div>

    <!-- 一括操作ボタン -->
    <div class="flex flex-wrap gap-3 justify-center">
      <Button
        v-if="completedCount > 0"
        @click="$emit('clear-completed')"
        variant="danger"
      >
        🗑️ 完了済みを削除 ({{ completedCount }}件)
      </Button>

      <Button
        v-if="activeCount > 0"
        @click="$emit('complete-all')"
        variant="success"
      >
        ✅ すべて完了にする
      </Button>

      <Button
        v-if="completedCount > 0"
        @click="$emit('uncomplete-all')"
        variant="warning"
      >
        🔄 すべて未完了にする
      </Button>

      <Button
        @click="$emit('export')"
        variant="info"
      >
        📤 エクスポート
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalCount: number
  completedCount: number
  activeCount: number
  progressPercentage: number
}>()

defineEmits<{
  (e: 'clear-completed'): void
  (e: 'complete-all'): void
  (e: 'uncomplete-all'): void
  (e: 'export'): void
}>()
</script>