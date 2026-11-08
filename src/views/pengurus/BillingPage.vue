<template>
  <DashboardLayout ref="layoutRef">
    <div class="mb-6">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Iuran dan Tagihan</h1>
          <p class="text-xs text-[var(--muted)] mt-1">{{ scopeStore.selectedScope.label }}</p>
        </div>
        <button @click="showFeeModal = true" class="shrink-0 px-4 py-2.5 rounded-xl bg-[var(--blue)] hover:bg-[var(--blue-d)] text-white text-xs font-semibold shadow-sm cursor-pointer">
          Pengaturan jenis iuran
        </button>
      </div>
    </div>

    <!-- Fee Types -->
    <section class="mb-8">
      <h2 class="font-heading font-bold text-base text-[var(--ink)] mb-3">Jenis Iuran Aktif</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="fee in feeTypes" :key="fee.name" class="bg-white rounded-2xl border border-[var(--line)] p-4">
          <div class="flex items-start justify-between mb-2">
            <div>
              <h3 class="font-semibold text-[var(--ink)]">{{ fee.name }}</h3>
              <span class="text-[10px] px-2 py-0.5 rounded bg-[var(--tint)] text-[var(--blue)]">{{ fee.category }}</span>
            </div>
            <button class="text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
              </svg>
            </button>
          </div>
          <div class="text-xl font-bold font-heading text-[var(--ink)] tabular-nums">
            <Money :value="fee.amount" />
          </div>
          <div class="text-xs text-[var(--muted)] mt-1">Periode {{ fee.period }} • Jatuh tempo tgl {{ fee.dueDate }}</div>
        </div>
      </div>
    </section>

    <!-- Bills List -->
    <section>
      <h2 class="font-heading font-bold text-base text-[var(--ink)] mb-3">Riwayat Tagihan</h2>
      <DataTable :columns="columns" :items="dataStore.bills" :searchable="true" search-placeholder="Cari tagihan...">
        <template #empty><p>Belum ada tagihan.</p></template>
        <template #col-totalAmount="{ value }"><Money :value="value" /></template>
        <template #col-status="{ value }"><StatusChip :status="value" /></template>
      </DataTable>
    </section>

    <!-- Fee Settings Modal -->
    <Teleport to="body">
      <div v-if="showFeeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="showFeeModal = false">
        <div class="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl max-h-[80vh] overflow-y-auto">
          <h3 class="font-heading font-bold text-base text-[var(--ink)] mb-4">Pengaturan Jenis Iuran</h3>
          <div class="space-y-3 mb-4">
            <div v-for="(fee, idx) in feeTypes" :key="idx" class="p-3 rounded-xl border border-[var(--line)]">
              <div class="flex justify-between items-start mb-2">
                <span class="font-semibold text-sm text-[var(--ink)]">{{ fee.name }}</span>
                <span class="text-[10px] text-[var(--muted)]">{{ fee.category }}</span>
              </div>
              <div class="flex gap-2">
                <input v-model="fee.amount" type="number" class="flex-1 text-sm p-2 rounded-lg border border-[var(--line)]" />
                <input v-model="fee.dueDate" type="number" class="w-16 text-sm p-2 rounded-lg border border-[var(--line)]" placeholder="Tgl" />
              </div>
            </div>
          </div>
          <p class="text-[10px] text-[var(--muted)] mb-4">Perubahan berlaku untuk tagihan berikutnya.</p>
          <div class="flex gap-2">
            <button @click="showFeeModal = false" class="flex-1 py-2.5 rounded-xl border border-[var(--line)] text-xs font-semibold text-[var(--muted)]">Batal</button>
            <button @click="saveFees" class="flex-1 py-2.5 rounded-xl bg-[var(--blue)] text-white text-xs font-semibold">Simpan</button>
          </div>
        </div>
      </div>
    </Teleport>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useScopeStore } from '@/stores/scope';
import { useDataStore } from '@/stores/data';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import DataTable from '@/components/ui/DataTable.vue';
import StatusChip from '@/components/common/StatusChip.vue';
import Money from '@/components/common/Money.vue';

const scopeStore = useScopeStore();
const dataStore = useDataStore();
const layoutRef = ref(null);

const showFeeModal = ref(false);
const feeTypes = ref([
  { name: 'Iuran Keamanan', category: 'Rutin', amount: 100000, period: 'Bulanan', dueDate: 10 },
  { name: 'Iuran Sampah', category: 'Rutin', amount: 25000, period: 'Bulanan', dueDate: 15 },
  { name: 'Kas RT', category: 'Rutin', amount: 50000, period: 'Bulanan', dueDate: 5 },
]);

const columns = [
  { key: 'title', label: 'Tagihan' },
  { key: 'houseNo', label: 'Rumah' },
  { key: 'totalAmount', label: 'Total', type: 'money', align: 'right' },
  { key: 'dueDate', label: 'Jatuh tempo' },
  { key: 'status', label: 'Status', type: 'status' },
];

function saveFees() {
  showFeeModal.value = false;
  layoutRef.value?.toast?.showToast?.('Pengaturan iuran disimpan');
}
</script>