<script setup lang="ts">
import { useField } from 'vee-validate'
import type { FieldConfig } from './types'
import { computed } from 'vue'

const props = defineProps<{ config: FieldConfig }>()

const { value, errorMessage, handleChange, handleBlur } =
  useField(() => props.config.name)

const commonGroupProps = computed(() => ({
  label: props.config.label,
  name: props.config.name,
  required: props.config.required,
  help: errorMessage.value || props.config.helperText,
  error: !!errorMessage.value
}))
</script>

<template>
  <!-- Custom component -->
  <component
    v-if="config.type === 'custom'"
    :is="config.component"
    v-bind="config.componentProps"
  />

  <!-- TEXT / EMAIL / PASSWORD / NUMBER -->
  <UFormGroup v-else-if="['text','email','password','number'].includes(config.type)"
              v-bind="commonGroupProps">
    <UInput
      :type="config.type"
      :model-value="value"
      @update:model-value="handleChange"
      @blur="handleBlur"
      :placeholder="config.placeholder"
      :disabled="config.disabled"
    />
  </UFormGroup>

  <!-- TEXTAREA -->
  <UFormGroup v-else-if="config.type === 'textarea'"
              v-bind="commonGroupProps">
    <UTextarea
      :rows="config.rows ?? 4"
      :model-value="value"
      @update:model-value="handleChange"
      @blur="handleBlur"
      :placeholder="config.placeholder"
      :disabled="config.disabled"
    />
  </UFormGroup>

  <!-- SELECT / MULTISELECT -->
  <UFormGroup v-else-if="['select','multiselect'].includes(config.type)"
              v-bind="commonGroupProps">
    <USelect
      :options="config.options ?? []"
      :multiple="config.type === 'multiselect' || config.multiple"
      :model-value="value"
      @update:model-value="handleChange"
      :disabled="config.disabled"
    />
  </UFormGroup>

  <!-- CHECKBOX -->
  <UFormGroup v-else-if="config.type === 'checkbox'"
              v-bind="commonGroupProps">
    <UCheckbox
      :model-value="value"
      @update:model-value="handleChange"
      :disabled="config.disabled"
    />
  </UFormGroup>

  <!-- SWITCH -->
  <UFormGroup v-else-if="config.type === 'switch'"
              v-bind="commonGroupProps">
    <USwitch
      :model-value="value"
      @update:model-value="handleChange"
      :disabled="config.disabled"
    />
  </UFormGroup>

  <!-- RADIO -->
  <UFormGroup v-else-if="config.type === 'radio'"
              v-bind="commonGroupProps">
    <URadioGroup
      :options="config.options ?? []"
      :model-value="value"
      @update:model-value="handleChange"
      :disabled="config.disabled"
    />
  </UFormGroup>

  <!-- DATE / TIME / DATETIME -->
  <UFormGroup v-else-if="['date','time','datetime'].includes(config.type)"
              v-bind="commonGroupProps">
    <UInput
      :type="config.type === 'datetime' ? 'datetime-local' : config.type"
      :model-value="value"
      @update:model-value="handleChange"
      :disabled="config.disabled"
    />
  </UFormGroup>
</template>