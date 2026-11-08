<template>
  <DashboardLayout ref="layoutRef">
    <div class="mb-6">
      <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Tagihan</h1>
      <p class="text-xs text-[var(--muted)] mt-1">Rumah {{ authStore.currentUser.houseNo }}, {{ scopeStore.selectedScope.label }}</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-2 mb-4">
      <button
        v-for="status in statusFilters"
        :key="status.value"
        @click="activeFilter = status.value"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
        :class="activeFilter === status.value 
          ? 'bg-[var(--blue)] text-white' 
          : 'bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)]'"
      >
        {{ status.label }}
      </button>
    </div>

    <!-- Bills List -->
    <div v-if="filteredBills.length > 0" class="space-y-3">
      <BillRow
        v-for="bill in filteredBills"
        :key="bill.id"
        :bill="bill"
        :can-pay="canPay"
        @pay="openPaymentModal"
      />
    </div>
    <div v-else class="bg-white rounded-2xl border border-[var(--line)] p-8 text-center">
      <p class="text-sm text-[var(--ink)]">Tidak ada tagihan dengan status "{{ activeFilter }}".</p>
    </div>

    <!-- Payment Modal (Same as Home) -->
    <Teleport to="body">
      <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="showPaymentModal = false">
        <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl">
          <h3 class="font-heading font-bold text-base text-[var(--ink)] mb-1">Bayar Tagihan</h3>
          <p class="text-xs text-[var(--muted)] mb-4">{{ selectedBill?.title }}</p>

          <div class="bg-[var(--surface-2)] rounded-xl p-3 mb-4">
            <div class="flex justify-between text-xs text-[var(--muted)] mb-1">
              <span>Sisa tagihan</span>
              <span>Total tagihan</span>
            </div>
            <div class="flex justify-between font-bold text-[var(--ink)]">
              <Money :value="selectedBill?.remainingAmount || 0" />
              <Money :value="selectedBill?.totalAmount || 0" />
            </div>
          </div>

          <div class="space-y-3 mb-4">
            <div>
              <label class="block text-xs font-semibold text-[var(--ink)] mb-1">Metode pembayaran</label>
              <select v-model="paymentMethod" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)] text-[var(--ink)]">
                <option value="online">Online (Simulasi)</option>
                <option value="tunai">Tunai (via Bendahara)</option>
                <option value="transfer">Transfer (via Bendahara)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[var(--ink)] mb-1">Nominal</label>
              <input v-model.number="paymentAmount" type="number" :max="selectedBill?.remainingAmount" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)] text-[var(--ink)]" />
            </div>
          </div>

          <Banner v-if="paymentMethod === 'online'" variant="info" class="mb-4 !p-2.5 !text-[10px]">
            Simulasi: tidak ada uang yang diproses.
          </Banner>

          <div class="flex gap-2">
            <button @click="showPaymentModal = false" class="flex-1 py-2.5 rounded-xl border border-[var(--line)] text-xs font-semibold text-[var(--muted)]">Batal</button>
            <button @click="submitPayment" :disabled="!paymentAmount || paymentAmount <= 0" class="flex-1 py-2.5 rounded-xl bg-[var(--blue)] text-white text-xs font-semibold disabled:opacity-50">Kirim</button>
          </div>
        </div>
      </div>
    </Teleport>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useScopeStore } from '@/stores/scope';
import { useDataStore } from '@/stores/data';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import BillRow from '@/components/ui/BillRow.vue';
import Money from '@/components/common/Money.vue';
import Banner from '@/components/common/Banner.vue';

const authStore = useAuthStore();
const scopeStore = useScopeStore();
const dataStore = useDataStore();

const layoutRef = ref(null);
const activeFilter = ref('semua');
const showPaymentModal = ref(false);
const selectedBill = ref(null);
const paymentMethod = ref('online');
const paymentAmount = ref(0);

const statusFilters = [
  { label: 'Semua', value: 'semua' },
  { label: 'Belum dibayar', value: 'UNPAID' },
  { label: 'Dibayar sebagian', value: 'PARTIALLY_PAID' },
  { label: 'Lunas', value: 'PAID' },
  { label: 'Terlambat', value: 'OVERDUE' },
];

const filteredBills = computed(() => {
  let bills = dataStore.bills.filter(b => b.houseNo === authStore.currentUser.houseNo);
  if (activeFilter.value !== 'semua') {
    bills = bills.filter(b => b.status === activeFilter.value);
  }
  return bills.sort((a, b) => new Date(b.dueDateRaw) - new Date(a.dueDateRaw));
});

const canPay = computed(() => {
  return authStore.currentUser.role === 'RESIDENT_HEAD' || 
    (authStore.currentUser.role === 'RESIDENT_MEMBER' && authStore.currentUser.permissions.includes('PAY_BILLS'));
});

function openPaymentModal(bill) {
  selectedBill.value = bill;
  paymentAmount.value = bill.remainingAmount;
  showPaymentModal.value = true;
}

function submitPayment() {
  if (selectedBill.value && paymentAmount.value > 0) {
    dataStore.submitResidentPayment({ billId: selectedBill.value.id, amount: paymentAmount.value, method: paymentMethod.value });
    showPaymentModal.value = false;
    layoutRef.value?.toast?.showToast?.('Pembayaran berhasil dikirim untuk verifikasi');
  }
}
</script>