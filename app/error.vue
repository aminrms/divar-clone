<script setup lang="ts">
import type { NuxtError } from '#app'

// Defining the props to accept the error object
const props = defineProps<{
  error: NuxtError
}>()

// Clear the error and redirect to home
const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <UContainer class="min-h-screen flex flex-col items-center justify-center text-center">
    <div class="space-y-6">
      <h1 class="text-9xl font-bold text-primary-500 opacity-20 selection:bg-transparent">
        {{ error.status }}
      </h1>

      <div class="space-y-2">
        <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">
          {{ error.status === 404 ? 'Page not found' : 'Oops! Something went wrong' }}
        </h2>
        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          {{ error.message || "We couldn't find the page you were looking for. It might have been moved or deleted." }}
        </p>
      </div>

      <div class="flex items-center justify-center gap-4">
        <UButton
          icon="i-heroicons-home"
          size="lg"
          color="primary"
          variant="solid"
          label="Back to Home"
          @click="handleError"
        />
        
        <UButton
          icon="i-heroicons-arrow-uturn-left"
          size="lg"
          variant="ghost"
          label="Go Back"
          @click="$router.back()"
        />
      </div>
    </div>
  </UContainer>
</template>