<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const username = route?.query?.username as string
const maskedPhone = '+88 913 123 4567'

// ─── OTP State ────────────────────────────────────────────────────────────────
const digits = ref<string[]>(['', '', '', ''])
const inputRefs = ref<HTMLInputElement[]>([])

const isLoading = ref(false)
const errorMsg = ref('')

// ─── Input Handlers ───────────────────────────────────────────────────────────
function onInput(index: number, event: Event) {
  const val = (event.target as HTMLInputElement).value
  digits.value[index] = val.slice(-1)
  errorMsg.value = ''
  if (val && index < 3) {
    nextTick(() => inputRefs.value[index + 1]?.focus())
  }
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    nextTick(() => inputRefs.value[index - 1]?.focus())
  }
}

function onPaste(event: ClipboardEvent) {
  const pasted = event.clipboardData?.getData('text') ?? ''
  const cleaned = pasted.replace(/\D/g, '').slice(0, 4)
  cleaned.split('').forEach((char, i) => { digits.value[i] = char })
  nextTick(() => inputRefs.value[Math.min(cleaned.length, 3)]?.focus())
}

const isComplete = computed(() => digits.value.every((d) => d !== ''))
const otp = computed(() => digits.value.join(''))

// ─── Resend Timer ─────────────────────────────────────────────────────────────
const resendSeconds = ref(30)
const canResend = ref(false)
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  inputRefs.value[0]?.focus()
  timer = setInterval(() => {
    if (resendSeconds.value > 0) {
      resendSeconds.value--
    } else {
      canResend.value = true
      clearInterval(timer)
    }
  }, 1000)
})

onUnmounted(() => clearInterval(timer))

function resendCode() {
  if (!canResend.value) return
  resendSeconds.value = 30
  canResend.value = false
  digits.value = ['', '', '', '']
  timer = setInterval(() => {
    if (resendSeconds.value > 0) resendSeconds.value--
    else { canResend.value = true; clearInterval(timer) }
  }, 1000)
  // TODO: call resend API
}

// ─── Submit ───────────────────────────────────────────────────────────────────
async function onConfirm() {
  if (!isComplete.value) {
    errorMsg.value = t('verification.emptyCode')
    return
  }
  isLoading.value = true
  errorMsg.value = ''
  try {
    await new Promise((r) => setTimeout(r, 1000))
    // TODO: verify OTP via API
    if (otp.value === '1234') {
      router.push('/feed')
    } else {
      errorMsg.value = t('verification.invalidCode')
      digits.value = ['', '', '', '']
      nextTick(() => inputRefs.value[0]?.focus())
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- ── BACK BUTTON ────────────────────────────────── -->
    <UButton color='ghost' variant="ghost" size="md" icon="i-heroicons-arrow-left" class="-mt-4 self-start font-bold"
      @click="router.back()">
    </UButton>

    <!-- ── HEADING ────────────────────────────────────── -->
    <div class="text-start">
      <h1 class="text-2xl font-normal text-gray-900">
        {{ t('verification.title') }}
      </h1>
      <p class="text-sm text-gray-500 mt-1 font-normal">
        {{ t('verification.subtitle') }} :
      </p>
      <span class="font-normal text-gray-474 text-sm">{{ maskedPhone }}</span>
    </div>

    <!-- ── API ERROR ──────────────────────────────────── -->
    <UAlert v-if="errorMsg" color="error" variant="soft" :description="errorMsg"
      icon="i-heroicons-exclamation-circle" />

    <!-- ── OTP INPUTS ─────────────────────────────────── -->
    <div class="flex gap-6 mt-2 w-[90%] mx-auto" @paste.prevent="onPaste">
      <input v-for="(_, index) in digits" :key="index"
        :ref="(el) => { if (el) inputRefs[index] = el as HTMLInputElement }" v-model="digits[index]" type="text"
        inputmode="numeric" maxlength="1"
        class="w-full h-14  text-center text-xl font-bold rounded-xl border-2 outline-none transition-all bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary"
        :class="[
          digits[index] ? 'border-primary text-primary' : 'border-gray-200',
        ]" @input="onInput(index, $event)" @keydown="onKeydown(index, $event)" placeholder="-" />
    </div>

    <!-- ── RESEND ─────────────────────────────────────── -->
    <!-- <div>
      <UButton color="primary" :variant="canResen d ? 'link' : 'ghost'" size="sm" :disabled="!canResend"
        @click="resendCode">
        {{
          canResend
            ? t('verification.resendCode')
            : t('verification.resendIn', { seconds: resendSeconds })
        }}
      </UButton>
    </div> -->
    <div class="mt-2"/>

    <!-- ── CONFIRM BUTTON ──────────────────────────────── -->
    <AppButton
      type="button"
      color="primary"
      variant="solid"
      size="xl"
      block
      :loading="isLoading"
      :disabled="isLoading"
      :trailing-icon="isLoading ? undefined : 'i-heroicons-arrow-right-20-solid'"
      class="uppercase"
      @click="onConfirm"
    >
      {{ t('verification.confirmButton') }}
    </AppButton>

  </div>
</template>
