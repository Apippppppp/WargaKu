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
        <div class="text-xs text-[var(--muted)] mb-1">Total Tagihan Terbit</div>
        <div class="text-2xl font-bold font-heading text-[var(--ink)] tabular-nums">
          <Money :value="dataStore.financeSummary.totalIssued" />
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-[var(--line)] p-5">
        <div class="text-xs text-[var(--muted)] mb-1">Total Diterima</div>
        <div class="text-2xl font-bold font-heading text-emerald-600 tabular-nums">
          <Money :value="dataStore.financeSummary.totalReceived" />
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-[var(--line)] p-5">
        <div class="text-xs text-[var(--muted)] mb-1">Total Belum Dibayar</div>
        <div class="text-2xl font-bold font-heading text-[var(--danger)] tabular-nums">
          <Money :value="dataStore.financeSummary.totalUnpaid" />
        </div>
      </div>
    </div>

    <!-- Households with Arrears -->
    <section>
      <h2 class="font-heading font-bold text-base text-[var(--ink)] mb-3">Rumah Menunggak</h2>
      <div class="bg-white rounded-2xl border border-[var(--line)] overflow-hidden">
        <table class="w-full text-left hidden md:table">
          <thead class="bg-[var(--surface-2)] border-b border-[var(--line)]">
            <tr>
              <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)]">Rumah</th>
              <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)]">Kepala Keluarga</th>
              <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)]">Tunggakan</th>
              <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)] text-right">Total Tunggakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--line)]">
            <tr v-for="h in householdsWithArrears" :key="h.id" class="hover:bg-[var(--surface-2)]">
              <td class="px-4 py-3 font-semibold text-[var(--ink)]">{{ h.houseNo }}</td>
              <td class="px-4 py-3 text-sm text-[var(--ink)]">{{ h.headName }}</td>
              <td class="px-4 py-3 text-sm text-[var(--danger)]">{{ h.arrearsCount }} bulan</td>
              <td class="px-4 py-3 text-sm font-bold text-[var(--danger)] text-right tabular-nums">
                <Money :value="h.totalArrears" />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Mobile -->
        <div class="block md:hidden divide-y divide-[var(--line)]">
          <div v-for="h in householdsWithArrears" :key="h.id" class="p-4">
            <div class="flex justify-between items-start mb-1">
              <span class="font-semibold text-[var(--ink)]">{{ h.houseNo }}</span>
              <Money :value="h.totalArrears" class="font-bold text-[var(--danger)]" />
            </div>
            <div class="text-xs text-[var(--muted)]">{{ h.headName }}</div>
            <div class="text-xs text-[var(--danger)]">{{ h.arrearsCount }} bulan menunggak</div>
          </div>
        </div>

        <div v-if="householdsWithArrears.length === 0" class="p-8 text-center">
          <p class="text-sm text-[var(--muted)]">Tidak ada tunggakan pada periode ini.</p>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>

<script setup>
import { computed } from 'vue';
import { useScopeStore } from '@/stores/scope';
import { useDataStore } from '@/stores/data';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import Money from '@/components/common/Money.vue';

const scopeStore = useScopeStore();
const dataStore = useDataStore();

const householdsWithArrears = computed(() => {
  return dataStore.households.filter(h => h.arrearsCount > 0);
});
</script>