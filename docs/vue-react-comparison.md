# Vue.js と React の比較

## 🔄 基本的な概念比較

| カテゴリ | Vue.js | React | 主な違い |
|---------|--------|-------|---------|
| **テンプレート** | HTML拡張（`<template>`） | JSX | Vue: HTML優先 vs React: JavaScript優先 |
| **リアクティブ性** | Proxy ベース自動検知 | 明示的な状態更新 | Vue: 自動検知 vs React: 手動更新呼び出し |
| **コンポーネント定義** | Single File Components | 関数/クラス | Vue: すべてがひとつのファイル vs React: 分離可能 |
| **スタイル定義** | `<style scoped>` | CSS-in-JS/Modules | Vue: 統合済み vs React: サードパーティに依存 |
| **ライフサイクル** | Compositionフック | useEffectフック | Vue: 目的別フック vs React: 依存配列で分岐 |

## 📊 状態管理の比較

### 基本的な状態管理

```javascript
// Vue.js - Composition API
const count = ref(0)
const increment = () => count.value++

// React - Hooks
const [count, setCount] = useState(0)
const increment = () => setCount(count + 1)
```

### 計算状態（Computed Properties）

```javascript
// Vue.js - 自動依存検出
const doubled = computed(() => count.value * 2)

// React - 手動依存配列
const doubled = useMemo(() => count * 2, [count])
```

### 副作用管理

```javascript
// Vue.js - 自動依存検出
watchEffect(() => {
  document.title = `Count: ${count.value}`
})

// React - 手動依存配列
useEffect(() => {
  document.title = `Count: ${count}`
}, [count])
```

## 🔄 データフローの違い

### Props の受け渡し

```javascript
// Vue.js - props定義
const props = defineProps<{
  item: Todo
  isActive: boolean
}>()

// React - props受け取り
function TodoItem({ item, isActive }) {
  // ...
}
```

### イベント処理

```javascript
// Vue.js - イベント発信
const emit = defineEmits(['update', 'delete'])
const handleClick = () => emit('update', newValue)

// React - コールバック関数
function TodoItem({ onUpdate, onDelete }) {
  const handleClick = () => onUpdate(newValue)
}
```

### 双方向バインディング

```vue
<!-- Vue.js - v-model -->
<input v-model="searchText" />

<!-- React - 手動実装 -->
<input value={searchText} onChange={(e) => setSearchText(e.target.value)} />
```

## 📱 条件付きレンダリングとリスト

```vue
<!-- Vue.js - v-if, v-for -->
<div v-if="isVisible">
  <div v-for="item in items" :key="item.id">{{ item.name }}</div>
</div>

<!-- React - 条件演算子, map() -->
{isVisible && (
  items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))
)}
```

## 🎯 パフォーマンス最適化

| 機能 | Vue.js | React |
|------|--------|-------|
| **再レンダリング制御** | 自動依存追跡 | `React.memo`, `useMemo` |
| **コード分割** | `defineAsyncComponent` | `React.lazy` + `Suspense` |
| **メモ化** | `computed` | `useMemo`, `useCallback` |
| **仮想DOM** | 高効率パッチング | Fiber アーキテクチャ |

## 📈 学習曲線と生産性

### Vue.js の長所
- 学習コストが低い
- HTML/CSS/JSの自然な拡張
- 設定が少なくてすぐに始められる
- 自動依存追跡で冗長なコードが少ない

### React の長所
- 豊富なエコシステムと多くのライブラリ
- JavaScriptの柔軟な活用
- 大規模プロジェクトでの実績
- 求人市場での需要が高い