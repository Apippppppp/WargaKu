<template>
  <div class="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Brand -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-2xl bg-[var(--blue)] flex items-center justify-center text-white font-bold font-heading text-2xl mx-auto mb-4">
          W
        </div>
        <h1 class="font-heading font-bold text-2xl text-[var(--ink)]">WargaKu</h1>
        <p class="text-xs text-[var(--muted)] mt-1">Portal Pengelolaan Lingkungan</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-2xl border border-[var(--line)] p-6 shadow-sm">
        <h2 class="font-heading font-bold text-lg text-[var(--ink)] mb-6">Masuk</h2>
        
        <div class="space-y-3">
          <p class="text-xs text-[var(--muted)] mb-4">Pilih akun demo untuk memulai:</p>
          <button
            v-for="user in authStore.users"
            :key="user.id"
            @click="loginAs(user.id)"
            class="w-full flex items-center gap-3 p-3 rounded-xl border border-[var(--line)] hover:border-[var(--blue)] hover:bg-[var(--tint)] transition-colors cursor-pointer text-left"
          >
            <div class="w-10 h-10 rounded-full bg-[var(--blue)] text-white flex items-center justify-center text-sm font-bold shrink-0">
              {{ user.name.charAt(0) }}
            </div>
            <div class="min-w-0">
              <div class="font-semibold text-sm text-[var(--ink)] truncate">{{ user.name }}</div>
              <div class="text-[11px] text-[var(--muted)]">{{ user.roleLabel }}</div>
            </div>
          </button>
        </div>
      </div>

      <p class="text-[10px] text-center text-[var(--muted)] mt-6">
        Demo tanpa data nyata. Semua pembayaran adalah simulasi.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

function loginAs(userId) {
  authStore.switchUserRole(userId);
  router.push(authStore.getDashboardPath(userId));
}
</script>