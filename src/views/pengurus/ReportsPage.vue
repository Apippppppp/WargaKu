<template>
  <DashboardLayout>
    <div class="mb-6">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Laporan</h1>
          <p class="text-xs text-[var(--muted)] mt-1">{{ scopeStore.selectedScope.label }}</p>
        </div>
        <button class="shrink-0 px-4 py-2.5 rounded-xl bg-[var(--blue)] hover:bg-[var(--blue-d)] text-white text-xs font-semibold shadow-sm cursor-pointer">
          Ekspor ke Excel
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="bg-white rounded-2xl border border-[var(--line)] p-5">
        <div class="text-xs text-[var(--muted)] mb-1">Tagihan Terbit</div>
        <div class="text-2xl font-bold font-heading text-[var(--ink)] tabular-nums">
          <Money :value="dataStore.financeSummary.totalIssued" />
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-[var(--line)] p-5">
        <div class="text-xs text-[var(--muted)] mb-1">Uang Diterima</div>
        <div class="text-2xl font-bold font-heading text-emerald-600 tabular-nums">
          <Money :value="dataStore.financeSummary.totalReceived" />
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-[var(--line)] p-5">
        <div class="text-xs text-[var(--muted)] mb-1">Belum Dibayar</div>
        <div class="text-2xl font-bold font-heading text-[var(--danger)] tabular-nums">
          <Money :value="dataStore.financeSummary.totalUnpaid" />
        </div>
      </div>
    </div>

    <!-- Arrears Table -->
    <section>
      <h2 class="font-heading font-bold text-base text-[var(--ink)] mb-3">Daftar Tunggakan</h2>
      <DataTable :columns="columns" :items="dataStore.households.filter(h => h.arrearsCount > 0)" :searchable="true" search-placeholder="Cari rumah...">
        <template #empty><p>Tidak ada tunggakan pada periode ini.</p></template>
        <template #col-totalArrears="{ value }"><Money :value="value" class="text-[var(--danger)] font-bold" /></template>
        <template #col-arrearsCount="{ value }"><span class="text-[var(--danger)] font-semibold">{{ value }}</span></template>
      </DataTable>
    </section>
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
  { key: 'houseNo', label: 'Rumah' },
  { key: 'headName', label: 'Kepala Keluarga' },
  { key: 'phone', label: 'Telepon' },
  { key: 'arrearsCount', label: 'Bulan', align: 'right' },
  { key: 'totalArrears', label: 'Total', type: 'money', align: 'right' },
];
</script>