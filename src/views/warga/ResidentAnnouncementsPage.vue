<template>
  <DashboardLayout>
    <div class="mb-6">
      <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Pengumuman dan Kegiatan</h1>
      <p class="text-xs text-[var(--muted)] mt-1">{{ scopeStore.selectedScope.label }}</p>
    </div>

    <div v-if="dataStore.announcements.length > 0" class="space-y-3">
      <div
        v-for="ann in dataStore.announcements"
        :key="ann.id"
        class="bg-white rounded-2xl border border-[var(--line)] p-4 hover:border-[var(--blue)] transition-colors cursor-pointer"
      >
        <div class="flex items-start justify-between gap-3 mb-2">
          <span class="px-2 py-0.5 rounded-md bg-[var(--tint)] text-[10px] font-semibold text-[var(--blue)]">
            {{ ann.category }}
          </span>
          <span class="text-xs text-[var(--muted)]">{{ ann.date }}</span>
        </div>
        <h3 class="font-semibold text-[var(--ink)] mb-1">{{ ann.title }}</h3>
        <p v-if="ann.location" class="text-xs text-[var(--muted)] flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ ann.location }}
        </p>
      </div>
    </div>
    <div v-else class="bg-white rounded-2xl border border-[var(--line)] p-8 text-center">
      <p class="text-sm text-[var(--muted)]">Tidak ada pengumuman.</p>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { useScopeStore } from '@/stores/scope';
import { useDataStore } from '@/stores/data';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';

const scopeStore = useScopeStore();
const dataStore = useDataStore();
</script>