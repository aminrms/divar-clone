<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const maskedPhone = '+88 913 123 4567'

// ─── OTP State ────────────────────────────────────────────────────────────────
const digits = ref<string[]>(['', '', '', ''])
const inputRefs = ref<HTMLInputElement[]>([])

function setRef(el: any, index: number) {
  if (!el) return
  // UInput is a component — resolve the inner native <input>
  const native = el.$el?.querySelector('input') ?? el
  inputRefs.value[index] = native
}

const isLoading = ref(false)
const errorMsg = ref('')

// ─── Input Handlers ───────────────────────────────────────────────────────────
function onInput(index: number, event: Event) {
  const val = (event.target as HTMLInputElement).value
  digits.value[index] = val.slice(-1)
  errorMsg.value = ''
  if (val && index < 3) nextTick(() => inputRefs.value[index + 1]?.focus())
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0)
    nextTick(() => inputRefs.value[index - 1]?.focus())
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

function startTimer() {
  resendSeconds.value = 30
  canResend.value = false
  timer = setInterval(() => {
    if (resendSeconds.value > 0) resendSeconds.value--
    else { canResend.value = true; clearInterval(timer) }
  }, 1000)
}

onMounted(() => { nextTick(() => inputRefs.value[0]?.focus()); startTimer() })
onUnmounted(() => clearInterval(timer))

function resendCode() {
  if (!canResend.value) return
  digits.value = ['', '', '', '']
  startTimer()
  // TODO: call resend API
}

// ─── Submit ───────────────────────────────────────────────────────────────────
async function onConfirm() {
  if (!isComplete.value) return
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
    <UButton
      color="neutral"
      variant="ghost"
      size="sm"
      icon="i-heroicons-arrow-left"
      class="-mt-4 self-start"
      @click="router.back()"
    >
      {{ t('common.back') }}
    </UButton>

    <!-- ── HEADING ────────────────────────────────────── -->
    <div class="text-start">
      <h1 class="text-2xl font-normal text-gray-900">
        {{ t('verification.title') }}
      </h1>
      <p class="text-sm text-gray-474 mt-1 leading-relaxed">
        {{ t('verification.subtitle') }} :
        <span class="font-semibold text-gray-474">{{ maskedPhone }}</span>
      </p>
    </div>

    <!-- ── API ERROR ──────────────────────────────────── -->
    <UAlert
      v-if="errorMsg"
      color="error"
      variant="soft"
      :description="errorMsg"
      icon="i-heroicons-exclamation-circle"
    />

    <!-- ── OTP INPUTS ─────────────────────────────────── -->
    <div class="flex gap-3 mt-2" @paste.prevent="onPaste">
      <UInput
        v-for="(_, index) in digits"
        :key="index"
        :ref="(el) => setRef(el, index)"
        v-model="digits[index]"
        type="text"
        inputmode="numeric"
        maxlength="1"
        :invalid="!!errorMsg"
        :ui="{
          base: 'pl-15 text-center text-xl font-bold h-14',
          leading: 'ps-0',
        }"
        @input="onInput(index, $event)"
        @keydown="onKeydown(index, $event)"
      >
        <template #leading>
          <UButton
            class="flex items-center justify-center w-12 h-full rounded-r-none self-stretch"
            :ui="{ base: ['rounded-xl'] }"
          >
            <span class="text-white text-lg font-bold">{{ index + 1 }}</span>
          </UButton>
        </template>
      </UInput>
    </div>

    <!-- ── RESEND ─────────────────────────────────────── -->
    <UButton
      color="primary"
      :variant="canResend ? 'link' : 'ghost'"
      size="sm"
      :disabled="!canResend"
      @click="resendCode"
    >
      {{
        canResend
          ? t('verification.resendCode')
          : t('verification.resendIn', { seconds: resendSeconds })
      }}
    </UButton>

    <!-- 40px space before confirm button -->
    <div class="mt-8" />
    <!-- ── CONFIRM BUTTON ─────────────────────────────── -->
    <AppButton
      type="button"
      color="primary"
      variant="solid"
      size="xl"
      block
      :loading="isLoading"
      :disabled="!isComplete || isLoading"
      :trailing-icon="isLoading ? undefined : 'i-heroicons-arrow-right-20-solid'"
      class="uppercase"
      @click="onConfirm"
    >
      {{ t('verification.confirmButton') }}
    </AppButton>

  </div>
</template>