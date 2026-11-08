<template>
  <DashboardLayout>
    <div class="mb-6">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Rumah dan Warga</h1>
          <p class="text-xs text-[var(--muted)] mt-1">{{ scopeStore.selectedScope.label }}</p>
        </div>
        <button class="shrink-0 px-4 py-2.5 rounded-xl bg-[var(--blue)] hover:bg-[var(--blue-d)] text-white text-xs font-semibold shadow-sm cursor-pointer">
          Tambah rumah
        </button>
      </div>
    </div>

    <DataTable 
      :columns="columns" 
      :items="dataStore.households" 
      :searchable="true" 
      search-placeholder="Cari rumah atau kepala keluarga..."
    >
      <template #empty>
        <p>Belum ada rumah di RT ini. Tambahkan rumah pertama untuk mulai menerbitkan tagihan.</p>
      </template>
      <template #col-headName="{ value }">
        <span class="font-semibold text-[var(--ink)]">{{ value }}</span>
      </template>
      <template #col-arrearsCount="{ value }">
        <span v-if="value > 0" class="text-[var(--danger)] font-semibold">{{ value }}</span>
        <span v-else class="text-emerald-600">-</span>
      </template>
      <template #col-totalArrears="{ value }">
        <Money v-if="value > 0" :value="value" class="text-[var(--danger)] font-bold" />
        <span v-else class="text-emerald-600">-</span>
      </template>
      <template #actions="{ item }">
        <button class="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--blue)] cursor-pointer">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </template>
    </DataTable>
  </DashboardLayout>
</template>

<script setup>
import { useScopeStore } from '@/stores/scope';
import { useDataStore } from '@/stores/data';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import DataTable from '@/components/ui/DataTable.vue';
import Money from '@/components/common/Money.vue';

const scopeStore = useScopeStore();
const dataStore = useDataStore();

const columns = [
  { key: 'houseNo', label: 'No. Rumah' },
  { key: 'headName', label: 'Kepala Keluarga' },
  { key: 'phone', label: 'Telepon' },
  { key: 'membersCount', label: 'Anggota', align: 'right' },
  { key: 'arrearsCount', label: 'Tunggakan', align: 'right' },
  { key: 'totalArrears', label: 'Total Tunggakan', type: 'money', align: 'right' },
];
</script>