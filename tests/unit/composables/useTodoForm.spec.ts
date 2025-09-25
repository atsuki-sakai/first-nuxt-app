import { describe, expect, it } from 'vitest'
import { useTodoForm } from '~/composables/useTodoForm'

// フォーム用Composableのデフォルト状態を共通で参照できるよう定義
const defaultState = {
  text: '',
  priority: 'medium',
  category: 'personal',
  tags: [],
  description: '',
  dueDate: ''
}

describe('useTodoForm', () => {
  it('provides default state and invalid flag when no initial data is given', () => {
    // 初期値なしで呼び出し、フォームが既定値で初期化されることと無効判定になることを確認
    const { form, isValid } = useTodoForm()

    expect(form.value).toEqual(defaultState)
    expect(isValid.value).toBe(false)
  })

  it('merges provided initial data and exposes computed validity', () => {
    // 初期値ありで呼び出し、渡した値がそのまま反映されること、空白トリムによるバリデーションを確認
    const { form, isValid } = useTodoForm({
      text: '  Finish docs  ',
      priority: 'high',
      category: 'work',
      tags: ['urgent'],
      description: 'Ship contributor guide',
      dueDate: '2025-01-02'
    })

    expect(form.value).toMatchObject({
      text: '  Finish docs  ',
      priority: 'high',
      category: 'work',
      tags: ['urgent'],
      description: 'Ship contributor guide',
      dueDate: '2025-01-02'
    })
    expect(isValid.value).toBe(true)

    // テキストを空白に更新すると computed が即座に無効判定へ変わることを検証
    form.value.text = '   '
    expect(isValid.value).toBe(false)
  })

  it('resets to the default state via resetForm', () => {
    // 初期値に任意の値を入れてから resetForm を呼び、完全に既定値へ戻ることを確認
    const { form, resetForm } = useTodoForm({
      text: 'Write tests',
      tags: ['important']
    })

    resetForm()

    expect(form.value).toEqual(defaultState)
  })
})
