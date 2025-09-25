<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">📝 Todoリスト</h2>
      <NuxtLink 
        to="/todos/create" 
        class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
      >
        ➕ 新規作成
      </NuxtLink>
    </div>

    <!-- フィルタリングとソート -->
    <TodoFilter
      v-model:searchQuery="searchQuery"
      v-model:currentFilter="currentFilter"
      v-model:selectedCategoryFilter="selectedCategoryFilter"
      v-model:selectedPriorityFilter="selectedPriorityFilter"
      v-model:sortOrder="sortOrder"
      :filtered-count="filteredTodos.length"
    />
    <div class="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 class="text-lg font-semibold text-blue-800 mb-4">📚 Vue.js データバインディング学習エリア</h3>

      <!-- v-model の基本的な使い方 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          ✨ v-model: 双方向データバインディング
        </label>
        <!--
          v-model の魔法！
          React/Next.js: value={text} onChange={e => setText(e.target.value)}
          Vue.js: v-model="text" だけでOK！
          入力値とJavaScript変数が自動的に同期される
        -->
        <input
          v-model="demoText"
          type="text"
          placeholder="ここに入力すると下に反映されます"
          class="w-full px-3 py-2 border border-blue-300 rounded-md"
        />
        <p class="mt-2 text-sm text-blue-600">
          入力値: <strong>"{{ demoText }}"</strong> (文字数: {{ demoText.length }})
        </p>
      </div>

      <!-- v-model.modifiers の使い方 -->
      <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            🔄 v-model.trim (前後の空白削除)
          </label>
          <input
            v-model.trim="trimmedText"
            type="text"
            placeholder="  空白を含めて入力  "
            class="w-full px-3 py-2 border border-green-300 rounded-md"
          />
          <p class="text-xs text-green-600 mt-1">値: "{{ trimmedText }}"</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            🔢 v-model.number (数値変換)
          </label>
          <input
            v-model.number="numberValue"
            type="text"
            placeholder="123"
            class="w-full px-3 py-2 border border-purple-300 rounded-md"
          />
          <p class="text-xs text-purple-600 mt-1">
            値: {{ numberValue }} (型: {{ typeof numberValue }})
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ⏱️ v-model.lazy (変更時のみ更新)
          </label>
          <input
            v-model.lazy="lazyText"
            type="text"
            placeholder="フォーカスを外すまで更新されない"
            class="w-full px-3 py-2 border border-orange-300 rounded-md"
          />
          <p class="text-xs text-orange-600 mt-1">値: "{{ lazyText }}"</p>
        </div>
      </div>

      <!-- 様々なフォーム要素でのv-model -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- セレクトボックス -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            📋 select要素
          </label>
          <select v-model="selectedPriority" class="w-full px-3 py-2 border rounded-md">
            <option value="">優先度選択</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <p class="text-xs text-gray-600 mt-1">選択: {{ selectedPriority || '未選択' }}</p>
        </div>

        <!-- ラジオボタン -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            🎯 radio要素
          </label>
          <div class="space-y-1">
            <label class="flex items-center">
              <input v-model="selectedCategory" type="radio" value="work" class="mr-2" />
              <span class="text-sm">仕事</span>
            </label>
            <label class="flex items-center">
              <input v-model="selectedCategory" type="radio" value="personal" class="mr-2" />
              <span class="text-sm">個人</span>
            </label>
          </div>
          <p class="text-xs text-gray-600 mt-1">選択: {{ selectedCategory || '未選択' }}</p>
        </div>

        <!-- チェックボックス（複数選択） -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            ☑️ checkbox要素（配列）
          </label>
          <div class="space-y-1">
            <label class="flex items-center">
              <input v-model="selectedTags" type="checkbox" value="urgent" class="mr-2" />
              <span class="text-sm">急ぎ</span>
            </label>
            <label class="flex items-center">
              <input v-model="selectedTags" type="checkbox" value="important" class="mr-2" />
              <span class="text-sm">重要</span>
            </label>
          </div>
          <p class="text-xs text-gray-600 mt-1">選択: {{ selectedTags.join(', ') || '未選択' }}</p>
        </div>

        <!-- テキストエリア -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            📝 textarea要素
          </label>
          <textarea
            v-model="todoDescription"
            rows="3"
            placeholder="詳細説明"
            class="w-full px-3 py-2 border rounded-md resize-none"
          ></textarea>
          <p class="text-xs text-gray-600 mt-1">文字数: {{ todoDescription.length }}</p>
        </div>
      </div>
    </div>

    <!-- ===== Todo追加フォーム（高機能版） ===== -->
    <div class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">➕ 新しいTodoを追加</h3>
      <!--
        @submit.prevent: Vue.jsのイベント修飾子
        @ = v-on: の省略記法
        .prevent = preventDefault()を自動実行
        React/Next.js: onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        Vue.js: @submit.prevent="handleSubmit" だけでOK！
      -->
      <form @submit.prevent="handleAddTodo" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- メインのTodoテキスト -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              📝 Todoタイトル *
            </label>
            <!--
              v-model: 最も重要なVue.js機能！
              JavaScript変数とHTML入力要素を双方向で結び付ける
              newTodo変数の値が変わると画面が更新される
              ユーザーが入力すると変数も自動更新される
            -->
            <input
              v-model.trim="newTodo"
              type="text"
              placeholder="例: 書類を整理する"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxlength="100"
            />
            <p class="text-xs text-gray-500 mt-1">{{ newTodo.length }}/100文字</p>
          </div>

          <!-- 優先度選択 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              🎯 優先度
            </label>
            <select v-model="newTodoPriority" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- カテゴリ選択 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              📂 カテゴリ
            </label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input v-model="newTodoCategory" type="radio" value="work" class="mr-2" />
                <span class="text-sm">🏢 仕事</span>
              </label>
              <label class="flex items-center">
                <input v-model="newTodoCategory" type="radio" value="personal" class="mr-2" />
                <span class="text-sm">👤 個人</span>
              </label>
              <label class="flex items-center">
                <input v-model="newTodoCategory" type="radio" value="other" class="mr-2" />
                <span class="text-sm">📌 その他</span>
              </label>
            </div>
          </div>

          <!-- 期限設定 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              📅 期限（オプション）
            </label>
            <input
              v-model="newTodoDueDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <!-- タグ選択 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            🏷️ タグ（複数選択可）
          </label>
          <div class="flex flex-wrap gap-3">
            <label class="flex items-center">
              <input v-model="newTodoTags" type="checkbox" value="urgent" class="mr-2" />
              <span class="text-sm">🚨 急ぎ</span>
            </label>
            <label class="flex items-center">
              <input v-model="newTodoTags" type="checkbox" value="important" class="mr-2" />
              <span class="text-sm">⭐ 重要</span>
            </label>
            <label class="flex items-center">
              <input v-model="newTodoTags" type="checkbox" value="easy" class="mr-2" />
              <span class="text-sm">😊 簡単</span>
            </label>
            <label class="flex items-center">
              <input v-model="newTodoTags" type="checkbox" value="research" class="mr-2" />
              <span class="text-sm">🔍 調査</span>
            </label>
          </div>
        </div>

        <!-- 詳細説明 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            📋 詳細説明（オプション）
          </label>
          <textarea
            v-model="newTodoDescription"
            rows="3"
            placeholder="詳細な説明や手順を入力..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
            maxlength="500"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">{{ newTodoDescription.length }}/500文字</p>
        </div>

        <!-- 送信ボタン -->
        <div class="flex justify-between items-center">
          <button
            type="button"
            @click="clearForm"
            class="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            🗑️ フォームをクリア
          </button>
          <!--
            :disabled: Vue.jsの動的属性バインディング
            : = v-bind: の省略記法
            条件によってbooleanの値を設定
            React/Next.js: disabled={!newTodo.trim()}
            Vue.js: :disabled="!newTodo.trim()"
          -->
          <button
            type="submit"
            :disabled="!newTodo.trim()"
            :class="[
              'px-6 py-2 rounded-md transition-colors font-medium',
              newTodo.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            ➕ Todoを追加
          </button>
        </div>

        <!-- リアルタイムプレビュー -->
        <div v-if="newTodo.trim()" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 class="text-sm font-semibold text-yellow-800 mb-2">👀 プレビュー</h4>
          <div class="text-sm text-yellow-700">
            <p><strong>タイトル:</strong> {{ newTodo }}</p>
            <p><strong>優先度:</strong> {{ getPriorityLabel(newTodoPriority) }}</p>
            <p><strong>カテゴリ:</strong> {{ getCategoryLabel(newTodoCategory) }}</p>
            <p v-if="newTodoDueDate"><strong>期限:</strong> {{ formatDate(new Date(newTodoDueDate)) }}</p>
            <p v-if="newTodoTags.length > 0"><strong>タグ:</strong> {{ newTodoTags.join(', ') }}</p>
            <p v-if="newTodoDescription"><strong>説明:</strong> {{ newTodoDescription.substring(0, 100) }}{{ newTodoDescription.length > 100 ? '...' : '' }}</p>
          </div>
        </div>
      </form>
    </div>

    <!-- ===== 検索とフィルター機能 ===== -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- 検索機能 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            🔍 Todo検索
          </label>
          <!--
            @input: Vue.jsのinputイベントハンドリング
            入力のたびに即座に検索が実行される
            React/Next.js: onChange={e => setSearchQuery(e.target.value)}
            Vue.js: v-model="searchQuery" だけで自動的に検索が動く
          -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Todoを検索..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p v-if="searchQuery" class="text-xs text-gray-500 mt-1">
            "{{ searchQuery }}" で検索中... ({{ filteredTodos.length }}件見つかりました)
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
            <!--
              v-for: Vue.jsのループ処理
              React/Next.jsの array.map() に相当
              配列の各要素に対してHTMLを生成

              :class: Vue.jsの動的クラスバインディング
              配列記法で複数のクラスを条件によって適用
              React/Next.js: className={`base-class ${condition ? 'active' : 'inactive'}`}
              Vue.js: :class="['base-class', condition ? 'active' : 'inactive']"
              
            -->
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
              <!--
                {{ }}: Vue.jsのテキスト補間
                JavaScript式の結果をHTMLに表示
                React/Next.js: {expression}
                Vue.js: {{expression}}
              -->
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

    <!-- ===== Todoリスト表示部分 ===== -->
    <!--
      v-if vs v-show の違い:
      v-if: 条件がfalseの場合、DOMから完全に削除される（React の条件 && JSX）
      v-show: 条件がfalseでもDOMに残り、CSS display:none で非表示（React の style={{display}}）
      頻繁に切り替わる場合は v-show、そうでない場合は v-if が良い
    -->
    <div v-if="filteredTodos.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">{{ getEmptyStateIcon(currentFilter, !!searchQuery.trim()) }}</div>
      <h3 class="text-lg font-medium text-gray-800 mb-2">{{ getEmptyMessage(currentFilter, !!searchQuery.trim()) }}</h3>
      <p class="text-gray-500">{{ getEmptySubMessage(currentFilter, !!searchQuery.trim()) }}</p>
    </div>

    <div v-else class="space-y-3">
      <!-- リスト統計情報 -->
      <div class="flex justify-between items-center text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-md">
        <span>
          📊 表示中: {{ filteredTodos.length }}件 / 全{{ todos.length }}件
          (完了: {{ completedCount }}件)
        </span>
        <span v-if="searchQuery">
          🔍 "{{ searchQuery }}" の検索結果
        </span>
      </div>

      <!-- Todoアイテム表示 -->
      <!--
        トランジション機能: Vue.js独特の機能
        要素の追加・削除・変更時にアニメーションを自動適用
        React/Next.jsではライブラリが必要だが、Vue.jsは標準機能
      -->
      <TransitionGroup name="todo-list" tag="div" class="space-y-3">
        <!-- 動的クラスバインディングの応用:
            複数の条件を組み合わせて複雑なスタイリング -->
        <div
          v-for="(todo, index) in filteredTodos"
          :key="todo.id"
          :class="[
            'group relative flex items-start gap-4 p-4 border-2 rounded-lg transition-all duration-200',
            'hover:shadow-md hover:border-blue-200',
            todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300',
            getPriorityClass(todo.priority)
          ]"
          @click="toggleTodoExpand(todo.id)"
        >
          <!-- 優先度インジケーター -->
          <div :class="['w-1 h-full absolute left-0 top-0 rounded-l-lg', getPriorityBorderClass(todo.priority)]"></div>

          <!-- チェックボックス -->
          <div class="flex items-center mt-1">
            <!--
              @click.stop: イベント修飾子の応用
              .stop = stopPropagation() を自動実行
              親要素のクリックイベントを阻止
            -->
            <input
              v-model="todo.completed"
              type="checkbox"
              @click.stop
              class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>

          <!-- メインコンテンツ -->
          <div class="flex-1 min-w-0">
            <!-- タイトルとメタ情報 -->
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4
                  :class="[
                    'text-lg font-medium transition-colors',
                    todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                  ]"
                >
                  {{ todo.text }}
                </h4>

                <!-- メタ情報 -->
                <div class="flex flex-wrap items-center gap-3 mt-2 text-sm">
                  <!-- カテゴリ -->
                  <span :class="['px-2 py-1 rounded-full text-xs font-medium', getCategoryBadgeClass(todo.category)]">
                    {{ getCategoryIcon(todo.category) }} {{ getCategoryLabel(todo.category) }}
                  </span>

                  <!-- 優先度 -->
                  <span :class="['px-2 py-1 rounded-full text-xs font-medium', getPriorityBadgeClass(todo.priority)]">
                    {{ getPriorityIcon(todo.priority) }} {{ getPriorityLabel(todo.priority) }}
                  </span>

                  <!-- タグ -->
                  <div v-if="todo.tags.length > 0" class="flex gap-1">
                    <span
                      v-for="tag in todo.tags"
                      :key="tag"
                      class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
                    >
                      #{{ tag }}
                    </span>
                  </div>

                  <!-- 作成日時 -->
                  <span class="text-gray-400">
                    📅 {{ formatDate(todo.createdAt) }}
                  </span>

                  <!-- 期限 -->
                  <span v-if="todo.dueDate" :class="[
                    'font-medium',
                    isOverdue(todo.dueDate) ? 'text-red-600' : 'text-orange-600'
                  ]">
                    ⏰ {{ formatDate(new Date(todo.dueDate)) }}
                    <span v-if="isOverdue(todo.dueDate)"> (期限切れ)</span>
                  </span>
                </div>
              </div>

              <!-- 操作ボタン -->
              <div class="flex items-center gap-2 ml-4">
                <!-- 展開/縮小ボタン -->
                <button
                  @click.stop="toggleTodoExpand(todo.id)"
                  class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all"
                >
                  {{ expandedTodos.includes(todo.id) ? '🔼' : '🔽' }}
                </button>

                <!-- 編集ボタン -->
                <button
                  @click.stop="startEdit(todo)"
                  class="opacity-0 group-hover:opacity-100 p-1 text-blue-400 hover:text-blue-600 transition-all"
                  title="編集"
                >
                  ✏️
                </button>

                <!-- 削除ボタン -->
                <button
                  @click.stop="removeTodo(todo.id)"
                  class="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all"
                  title="削除"
                >
                  🗑️
                </button>
              </div>
            </div>

            <!-- 展開コンテンツ -->
            <!--
              v-show: 表示/非表示の切り替え
              v-ifと違ってDOMは残り、CSSのdisplayプロパティで制御
              頻繁に切り替える場合はパフォーマンスが良い
            -->
            <div v-show="expandedTodos.includes(todo.id)" class="mt-4 pt-4 border-t border-gray-200">
              <div v-if="todo.description" class="mb-3">
                <h5 class="text-sm font-medium text-gray-700 mb-1">📋 詳細説明</h5>
                <p class="text-sm text-gray-600 whitespace-pre-wrap">{{ todo.description }}</p>
              </div>

              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>ID: {{ todo.id }}</span>
                <span>インデックス: {{ index + 1 }} / {{ filteredTodos.length }}</span>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- ===== 統計とアクション ===== -->
    <div v-if="todos.length > 0" class="mt-8 pt-6 border-t-2 border-gray-200">
      <!-- 詳細統計 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="text-center p-3 bg-blue-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">{{ todos.length }}</div>
          <div class="text-sm text-blue-800">総数</div>
        </div>
        <div class="text-center p-3 bg-green-50 rounded-lg">
          <div class="text-2xl font-bold text-green-600">{{ completedCount }}</div>
          <div class="text-sm text-green-800">完了</div>
        </div>
        <div class="text-center p-3 bg-yellow-50 rounded-lg">
          <div class="text-2xl font-bold text-yellow-600">{{ todos.length - completedCount }}</div>
          <div class="text-sm text-yellow-800">未完了</div>
        </div>
        <div class="text-center p-3 bg-purple-50 rounded-lg">
          <div class="text-2xl font-bold text-purple-600">{{ Math.round((completedCount / todos.length) * 100) }}%</div>
          <div class="text-sm text-purple-800">進捗</div>
        </div>
      </div>

      <!-- プログレスバー -->
      <div class="mb-6">
        <div class="flex justify-between text-sm text-gray-600 mb-2">
          <span>進捗状況</span>
          <span>{{ completedCount }} / {{ todos.length }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <!--
            スタイルバインディング: :style
            React/Next.js: style={{width: `${progress}%`}}
            Vue.js: :style="{width: progress + '%'}"
          -->
          <div
            class="h-3 rounded-full transition-all duration-500"
            :class="completedCount === todos.length ? 'bg-green-500' : 'bg-blue-500'"
            :style="{width: (completedCount / todos.length * 100) + '%'}"
          ></div>
        </div>
      </div>

      <!-- 一括操作ボタン -->
      <div class="flex flex-wrap gap-3 justify-center">
        <button
          v-if="completedCount > 0"
          @click="clearCompleted"
          class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          🗑️ 完了済みを削除 ({{ completedCount }}件)
        </button>

        <button
          v-if="todos.length - completedCount > 0"
          @click="completeAll"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          ✅ すべて完了にする
        </button>

        <button
          v-if="completedCount > 0"
          @click="uncompleteAll"
          class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
        >
          🔄 すべて未完了にする
        </button>

        <button
          @click="exportTodos"
          class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
        >
          📤 エクスポート
        </button>
      </div>
    </div>

    <!-- ===== 編集モーダル ===== -->
    <!--
      モーダルの実装: Vue.jsでは簡潔に書ける
      React/Next.jsではポータルやライブラリが必要な場合が多い
    -->
    <div v-if="editingTodo" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="cancelEdit">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-lg font-semibold mb-4">📝 Todoを編集</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
            <input
              v-model="editForm.text"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              ref="editInput"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">優先度</label>
            <select v-model="editForm.priority" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input v-model="editForm.category" type="radio" value="work" class="mr-2" />
                <span class="text-sm">仕事</span>
              </label>
              <label class="flex items-center">
                <input v-model="editForm.category" type="radio" value="personal" class="mr-2" />
                <span class="text-sm">個人</span>
              </label>
              <label class="flex items-center">
                <input v-model="editForm.category" type="radio" value="other" class="mr-2" />
                <span class="text-sm">その他</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="cancelEdit"
            class="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            キャンセル
          </button>
          <button
            @click="saveEdit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref, nextTick } from 'vue'
import { useTodos } from '../composables/useTodos'
import { useUiHelpers } from '../composables/useUiHelpers'
import type { TodoFormData } from '../types/todo'

// Todoロジック
const {
  todos,
  currentFilter,
  selectedCategoryFilter,
  selectedPriorityFilter, 
  searchQuery,
  sortOrder,
  expandedTodos,
  
  filteredTodos,
  completedCount,
  activeCount,
  progressPercentage,
  
  loadTodos,
  addTodo,
  removeTodo,
  toggleTodoCompletion,
  toggleTodoExpand,
  clearCompleted,
  completeAll,
  uncompleteAll,
  exportTodos
} = useTodos()

// UIヘルパー
const { 
  getEmptyMessage, 
  getEmptySubMessage, 
  getEmptyStateIcon 
} = useUiHelpers()

// コンポーネントの名前を定義
const __name = 'TodoApp'

// TypeScript型定義（Next.jsと同じように型安全性を確保）
interface Todo {
  id: number              // 一意識別子
  text: string           // Todoの内容
  completed: boolean     // 完了状態
  createdAt: Date       // 作成日時
  priority: 'low' | 'medium' | 'high'  // 優先度
  category: 'work' | 'personal' | 'other'  // カテゴリ
  tags: string[]        // タグ（配列）
  description: string   // 詳細説明
  dueDate?: string     // 期限（オプション）
}

// フィルターの種類を型で制限
type FilterType = 'all' | 'active' | 'completed'
type PriorityType = 'low' | 'medium' | 'high'
type CategoryType = 'work' | 'personal' | 'other'
type SortType = 'newest' | 'oldest' | 'priority' | 'alphabetical'

/*
  リアクティブデータの定義
  ref(): Vue 3のリアクティブ変数作成関数
  React/Next.jsのuseState()に相当
  .valueでアクセスする必要がある（テンプレート内では自動的に.valueが付く）
*/

// ===== データバインディング学習用の変数 =====
const demoText = ref('') // 基本的なv-modelの例
const trimmedText = ref('') // v-model.trimの例
const numberValue = ref(0) // v-model.numberの例
const lazyText = ref('') // v-model.lazyの例
const selectedPriority = ref<string>('') // selectでのv-modelの例
const selectedCategory = ref<string>('') // radioでのv-modelの例
const selectedTags = ref<string[]>([]) // checkboxでのv-modelの例（配列）
const todoDescription = ref('') // textareaでのv-modelの例

// ===== メインのTodo機能用の変数 =====
// 新しいTodo入力用の変数（React/Next.jsのuseState('')相当）
const newTodo = ref('')
const newTodoPriority = ref<PriorityType>('medium')
const newTodoCategory = ref<CategoryType>('personal')
const newTodoTags = ref<string[]>([])
const newTodoDescription = ref('')
const newTodoDueDate = ref('')
const editingTodo = ref<Todo | null>(null) // 編集中のTodo
const editForm = ref({
  text: '',
  priority: 'medium' as PriorityType,
  category: 'personal' as CategoryType
})

// ===== 静的な設定データ =====
// フィルターオプション（静的なデータなのでrefは不要）
const filterOptions = [
  { value: 'all' as FilterType, label: 'すべて', icon: '📋' },
  { value: 'active' as FilterType, label: '未完了', icon: '⏳' },
  { value: 'completed' as FilterType, label: '完了済み', icon: '✅' }
]

// カテゴリオプション
const categoryOptions = [
  { value: 'work' as CategoryType, label: '仕事', icon: '🏢' },
  { value: 'personal' as CategoryType, label: '個人', icon: '👤' },
  { value: 'other' as CategoryType, label: 'その他', icon: '📌' }
]

// 優先度オプション
const priorityOptions = [
  { value: 'high' as PriorityType, label: '高', icon: '🔴' },
  { value: 'medium' as PriorityType, label: '中', icon: '🟡' },
  { value: 'low' as PriorityType, label: '低', icon: '🟢' }
]



/*
  メソッド定義
  Vue.jsでは普通の関数として定義
  React/Next.jsのuseCallback()を使わなくても最適化される
*/

// 新しいTodoを追加する関数
const handleAddTodo = (event?: SubmitEvent) => {
  if (event) event.preventDefault();
  if (newTodo.value.trim()) {
    // formDataオブジェクトを作成
    const formData: TodoFormData = {
      text: newTodo.value.trim(),
      priority: newTodoPriority.value,
      category: newTodoCategory.value,
      tags: [...newTodoTags.value],
      description: newTodoDescription.value.trim(),
      dueDate: newTodoDueDate.value || undefined
    };
    
    // useTodosのaddTodo関数を使用
    addTodo(formData);
    
    // フォームをリセット
    clearForm()
  }
}

// フォームをクリアする関数
const clearForm = () => {
  newTodo.value = ''
  newTodoPriority.value = 'medium'
  newTodoCategory.value = 'personal'
  newTodoTags.value = []
  newTodoDescription.value = ''
  newTodoDueDate.value = ''
}

// Todo編集を開始する関数
const startEdit = (todo: Todo) => {
  editingTodo.value = todo
  editForm.value = {
    text: todo.text,
    priority: todo.priority,
    category: todo.category
  }

  // 次のティックでフォーカス（DOM更新後）
  nextTick(() => {
    const input = document.querySelector('input[ref="editInput"]') as HTMLInputElement
    if (input) input.focus()
  })
}

// Todo編集をキャンセルする関数
const cancelEdit = () => {
  editingTodo.value = null
  editForm.value = {
    text: '',
    priority: 'medium',
    category: 'personal'
  }
}

// Todo編集を保存する関数
const saveEdit = () => {
  if (editingTodo.value && editForm.value.text.trim()) {
    editingTodo.value.text = editForm.value.text.trim()
    editingTodo.value.priority = editForm.value.priority
    editingTodo.value.category = editForm.value.category
    cancelEdit()
  }
}

// ===== ヘルパー関数（ユーティリティ関数） =====

// 空状態メッセージはuseUiHelpersのメソッドを使用
// composableからインポートした関数を使用するので、
// ローカルでの定義は削除

// 日付をフォーマットして表示する関数
const formatDate = (date: Date) => {
  // SSRとクライアントサイドで一貫したフォーマットを使用する
  if (typeof window === 'undefined') {
    // サーバーサイドでの単純なフォーマット
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${month}月${day}日 ${hour}:${minute}`;
  } else {
    // クライアントサイドでのフォーマット
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// 期限切れかどうかチェックする関数
const isOverdue = (dueDate: string) => {
  // 日付比較をシンプルに実行 - サーバーとクライアントで一貫した結果になるように
  const dueTime = new Date(dueDate).getTime();
  const nowTime = Date.now();
  return dueTime < nowTime;
}

// ===== スタイリング用のヘルパー関数 =====

// 優先度に応じたクラス名を返す関数
const getPriorityClass = (priority: PriorityType) => {
  switch (priority) {
    case 'high': return 'ring-2 ring-red-200'
    case 'medium': return 'ring-1 ring-yellow-200'
    default: return ''
  }
}

// 優先度に応じたボーダークラス名を返す関数
const getPriorityBorderClass = (priority: PriorityType) => {
  switch (priority) {
    case 'high': return 'bg-red-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
  }
}

// 優先度に応じたバッジクラス名を返す関数
const getPriorityBadgeClass = (priority: PriorityType) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
  }
}

// 優先度ラベルを返す関数
const getPriorityLabel = (priority: PriorityType) => {
  switch (priority) {
    case 'high': return '高'
    case 'medium': return '中'
    case 'low': return '低'
  }
}

// 優先度アイコンを返す関数
const getPriorityIcon = (priority: PriorityType) => {
  switch (priority) {
    case 'high': return '🔴'
    case 'medium': return '🟡'
    case 'low': return '🟢'
  }
}

// カテゴリに応じたバッジクラス名を返す関数
const getCategoryBadgeClass = (category: CategoryType) => {
  switch (category) {
    case 'work': return 'bg-blue-100 text-blue-800'
    case 'personal': return 'bg-purple-100 text-purple-800'
    case 'other': return 'bg-gray-100 text-gray-800'
  }
}

// カテゴリラベルを返す関数
const getCategoryLabel = (category: CategoryType) => {
  switch (category) {
    case 'work': return '仕事'
    case 'personal': return '個人'
    case 'other': return 'その他'
  }
}

// カテゴリアイコンを返す関数
const getCategoryIcon = (category: CategoryType) => {
  switch (category) {
    case 'work': return '🏢'
    case 'personal': return '👤'
    case 'other': return '📌'
  }
}

/*
  ライフサイクルフック
  onMounted(): Vue.jsのライフサイクル関数
  React/Next.jsのuseEffect(() => {}, [])に相当
  コンポーネントがマウント（DOM作成）された時に実行
*/
onMounted(() => {
  // process.client: Nuxt.js特有の変数
  // クライアントサイドでのみ実行（SSR時はスキップ）
  // React/Next.jsでは typeof window !== 'undefined' で判定
  if (typeof window !== 'undefined') {
    // ローカルストレージからTodoデータを読み込み
    const saved = localStorage.getItem('nuxt-todos')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // 日付オブジェクトを復元
        todos.value = parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          // 新しいプロパティのデフォルト値を設定
          priority: todo.priority || 'medium',
          category: todo.category || 'personal',
          tags: todo.tags || [],
          description: todo.description || ''
        }))
      } catch (error) {
        console.error('Todoデータの読み込みに失敗:', error)
      }
    }
  }
})

/*
  watch(): Vue.jsの監視機能
  React/Next.jsのuseEffect(() => {}, [依存配列])に相当
  指定した値が変更された時に実行される
*/
// クライアント側の場合のみtodosを監視
watch(todos, (newTodos) => {
  localStorage.setItem('nuxt-todos', JSON.stringify(newTodos))
}, {
  deep: true  // オブジェクトの深い監視を有効化
              // React/Next.jsでは依存配列に具体的な値を指定する必要がある
})


// 開発者用のデバッグ情報（本番では削除推奨）
onMounted(() => {
  // クライアントサイドでのみ実行
  if (typeof window !== 'undefined') {
    console.log('🎉 Vue.js Todo App が初期化されました')
    console.log('📊 利用可能な機能:')
    console.log('  - v-model による双方向データバインディング')
    console.log('  - computed による計算プロパティ')
    console.log('  - watch によるリアクティブな監視')
    console.log('  - ライフサイクルフック (onMounted)')
    console.log('  - 条件分岐 (v-if, v-show)')
    console.log('  - ループ処理 (v-for)')
    console.log('  - イベントハンドリング (@click, @submit)')
    console.log('  - 動的スタイリング (:class, :style)')
    console.log('  - Transition アニメーション')
  }
})
</script>

<style scoped>
/*
  scoped: Vue.js特有のCSS記法
  このコンポーネント内のみに適用されるCSS
  React/Next.jsのCSS Modulesやstyled-componentsに相当
  自動的にユニークなクラス名が生成される
*/

/* アニメーション用のCSS */
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter-from,
.todo-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.todo-list-move {
  transition: transform 0.3s ease;
}

/* カスタムスクロールバー */
:deep(.overflow-y-auto)::-webkit-scrollbar {
  width: 6px;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

:deep(.overflow-y-auto)::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>