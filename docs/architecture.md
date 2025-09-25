# プロジェクト構造とアーキテクチャ

## 📁 ディレクトリ構造

```
first-nuxt/
├── 📁 app.vue              # アプリケーションルート（React _app.tsx相当）
│                          # グローバルレイアウト・メタタグ・SEO設定
├── 📁 pages/               # ファイルベースルーティング
│   ├── index.vue           # / - ホームページ
│   └── todos/              # Todo機能ルート群
│       ├── index.vue       # /todos - Todo一覧ページ
│       ├── create.vue      # /todos/create - 新規Todo作成
│       └── [id]/           # 動的ルーティング
│           ├── index.vue   # /todos/:id - Todo詳細表示
│           └── edit.vue    # /todos/:id/edit - Todo編集画面
├── 📁 components/          # 再利用可能UIコンポーネント
│   ├── ui/                 # 汎用UIパーツ
│   │   └── Button.vue      # 汎用ボタン
│   ├── todo/               # Todo機能専用コンポーネント群
│   │   ├── TodoItem.vue    # 個別Todo表示
│   │   ├── TodoForm.vue    # Todo作成/編集フォーム
│   │   ├── TodoFilter.vue  # フィルタリング・ソート機能
│   │   └── TodoStats.vue   # 統計・進捗表示
│   ├── TodoApp.vue         # メインTodoアプリケーション
│   └── TodoAppNew.vue      # 新版（学習用比較対象）
├── 📁 composables/         # ビジネスロジック層
│   ├── useTodos.ts         # Todoメインロジック（CRUD操作）
│   ├── useTodoForm.ts      # フォーム状態管理・バリデーション
│   └── useUiHelpers.ts     # UI状態ヘルパー
├── 📁 types/               # TypeScript型システム
│   └── todo.ts             # Todo関連型定義・定数
├── 📁 layouts/             # ページレイアウトテンプレート
│   └── default.vue         # デフォルトレイアウト
└── 📁 public/              # 静的公開ファイル
    ├── favicon.ico         # ファビコン
    └── robots.txt          # 検索エンジン設定
```

## 🏗 アーキテクチャ設計

### 分離の原則（Separation of Concerns）

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

### ルーティングシステム

```
# 基本ルーティング
pages/index.vue                    → GET  /
pages/todos/index.vue              → GET  /todos
pages/todos/create.vue             → GET  /todos/create

# 動的ルーティング
pages/todos/[id]/index.vue         → GET  /todos/:id
pages/todos/[id]/edit.vue          → GET  /todos/:id/edit

# キャッチオールルーティング
pages/[...slug].vue                → GET  /*（404ページ等）
```

### コンポーネント設計

- **Presentation Components**: UI表示に特化したコンポーネント
- **Container Components**: ビジネスロジックとデータ管理を担当
- **Composables**: 再利用可能なロジックを分離し、複数コンポーネントで共有

### データフロー

1. **ユーザー操作** → コンポーネント内のイベントハンドラ
2. **イベントハンドラ** → Composableのメソッド呼び出し
3. **Composable** → データ更新とリアクティブな反映
4. **リアクティブデータ** → 自動的にUIに反映

### 状態管理アプローチ

- **Local State**: `ref()`, `reactive()` でコンポーネント内の状態管理
- **Shared State**: Composablesで複数コンポーネント間の状態共有
- **Persistence**: LocalStorageを使用したデータ永続化