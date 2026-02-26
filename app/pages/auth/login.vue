<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useLogin } from '~/composables/api/mutations/useAuthMutations'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  email: z.string().email(t('validation.emailInvalid')),
  password: z.string().min(8, t('validation.passwordMin')),
})
type LoginForm = z.infer<typeof schema>

// ─── Mutation ─────────────────────────────────────────────────────────────────
const { mutateAsync: login, isPending: isLoading, error: loginError } = useLogin()

// ─── Form ─────────────────────────────────────────────────────────────────────
const { handleSubmit, errors, defineField } = useForm<LoginForm>({
  validationSchema: toTypedSchema(schema),
  initialValues: { email: '', password: '' },
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const router = useRouter()
const showPassword = ref(false)

// ─── Submit ───────────────────────────────────────────────────────────────────
// navigateTo() is called inside useLogin onSuccess — no need to do it here
const onSubmit = handleSubmit(async (values) => {
  await login({ email: values.email, password: values.password })
})

// Derive a readable error message from the axios error
const errorMessage = computed(() => {
  if (!loginError.value) return null
  const err = loginError.value as any
  return err?.response?.data?.message || t('login.errorFallback')
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- ── LOGO ───────────────────────────────────────── -->
    <div class="flex flex-col items-center gap-1 mb-5">
      <span class="text-5xl text-gray-900 mt-2 font-medium">
        LOGO
      </span>
    </div>
    <!-- ── HEADING ────────────────────────────────────── -->
    <div class="text-start">
      <h1 class="text-2xl font-medium  text-gray-900 tracking-tight">
        {{ t('login.title') }}
      </h1>
      <p class="text-sm text-gray-500 mt-1 font-normal">
        {{ t('login.subtitle') }}
      </p>
    </div>

    <!-- ── API ERROR ──────────────────────────────────── -->
    <UAlert v-if="errorMessage" color="error" variant="soft" :description="errorMessage"
      icon="i-heroicons-exclamation-circle" />

    <!-- ── FORM ───────────────────────────────────────── -->
    <form class="flex flex-col gap-4" novalidate @submit.prevent="onSubmit">

      <!-- Email -->
      <UFormField :error="errors.email">
        <UInput v-model="email" v-bind="emailAttrs" type="email" :placeholder="t('login.emailPlaceholder')"
          autocomplete="email" :invalid="!!errors.email" :ui="{ base: 'pl-15', leading: 'ps-0' }">
          <template #leading>
            <UButton class="flex items-center justify-center w-12 h-full rounded-r-none self-stretch"
              :ui="{ base: ['rounded-xl'] }">
              <UIcon name="i-heroicons-envelope" class="text-white text-xl w-6 h-6" />
            </UButton>
          </template>
        </UInput>
      </UFormField>

      <!-- Password -->
      <UFormField :error="errors.password">
        <UInput v-model="password" v-bind="passwordAttrs" :type="showPassword ? 'text' : 'password'"
          :placeholder="t('login.passwordPlaceholder')" autocomplete="current-password" :invalid="!!errors.password"
          :ui="{ base: 'pl-15', leading: 'ps-0' }">
          <template #leading>
            <UButton class="flex items-center justify-center w-12 h-full rounded-r-none self-stretch"
              :ui="{ base: ['rounded-xl'] }">
              <UIcon name="i-lucide-lock" class="text-white text-xl w-6 h-6" />
            </UButton>
          </template>
          <template #trailing>
            <UButton color="neutral" variant="link" size="sm" :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="showPassword ? t('common.hidePassword') : t('common.showPassword')"
              :aria-pressed="showPassword" @click="showPassword = !showPassword" />
          </template>
        </UInput>
      </UFormField>

      <!-- Forgot Password -->
      <div class="flex justify-end -mt-1">
        <NuxtLink to="/auth/forgot-password"
          class="text-xs font-semibold text-[#9B1B3A] hover:text-[#7d1530] hover:underline transition-colors">
          {{ t('login.forgotPassword') }}
        </NuxtLink>
      </div>

      <!-- Sign In -->
      <UButton type="submit" color="primary" variant="solid" size="xl" block :loading="isLoading"
        :trailing-icon="isLoading ? undefined : 'i-heroicons-arrow-right-20-solid'"
        :ui="{ trailingIcon: 'w-5 h-5 rounded-full text-white flex items-center justify-center', base: ['uppercase'] }">
        {{ t('login.submitButton') }}
      </UButton>

      <!-- Guest -->
      <UButton type="button" color="primary" variant="outline" size="xl" block trailing-icon="i-heroicons-user-20-solid"
        @click="router.push('/')" :ui="{ base: ['uppercase'] }">
        {{ t('login.guestButton') }}
      </UButton>

    </form>

    <!-- ── DIVIDER ─────────────────────────────────────── -->
    <div class="flex items-center gap-3 justify-center w-full">
      <div class="w-2.5 h-px bg-gray-500"></div>

      <span class="text-[16px] text-gray-900 whitespace-nowrap font-medium">
        {{ t('common.orLoginWith') }}
      </span>

      <div class="w-2.5 h-px bg-gray-500"></div>
    </div>

    <!-- ── GOOGLE ──────────────────────────────────────── -->
    <UButton type="button" color="neutral" variant="ghost" size="lg" block
      :style="{ boxShadow: '15px 0px 30px 0px #D3D4E240' }">
      <template #leading>
        <svg class="size-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
          <path fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      </template>
      {{ t('common.loginWithGoogle') }}
    </UButton>

    <!-- ── REGISTER LINK ───────────────────────────────── -->
    <p class="text-center text-sm text-gray-500 -mt-2">
      {{ t('login.noAccount') }}
      <NuxtLink to="/auth/register"
        class="text-[#9B1B3A] font-semibold hover:text-[#7d1530] hover:underline transition-colors ml-1">
        {{ t('login.signUpLink') }}
      </NuxtLink>
    </p>
  </div>
</template>