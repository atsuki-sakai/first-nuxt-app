import { fileURLToPath } from 'node:url'

/*
  Nuxt.js 設定ファイル
  React/Next.js の next.config.js に相当

  React/Next.js での設定例:
  // next.config.js
  module.exports = {
    reactStrictMode: true,
    typescript: { ignoreBuildErrors: false },
    images: { domains: ['example.com'] }
  }

  Vue.js + Nuxt.js:
  // nuxt.config.ts
  export default defineNuxtConfig({
    devtools: { enabled: true },
    typescript: { strict: true }
  })
*/

const projectRoot = fileURLToPath(new URL('./', import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 互換性日付: この日付以降の機能を有効化
  compatibilityDate: '2025-07-15',

  // Docker環境でのサーバー設定
  nitro: {
    preset: 'node-server',
    // Docker内でのホストとポート設定
    experimental: {
      wasm: true
    }
  },

  // Docker環境でのデバッグ設定
  runtimeConfig: {
    // サーバー環境変数
    public: {
      // クライアント側で使用する環境変数
    }
  },

  /*
    開発ツールの設定
    React/Next.js: React Developer Tools（ブラウザ拡張）
    Vue.js + Nuxt.js: Nuxt DevTools（内蔵）+ Vue Developer Tools

    Nuxt DevToolsでできること:
    - コンポーネントツリーの表示
    - ルーティング情報
    - パフォーマンス分析
    - モジュール管理
  */
  devtools: { enabled: true },

  /*
    モジュール設定: Nuxt.js の重要な機能
    React/Next.js では package.json + 設定ファイルが必要
    Vue.js + Nuxt.js では modules 配列に追加するだけ

    React/Next.js でTailwindを使う場合:
    1. npm install tailwindcss
    2. tailwind.config.js 作成
    3. postcss.config.js 設定
    4. CSS ファイルにインポート

    Vue.js + Nuxt.js でTailwindを使う場合:
    1. modules: ['@nuxtjs/tailwindcss'] を追加
    → 自動的にセットアップ完了！
  */
  modules: [
    '@nuxtjs/tailwindcss', // Tailwind CSS モジュールを有効化
    '@nuxt/test-utils/module' // Vitest を公式サポート設定で利用
  ],

  /*
    グローバルCSS設定
    React/Next.js: _app.tsx でインポート
    Vue.js + Nuxt.js: nuxt.config.ts の css 配列で指定

    React/Next.js:
    import '../styles/globals.css'

    Vue.js + Nuxt.js:
    css: ['~/assets/css/main.css']
  */
  css: [
    // 必要に応じてグローバルCSSファイルを指定
    // 例: '~/assets/css/main.css'
  ],

  /*
    TypeScript設定
    React/Next.js: tsconfig.json のみで設定
    Vue.js + Nuxt.js: nuxt.config.ts でも追加設定可能

    strict: 厳密な型チェック
    typeCheck: ビルド時の型チェック
  */
  typescript: {
    strict: true,        // 厳密モード有効化
    typeCheck: true      // ビルド時型チェック有効化
  },

  /*
    アプリケーション設定
    React/Next.js: _app.tsx や _document.tsx で設定
    Vue.js + Nuxt.js: nuxt.config.ts の app 設定

    SEO関連のメタデータをここで一括管理
  */
  app: {
    head: {
      title: 'Todo App',
      meta: [
        { name: 'description', content: 'Nuxt.js + Vue 3 + TypeScript Todo App' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  /*
    パスエイリアス設定
    React/Next.js: tsconfig.json の paths で設定
    Vue.js + Nuxt.js: nuxt.config.ts の alias で設定

    ~/ と @/ はプロジェクトルートを指す
    使用例: import { useTodos } from '~/composables/useTodos'
  */
  alias: {
    '~': projectRoot,
    '@': projectRoot
  },

  /*
    自動インポート設定: Nuxt.js の強力な機能
    React/Next.js では手動でimport文を書く必要がある
    Vue.js + Nuxt.js では指定したディレクトリから自動インポート

    React/Next.js:
    import { useState } from 'react'
    import { useTodos } from '../composables/useTodos'

    Vue.js + Nuxt.js:
    // import 不要！自動的にインポートされる
    const { addTodo } = useTodos()
  */
  imports: {
    dirs: ['composables', 'types']
  },

  /*
    コンポーネントの自動インポート
    React/Next.js では各ファイルでコンポーネントをインポートが必要
    Vue.js + Nuxt.js では components/ から自動インポート

    React/Next.js:
    import TodoItem from '../components/TodoItem'
    <TodoItem />

    Vue.js + Nuxt.js:
    // import 不要！
    <TodoItem />
  */
  components: {
    global: true,           // グローバルコンポーネントとして登録
    dirs: ['components']    // 自動インポート対象ディレクトリ
  }
})
