<template>
  <DashboardLayout>
    <div class="mb-6">
      <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Log Aktivitas</h1>
      <p class="text-xs text-[var(--muted)] mt-1">{{ scopeStore.selectedScope.label }}</p>
    </div>

    <DataTable :columns="columns" :items="dataStore.auditLogs" :searchable="true" search-placeholder="Cari aktivitas...">
      <template #empty><p>Belum ada aktivitas tercatat.</p></template>
      <template #col-action="{ value }">
        <span class="font-semibold text-[var(--ink)]">{{ value }}</span>
      </template>
      <template #col-timestamp="{ value }">
        <span class="text-[var(--muted)] text-xs">{{ value }}</span>
      </template>
    </DataTable>
  </DashboardLayout>
</template>

<script setup>
import { useScopeStore } from '@/stores/scope';
import { useDataStore } from '@/stores/data';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import DataTable from '@/components/ui/DataTable.vue';

const scopeStore = useScopeStore();
const dataStore = useDataStore();

const columns = [
  { key: 'timestamp', label: 'Waktu' },
  { key: 'actor', label: 'Pelaku' },
  { key: 'action', label: 'Aksi' },
  { key: 'target', label: 'Target' },
  { key: 'details', label: 'Detail' },
];
</script>