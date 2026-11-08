<script setup>
import { ref, computed, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

defineProps({
  collapsed: Boolean
});

const emit = defineEmits(['toggle']);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const moreOpen = ref(false);

// Icon components as render functions
const icons = {
  dashboard: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
  ]),
  home: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
  ]),
  bill: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
  ]),
  payment: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' })
  ]),
  house: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' })
  ]),
  report: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
  ]),
  announcement: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' })
  ]),
  activity: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
  ]),
  verify: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
  ]),
  config: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
  ]),
  history: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })
  ]),
  members: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
  ]),
  audit: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' })
  ]),
  settings: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-5 h-5' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
  ]),
};

const menuConfigs = {
  RESIDENT_HEAD: [
    { path: '/warga', label: 'Beranda rumah', icon: icons.home },
    { path: '/warga/tagihan', label: 'Tagihan', icon: icons.bill },
    { path: '/warga/riwayat', label: 'Riwayat', icon: icons.history },
    { path: '/warga/anggota', label: 'Anggota keluarga', icon: icons.members },
    { path: '/warga/pengumuman', label: 'Pengumuman', icon: icons.announcement },
  ],
  RESIDENT_MEMBER: [
    { path: '/warga', label: 'Beranda rumah', icon: icons.home },
    { path: '/warga/tagihan', label: 'Tagihan', icon: icons.bill },
    { path: '/warga/pengumuman', label: 'Pengumuman', icon: icons.announcement },
  ],
  TREASURER: [
    { path: '/keuangan', label: 'Verifikasi pembayaran', icon: icons.verify },
    { path: '/keuangan/tagihan', label: 'Tagihan', icon: icons.bill },
    { path: '/keuangan/transaksi', label: 'Riwayat transaksi', icon: icons.history },
    { path: '/keuangan/laporan', label: 'Laporan', icon: icons.report },
  ],
  RT_ADMIN: [
    { path: '/pengurus', label: 'Ringkasan', icon: icons.dashboard },
    { path: '/pengurus/rumah', label: 'Rumah dan warga', icon: icons.house },
    { path: '/pengurus/iuran', label: 'Iuran dan tagihan', icon: icons.bill },
    { path: '/pengurus/laporan', label: 'Laporan', icon: icons.report },
    { path: '/pengurus/pengumuman', label: 'Pengumuman', icon: icons.announcement },
    { path: '/pengurus/kegiatan', label: ' Kegiatan', icon: icons.activity },
    { path: '/pengurus/log', label: 'Log aktivitas', icon: icons.audit },
  ],
  RW_ADMIN: [
    { path: '/pengurus', label: 'Ringkasan', icon: icons.dashboard },
    { path: '/pengurus/rumah', label: 'Rumah dan warga', icon: icons.house },
    { path: '/pengurus/iuran', label: 'Iuran dan tagihan', icon: icons.bill },
    { path: '/pengurus/laporan', label: 'Laporan', icon: icons.report },
    { path: '/pengurus/pengumuman', label: 'Pengumuman', icon: icons.announcement },
    { path: '/pengurus/kegiatan', label: ' Kegiatan', icon: icons.activity },
    { path: '/pengurus/log', label: 'Log aktivitas', icon: icons.audit },
  ],
  PLATFORM_ADMIN: [
    { path: '/platform', label: 'Verifikasi lingkungan', icon: icons.verify },
    { path: '/platform/aktif', label: 'Lingkungan aktif', icon: icons.house },
    { path: '/platform/konfigurasi', label: 'Konfigurasi platform', icon: icons.config },
    { path: '/platform/log', label: 'Log aktivitas', icon: icons.audit },
  ],
};

const filteredMenuItems = computed(() => {
  const role = authStore.currentUser.role;
  return menuConfigs[role] || menuConfigs.RESIDENT_HEAD;
});

const mobileMenuItems = computed(() => filteredMenuItems.value.slice(0, 3));
const moreMenuItems = computed(() => filteredMenuItems.value.slice(3));

function isActive(path) {
  return route.path === path || route.path.startsWith(path + '/');
}

function goTo(path) {
  router.push(path);
  moreOpen.value = false;
}

function toggleSidebar() {
  emit('toggle');
}
</script>

<template>
  <!-- Desktop Sidebar (>=1024px) -->
  <aside 
    class="hidden lg:flex flex-col bg-[var(--surface-2)] border-r border-[var(--line)] h-screen fixed left-0 top-16 z-30 transition-all duration-300 ease-in-out"
    :class="collapsed ? 'w-16' : 'w-[248px]'"
  >
    <!-- Logo & Toggle -->
    <div class="h-16 flex items-center px-4 border-b border-[var(--line)]">
      <div class="flex items-center gap-2 overflow-hidden">
        <img src="/logo.webp" alt="WargaKu" class="w-8 h-8 object-contain shrink-0" />
        <span 
          class="font-heading font-bold text-lg text-[var(--ink)] whitespace-nowrap transition-all duration-300"
          :class="collapsed ? 'opacity-0 w-0' : 'opacity-100'"
        >WargaKu</span>
      </div>
    </div>

    <!-- Toggle Button -->
    <button 
      @click="toggleSidebar"
      class="absolute -right-3 top-20 w-6 h-6 bg-white border border-[var(--line)] rounded-full flex items-center justify-center shadow-sm hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
    >
      <svg 
        class="w-4 h-4 text-[var(--muted)] transition-transform duration-300" 
        :class="collapsed ? 'rotate-180' : ''"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <router-link
        v-for="item in filteredMenuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
        :class="[
          isActive(item.path)
            ? 'bg-white text-[var(--blue)] shadow-sm border border-[var(--line)]'
            : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-white/50'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" />
        <span 
          class="whitespace-nowrap transition-all duration-300"
          :class="collapsed ? 'opacity-0 w-0' : 'opacity-100'"
        >{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Bottom links -->
    <div class="p-4 border-t border-[var(--line)] space-y-1">
      <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] hover:bg-white/50 transition-colors cursor-pointer">
        <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span 
          class="whitespace-nowrap transition-all duration-300"
          :class="collapsed ? 'opacity-0 w-0' : 'opacity-100'"
        >Pengaturan</span>
      </button>
    </div>
  </aside>

  <!-- Mobile Bottom Tab Bar (<768px) -->
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[var(--line)] z-30 px-2 pb-safe">
    <div class="flex items-center justify-around h-full max-w-lg mx-auto">
      <router-link
        v-for="item in mobileMenuItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl text-[10px] font-semibold transition-colors min-w-[64px]"
        :class="[
          isActive(item.path)
            ? 'text-[var(--blue)]'
            : 'text-[var(--muted)]'
        ]"
      >
        <component :is="item.icon" class="w-6 h-6" />
        <span>{{ item.label }}</span>
      </router-link>

      <!-- "Lainnya" dropdown -->
      <div class="relative">
        <button
          @click="moreOpen = !moreOpen"
          class="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl text-[10px] font-semibold text-[var(--muted)]"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          <span>Lainnya</span>
        </button>
        <div v-if="moreOpen" class="absolute bottom-full right-0 mb-2 w-48 rounded-xl bg-white shadow-xl border border-[var(--line)] py-1">
          <button
            v-for="item in moreMenuItems"
            :key="item.path"
            @click="goTo(item.path)"
            class="w-full text-left px-3 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)]"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>