<template>
  <DashboardLayout ref="layoutRef">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)] leading-tight">
            Rumah {{ authStore.currentUser.houseNo }}, {{ scopeStore.selectedScope.label }}
          </h1>
          <p class="text-xs text-[var(--muted)] mt-1">Selamat datang, {{ authStore.currentUser.name }}</p>
        </div>
        <button
          v-if="authStore.currentUser.role === 'RESIDENT_HEAD'"
          @click="showInviteModal = true"
          class="shrink-0 px-4 py-2.5 rounded-xl bg-[var(--blue)] hover:bg-[var(--blue-d)] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          Undang anggota
        </button>
      </div>
    </div>

    <!-- Section: Tagihan Aktif -->
    <section class="mb-8">
      <h2 class="font-heading font-bold text-base text-[var(--ink)] mb-3">Perlu dibayar</h2>
      <div v-if="unpaidBills.length > 0" class="space-y-3">
        <BillRow
          v-for="bill in unpaidBills"
          :key="bill.id"
          :bill="bill"
          :can-pay="canPay"
          @pay="openPaymentModal"
        />
      </div>
      <div v-else class="bg-white rounded-2xl border border-[var(--line)] p-6 text-center">
        <svg class="w-10 h-10 text-emerald-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm text-[var(--ink)] font-medium">Tidak ada tagihan yang perlu dibayar.</p>
        <p class="text-xs text-[var(--muted)] mt-1">Pembayaran terakhir Anda dikonfirmasi 12 Okt.</p>
      </div>
    </section>

    <!-- Two Column Layout: Riwayat & Pengumuman (Desktop) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Riwayat Terbaru -->
      <section class="bg-white rounded-2xl border border-[var(--line)] p-4">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-heading font-bold text-base text-[var(--ink)]">Riwayat terbaru</h2>
          <router-link to="/warga/riwayat" class="text-xs font-semibold text-[var(--blue)] hover:underline">
            Lihat semua riwayat
          </router-link>
        </div>
        <div v-if="recentTransactions.length > 0" class="space-y-2">
          <div v-for="trx in recentTransactions" :key="trx.id" class="flex items-center justify-between py-2 border-b border-[var(--surface-2)] last:border-0">
            <div class="min-w-0">
              <div class="text-xs text-[var(--muted)]">{{ trx.date }}</div>
              <div class="text-sm font-semibold text-[var(--ink)]">{{ trx.billTitle }}</div>
            </div>
            <div class="text-right shrink-0">
              <Money :value="trx.amount" class="text-sm font-bold text-[var(--ink)]" />
              <StatusChip :status="trx.status" class="mt-1" />
            </div>
          </div>
        </div>
        <p v-else class="text-xs text-[var(--muted)] text-center py-4">Belum ada riwayat transaksi.</p>
      </section>

      <!-- Pengumuman & Kegiatan -->
      <section class="bg-white rounded-2xl border border-[var(--line)] p-4">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-heading font-bold text-base text-[var(--ink)]">Pengumuman dan kegiatan</h2>
          <router-link to="/warga/pengumuman" class="text-xs font-semibold text-[var(--blue)] hover:underline">
            Lihat semua
          </router-link>
        </div>
        <div v-if="dataStore.announcements.length > 0" class="space-y-2">
          <div v-for="ann in dataStore.announcements.slice(0, 3)" :key="ann.id" class="flex items-start gap-3 py-2 border-b border-[var(--surface-2)] last:border-0">
            <div class="w-10 h-10 rounded-lg bg-[var(--tint)] flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-[var(--blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="min-w-0">
              <div class="text-xs text-[var(--muted)]">{{ ann.date }}</div>
              <div class="text-sm font-semibold text-[var(--ink)] truncate">{{ ann.title }}</div>
            </div>
          </div>
        </div>
        <p v-else class="text-xs text-[var(--muted)] text-center py-4">Tidak ada pengumuman.</p>
      </section>
    </div>

    <!-- Payment Modal -->
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
              <select v-model="paymentMethod" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]">
                <option value="online">Online (Simulasi)</option>
                <option value="tunai">Tunai (via Bendahara)</option>
                <option value="transfer">Transfer (via Bendahara)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[var(--ink)] mb-1">Nominal</label>
              <input 
                v-model.number="paymentAmount" 
                type="number" 
                :max="selectedBill?.remainingAmount"
                class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]"
                placeholder="Masukkan nominal"
              />
              <p v-if="paymentAmount > (selectedBill?.remainingAmount || 0)" class="text-[10px] text-[var(--danger)] mt-1">
                Nominal melebihi sisa tagihan
              </p>
            </div>
          </div>

          <Banner v-if="paymentMethod === 'online'" variant="info" class="mb-4 !p-2.5 !text-[10px]">
            Simulasi: tidak ada uang yang diproses.
          </Banner>

          <div class="flex gap-2">
            <button @click="showPaymentModal = false" class="flex-1 py-2.5 rounded-xl border border-[var(--line)] text-xs font-semibold text-[var(--muted)]">
              Batal
            </button>
            <button 
              @click="submitPayment" 
              :disabled="!paymentAmount || paymentAmount <= 0 || paymentAmount > (selectedBill?.remainingAmount || 0)"
              class="flex-1 py-2.5 rounded-xl bg-[var(--blue)] text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Invite Modal -->
    <Teleport to="body">
      <div v-if="showInviteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="showInviteModal = false">
        <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl">
          <h3 class="font-heading font-bold text-base text-[var(--ink)] mb-1">Undang Anggota Keluarga</h3>
          <p class="text-xs text-[var(--muted)] mb-4">Kirim undangan melalui email.</p>
          
          <div class="space-y-3 mb-4">
            <div>
              <label class="block text-xs font-semibold text-[var(--ink)] mb-1">Email</label>
              <input v-model="inviteEmail" type="email" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]" placeholder="nama@email.com" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[var(--ink)] mb-1">Nama</label>
              <input v-model="inviteName" type="text" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)]" placeholder="Nama anggota keluarga" />
            </div>
          </div>

          <div class="flex gap-2">
            <button @click="showInviteModal = false" class="flex-1 py-2.5 rounded-xl border border-[var(--line)] text-xs font-semibold text-[var(--muted)]">
              Batal
            </button>
            <button @click="sendInvite" class="flex-1 py-2.5 rounded-xl bg-[var(--blue)] text-white text-xs font-semibold">
              Kirim undangan
            </button>
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
import StatusChip from '@/components/common/StatusChip.vue';
import Money from '@/components/common/Money.vue';
import Banner from '@/components/common/Banner.vue';

const authStore = useAuthStore();
const scopeStore = useScopeStore();
const dataStore = useDataStore();
const layoutRef = ref(null);

const showPaymentModal = ref(false);
const showInviteModal = ref(false);
const selectedBill = ref(null);
const paymentMethod = ref('online');
const paymentAmount = ref(0);
const inviteEmail = ref('');
const inviteName = ref('');

const unpaidBills = computed(() => {
  return dataStore.bills
    .filter(b => b.houseNo === authStore.currentUser.houseNo && b.status !== 'PAID' && b.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.dueDateRaw) - new Date(b.dueDateRaw));
});

const recentTransactions = computed(() => {
  return dataStore.transactionHistory
    .filter(t => t.houseNo === authStore.currentUser.houseNo)
    .slice(0, 3);
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
    dataStore.submitResidentPayment({
      billId: selectedBill.value.id,
      amount: paymentAmount.value,
      method: paymentMethod.value === 'online' ? 'Online (Simulasi QRIS)' : 
             paymentMethod.value === 'tunai' ? 'Tunai' : 'Transfer'
    });
    showPaymentModal.value = false;
    layoutRef.value?.toast?.showToast?.('Pembayaran berhasil dikirim untuk verifikasi');
  }
}

function sendInvite() {
  showInviteModal.value = false;
  layoutRef.value?.toast?.showToast?.('Undangan berhasil dikirim ke ' + inviteEmail.value);
  inviteEmail.value = '';
  inviteName.value = '';
}
</script>