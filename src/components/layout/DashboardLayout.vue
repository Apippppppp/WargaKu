<template>
  <div class="min-h-screen bg-[var(--bg)]">
    <!-- Header (Desktop) -->
    <AppHeader class="hidden lg:flex" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />

    <!-- Main Content Area -->
    <div class="flex pt-16 lg:pt-0">
      <!-- Sidebar (Desktop) -->
      <AppSidebar 
        class="hidden lg:flex" 
        :collapsed="sidebarCollapsed"
        @toggle="sidebarCollapsed = !sidebarCollapsed"
      />

      <!-- Page Content -->
      <main 
        class="flex-1 pt-16 lg:pt-20 min-h-screen pb-20 lg:pb-0 transition-all duration-300"
        :class="sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-[248px]'"
      >
        <!-- Mobile Header & Scope Chips -->
        <div class="lg:hidden sticky top-0 z-20 bg-white border-b border-[var(--line)] px-4 py-3 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <img src="/logo.webp" alt="WargaKu" class="w-7 h-7 object-contain" />
              <span class="font-heading font-bold text-base text-[var(--ink)]">WargaKu</span>
            </div>
            <button
              v-if="authStore.users.length > 1"
              @click="showRoleSwitcher = true"
              class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--tint)] border border-[var(--blue)] text-[10px] font-semibold text-[var(--blue)]"
            >
              {{ authStore.currentUser.roleLabel }}
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </button>
          </div>

          <!-- Mobile Chips: Scope & Period -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <ScopeSwitcher class="shrink-0" />
            <button
              @click="periodOpen = !periodOpen"
              class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-xs font-semibold text-[var(--ink)]"
            >
              <svg class="w-3.5 h-3.5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ scopeStore.selectedPeriod }}</span>
            </button>
          </div>
        </div>

        <!-- Page Content -->
        <div class="p-4 sm:p-6 lg:p-8">
          <div class="max-w-[1200px] mx-auto">
            <slot></slot>
          </div>
        </div>
      </main>
    </div>

    <!-- Mobile Role Switcher Modal -->
    <Teleport to="body">
      <div v-if="showRoleSwitcher" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40" @click.self="showRoleSwitcher = false">
        <div class="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-4 shadow-xl">
          <h3 class="text-sm font-bold text-[var(--ink)] mb-3 px-2">Ganti Peran (Demo)</h3>
          <div class="space-y-1">
            <button
              v-for="u in authStore.users"
              :key="u.id"
              @click="switchRole(u.id)"
              class="w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center justify-between hover:bg-[var(--surface-2)]"
              :class="u.id === authStore.currentUser.id ? 'bg-[var(--tint)]' : ''"
            >
              <div>
                <div class="font-semibold text-[var(--ink)]">{{ u.name }}</div>
                <div class="text-[11px] text-[var(--muted)]">{{ u.roleLabel }}</div>
              </div>
              <svg v-if="u.id === authStore.currentUser.id" class="w-5 h-5 text-[var(--blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
          <button @click="showRoleSwitcher = false" class="w-full mt-3 py-2.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)]">
            Batal
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Toast Container -->
    <Toast ref="toastRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useScopeStore } from '@/stores/scope';
import AppHeader from './AppHeader.vue';
import AppSidebar from './AppSidebar.vue';
import ScopeSwitcher from '@/components/common/ScopeSwitcher.vue';
import Toast from '@/components/common/Toast.vue';

const router = useRouter();
const authStore = useAuthStore();
const scopeStore = useScopeStore();

const sidebarCollapsed = ref(false);
const showRoleSwitcher = ref(false);
const periodOpen = ref(false);
const toastRef = ref(null);

function switchRole(userId) {
  authStore.switchUserRole(userId);
  router.push(authStore.getDashboardPath());
  showRoleSwitcher.value = false;
}

defineExpose({ toast: toastRef });
</script>