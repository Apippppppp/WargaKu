<template>
  <div class="relative inline-block text-left">
    <button
      v-if="canSelect"
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--tint)] border border-[var(--line)] text-xs font-semibold text-[var(--ink)] transition-colors cursor-pointer"
    >
      <svg class="w-4 h-4 text-[var(--blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 4h4" />
      </svg>
      <span>{{ scopeStore.selectedScope.label }}</span>
      <svg class="w-3.5 h-3.5 text-[var(--muted)] transition-transform duration-150" :class="{ 'rotate-180': isOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div
      v-else
      class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-xs font-semibold text-[var(--ink)]"
    >
      <svg class="w-4 h-4 text-[var(--blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 4h4" />
      </svg>
      <span>{{ scopeStore.selectedScope.label }}</span>
    </div>

    <!-- Dropdown -->
    <div
      v-if="canSelect && isOpen"
      class="absolute left-0 mt-1.5 w-48 rounded-xl bg-white shadow-xl border border-[var(--line)] py-1 z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      <div class="px-3 py-1.5 text-[11px] font-semibold text-[var(--muted)] uppercase border-b border-[var(--line)]">
        Pilih Wilayah
      </div>
      <button
        v-for="s in scopeStore.availableScopes"
        :key="s.label"
        @click="selectScope(s)"
        class="w-full text-left px-3 py-2 text-xs font-medium text-[var(--ink)] hover:bg-[var(--surface-2)] flex items-center justify-between"
      >
        <span>{{ s.label }}</span>
        <svg v-if="s.label === scopeStore.selectedScope.label" class="w-4 h-4 text-[var(--blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useScopeStore } from '@/stores/scope';
import { useAuthStore } from '@/stores/auth';

const scopeStore = useScopeStore();
const authStore = useAuthStore();

const isOpen = ref(false);
const canSelect = authStore.currentUser.role === 'RW_ADMIN' || authStore.currentUser.role === 'PLATFORM_ADMIN';

function selectScope(s) {
  scopeStore.setScope(s);
  isOpen.value = false;
}
</script>
