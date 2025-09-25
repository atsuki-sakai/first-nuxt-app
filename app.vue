<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto max-w-2xl py-8 px-4">
      <!-- ルーティングに応じたページコンポーネントを表示するのに必要 -->
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nuxt 3の自動インポート機能で、componentsディレクトリ内のコンポーネントは
// 明示的にインポートせずに使用できる
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>