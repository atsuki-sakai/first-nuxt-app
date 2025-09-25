<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">🏠 ようこそ、Todo App へ！</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">🚀 アプリの特徴</h2>
      
      <ul class="list-disc pl-5 space-y-2">
        <li>Nuxt.js と Vue 3 による最新のフロントエンド開発</li>
        <li>TypeScript による型安全性</li>
        <li>コンポーネント分割による保守性の高いコード</li>
        <li>Composables による再利用可能なロジック</li>
        <li>ローカルストレージによるデータ永続化</li>
        <li>レスポンシブデザイン</li>
      </ul>
      
      <div class="mt-6 flex justify-center">
        <a 
          href="/todos" 
          class="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          👉 Todo一覧を見る
        </a>
      </div>
    </div>
  </div>
</template>