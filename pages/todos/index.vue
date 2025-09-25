<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">📝 Todo一覧</h1>
    <!--
      コンポーネントの自動インポート: Nuxt.js の重要な機能
      components/ ディレクトリ内のコンポーネントは自動的にインポートされる

      React/Next.js:
      import TodoAppNew from '../components/TodoAppNew'
      <TodoAppNew />

      Vue.js + Nuxt.js:
      // インポート不要！
      <TodoAppNew />

      Nuxt.js が自動的に:
      - components/TodoAppNew.vue を検出
      - グローバルコンポーネントとして登録
      - テンプレート内で直接使用可能
    -->
    <TodoAppNew />
  </div>
</template>

<script setup lang="ts">
/*
  Nuxt.js ページコンポーネントの特徴:

  1. ファイルベースルーティング
     pages/todos/index.vue → /todos にアクセス可能
     React/Next.js の pages システムと同じ仕組み

  2. 自動コード分割
     各ページは自動的に独立したチャンクに分割される

  3. SEO メタデータ
     useHead() や useSeoMeta() でメタ情報を設定可能

  4. サーバーサイドレンダリング (SSR)
     デフォルトでサーバーサイドでレンダリングされる

  5. 自動インポート
     Nuxt.js の機能やコンポーザブルは自動的にインポート
*/

// このページは単純な表示のみなので、追加のロジックは不要
// TodoAppNew コンポーネントがすべての機能を提供

</script>