<template>
  <button
    :type="type"
    :disabled="disabled"
    @click="$emit('click')"
    :class="[
      'px-4 py-2 rounded-md transition-colors font-medium',
      sizeClasses,
      variantClasses,
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    ]"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'danger', 'success', 'warning', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  type: {
    type: String as () => 'button' | 'submit' | 'reset',
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none'
    case 'secondary':
      return 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none'
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none'
    case 'success':
      return 'bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-300 focus:outline-none'
    case 'warning':
      return 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-300 focus:outline-none'
    case 'info':
      return 'bg-purple-500 text-white hover:bg-purple-600 focus:ring-2 focus:ring-purple-300 focus:outline-none'
    default:
      return 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-xs px-2 py-1'
    case 'md': return 'text-sm px-4 py-2'
    case 'lg': return 'text-base px-6 py-3'
    default: return 'text-sm px-4 py-2'
  }
})
</script>