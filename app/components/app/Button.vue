<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  color?: 'primary' | 'neutral' | 'secondary' | 'ghost' | 'white'
  variant?: 'solid' | 'outline' | 'ghost' | 'soft' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  block?: boolean
  loading?: boolean
  disabled?: boolean
  trailingIcon?: string
  leadingIcon?: string
  icon?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  color: 'primary',
  variant: 'solid',
  size: 'md',
  block: false,
  loading: false,
  disabled: false,
})

// Only apply the styled circle for solid / outline when an icon is given and not loading
const hasStyledTrailing = computed(
  () =>
    !!props.trailingIcon &&
    !props.loading &&
    (props.variant === 'solid' || props.variant === 'outline'),
)

// Circle — absolutely positioned, pinned to the right, vertically centred
const circleClass = computed(() => {
  const base =
    'absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full'

  if (props.variant === 'solid') {
    return `${base} bg-black/30 p-1`
  }
  if (props.variant === 'outline') {
    return `${base} bg-transparent ring-1 ring-inset ring-primary-900 p-2`
  }
  return base
})

const iconSizeClass = computed(
  () =>
    ({ xs: 'size-3', sm: 'size-3.5', md: 'size-4', lg: 'size-5', xl: 'size-5' }[props.size] ??
    'size-5'),
)
</script>

<template>
  <!--
    When a styled trailing icon is present we need:
      • relative on the root so the absolute circle is anchored correctly
      • label: 'flex-1 text-center' so the text stays truly centred
        regardless of the circle sitting on the right
  -->
  <UButton
    :type="type"
    :color="color"
    :variant="variant"
    :size="size"
    :block="block"
    :loading="loading"
    :disabled="disabled"
    :leading-icon="leadingIcon"
    :icon="!trailingIcon ? icon : undefined"
    :class="[props.class, hasStyledTrailing ? 'relative' : '']"
    :ui="hasStyledTrailing ? { label: 'flex-1 text-center' } : {}"
  >
    <slot />

    <template v-if="trailingIcon" #trailing>
      <!-- Solid / outline → circular badge absolutely pinned right -->
      <span v-if="hasStyledTrailing" :class="circleClass">
        <UIcon :name="trailingIcon" :class="iconSizeClass" />
      </span>
      <!-- Ghost / soft / link → plain inline icon -->
      <UIcon v-else-if="!loading" :name="trailingIcon" :class="iconSizeClass" />
    </template>
  </UButton>
</template>