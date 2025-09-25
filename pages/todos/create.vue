<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">新しいTodoを作成</h1>
      <!--
        NuxtLink: Nuxt.js の内部リンクコンポーネント
        React/Next.js の <Link> コンポーネントに相当

        React/Next.js:
        import Link from 'next/link'
        <Link href="/todos">
          <a className="btn">一覧に戻る</a>
        </Link>

        Vue.js + Nuxt.js:
        <NuxtLink to="/todos" class="btn">
          一覧に戻る
        </NuxtLink>

        特徴:
        - プリフェッチング（ホバー時に先読み）
        - クライアントサイドナビゲーション
        - 自動的なアクティブクラス付与
        - SEO 友好的
      -->
      <NuxtLink
        to="/todos"
        class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
      >
        ↩️ 一覧に戻る
      </NuxtLink>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <!--
        カスタムイベントの使用: Vue.js の重要な機能
        親コンポーネントから子コンポーネントにイベントハンドラーを渡す

        React/Next.js:
        <TodoForm
          onSubmit={createTodo}
          onCancel={navigateBack}
        />

        Vue.js:
        <TodoForm
          @submit="createTodo"
          @cancel="navigateBack"
        />

        @ = v-on: の省略記法
        子コンポーネントは emit() でイベントを発火
      -->
      <TodoForm
        @submit="createTodo"
        @cancel="navigateBack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/*
  自動インポート vs 明示的インポート

  Nuxt.js では以下が自動的にインポートされる:
  - Vue の基本機能 (ref, computed, watch など)
  - Nuxt.js の機能 (navigateTo, useHead など)
  - Vue Router の機能 (useRouter, useRoute)
  - 自作の composables (~/composables/ 内)
  - 型定義 (~/types/ 内)

  React/Next.js では常に明示的インポートが必要:
  import { useState, useEffect } from 'react'
  import { useRouter } from 'next/router'
  import { useTodos } from '../composables/useTodos'
*/

// 明示的にインポートが必要な場合（外部ライブラリなど）
import { useRouter } from 'vue-router'
import { useTodos } from '~/composables/useTodos'
import type { TodoFormData } from '~/types/todo'

/*
  composables の使用
  React/Next.js のカスタムフックと同じパターン

  React/Next.js:
  const router = useRouter();
  const { addTodo } = useTodos();

  Vue.js:
  const router = useRouter()
  const { addTodo } = useTodos()
*/
const router = useRouter()
const { addTodo } = useTodos()

/*
  関数定義: Vue.js では function 宣言でも arrow function でも使用可能
  React/Next.js:
  const createTodo = useCallback((data: TodoFormData) => {
    const newTodo = addTodo(data);
    router.push(`/todos/${newTodo.id}`);
  }, [addTodo, router]);

  Vue.js:
  function createTodo(data: TodoFormData) {
    const newTodo = addTodo(data)
    router.push(`/todos/${newTodo.id}`)
  }
  // useCallback は不要（自動最適化）
*/

// 新しいTodoを作成
function createTodo(data: TodoFormData) {
  const newTodo = addTodo(data)
  // プログラマティックナビゲーション
  router.push(`/todos/${newTodo.id}`)
}

// 戻る処理
function navigateBack() {
  router.push('/todos')
}

/*
  ページレベルでの責務:
  1. レイアウトの定義
  2. コンポーネントの配置
  3. ナビゲーションロジック
  4. データの受け渡し

  実際のフォームロジックは TodoForm コンポーネントに委譲
  → 単一責任の原則に従った設計
*/
</script>