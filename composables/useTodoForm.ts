import { ref, computed } from 'vue'
import type { TodoFormData } from '../types/todo'

/*
  Vue.js Composables（コンポーザブル）の説明:
  React/Next.jsのカスタムフック（useXXX）に相当する機能

  React/Next.js:
  const useForm = (initialData) => {
    const [form, setForm] = useState(initialData);
    const isValid = useMemo(() => form.text.trim().length > 0, [form.text]);
    return { form, setForm, isValid };
  };

  Vue.js:
  export const useForm = (initialData) => {
    const form = ref(initialData);
    const isValid = computed(() => form.value.text.trim().length > 0);
    return { form, isValid };
  };

  違いのポイント:
  - Vue.jsでは ref() でリアクティブな値を作成
  - computed() で計算プロパティを作成（React の useMemo に相当）
  - .value でアクセス（テンプレート内では自動的に.valueが付く）
*/

/**
 * フォーム関連のロジックを扱うComposable（Vue.jsの再利用可能なロジック）
 * 新規作成と編集で共通利用できるようにします
 *
 * React/Next.jsでは以下のような実装になります:
 * const useFormHook = (initialData) => {
 *   const [formData, setFormData] = useState(initialData);
 *   const [isValid, setIsValid] = useState(false);
 *
 *   useEffect(() => {
 *     setIsValid(formData.text.trim().length > 0);
 *   }, [formData.text]);
 *
 *   const resetForm = useCallback(() => {
 *     setFormData(defaultValues);
 *   }, []);
 *
 *   return { formData, setFormData, isValid, resetForm };
 * };
 */
export const useTodoForm = (initialData?: Partial<TodoFormData>) => {
  /*
    ref(): Vue 3の基本的なリアクティブ変数作成関数
    React/Next.jsの useState() に相当

    React/Next.js: const [form, setForm] = useState(defaultValues)
    Vue.js: const form = ref(defaultValues)

    アクセス方法:
    React/Next.js: form.text, setForm({...form, text: 'new'})
    Vue.js: form.value.text, form.value.text = 'new'
  */
  const form = ref<TodoFormData>({
    text: initialData?.text || '',
    priority: initialData?.priority || 'medium',
    category: initialData?.category || 'personal',
    tags: initialData?.tags || [],
    description: initialData?.description || '',
    dueDate: initialData?.dueDate || ''
  })

  /*
    computed(): Vue.jsの計算プロパティ
    React/Next.jsの useMemo() に相当
    依存する値が変更された時のみ再計算される（自動的な依存関係追跡）

    React/Next.js:
    const isValid = useMemo(() => {
      return form.text.trim().length > 0;
    }, [form.text]);

    Vue.js:
    const isValid = computed(() => {
      return form.value.text.trim().length > 0;
    });
  */
  const isValid = computed(() => {
    return form.value.text.trim().length > 0
  })

  /*
    関数定義
    React/Next.jsでは useCallback() でメモ化することが多い
    Vue.jsでは通常の関数定義で十分（自動的に最適化される）

    React/Next.js:
    const resetForm = useCallback(() => {
      setForm(defaultValues);
    }, []);

    Vue.js:
    const resetForm = () => {
      form.value = defaultValues;
    };
  */
  const resetForm = () => {
    form.value = {
      text: '',
      priority: 'medium',
      category: 'personal',
      tags: [],
      description: '',
      dueDate: ''
    }
  }

  /*
    戻り値: Vue.jsのComposableでは必要な値や関数をオブジェクトで返す
    React/Next.jsのカスタムフックと同じパターン
  */
  return {
    form,
    isValid,
    resetForm
  }
}