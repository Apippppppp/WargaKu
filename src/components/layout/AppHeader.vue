<template>
  <header class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[var(--line)] z-40 px-4 sm:px-6">
    <div class="h-full w-full flex items-center justify-between gap-4">
      <!-- Toggle Button -->
      <button 
        @click="emit('toggle-sidebar')"
        class="p-2 rounded-lg hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
      >
        <svg class="w-5 h-5 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Right: Scope (Desktop), Period, User Menu -->
      <div class="flex items-center gap-2 sm:gap-4">
        <!-- Period Selector -->
        <div class="relative hidden md:block">
          <button
            @click="periodOpen = !periodOpen"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--tint)] border border-[var(--line)] text-xs font-semibold text-[var(--ink)] transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Periode: {{ scopeStore.selectedPeriod }}</span>
            <svg class="w-3.5 h-3.5 text-[var(--muted)] transition-transform duration-150" :class="{ 'rotate-180': periodOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <!-- Period Dropdown -->
          <div v-if="periodOpen" class="absolute right-0 mt-1.5 w-40 rounded-xl bg-white shadow-xl border border-[var(--line)] py-1 z-50">
            <button
              v-for="p in scopeStore.availablePeriods"
              :key="p"
              @click="selectPeriod(p)"
              class="w-full text-left px-3 py-2 text-xs font-medium text-[var(--ink)] hover:bg-[var(--surface-2)] flex items-center justify-between"
            >
              <span>{{ p }}</span>
              <svg v-if="p === scopeStore.selectedPeriod" class="w-4 h-4 text-[var(--blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Role Switcher (If user has multiple roles) -->
        <div class="relative" v-if="authStore.users.length > 1">
          <button
            @click="roleOpen = !roleOpen"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--tint)] hover:bg-[var(--line)] border border-[var(--blue)] text-xs font-semibold text-[var(--blue)] transition-colors cursor-pointer"
          >
            <span>{{ authStore.currentUser.roleLabel }}</span>
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </button>
          <div v-if="roleOpen" class="absolute right-0 mt-1.5 w-56 rounded-xl bg-white shadow-xl border border-[var(--line)] py-1 z-50">
            <div class="px-3 py-1.5 text-[11px] font-semibold text-[var(--muted)] uppercase border-b border-[var(--line)]">
              Ganti Peran (Demo)
            </div>
            <button
              v-for="u in authStore.users"
              :key="u.id"
              @click="switchRole(u.id)"
              class="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--surface-2)] flex items-center justify-between"
              :class="u.id === authStore.currentUser.id ? 'bg-[var(--tint)] text-[var(--blue)]' : 'text-[var(--ink)]'"
            >
              <div>
                <div class="font-semibold">{{ u.name }}</div>
                <div class="text-[10px] text-[var(--muted)]">{{ u.roleLabel }}</div>
              </div>
              <svg v-if="u.id === authStore.currentUser.id" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- User Menu -->
        <div class="relative">
          <button
            @click="userMenuOpen = !userMenuOpen"
            class="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
          >
            <div class="w-8 h-8 rounded-full bg-[var(--blue)] text-white flex items-center justify-center text-xs font-bold">
              {{ authStore.currentUser.name.charAt(0) }}
            </div>
            <span class="text-xs font-semibold text-[var(--ink)] hidden sm:block">{{ authStore.currentUser.name.split(' ')[0] }}</span>
            <svg class="w-4 h-4 text-[var(--muted)] hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-if="userMenuOpen" class="absolute right-0 mt-1.5 w-48 rounded-xl bg-white shadow-xl border border-[var(--line)] py-1 z-50">
          <button class="w-full text-left px-3 py-2 text-xs font-medium text-[var(--ink)] hover:bg-[var(--surface-2)]">
            Profil
          </button>
          <button class="w-full text-left px-3 py-2 text-xs font-medium text-[var(--ink)] hover:bg-[var(--surface-2)]">
            Ganti kata sandi
          </button>
          <div class="border-t border-[var(--line)] my-1"></div>
          <button @click="logout" class="w-full text-left px-3 py-2 text-xs font-medium text-[var(--danger)] hover:bg-[var(--danger-bg)]">
            Keluar
          </button>
        </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useScopeStore } from '@/stores/scope';
import { useAuthStore } from '@/stores/auth';

const emit = defineEmits(['toggle-sidebar']);

const router = useRouter();
const scopeStore = useScopeStore();
const authStore = useAuthStore();

const periodOpen = ref(false);
const roleOpen = ref(false);
const userMenuOpen = ref(false);

function selectPeriod(p) {
  scopeStore.setPeriod(p);
  periodOpen.value = false;
}

function switchRole(userId) {
  authStore.switchUserRole(userId);
  router.push(authStore.getDashboardPath());
  roleOpen.value = false;
}

function logout() {
  router.push('/login');
}
</script>