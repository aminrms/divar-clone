<!-- components/form-builder/FormBuilder.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import type { FormBuilderConfig, FormSection } from './types'
import FormFieldRenderer from './FormFieldRenderer.vue'

interface Props {
  config: FormBuilderConfig
}

defineProps<Props>()

// Track collapsed sections (same as React useState)
const expandedSections = ref<Record<number, boolean>>({})

function toggleSection(index: number) {
  expandedSections.value[index] = !expandedSections.value[index]
}

function isSectionExpanded(section: FormSection, index: number) {
  return expandedSections.value[index] ?? section.defaultExpanded ?? true
}

// Grid cols → Tailwind class mapping
function colClass(cols?: number) {
  const map: Record<number, string> = {
    1: 'grid-cols-1', 2: 'grid-cols-2',
    3: 'grid-cols-3', 4: 'grid-cols-4',
    6: 'grid-cols-6', 12: 'grid-cols-12',
  }
  return map[cols ?? 1] ?? 'grid-cols-1'
}
</script>

<template>
  <div class="space-y-4">

    <!-- Sections mode (like your React sections render) -->
    <template v-if="config.sections">
      <div
        v-for="(section, index) in config.sections"
        :key="index"
        class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm"
      >
        <!-- Section header -->
        <div
          v-if="section.title || section.description"
          class="flex items-center justify-between mb-4"
        >
          <div>
            <h3 v-if="section.title" class="text-base font-semibold text-gray-900 dark:text-white">
              {{ section.title }}
            </h3>
            <p v-if="section.description" class="text-sm text-gray-500 mt-0.5">
              {{ section.description }}
            </p>
          </div>
          <button
            v-if="section.collapsible"
            type="button"
            class="text-gray-400 hover:text-gray-600 transition-colors"
            @click="toggleSection(index)"
          >
            <UIcon :name="isSectionExpanded(section, index) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="w-5 h-5" />
          </button>
        </div>

        <!-- Fields grid (Collapse equivalent) -->
        <Transition name="collapse">
          <div
            v-show="isSectionExpanded(section, index)"
            :class="['grid gap-4', colClass(section.columns ?? config.columns)]"
          >
            <FormFieldRenderer
              v-for="field in section.fields.filter(f => !f.hide)"
              :key="field.name"
              :config="field"
            />
          </div>
        </Transition>
      </div>
    </template>

    <!-- Flat fields mode (no sections) -->
    <div
      v-else-if="config.fields"
      :class="['grid gap-4', colClass(config.columns)]"
    >
      <FormFieldRenderer
        v-for="field in config.fields.filter(f => !f.hide)"
        :key="field.name"
        :config="field"
      />
    </div>

    <!-- Slot for action buttons (submit, reset) -->
    <slot name="actions" />
  </div>
</template>