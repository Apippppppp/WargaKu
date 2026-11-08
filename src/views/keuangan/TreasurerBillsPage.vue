<template>
  <DashboardLayout>
    <div class="mb-6">
      <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Daftar Tagihan</h1>
      <p class="text-xs text-[var(--muted)] mt-1">{{ scopeStore.selectedScope.label }}</p>
    </div>

    <DataTable :columns="columns" :items="dataStore.bills" :searchable="true" search-placeholder="Cari tagihan...">
      <template #empty>
        <p>Belum ada tagihan.</p>
      </template>
      <template #col-totalAmount="{ value }">
        <Money :value="value" />
      </template>
      <template #col-remainingAmount="{ value }">
        <Money :value="value" :class="value > 0 ? 'text-[var(--danger)]' : 'text-emerald-600'" />
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
  { key: 'title', label: 'Tagihan' },
  { key: 'houseNo', label: 'Rumah' },
  { key: 'totalAmount', label: 'Total', type: 'money', align: 'right' },
  { key: 'remainingAmount', label: 'Sisa', type: 'money', align: 'right' },
  { key: 'dueDate', label: 'Jatuh tempo' },
  { key: 'status', label: 'Status', type: 'status' },
];
</script>