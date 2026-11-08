<template>
  <DashboardLayout>
    <div class="mb-6">
      <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Riwayat Pembayaran</h1>
      <p class="text-xs text-[var(--muted)] mt-1">Rumah {{ authStore.currentUser.houseNo }}, {{ scopeStore.selectedScope.label }}</p>
    </div>

    <DataTable :columns="columns" :items="transactions" :searchable="true" search-placeholder="Cari riwayat...">
      <template #empty>
        <p>Belum ada riwayat transaksi.</p>
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
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useScopeStore } from '@/stores/scope';
import { useDataStore } from '@/stores/data';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import DataTable from '@/components/ui/DataTable.vue';
import StatusChip from '@/components/common/StatusChip.vue';
import Money from '@/components/common/Money.vue';

const authStore = useAuthStore();
const scopeStore = useScopeStore();
const dataStore = useDataStore();

const columns = [
  { key: 'date', label: 'Tanggal' },
  { key: 'billTitle', label: 'Tagihan' },
  { key: 'amount', label: 'Nominal', type: 'money', align: 'right' },
  { key: 'method', label: 'Metode' },
  { key: 'status', label: 'Status', type: 'status' },
];

const transactions = computed(() => {
  return dataStore.transactionHistory.filter(t => t.houseNo === authStore.currentUser.houseNo);
});
</script>