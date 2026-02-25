<template>
    <UContainer class="py-10">
        <UCard>
            <template #header>
                <h1 class="text-xl font-bold">Welcome Home</h1>
            </template>

            <p class="text-gray-600 dark:text-gray-400">
                You are seeing this because you are logged in!
            </p>

            <template #footer>
                <UButton color='error' variant="soft" label="Logout" @click="handleLogout" />
            </template>
        </UCard>
    </UContainer>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()
// This line protects the page
definePageMeta({
    middleware: 'auth'
})

const handleLogout = () => {
    authStore.logout()
    router.replace('/auth/login')
}
</script>