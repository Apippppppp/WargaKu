<template>
  <DashboardLayout>
    <div class="mb-6">
      <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Log Aktivitas Platform</h1>
      <p class="text-xs text-[var(--muted)] mt-1">Riwayat perubahan sistem</p>
    </div>

    <DataTable :columns="columns" :items="dataStore.auditLogs" :searchable="true" search-placeholder="Cari aktivitas...">
      <template #empty><p>Belum ada aktivitas.</p></template>
    </DataTable>
  </DashboardLayout>
</template>

<script setup>
import { useDataStore } from '@/stores/data';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import DataTable from '@/components/ui/DataTable.vue';

const dataStore = useDataStore();

const columns = [
  { key: 'timestamp', label: 'Waktu' },
  { key: 'actor', label: 'Pelaku' },
  { key: 'action', label: 'Aksi' },
  { key: 'target', label: 'Target' },
  { key: 'details', label: 'Detail' },
];
</script>