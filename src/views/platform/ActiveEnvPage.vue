<template>
  <DashboardLayout>
    <div class="mb-6">
      <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Lingkungan Aktif</h1>
      <p class="text-xs text-[var(--muted)] mt-1">Daftar lingkungan yang telah terverifikasi</p>
    </div>

    <DataTable :columns="columns" :items="activeEnvs" :searchable="true" search-placeholder="Cari lingkungan...">
      <template #empty><p>Belum ada lingkungan aktif.</p></template>
      <template #col-status="{ value }"><StatusChip :status="value" type="org" /></template>
    </DataTable>
  </DashboardLayout>
</template>

<script setup>
import { computed } from 'vue';
import { useDataStore } from '@/stores/data';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import DataTable from '@/components/ui/DataTable.vue';
import StatusChip from '@/components/common/StatusChip.vue';

const dataStore = useDataStore();

const activeEnvs = computed(() => [
  { id: 'env_1', name: 'RT 03 / RW 07', type: 'RT', totalHouses: 48, status: 'VERIFIED', registeredDate: '28 Okt 2024' },
  { id: 'env_2', name: 'RW 07', type: 'RW', totalHouses: 180, status: 'VERIFIED', registeredDate: '15 Jan 2024' },
  { id: 'env_3', name: 'RT 01 / RW 07', type: 'RT', totalHouses: 42, status: 'VERIFIED', registeredDate: '01 Mar 2024' },
  { id: 'env_4', name: 'RT 02 / RW 07', type: 'RT', totalHouses: 38, status: 'VERIFIED', registeredDate: '10 Apr 2024' },
]);

const columns = [
  { key: 'name', label: 'Nama Lingkungan' },
  { key: 'type', label: 'Jenis' },
  { key: 'totalHouses', label: 'Rumah', align: 'right' },
  { key: 'registeredDate', label: 'Tgl Daftar' },
  { key: 'status', label: 'Status', type: 'status' },
];
</script>