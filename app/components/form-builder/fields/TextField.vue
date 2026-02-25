<!-- components/form-builder/fields/TextField.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string | number
  label?: string
  type?: string
  placeholder?: string
  helperText?: string
  error?: boolean
  required?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { type: 'text' })
const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

const showPassword = ref(false)
const isPassword = computed(() => props.type === 'password')
const inputType = computed(() =>
  isPassword.value
    ? (showPassword.value ? 'text' : 'password')
    : props.type
)
</script>   

<template>
  <div class="w-full">
    <!-- Label (same as your FormFieldLabel.tsx) -->
    <label v-if="label" class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
      {{ label }}<span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="relative">
      <input
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="[
          'w-full rounded-lg border px-3 py-2.5 text-sm transition-colors',
          'bg-white dark:bg-gray-900',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2',
          error
            ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
            : 'border-gray-300 dark:border-gray-600 focus:ring-primary/30 focus:border-primary',
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : '',
          isPassword ? 'pr-10' : '',
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="emit('blur')"
      />
      <!-- Password toggle (same logic as your React TextField) -->
      <button
        v-if="isPassword"
        type="button"
        tabindex="-1"
        class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        @click="showPassword = !showPassword"
      >
        <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-4 h-4" />
      </button>
    </div>

    <!-- Helper / error text -->
    <p v-if="helperText" :class="['text-xs mt-1', error ? 'text-red-500' : 'text-gray-400']">
      {{ helperText }}
    </p>
  </div>
</template>