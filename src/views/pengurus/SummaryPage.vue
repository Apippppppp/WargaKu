<template>
  <DashboardLayout ref="layoutRef">
    <div class="mb-6">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">
            Ringkasan {{ scopeStore.selectedScope.label }}
          </h1>
          <p class="text-xs text-[var(--muted)] mt-1">Dashboard pengelolaan {{ authStore.currentUser.roleLabel }}</p>
        </div>
        <button @click="showIssueBillModal = true" class="shrink-0 px-4 py-2.5 rounded-xl bg-[var(--blue)] hover:bg-[var(--blue-d)] text-white text-xs font-semibold shadow-sm cursor-pointer">
          Terbitkan tagihan
        </button>
      </div>
    </div>

    <!-- Billing Progress -->
    <section class="mb-8">
      <h2 class="font-heading font-bold text-base text-[var(--ink)] mb-3">Penagihan {{ scopeStore.selectedPeriod }}</h2>
      <div class="bg-white rounded-2xl border border-[var(--line)] p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-[var(--ink)]">{{ activeHouses }} rumah aktif</span>
          <span class="text-xs text-[var(--muted)]">{{ paidCount }} lunas, {{ partialCount }} sebagian, {{ unpaidCount }} belum</span>
        </div>
        <div class="w-full bg-[var(--tint)] h-3 rounded-full overflow-hidden mb-4">
          <div class="bg-[var(--blue)] h-full transition-all duration-400 rounded-full" :style="{ width: progressPct + '%' }"></div>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-[var(--muted)]">Pembayaran: <Money :value="dataStore.financeSummary.totalReceived" class="font-bold text-emerald-600" /></span>
          <span class="text-[var(--muted)]">Sisa: <Money :value="dataStore.financeSummary.totalUnpaid" class="font-bold text-[var(--danger)]" /></span>
        </div>
      </div>
    </section>

    <!-- Two Column: Attention & Draft Announcements -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Need Attention -->
      <section class="bg-white rounded-2xl border border-[var(--line)] p-4">
        <h2 class="font-heading font-bold text-base text-[var(--ink)] mb-3">Perlu perhatian</h2>
        <div v-if="householdsWithArrears.length > 0" class="space-y-2">
          <div class="flex items-center justify-between py-2 border-b border-[var(--surface-2)]">
            <div>
              <div class="text-sm font-semibold text-[var(--ink)]">{{ householdsWithArrears.length }} rumah menunggak lebih dari 1 bulan</div>
              <div class="text-xs text-[var(--danger)]">Total tunggakan: <Money :value="totalArrearsAmount" class="font-bold" /></div>
            </div>
          </div>
          <button class="text-xs font-semibold text-[var(--blue)] hover:underline">Lihat daftar tunggakan</button>
        </div>
        <p v-else class="text-sm text-[var(--muted)]">Tidak ada yang perlu perhatian.</p>
      </section>

      <!-- Draft Announcements -->
      <section class="bg-white rounded-2xl border border-[var(--line)] p-4">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-heading font-bold text-base text-[var(--ink)]">Draf pengumuman</h2>
          <button class="text-xs font-semibold text-[var(--blue)]">+ Buat baru</button>
        </div>
        <div v-if="draftAnnouncements.length > 0" class="space-y-2">
          <div v-for="ann in draftAnnouncements" :key="ann.id" class="flex items-center justify-between py-2 border-b border-[var(--surface-2)]">
            <div>
              <div class="text-sm font-semibold text-[var(--ink)]">{{ ann.title }}</div>
              <div class="text-xs text-[var(--muted)]">{{ ann.date }}</div>
            </div>
            <button class="px-3 py-1 rounded-lg bg-[var(--tint)] text-[10px] font-semibold text-[var(--blue)]">Terbitkan</button>
          </div>
        </div>
        <p v-else class="text-sm text-[var(--muted)]">Tidak ada draf.</p>
      </section>
    </div>

    <!-- Admin RW: Recap per RT -->
    <section v-if="authStore.currentUser.role === 'RW_ADMIN'" class="mt-8">
      <h2 class="font-heading font-bold text-base text-[var(--ink)] mb-3">Rekap per RT</h2>
      <div class="bg-white rounded-2xl border border-[var(--line)] overflow-hidden">
        <table class="w-full text-left hidden md:table">
          <thead class="bg-[var(--surface-2)] border-b border-[var(--line)]">
            <tr>
              <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)]">RT</th>
              <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)] text-right">Rumah Aktif</th>
              <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)] text-right">Tagihan</th>
              <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)] text-right">Diterima</th>
              <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)] text-right">Menunggak</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--line)]">
            <tr v-for="rt in rtRecap" :key="rt.rt" class="hover:bg-[var(--surface-2)]">
              <td class="px-4 py-3 font-semibold text-[var(--ink)]">{{ rt.rt }}</td>
              <td class="px-4 py-3 text-sm text-[var(--ink)] text-right">{{ rt.houses }}</td>
              <td class="px-4 py-3 text-sm text-[var(--ink)] text-right tabular-nums"><Money :value="rt.issued" /></td>
              <td class="px-4 py-3 text-sm text-emerald-600 text-right tabular-nums"><Money :value="rt.received" /></td>
              <td class="px-4 py-3 text-sm text-[var(--danger)] text-right tabular-nums"><Money :value="rt.arrears" /></td>
            </tr>
          </tbody>
        </table>
        <!-- Mobile Recap -->
        <div class="block md:hidden divide-y divide-[var(--line)]">
          <div v-for="rt in rtRecap" :key="rt.rt" class="p-4">
            <div class="font-semibold text-[var(--ink)] mb-1">{{ rt.rt }}</div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div><span class="text-[var(--muted)]">Rumah:</span> <span class="font-semibold">{{ rt.houses }}</span></div>
              <div><span class="text-[var(--muted)]">Tagihan:</span> <span class="font-semibold"><Money :value="rt.issued" /></span></div>
              <div><span class="text-[var(--muted)]">Diterima:</span> <span class="font-semibold text-emerald-600"><Money :value="rt.received" /></span></div>
              <div><span class="text-[var(--muted)]">Menunggak:</span> <span class="font-semibold text-[var(--danger)]"><Money :value="rt.arrears" /></span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Issue Bill Modal -->
    <Teleport to="body">
      <div v-if="showIssueBillModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="showIssueBillModal = false">
        <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl">
          <h3 class="font-heading font-bold text-base text-[var(--ink)] mb-1">Terbitkan Tagihan Baru</h3>
          <p class="text-xs text-[var(--muted)] mb-4">Pilih jenis iuran dan periode.</p>
          <div class="space-y-3 mb-4">
            <div>
              <label class="block text-xs font-semibold text-[var(--ink)] mb-1">Jenis Iuran</label>
              <select v-model="issueBillForm.feeType" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)]">
                <option value="Keamanan">Keamanan</option>
                <option value="Kebersihan">Kebersihan</option>
                <option value="Kas RT">Kas RT</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[var(--ink)] mb-1">Periode</label>
              <select v-model="issueBillForm.period" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)]">
                <option v-for="p in scopeStore.availablePeriods" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
          </div>
          <div class="bg-[var(--surface-2)] rounded-xl p-3 mb-4 text-xs">
            <div class="text-[var(--muted)]">Akan diterbitkan ke 48 rumah.</div>
            <div class="text-[var(--muted)]">2 rumah dilewati (sudah ada tagihan).</div>
          </div>
          <div class="flex gap-2">
            <button @click="showIssueBillModal = false" class="flex-1 py-2.5 rounded-xl border border-[var(--line)] text-xs font-semibold text-[var(--muted)]">Batal</button>
            <button @click="issueBill" class="flex-1 py-2.5 rounded-xl bg-[var(--blue)] text-white text-xs font-semibold">Terbitkan</button>
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
import Money from '@/components/common/Money.vue';

const authStore = useAuthStore();
const scopeStore = useScopeStore();
const dataStore = useDataStore();
const layoutRef = ref(null);

const showIssueBillModal = ref(false);
const issueBillForm = ref({ feeType: 'Keamanan', period: 'Nov 2026' });

const activeHouses = computed(() => dataStore.households.length);
const bills = computed(() => dataStore.bills.filter(b => b.period === scopeStore.selectedPeriod));

const paidCount = computed(() => bills.value.filter(b => b.status === 'PAID').length);
const partialCount = computed(() => bills.value.filter(b => b.status === 'PARTIALLY_PAID').length);
const unpaidCount = computed(() => bills.value.filter(b => b.status === 'UNPAID' || b.status === 'OVERDUE').length);

const progressPct = computed(() => {
  const total = bills.value.length;
  if (!total) return 0;
  return Math.round(((paidCount.value + partialCount.value) / total) * 100);
});

const householdsWithArrears = computed(() => dataStore.households.filter(h => h.arrearsCount > 0));
const totalArrearsAmount = computed(() => householdsWithArrears.value.reduce((sum, h) => sum + h.totalArrears, 0));

const draftAnnouncements = computed(() => dataStore.announcements.filter(a => a.status === 'Draft'));

const rtRecap = ref([
  { rt: 'RT 01', houses: 42, issued: 840000, received: 620000, arrears: 220000 },
  { rt: 'RT 02', houses: 38, issued: 760000, received: 510000, arrears: 250000 },
  { rt: 'RT 03', houses: 48, issued: 960000, received: 720000, arrears: 240000 },
  { rt: 'RT 04', houses: 35, issued: 700000, received: 525000, arrears: 175000 },
]);

function issueBill() {
  dataStore.generateBills(issueBillForm.value);
  showIssueBillModal.value = false;
  layoutRef.value?.toast?.showToast?.('Tagihan berhasil diterbitkan ke 48 rumah');
}
</script>