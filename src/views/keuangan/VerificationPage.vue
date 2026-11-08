<template>
  <DashboardLayout ref="layoutRef">
    <div class="mb-6">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Verifikasi Pembayaran</h1>
          <p class="text-xs text-[var(--muted)] mt-1">{{ scopeStore.selectedScope.label }}</p>
        </div>
        <button @click="showCashModal = true" class="shrink-0 px-4 py-2.5 rounded-xl bg-[var(--blue)] hover:bg-[var(--blue-d)] text-white text-xs font-semibold shadow-sm cursor-pointer">
          Catat tunai
        </button>
      </div>
    </div>

    <!-- Pending Queue -->
    <section class="mb-8">
      <div class="flex items-center gap-2 mb-3">
        <h2 class="font-heading font-bold text-base text-[var(--ink)]">Menunggu verifikasi</h2>
        <span class="px-2 py-0.5 rounded-full bg-[var(--tint)] text-[10px] font-bold text-[var(--blue)]">{{ dataStore.pendingPayments.length }}</span>
      </div>
      
      <div v-if="dataStore.pendingPayments.length > 0" class="bg-white rounded-2xl border border-[var(--line)] overflow-hidden">
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-[var(--surface-2)] border-b border-[var(--line)]">
              <tr>
                <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)]">Rumah</th>
                <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)]">Tagihan</th>
                <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)]">Metode</th>
                <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)] text-right">Nominal</th>
                <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--line)]">
              <tr v-for="payment in dataStore.pendingPayments" :key="payment.id" class="hover:bg-[var(--surface-2)] transition-colors">
                <td class="px-4 py-3">
                  <div class="font-semibold text-sm text-[var(--ink)]">{{ payment.houseNo }}</div>
                  <div class="text-[11px] text-[var(--muted)]">{{ payment.residentName }}</div>
                </td>
                <td class="px-4 py-3 text-sm text-[var(--ink)]">{{ payment.billTitle }}</td>
                <td class="px-4 py-3 text-sm text-[var(--muted)]">{{ payment.method }}</td>
                <td class="px-4 py-3 text-sm font-bold text-[var(--ink)] text-right tabular-nums">
                  <Money :value="payment.amount" />
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="rejectPayment(payment)" class="px-3 py-1.5 rounded-lg border border-[var(--danger)] text-[var(--danger)] text-xs font-semibold hover:bg-[var(--danger-bg)] cursor-pointer">Tolak</button>
                    <button @click="confirmPayment(payment)" class="px-3 py-1.5 rounded-lg bg-[var(--blue)] text-white text-xs font-semibold hover:bg-[var(--blue-d)] cursor-pointer">Konfirmasi</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="block md:hidden divide-y divide-[var(--line)]">
          <div v-for="payment in dataStore.pendingPayments" :key="payment.id" class="p-4 space-y-3">
            <div class="flex items-start justify-between">
              <div>
                <div class="font-semibold text-sm text-[var(--ink)]">{{ payment.houseNo }} — {{ payment.residentName }}</div>
                <div class="text-[11px] text-[var(--muted)]">{{ payment.billTitle }}</div>
              </div>
              <Money :value="payment.amount" class="font-bold text-[var(--ink)]" />
            </div>
            <div class="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{{ payment.method }}</span>
              <span>{{ payment.date }}</span>
            </div>
            <div class="flex gap-2 pt-2 border-t border-[var(--surface-2)]">
              <button @click="rejectPayment(payment)" class="flex-1 py-2 rounded-lg border border-[var(--danger)] text-[var(--danger)] text-xs font-semibold">Tolak</button>
              <button @click="confirmPayment(payment)" class="flex-1 py-2 rounded-lg bg-[var(--blue)] text-white text-xs font-semibold">Konfirmasi</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="bg-white rounded-2xl border border-[var(--line)] p-8 text-center">
        <p class="text-sm text-[var(--muted)]">Tidak ada pembayaran yang menunggu verifikasi.</p>
      </div>
    </section>

    <!-- Finance Summary (3 Total Dipisah) -->
    <section>
      <h2 class="font-heading font-bold text-base text-[var(--ink)] mb-3">Periode {{ scopeStore.selectedPeriod }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-[var(--line)] p-4">
          <div class="text-xs text-[var(--muted)] mb-1">Tagihan terbit</div>
          <div class="text-xl font-bold font-heading text-[var(--ink)] tabular-nums">
            <Money :value="dataStore.financeSummary.totalIssued" />
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-[var(--line)] p-4">
          <div class="text-xs text-[var(--muted)] mb-1">Uang diterima</div>
          <div class="text-xl font-bold font-heading text-emerald-600 tabular-nums">
            <Money :value="dataStore.financeSummary.totalReceived" />
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-[var(--line)] p-4">
          <div class="text-xs text-[var(--muted)] mb-1">Belum dibayar</div>
          <div class="text-xl font-bold font-heading text-[var(--danger)] tabular-nums">
            <Money :value="dataStore.financeSummary.totalUnpaid" />
          </div>
        </div>
      </div>
    </section>

    <!-- Reject Dialog -->
    <ConfirmDialog
      :show="showRejectDialog"
      title="Tolak Pembayaran"
      message="Pastikan bukti pembayaran tidak valid sebelum menolak."
      confirm-text="Tolak"
      :is-danger="true"
      :require-reason="true"
      @confirm="handleReject"
      @cancel="showRejectDialog = false"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useScopeStore } from '@/stores/scope';
import { useDataStore } from '@/stores/data';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import Money from '@/components/common/Money.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

const scopeStore = useScopeStore();
const dataStore = useDataStore();
const layoutRef = ref(null);

const showCashModal = ref(false);
const showRejectDialog = ref(false);
const selectedPayment = ref(null);

function confirmPayment(payment) {
  dataStore.confirmPayment(payment.id);
  layoutRef.value?.toast?.showToast?.('Pembayaran dikonfirmasi');
}

function rejectPayment(payment) {
  selectedPayment.value = payment;
  showRejectDialog.value = true;
}

function handleReject(reason) {
  if (selectedPayment.value && reason) {
    dataStore.rejectPayment(selectedPayment.value.id, reason);
    layoutRef.value?.toast?.showToast?.('Pembayaran ditolak');
  }
  showRejectDialog.value = false;
  selectedPayment.value = null;
}
</script>