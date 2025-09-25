# Todo App - Vue.js/Nuxt.js 学習プロジェクト

このプロジェクトは **Vue.js + Nuxt.js + TypeScript** の学習を目的とした、教育的Todoアプリケーションです。React/Next.jsとの違いを詳細にコメントで説明し、Vue.js/Nuxt.jsの特徴的な機能や記法を段階的に理解できるように設計されています。

## 🎯 詳細学習目標

### **Core Technologies**
- **Vue.js 3 Composition API**: リアクティブシステムとコンポーザブルパターンの理解
- **Nuxt.js 4**: ファイルベースルーティング、SSR、ハイドレーション、自動インポート
- **TypeScript**: 型安全性、インターフェース設計、ジェネリクス活用
- **Composables**: 再利用可能なロジック設計パターンとベストプラクティス

### **Comparative Learning Objectives**
- React/Next.jsとの**概念的違い**と**実装パターン**の把握
- **データフロー**の違い: Props/State vs Props/Emits
- **ライフサイクル**: useEffect vs watch/lifecycle hooks
- **状態管理アプローチ**: useState vs ref/reactive
- **パフォーマンス最適化**: React.memo vs defineAsyncComponent

## 🚀 環境セットアップ

### **前提条件**
- Node.js 18.0.0 以上 (Nuxt 4 対応)
- Package Manager: npm, pnpm, yarn のいずれか
- エディタ: VS Code + Vetur/Vue Language Features

### **依存関係のインストール**

```bash
# 推奨: pnpm (高速・効率的)
pnpm install

# 代替: npm
npm install

# 代替: yarn
yarn install
```

### **開発環境の詳細**

#### **開発サーバー起動**
```bash
# 開発サーバー起動（http://localhost:3000）
npm run dev

# 詳細ログ付きで起動
DEBUG=nuxt:* npm run dev

# 特定ポートで起動
PORT=4000 npm run dev
```

#### **Docker環境での起動**
```bash
# Docker Composeで起動（推奨）
npm run docker:up

# 個別コマンドでの起動
npm run docker:build  # Dockerイメージをビルド
npm run docker:run    # コンテナを起動

# その他のDockerコマンド
npm run docker:down   # コンテナを停止
npm run docker:logs   # ログを表示
npm run docker:shell  # コンテナ内のシェルにアクセス
```

**Docker環境の特徴**:
- **Node.js 20対応**: Nuxt 4.1.2の要件に準拠
- **マルチステージビルド**: 本番環境用の軽量イメージ（約200MB）
- **セキュリティ**: 非rootユーザー（nuxt:nodejs）での実行
- **ネイティブバインディング**: oxc-parser等の高速パーサー対応
- **自動再起動**: コンテナクラッシュ時の自動復旧
- **ポート**: `http://localhost:3000` でアクセス可能

**Docker構成ファイル**:
- `Dockerfile`: 本番用マルチステージビルド（日本語コメント付き）
- `docker-compose.yml`: 開発・本番環境管理（日本語コメント付き）
- `.dockerignore`: ビルド最適化（不要ファイル除外）

**Docker環境のトラブルシューティング**:
```bash
# Docker Desktopが起動していない場合
# Applications > Docker Desktop を起動

# 既存コンテナ・イメージのクリーンアップ
docker-compose down
docker system prune -f

# ビルドキャッシュをクリア
docker builder prune -f

# 完全な再ビルド
npm run docker:up
```

#### **開発ツールの有効化**
Nuxt DevTools が自動的に有効化され、以下の機能が利用可能:
- **コンポーネントツリー可視化**
- **ルーティング構造の確認**
- **パフォーマンス分析**
- **ストアの状態管理**
- **API ルートのテスト**

#### **TypeScript開発支援**
```bash
# 型チェック
npm run typecheck

# TypeScript設定の検証
npx nuxi typecheck
```

## 📁 プロジェクト構造とアーキテクチャ分析

### **完全ディレクトリ構造マップ**

```
first-nuxt/
├── 📁 app/
│   └── app.vue              # アプリケーションルート（React _app.tsx相当）
│                            # ✨ グローバルレイアウト・メタタグ・SEO設定
├── 📁 pages/                # 📍 ファイルベースルーティング（Next.js App Router準拠）
│   ├── index.vue            # 🏠 / - ホームページ（ランディング）
│   └── todos/               # 📝 Todo機能ルート群
│       ├── index.vue        # 📋 /todos - Todo一覧ページ（メイン機能）
│       ├── create.vue       # ➕ /todos/create - 新規Todo作成
│       └── [id]/            # 🔗 動的ルーティング（パラメータ付き）
│           ├── index.vue    # 👁️ /todos/:id - Todo詳細表示
│           └── edit.vue     # ✏️ /todos/:id/edit - Todo編集画面
├── 📁 components/           # 🧩 再利用可能UIコンポーネント
│   ├── ui/                  # 🎨 汎用UIパーツ（デザインシステム基盤）
│   │   └── Button.vue       # 🔘 汎用ボタン（variant/size対応）
│   ├── todo/                # 📝 Todo機能専用コンポーネント群
│   │   ├── TodoItem.vue     # 📄 個別Todo表示（チェックボックス付き）
│   │   ├── TodoForm.vue     # 📝 Todo作成/編集フォーム（バリデーション付き）
│   │   ├── TodoFilter.vue   # 🔍 フィルタリング・ソート機能
│   │   └── TodoStats.vue    # 📊 統計・進捗表示
│   ├── TodoApp.vue          # 🎯 メインTodoアプリケーション
│   └── TodoAppNew.vue       # 🆕 新版（学習用比較対象）
├── 📁 composables/          # ⚙️ ビジネスロジック層（React Custom Hooks相当）
│   ├── useTodos.ts          # 📝 Todoメインロジック（CRUD操作）
│   ├── useTodoForm.ts       # 📋 フォーム状態管理・バリデーション
│   └── useUiHelpers.ts      # 🎛️ UI状態ヘルパー（モーダル・トースト等）
├── 📁 types/                # 📐 TypeScript型システム
│   └── todo.ts              # 📝 Todo関連型定義・定数・オプション
├── 📁 layouts/              # 🏗️ ページレイアウトテンプレート
│   └── default.vue          # 🎨 デフォルトレイアウト（ヘッダー・フッター）
├── 📁 assets/               # 🎨 ビルド対象アセット（存在時）
├── 📁 static/               # 📁 静的ファイル（ビルド時コピー）
├── 📁 plugins/              # 🔌 Nuxtプラグイン（グローバル設定）
├── 📁 middleware/           # 🛡️ ルートガード・認証チェック
├── 📁 server/               # 🖥️ サーバーサイドAPI（存在時）
│   └── api/                 # 🔗 APIエンドポイント
└── 📁 public/               # 🌐 静的公開ファイル
    ├── favicon.ico          # 🔖 サイトアイコン
    └── robots.txt           # 🤖 検索エンジン設定
```

### **アーキテクチャ設計原則**

#### **📐 分離の原則（Separation of Concerns）**
```
📱 Presentation Layer (components/pages)
├── 🎨 UI Components      → 見た目・相互作用
├── 📄 Page Components    → ルーティング・レイアウト
└── 🎭 Layout Components  → 共通構造・ナビゲーション

⚙️ Logic Layer (composables)
├── 🧠 Business Logic     → ドメインルール・計算
├── 📡 Data Management    → API通信・キャッシュ
└── 🔄 State Management   → リアクティブ状態管理

📐 Type Layer (types)
├── 🏗️ Domain Models      → ビジネスエンティティ
├── 📋 Form Schemas       → 入力検証スキーマ
└── 🔗 API Interfaces     → 通信インターフェース
```

#### **🔀 データフロー・状態管理アーキテクチャ**

##### **1. ルーティングシステム詳細**

**📍 ファイルベースルーティングマッピング**
```bash
# 基本ルーティング
pages/index.vue                    → GET  /
pages/todos/index.vue              → GET  /todos
pages/todos/create.vue             → GET  /todos/create

# 動的ルーティング
pages/todos/[id]/index.vue         → GET  /todos/:id
pages/todos/[id]/edit.vue          → GET  /todos/:id/edit

# キャッチオールルーティング
pages/[...slug].vue                → GET  /*（404ページ等）

# ネストされた動的ルート
pages/users/[userId]/posts/[postId].vue → GET /users/:userId/posts/:postId
```

**⚡ React/Next.js App Router との比較**
```typescript
// Next.js App Router
app/
├── page.tsx              // ← pages/index.vue
├── todos/
│   ├── page.tsx          // ← pages/todos/index.vue
│   ├── create/page.tsx   // ← pages/todos/create.vue
│   └── [id]/
│       ├── page.tsx      // ← pages/todos/[id]/index.vue
│       └── edit/page.tsx // ← pages/todos/[id]/edit.vue
```

##### **2. Composables 状態管理パターン**

**🔄 リアクティブシステム比較**
```typescript
// ❌ React/Next.js - 手動依存管理が必要
const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [isLoading, setIsLoading] = useState(false)

  // 依存配列を手動管理
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'all') return true
      if (filter === 'active') return !todo.completed
      if (filter === 'completed') return todo.completed
    })
  }, [todos, filter]) // ← 手動で依存関係を指定

  // 副作用の管理
  useEffect(() => {
    setIsLoading(true)
    // API呼び出し...
    setIsLoading(false)
  }, [todos]) // ← 依存配列管理

  return { todos, setTodos, filter, setFilter, filteredTodos, isLoading }
}
```

```typescript
// ✅ Vue.js - 自動依存追跡システム
export const useTodos = () => {
  const todos = ref<Todo[]>([])
  const filter = ref<FilterType>('all')
  const isLoading = ref(false)

  // 自動的に依存関係を追跡
  const filteredTodos = computed(() => {
    return todos.value.filter(todo => {
      if (filter.value === 'all') return true
      if (filter.value === 'active') return !todo.completed
      if (filter.value === 'completed') return todo.completed
    })
  }) // ← 自動で todos と filter の変更を検知

  // 副作用の管理
  watchEffect(() => {
    isLoading.value = true
    // API呼び出し...
    isLoading.value = false
  }) // ← 自動で依存関係を追跡

  return { todos, filter, filteredTodos, isLoading }
}
```

##### **3. コンポーネントアーキテクチャパターン**

**🏗️ レイヤードアーキテクチャ詳細**
```
┌─────────────────────────────────────────┐ ← 🎨 Presentation Layer
│  📄 Pages (pages/)                      │
│  ├── ルーティング・SEO・レイアウト選択       │
│  └── データフェッチ・ナビゲーション         │
├─────────────────────────────────────────┤
│  🧩 Components (components/)            │
│  ├── UI: 汎用UIパーツ（Button, Modal）   │
│  ├── Feature: 機能専用コンポーネント       │
│  └── Layout: 共通レイアウト構造           │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐ ← ⚙️ Logic Layer
│  🔄 Composables (composables/)          │
│  ├── ビジネスロジック・状態管理            │
│  ├── API通信・データ変換                 │
│  └── 副作用・ライフサイクル管理            │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐ ← 📐 Type Layer
│  📋 Types (types/)                      │
│  ├── ドメインモデル・エンティティ          │
│  ├── API レスポンス・リクエスト型          │
│  └── UI状態・フォーム検証スキーマ          │
└─────────────────────────────────────────┘
```

##### **4. データフロー・状態同期システム**

**🔄 状態同期フロー図**
```
    📱 User Interaction
         │
         ▼
    🎯 Component Event (@click, @input)
         │
         ▼
    ⚙️ Composable Function Call
         │
         ├─ 🔄 ref/reactive Update
         │       │
         │       ▼
         │  📊 Computed Property Re-calculation
         │       │
         │       ▼
         │  🖥️ Template Re-render
         │
         ├─ 💾 Persistent Storage (localStorage)
         │
         └─ 📡 API Request (if needed)
                 │
                 ▼
            🔄 Response Processing
                 │
                 ▼
            📊 State Update & UI Sync
```

## 🔧 Vue.js/Nuxt.js 技術スタック詳細解析

### **🎨 Vue.js 独特の記法・機能体系**

#### **1. テンプレート構文の完全ガイド**

**📝 基本データバインディング**
```vue
<template>
  <!-- 🔗 テキストバインディング -->
  <p>{{ message }}</p>
  <p>{{ user.name + ' (' + user.age + ')' }}</p>

  <!-- 🔗 HTML出力（XSS注意） -->
  <div v-html="htmlContent"></div>

  <!-- 🔗 属性バインディング -->
  <div :class="{ active: isActive, disabled: isDisabled }">
  <img :src="imageUrl" :alt="imageAlt" />

  <!-- 🔗 スタイルバインディング -->
  <div :style="{ color: textColor, fontSize: fontSize + 'px' }">
  <div :style="[baseStyles, overrideStyles]">

  <!-- 🎯 イベントハンドリング -->
  <button @click="handleClick">
  <button @click="handleClick($event, 'extra-data')">
  <form @submit.prevent="handleSubmit">

  <!-- 🔄 双方向バインディング -->
  <input v-model="text" />
  <input v-model.number="age" />
  <input v-model.trim="username" />
  <textarea v-model="message"></textarea>
  <select v-model="selected">
    <option value="a">A</option>
    <option value="b">B</option>
  </select>

  <!-- 🔀 条件分岐 -->
  <div v-if="showContent">表示される</div>
  <div v-else-if="showAlternative">代替表示</div>
  <div v-else>デフォルト</div>
  <div v-show="isVisible">常にDOM存在、表示切り替えのみ</div>

  <!-- 🔁 リストレンダリング -->
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
  <li v-for="(item, index) in items" :key="index">
    {{ index }}: {{ item }}
  </li>
  <li v-for="(value, key) in object" :key="key">
    {{ key }}: {{ value }}
  </li>
</template>
```

**⚡ React/Next.js との比較表**
| Vue.js | React/Next.js | 用途 |
|--------|---------------|------|
| `{{ data }}` | `{data}` | データ表示 |
| `:class="{ active: isActive }"` | `className={isActive ? 'active' : ''}` | 条件付きクラス |
| `@click="handler"` | `onClick={handler}` | イベント処理 |
| `v-model="value"` | `value={value} onChange={setValue}` | 双方向バインディング |
| `v-if="condition"` | `{condition && <div>}` | 条件分岐 |
| `v-for="item in items"` | `{items.map(item =>)}` | リスト描画 |

#### **2. Composition API 詳細パターン**

**🔄 リアクティブシステム完全ガイド**
```vue
<script setup lang="ts">
import {
  ref, reactive, computed, watch, watchEffect,
  onMounted, onUpdated, onUnmounted,
  nextTick, toRefs, toRef
} from 'vue'

// 🔗 基本リアクティブ変数
const count = ref<number>(0)           // プリミティブ用
const user = reactive<User>({          // オブジェクト用
  name: 'John',
  age: 30,
  profile: { bio: '...' }
})

// 📊 計算プロパティ（自動キャッシュ・依存追跡）
const doubled = computed(() => count.value * 2)
const displayName = computed(() =>
  user.name.toUpperCase() + ` (${user.age}歳)`
)

// 👁️ ウォッチャー（副作用管理）
// 特定の値を監視
watch(count, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`)
})

// 複数の値を監視
watch([count, () => user.name], ([newCount, newName], [oldCount, oldName]) => {
  // 複数値の変更を一度に処理
})

// 自動依存関係追跡
watchEffect(() => {
  // count.value や user.name が変更されると自動実行
  document.title = `Count: ${count.value}, User: ${user.name}`
})

// 🔄 ライフサイクルフック
onMounted(() => {
  console.log('コンポーネント マウント完了')
  // API呼び出し、イベントリスナー登録等
})

onUpdated(() => {
  console.log('DOM 更新完了')
})

onUnmounted(() => {
  console.log('コンポーネント アンマウント')
  // クリーンアップ処理
})

// 🔄 非同期処理・DOM操作
const updateAsync = async () => {
  count.value++
  await nextTick() // DOM更新完了を待機
  console.log('DOM update completed')
}

// 🔄 リアクティブオブジェクトの分割代入
const { name, age } = toRefs(user) // リアクティブ性を保持
const userName = toRef(user, 'name') // 単一プロパティのref化
</script>
```

#### **3. Nuxt.js 自動インポート・DX機能**

**🚀 自動インポートシステム**
```vue
<script setup lang="ts">
// ✨ 以下は全て自動インポート（import文不要）
// Vue 3 Core Functions
const count = ref(0)              // from 'vue'
const doubled = computed(() => count.value * 2)
const router = useRouter()        // from '#app'
const route = useRoute()          // from '#app'

// カスタムComposables
const { todos, addTodo } = useTodos()        // from '~/composables/useTodos'
const { user, login } = useAuth()            // from '~/composables/useAuth'
const { theme, toggleTheme } = useTheme()    // from '~/composables/useTheme'

// ユーティリティ
const apiUrl = $fetch('/api/todos')          // Nuxt自動インポート
const { data } = await useFetch('/api/todos') // SSRデータフェッチ
</script>
```

**⚙️ nuxt.config.ts での自動インポート設定**
```typescript
export default defineNuxtConfig({
  imports: {
    dirs: [
      'composables',           // ~/composables/**/*.ts
      'types',                 // ~/types/**/*.ts
      'utils',                 // ~/utils/**/*.ts
      'stores/**'              // ~/stores/**/*.ts (Pinia等)
    ]
  },
  components: {
    global: true,              // グローバルコンポーネント登録
    dirs: [
      '~/components',          // 自動インポートディレクトリ
      '~/components/ui'        // UI コンポーネント
    ]
  }
})
```

### **🔥 React/Next.js との詳細比較分析**

#### **主要機能比較表**
| カテゴリ | 機能 | React/Next.js | Vue.js/Nuxt.js | 優劣 |
|---------|------|---------------|-----------------|-----|
| **状態管理** | 基本状態 | `useState()` | `ref()`, `reactive()` | Vue: シンプル |
| | 派生状態 | `useMemo()` + deps | `computed()` | Vue: 自動依存 |
| | 副作用 | `useEffect()` + deps | `watch()`, `watchEffect()` | Vue: 自動依存 |
| **データ流** | 双方向 | 手動実装 | `v-model` | Vue: 簡潔 |
| | Props | `props.data` | `props.data` | 同等 |
| | Events | コールバック | `@event` / `emit` | Vue: 明示的 |
| **テンプレート** | 条件分岐 | `{condition && <div>}` | `v-if`, `v-show` | Vue: 宣言的 |
| | ループ | `{items.map()}` | `v-for` | Vue: 宣言的 |
| | イベント | `onClick={handler}` | `@click="handler"` | ほぼ同等 |
| **スタイリング** | CSS | CSS Modules/styled | `<style scoped>` | Vue: 統合済み |
| **開発体験** | 自動インポート | 手動またはライブラリ | 組み込み | Vue: DX優位 |
| | TypeScript | 設定が複雑 | 統合済み | Vue: 簡単 |

#### **🎯 学習曲線・生産性比較**

**React/Next.js の特徴**
- ✅ 学習リソースが豊富
- ✅ 求人市場で有利
- ✅ 大規模プロジェクトでの実績
- ❌ 設定が複雑（Webpack, Babel, TypeScript）
- ❌ 状態管理が冗長（useState + useEffect）
- ❌ 依存配列の管理が必要

**Vue.js/Nuxt.js の特徴**
- ✅ 学習コストが低い
- ✅ 設定が簡単（Zero-config）
- ✅ テンプレート構文が直感的
- ✅ 自動依存追跡（依存配列不要）
- ❌ React比でエコシステムが小さい
- ❌ 大企業での採用事例が少ない

#### **🚀 パフォーマンス比較**

| 項目 | React/Next.js | Vue.js/Nuxt.js |
|-----|---------------|-----------------|
| **バンドルサイズ** | ~45KB (React + ReactDOM) | ~34KB (Vue 3) |
| **初期描画** | Virtual DOM diffing | Proxy-based reactivity |
| **更新性能** | 手動最適化が必要 | 自動最適化 |
| **メモリ使用量** | クロージャ多用で高め | Proxy ベースで効率的 |
| **ビルド時間** | Webpack設定次第 | Vite ベースで高速 |

#### **📊 コード量比較例**

**Todo追加機能の実装比較**
```typescript
// React/Next.js版（54行）
import React, { useState, useCallback, useMemo } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [inputText, setInputText] = useState('')

  const addTodo = useCallback(() => {
    if (inputText.trim()) {
      setTodos(prev => [...prev, {
        id: Date.now(),
        text: inputText.trim(),
        completed: false
      }])
      setInputText('')
    }
  }, [inputText])

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active') return !todo.completed
      if (filter === 'completed') return todo.completed
      return true
    })
  }, [todos, filter])

  return (
    <div>
      <input
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && addTodo()}
      />
      <button onClick={addTodo}>Add</button>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoApp
```

```vue
<!-- Vue.js版（39行） -->
<script setup lang="ts">
interface Todo {
  id: number
  text: string
  completed: boolean
}

const todos = ref<Todo[]>([])
const filter = ref<'all' | 'active' | 'completed'>('all')
const inputText = ref('')

const addTodo = () => {
  if (inputText.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: inputText.value.trim(),
      completed: false
    })
    inputText.value = ''
  }
}

const filteredTodos = computed(() => {
  return todos.value.filter(todo => {
    if (filter.value === 'active') return !todo.completed
    if (filter.value === 'completed') return todo.completed
    return true
  })
})
</script>

<template>
  <div>
    <input v-model="inputText" @keyup.enter="addTodo" />
    <button @click="addTodo">Add</button>
    <div>
      <button @click="filter = 'all'">All</button>
      <button @click="filter = 'active'">Active</button>
      <button @click="filter = 'completed'">Completed</button>
    </div>
    <ul>
      <li v-for="todo in filteredTodos" :key="todo.id">
        {{ todo.text }}
      </li>
    </ul>
  </div>
</template>
```

**📊 結果**: Vue.js版は28%少ないコード量で同等機能を実現

## 🎨 Vue.js 重要学習ポイント詳解

### **1. v-model の強力な双方向バインディング**

**🔄 基本的な双方向バインディング**
```vue
<!-- Vue.js - 極めてシンプル -->
<template>
  <input v-model="text" />
  <textarea v-model="message"></textarea>
  <select v-model="selected">
    <option value="a">A</option>
    <option value="b">B</option>
  </select>
  <input type="checkbox" v-model="checked" />
  <input type="radio" value="option1" v-model="picked" />
</template>

<script setup lang="ts">
const text = ref('')
const message = ref('')
const selected = ref('a')
const checked = ref(false)
const picked = ref('')
</script>
```

```typescript
// React/Next.js - 冗長な実装が必要
const [text, setText] = useState('')
const [message, setMessage] = useState('')
const [selected, setSelected] = useState('a')
const [checked, setChecked] = useState(false)
const [picked, setPicked] = useState('')

return (
  <>
    <input value={text} onChange={e => setText(e.target.value)} />
    <textarea value={message} onChange={e => setMessage(e.target.value)} />
    <select value={selected} onChange={e => setSelected(e.target.value)}>
      <option value="a">A</option>
      <option value="b">B</option>
    </select>
    <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />
    <input type="radio" value="option1" checked={picked === 'option1'} onChange={e => setPicked(e.target.value)} />
  </>
)
```

**🎛️ v-model の修飾子（Modifiers）**
```vue
<template>
  <!-- .lazy: change イベントで同期（input ではなく） -->
  <input v-model.lazy="msg" />

  <!-- .number: 自動的に数値に変換 -->
  <input v-model.number="age" type="number" />

  <!-- .trim: 自動的にtrimを適用 -->
  <input v-model.trim="msg" />
</template>
```

### **2. Computed Properties の自動依存追跡システム**

**📊 React vs Vue の依存管理**
```typescript
// ❌ React - 手動依存管理でバグが起きやすい
const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // 依存配列の管理が複雑で、漏れやすい
  const filteredTodos = useMemo(() => {
    return todos
      .filter(todo => {
        if (filter === 'active') return !todo.completed
        if (filter === 'completed') return todo.completed
        return true
      })
      .filter(todo => todo.text.includes(searchTerm))
  }, [todos, filter, searchTerm]) // ← 手動で全依存を記述

  const completedCount = useMemo(() => {
    return filteredTodos.filter(todo => todo.completed).length
  }, [filteredTodos]) // ← さらに依存関係を管理

  const stats = useMemo(() => {
    return {
      total: filteredTodos.length,
      completed: completedCount,
      active: filteredTodos.length - completedCount
    }
  }, [filteredTodos, completedCount]) // ← 依存地獄
}
```

```typescript
// ✅ Vue.js - 自動依存追跡で安全
export const useTodos = () => {
  const todos = ref<Todo[]>([])
  const filter = ref<FilterType>('all')
  const searchTerm = ref('')

  // 自動的に依存関係を追跡・最適化
  const filteredTodos = computed(() => {
    return todos.value
      .filter(todo => {
        if (filter.value === 'active') return !todo.completed
        if (filter.value === 'completed') return todo.completed
        return true
      })
      .filter(todo => todo.text.includes(searchTerm.value))
  }) // ← 自動で todos, filter, searchTerm を監視

  const completedCount = computed(() => {
    return filteredTodos.value.filter(todo => todo.completed).length
  }) // ← 自動で filteredTodos を監視

  const stats = computed(() => {
    return {
      total: filteredTodos.value.length,
      completed: completedCount.value,
      active: filteredTodos.value.length - completedCount.value
    }
  }) // ← 自動で関連する全ての値を監視
}
```

### **3. コンポーネント間通信パターン**

**📡 Props & Events システム**
```vue
<!-- 👨‍👩‍👧‍👦 親コンポーネント -->
<template>
  <div>
    <TodoForm
      :initialData="editingTodo"
      :loading="isSubmitting"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <TodoList
      :todos="filteredTodos"
      :filter="currentFilter"
      @toggle="toggleTodo"
      @delete="deleteTodo"
      @edit="startEdit"
    />
  </div>
</template>

<script setup lang="ts">
// Props として子コンポーネントにデータを渡す
const editingTodo = ref<Todo | null>(null)
const isSubmitting = ref(false)

// Events として子コンポーネントからイベントを受け取る
const handleSubmit = (todoData: TodoFormData) => {
  // フォーム送信処理
}

const handleCancel = () => {
  editingTodo.value = null
}
</script>
```

```vue
<!-- 👶 子コンポーネント (TodoForm.vue) -->
<template>
  <form @submit.prevent="onSubmit">
    <input v-model="form.text" :disabled="loading" />
    <button type="submit" :disabled="loading">
      {{ loading ? '送信中...' : '保存' }}
    </button>
    <button type="button" @click="onCancel">キャンセル</button>
  </form>
</template>

<script setup lang="ts">
// Props の型定義（TypeScript）
interface Props {
  initialData?: Todo
  loading?: boolean
}

// Events の型定義
interface Emits {
  (e: 'submit', data: TodoFormData): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const form = ref<TodoFormData>({
  text: props.initialData?.text || '',
  priority: props.initialData?.priority || 'medium'
  // ...
})

const onSubmit = () => {
  emit('submit', form.value)
}

const onCancel = () => {
  emit('cancel')
}
</script>
```

### **4. 高度なリアクティブシステム活用**

**🔄 watch vs watchEffect の使い分け**
```vue
<script setup lang="ts">
const todos = ref<Todo[]>([])
const selectedTodoId = ref<number | null>(null)
const searchQuery = ref('')

// 🎯 watch - 特定の値の変更を監視
watch(selectedTodoId, (newId, oldId) => {
  console.log(`選択が ${oldId} から ${newId} に変更`)
  if (newId) {
    // 選択されたTodoの詳細データを取得
    fetchTodoDetails(newId)
  }
})

// 🎯 watch - 複数の値を同時監視
watch([todos, searchQuery], ([newTodos, newQuery], [oldTodos, oldQuery]) => {
  // TodosまたはsearchQueryが変更された時の処理
  updateSearchResults(newTodos, newQuery)
})

// 🎯 watchEffect - 自動依存追跡
watchEffect(() => {
  // この関数内で使用される全てのリアクティブな値を自動監視
  if (todos.value.length > 0 && searchQuery.value) {
    // todos や searchQuery が変更されると自動実行
    performSearch(todos.value, searchQuery.value)
  }
})

// 🔄 非同期監視
watchEffect(async () => {
  if (selectedTodoId.value) {
    const details = await fetchTodoDetails(selectedTodoId.value)
    // 結果を処理...
  }
})
</script>
```

## 🗂️ プロジェクト管理・ベストプラクティス

### **📋 ファイル配置戦略（Where to put what）**

#### **📄 Pages Directory Strategy**
```
pages/
├── index.vue                    # 🏠 ホームページ・ランディングページ
├── about.vue                    # ℹ️ 静的ページ例
├── todos/
│   ├── index.vue               # 📋 Todo一覧（/todos）
│   ├── create.vue              # ➕ Todo作成（/todos/create）
│   ├── [id]/
│   │   ├── index.vue          # 👁️ Todo詳細（/todos/:id）
│   │   └── edit.vue           # ✏️ Todo編集（/todos/:id/edit）
│   └── categories/
│       └── [category].vue     # 🏷️ カテゴリ別表示（/todos/categories/:category）
├── auth/
│   ├── login.vue              # 🔐 ログインページ
│   └── register.vue           # 📝 新規登録ページ
└── [...error].vue             # 🚫 404・エラーページ（キャッチオール）
```

**📍 ルーティング設計原則**
- **RESTful URL**: `/todos/:id/edit` のように意味のあるURL構造
- **階層化**: 関連する機能は同一ディレクトリにグループ化
- **動的ルート**: `[id].vue` で動的パラメータを処理
- **キャッチオール**: `[...error].vue` で未定義ルートをハンドリング

#### **🧩 Components Architecture**
```
components/
├── ui/                         # 🎨 Design System Components
│   ├── Button.vue             # 🔘 基本ボタン（variant, size対応）
│   ├── Modal.vue              # 🪟 モーダル（overlay, animation）
│   ├── Input.vue              # 📝 入力コンポーネント（validation対応）
│   ├── Card.vue               # 📄 カードレイアウト
│   └── Toast.vue              # 🍞 通知トースト
├── form/                      # 📋 Form Specific Components
│   ├── TodoForm.vue           # ✏️ Todo専用フォーム
│   ├── SearchForm.vue         # 🔍 検索フォーム
│   └── FilterForm.vue         # 🎛️ フィルターコントロール
├── todo/                      # 📝 Todo Feature Components
│   ├── TodoItem.vue           # 📄 個別Todo表示（toggle, delete機能付き）
│   ├── TodoList.vue           # 📋 Todo一覧表示（仮想スクロール対応）
│   ├── TodoStats.vue          # 📊 統計・進捗表示
│   ├── TodoFilter.vue         # 🔍 フィルター機能
│   └── TodoSort.vue           # 🔄 ソート機能
├── layout/                    # 🏗️ Layout Components
│   ├── Header.vue             # 📃 ヘッダーナビゲーション
│   ├── Sidebar.vue            # 📱 サイドバーメニュー
│   └── Footer.vue             # 📄 フッター情報
└── common/                    # 🔄 Shared Components
    ├── Loading.vue            # ⏳ ローディングスピナー
    ├── ErrorBoundary.vue      # 🚨 エラー境界
    └── Pagination.vue         # 📄 ページネーション
```

#### **⚙️ Composables Organization**
```
composables/
├── core/                      # 🏗️ Core Business Logic
│   ├── useTodos.ts           # 📝 Todo CRUD操作
│   ├── useAuth.ts            # 🔐 認証関連
│   └── useApi.ts             # 📡 API通信基盤
├── ui/                       # 🎨 UI State Management
│   ├── useModal.ts           # 🪟 モーダル状態管理
│   ├── useToast.ts           # 🍞 通知システム
│   ├── useTheme.ts           # 🎨 テーマ・ダークモード
│   └── useLocalStorage.ts    # 💾 ローカルストレージ
├── form/                     # 📋 Form Handling
│   ├── useTodoForm.ts        # ✏️ Todo専用フォーム
│   ├── useValidation.ts      # ✅ バリデーションルール
│   └── useFormState.ts       # 📊 フォーム状態管理
└── utils/                    # 🛠️ Utility Functions
    ├── useDateFormat.ts      # 📅 日付フォーマット
    ├── useDebounce.ts        # ⏱️ デバウンス処理
    └── useKeyboard.ts        # ⌨️ キーボードショートカット
```

### **🔧 開発ワークフロー・ツール設定**

#### **📊 品質管理ツールチェーン**
```json
// package.json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "generate": "nuxt generate",
    "typecheck": "nuxt typecheck",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "@nuxt/eslint": "^0.2.0",
    "@nuxt/test-utils": "^3.9.0",
    "@playwright/test": "^1.40.0",
    "vitest": "^1.0.0",
    "@vue/test-utils": "^2.4.0",
    "happy-dom": "^12.10.0"
  }
}
```

#### **🧪 テスト戦略**

**Unit Tests (Vitest + @vue/test-utils)**
```typescript
// composables/useTodos.test.ts
import { describe, it, expect } from 'vitest'
import { useTodos } from '~/composables/useTodos'

describe('useTodos', () => {
  it('should add todo correctly', () => {
    const { todos, addTodo } = useTodos()

    addTodo({
      text: 'Test todo',
      priority: 'high',
      category: 'work',
      tags: ['urgent'],
      description: 'Test description'
    })

    expect(todos.value).toHaveLength(1)
    expect(todos.value[0].text).toBe('Test todo')
    expect(todos.value[0].completed).toBe(false)
  })
})
```

**Component Tests**
```typescript
// components/todo/TodoItem.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import TodoItem from '~/components/todo/TodoItem.vue'

describe('TodoItem', () => {
  const mockTodo = {
    id: 1,
    text: 'Test todo',
    completed: false,
    priority: 'high' as const,
    category: 'work' as const,
    tags: ['test'],
    description: 'Test description',
    createdAt: new Date(),
    dueDate: '2024-01-01'
  }

  it('emits toggle event when checkbox clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo }
    })

    await wrapper.find('input[type="checkbox"]').trigger('change')

    expect(wrapper.emitted('toggle')).toHaveLength(1)
    expect(wrapper.emitted('toggle')![0]).toEqual([1])
  })
})
```

**E2E Tests (Playwright)**
```typescript
// tests/e2e/todos.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Todo Application', () => {
  test('should create and complete a todo', async ({ page }) => {
    await page.goto('/todos')

    // Todo作成
    await page.fill('[data-testid="todo-input"]', 'Complete project documentation')
    await page.click('[data-testid="add-todo-btn"]')

    // 作成されたことを確認
    await expect(page.locator('[data-testid="todo-item"]')).toContainText('Complete project documentation')

    // Todoを完了にする
    await page.click('[data-testid="todo-checkbox"]')

    // 完了状態の確認
    await expect(page.locator('[data-testid="todo-item"]')).toHaveClass(/completed/)
  })

  test('should filter todos by status', async ({ page }) => {
    await page.goto('/todos')

    // 複数のTodoを作成
    await page.fill('[data-testid="todo-input"]', 'Active todo')
    await page.click('[data-testid="add-todo-btn"]')

    await page.fill('[data-testid="todo-input"]', 'Completed todo')
    await page.click('[data-testid="add-todo-btn"]')

    // 1つを完了にする
    await page.locator('[data-testid="todo-checkbox"]').first().check()

    // 完了済みフィルター
    await page.click('[data-testid="filter-completed"]')
    await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(1)
    await expect(page.locator('[data-testid="todo-item"]')).toContainText('Completed todo')

    // アクティブフィルター
    await page.click('[data-testid="filter-active"]')
    await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(1)
    await expect(page.locator('[data-testid="todo-item"]')).toContainText('Active todo')
  })
})
```

## 🚀 ビルド・デプロイメント戦略

### **🔨 ビルドプロセス詳細**

#### **開発モード**
```bash
# 開発サーバー起動（HMR有効）
npm run dev

# TypeScript型チェック付き開発
npm run dev --typescript

# 特定ポートで起動
PORT=4000 npm run dev

# デバッグモード
DEBUG=nuxt:* npm run dev
```

#### **本番ビルド**
```bash
# SSR ビルド（推奨）
npm run build

# 静的サイト生成（SSG）
npm run generate

# 本番プレビュー
npm run preview

# バンドルサイズ分析
npx nuxi analyze
```

### **📊 パフォーマンス最適化**

#### **Nuxt 設定での最適化**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 🚀 パフォーマンス設定
  experimental: {
    payloadExtraction: false,    // ペイロード抽出を無効化
    inlineSSRStyles: false,      // インラインCSS無効化
    treeshakeClientOnly: true    // クライアント専用コードのTree-shaking
  },

  // 📦 バンドル最適化
  build: {
    extractCSS: true,           // CSS分離
    optimization: {
      splitChunks: {
        chunks: 'all'           // チャンク分割最適化
      }
    }
  },

  // 🔧 Vite設定
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', '@vue/runtime-core'],
            'utils': ['lodash-es', 'date-fns']
          }
        }
      }
    }
  },

  // 📡 プリフェッチ設定
  router: {
    prefetchLinks: false        // リンクプリフェッチ無効化
  }
})
```

#### **コンポーネントレベル最適化**
```vue
<script setup lang="ts">
// 🔄 非同期コンポーネント読み込み
const LazyTodoStats = defineAsyncComponent(() => import('~/components/todo/TodoStats.vue'))

// 📊 computed プロパティでの最適化
const expensiveCalculation = computed(() => {
  // 重い計算処理
  return heavyProcessing(todos.value)
})

// ⚡ watch での最適化
watch(searchQuery, debounce((newQuery) => {
  performSearch(newQuery)
}, 300)) // 300msデバウンス
</script>

<template>
  <!-- 🔄 条件付きレンダリング -->
  <LazyTodoStats v-if="showStats" />

  <!-- 🎯 v-show vs v-if の使い分け -->
  <TodoFilter v-show="showFilter" />  <!-- 頻繁に切り替え -->
  <TodoModal v-if="showModal" />      <!-- 稀に表示 -->
</template>
```

### **🌐 デプロイメント オプション**

#### **Docker デプロイ（推奨）**
```bash
# 本番環境へのデプロイ
docker build -t nuxt-app .
docker run -p 3000:3000 nuxt-app

# Docker Registryへのプッシュ
docker tag nuxt-app your-registry/nuxt-app:latest
docker push your-registry/nuxt-app:latest
```

#### **クラウドプラットフォーム対応**
- **Google Cloud Run**: Dockerコンテナ直接デプロイ
- **AWS ECS/Fargate**: コンテナオーケストレーション
- **Azure Container Instances**: サーバーレスコンテナ
- **DigitalOcean App Platform**: GitベースDockerデプロイ

#### **Vercel デプロイ**
```typescript
// vercel.json
{
  "builds": [
    {
      "src": "nuxt.config.ts",
      "use": "@nuxtjs/vercel-builder"
    }
  ]
}
```

#### **Netlify デプロイ**
```bash
# netlify.toml
[build]
  command = "npm run generate"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### **Docker コンテナ化**
```dockerfile
# Dockerfile（マルチステージビルド）
FROM --platform=linux/amd64 node:18-alpine AS base

# 依存関係インストール
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# アプリケーションビルド
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 本番環境用イメージ
FROM base AS runner
WORKDIR /app

# 非rootユーザー作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxt

# ビルド済みアプリケーションをコピー
COPY --from=builder --chown=nuxt:nodejs /app/.output /app/.output
COPY --from=deps --chown=nuxt:nodejs /app/node_modules /app/node_modules

USER nuxt
EXPOSE 3000

ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]
```

**Docker環境の技術仕様**:
- `Dockerfile`: 本番用マルチステージビルド（日本語コメント付き）
- `docker-compose.yml`: 開発・本番環境の管理（日本語コメント付き）
- `.dockerignore`: ビルド最適化用の除外設定
- **ベースイメージ**: `node:20-alpine` （軽量Linuxディストリビューション）
- **最終イメージサイズ**: 約200MB（最適化済み）
- **ビルドツール**: `python3`, `make`, `g++`（ネイティブバインディング用）
- **セキュリティ**: 非特権ユーザー実行、最小権限の原則

## 📚 学習リソース・参考資料

### **📖 公式ドキュメント**
- [Nuxt 3 Documentation](https://nuxt.com/docs) - 最新のNuxt.js公式ガイド
- [Vue 3 Documentation](https://vuejs.org/) - Vue.js 3の完全リファレンス
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) - Composition APIの詳細解説
- [TypeScript Support in Nuxt](https://nuxt.com/docs/guide/concepts/typescript) - TypeScript統合ガイド
- [Vite Documentation](https://vitejs.dev/) - 高速ビルドツールViteの公式ドキュメント

### **🔧 ツール・エコシステム**
- [Nuxt DevTools](https://devtools.nuxtjs.org/) - 開発者ツール詳細
- [Vue DevTools](https://devtools.vuejs.org/) - ブラウザ拡張デバッグツール
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSSフレームワーク
- [Vitest](https://vitest.dev/) - Vue向け高速テストフレームワーク
- [Playwright](https://playwright.dev/) - E2Eテストフレームワーク

### **📊 パフォーマンス・最適化**
- [Web Vitals](https://web.dev/vitals/) - ウェブパフォーマンス指標
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - パフォーマンス監査ツール
- [Bundle Analyzer](https://nuxt.com/docs/api/commands/analyze) - バンドルサイズ分析

### **🌐 デプロイメント・ホスティング**
- [Vercel](https://vercel.com/docs) - フロントエンド特化ホスティング
- [Netlify](https://docs.netlify.com/) - JAMstackホスティングサービス
- [Cloudflare Pages](https://pages.cloudflare.com/) - エッジコンピューティング対応

## 🎯 学習パス・習得目標

### **🔰 初級レベル（~20時間）**
**習得目標**:
- [x] Vue.js 基本構文の理解（テンプレート、ディレクティブ）
- [x] Composition API の基本（ref, reactive, computed）
- [x] コンポーネント間通信（props, events）
- [x] Nuxt.js ファイルベースルーティング
- [x] 基本的なフォーム処理

**学習フロー**:
1. **Vue.js 構文学習** (5時間): テンプレート構文、ディレクティブ、イベントハンドリング
2. **Composition API 実践** (8時間): ref/reactive、computed、watch の活用
3. **コンポーネント設計** (4時間): Props/Emits、単一ファイルコンポーネント
4. **Nuxt.js 基礎** (3時間): ファイルベースルーティング、自動インポート

### **🚀 中級レベル（~30時間）**
**習得目標**:
- [ ] 高度なリアクティブシステム活用
- [ ] Composables 設計パターン
- [ ] TypeScript 型安全性の活用
- [ ] パフォーマンス最適化技法
- [ ] テスト戦略とTDD実践

**学習フロー**:
1. **Composables 設計** (10時間): 再利用可能ロジック、依存関係管理
2. **TypeScript 活用** (8時間): 型定義、ジェネリクス、型推論
3. **パフォーマンス最適化** (7時間): 仮想スクロール、レイジーローディング、メモ化
4. **テスト実装** (5時間): Unit/Integration/E2E テストの実装

### **⚡ 上級レベル（~40時間）**
**習得目標**:
- [ ] マイクロフロントエンド アーキテクチャ
- [ ] サーバーサイドレンダリング最適化
- [ ] CI/CD パイプライン構築
- [ ] モニタリング・ロギング戦略
- [ ] セキュリティ ベストプラクティス

**学習フロー**:
1. **アーキテクチャ設計** (15時間): モジュラー設計、依存関係管理
2. **SSR/SSG 最適化** (10時間): パフォーマンスチューニング、SEO対策
3. **DevOps 実践** (10時間): CI/CD、Docker、監視システム
4. **セキュリティ対策** (5時間): XSS、CSRF、セキュアコーディング

## 🤝 このプロジェクトで学べる内容

### **🎨 Vue.js/Nuxt.js 特有の機能**
1. **リアクティブシステム**: Proxyベースの自動依存追跡システム
2. **テンプレート構文**: 宣言的UIレンダリングとディレクティブ活用
3. **Composition API**: 関数型アプローチによるロジック分離と再利用
4. **自動インポート**: 開発効率を向上させるZero-config システム
5. **ファイルベースルーティング**: 直感的なページ構造とURL管理

### **🔄 React/Next.js との実践的比較**
1. **状態管理アプローチ**: useState vs ref/reactive の使い分け
2. **副作用処理**: useEffect vs watch/watchEffect の活用法
3. **パフォーマンス最適化**: React.memo vs Vue の自動最適化
4. **コンポーネント設計**: JSX vs テンプレート構文の特徴
5. **開発体験**: 設定複雑性と生産性のトレードオフ

### **📊 実践的スキル習得**
1. **型安全性**: TypeScript統合によるバグ予防とIDEサポート
2. **テスト戦略**: Unit/Integration/E2E テストの実装パターン
3. **パフォーマンス**: Core Web Vitals最適化とUX向上手法
4. **デプロイメント**: 現代的なJAMstack デプロイメント戦略
5. **保守性**: 長期運用に耐える アーキテクチャ設計

### **💼 実務活用レベル**
各ファイルには**詳細な日本語コメント**と**React/Next.js比較**が併記されており、以下の実務スキルを段階的に習得できます:

- ✅ **チーム開発**: コードレビュー、設計パターン共有
- ✅ **要件定義**: フロントエンド技術選定の判断基準
- ✅ **アーキテクチャ**: スケーラブルなプロジェクト構造設計
- ✅ **パフォーマンス**: 測定ベースの最適化アプローチ
- ✅ **品質保証**: 自動化テストとCI/CD パイプライン

---

**📝 学習成果**: 既存の React/Next.js 知識を活かしながら、Vue.js/Nuxt.js の生産性の高さと開発体験の良さを体系的に理解し、実務レベルでの技術選択ができるようになります。
# first-nuxt-app
