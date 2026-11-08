<template>
  <DashboardLayout>
    <div class="mb-6">
      <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Riwayat Transaksi</h1>
      <p class="text-xs text-[var(--muted)] mt-1">{{ scopeStore.selectedScope.label }}</p>
    </div>

    <DataTable :columns="columns" :items="dataStore.transactionHistory" :searchable="true" search-placeholder="Cari transaksi...">
      <template #empty>
        <p>Belum ada transaksi.</p>
      </template>
      <template #col-amount="{ value }">
        <Money :value="value" class="font-bold" />
      </template>
      <template #col-status="{ value }">
        <StatusChip :status="value" />
      </template>
    </DataTable>
  </DashboardLayout>
</template>

<script setup>
import { useScopeStore } from '@/stores/scope';
import { useDataStore } from '@/stores/data';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import DataTable from '@/components/ui/DataTable.vue';
import StatusChip from '@/components/common/StatusChip.vue';
import Money from '@/components/common/Money.vue';

const scopeStore = useScopeStore();
const dataStore = useDataStore();

const columns = [
  { key: 'date', label: 'Tanggal' },
  { key: 'houseNo', label: 'Rumah' },
  { key: 'residentName', label: 'Warga' },
  { key: 'billTitle', label: 'Tagihan' },
  { key: 'amount', label: 'Nominal', type: 'money', align: 'right' },
  { key: 'method', label: 'Metode' },
  { key: 'status', label: 'Status', type: 'status' },
];
</script>