<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()

const schema = z.object({
  email: z.string().email(t('validation.emailInvalid')),
})
type ForgotForm = z.infer<typeof schema>

const { handleSubmit, errors, defineField } = useForm<ForgotForm>({
  validationSchema: toTypedSchema(schema),
  initialValues: { email: '' },
})

const [email, emailAttrs] = defineField('email')

const router = useRouter()
const isLoading = ref(false)
const sent = ref(false)

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  try {
    await new Promise((r) => setTimeout(r, 1000))
    // TODO: call forgot-password API
    sent.value = true
    setTimeout(() => {
      router.push({
        path: '/auth/verification',
        query: {
          username: values.email
        }
      })
    }, 800)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class=" flex flex-col gap-8">

    <!-- ── BACK BUTTON ────────────────────────────────── -->
    <UButton color="neutral" variant="ghost" size="sm" icon="i-heroicons-arrow-left" class="-mt-4 self-start"
      @click="router.back()">
      {{ t('common.back') }}
    </UButton>

    <!-- ── HEADING ────────────────────────────────────── -->
    <div class="text-start -mt-2">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
        {{ t('forgotPassword.title') }}
      </h1>
      <p class="text-sm text-gray-500 mt-1 leading-relaxed">
        {{ t('forgotPassword.subtitle') }}
      </p>
    </div>

    <!-- ── FORM ───────────────────────────────────────── -->
    <form class="flex flex-col gap-4" novalidate @submit.prevent="onSubmit">

      <!-- Email -->
      <UFormField :error="errors.email">
        <UInput v-model="email" v-bind="emailAttrs" type="email" :placeholder="t('forgotPassword.emailPlaceholder')"
          autocomplete="email" :invalid="!!errors.email" :ui="{ base: 'pl-15', leading: 'ps-0' }">
          <template #leading>
            <UButton class="flex items-center justify-center w-12 h-full rounded-r-none self-stretch"
              :ui="{ base: ['rounded-xl'] }">
              <UIcon name="i-heroicons-envelope" class="text-white text-xl w-6 h-6" />
            </UButton>
          </template>
        </UInput>
      </UFormField>

      <!-- Send Link Button -->
      <UButton type="submit" color="primary" variant="solid" size="lg" block :loading="isLoading"
        :disabled="isLoading || sent" :trailing-icon="sent
          ? 'i-heroicons-check-20-solid'
          : isLoading
            ? undefined
            : 'i-heroicons-arrow-right-20-solid'"
        :ui="{ trailingIcon: 'w-5 h-5 rounded-full text-white flex items-center justify-center' }">
        {{ sent ? t('forgotPassword.sentButton') : t('forgotPassword.submitButton') }}
      </UButton>

    </form>
  </div>
</template>