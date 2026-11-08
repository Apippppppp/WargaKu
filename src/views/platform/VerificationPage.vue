<template>
  <DashboardLayout ref="layoutRef">
    <div class="mb-6">
      <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Verifikasi Lingkungan</h1>
      <p class="text-xs text-[var(--muted)] mt-1">Pantau pendaftaran lingkungan baru</p>
    </div>

    <section>
      <div class="flex items-center gap-2 mb-3">
        <h2 class="font-heading font-bold text-base text-[var(--ink)]">Menunggu verifikasi</h2>
        <span class="px-2 py-0.5 rounded-full bg-[var(--tint)] text-[10px] font-bold text-[var(--blue)]">{{ pendingEnvs.length }}</span>
      </div>

      <div v-if="pendingEnvs.length > 0" class="bg-white rounded-2xl border border-[var(--line)] overflow-hidden">
        <!-- Desktop -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-[var(--surface-2)] border-b border-[var(--line)]">
              <tr>
                <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)]">Nama Lingkungan</th>
                <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)]">Jenis</th>
                <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)]">Pemohon</th>
                <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)]">Diajukan</th>
                <th class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--line)]">
              <tr v-for="env in pendingEnvs" :key="env.id" class="hover:bg-[var(--surface-2)]">
                <td class="px-4 py-3">
                  <div class="font-semibold text-sm text-[var(--ink)]">{{ env.name }}</div>
                  <div class="text-[11px] text-[var(--muted)]">{{ env.totalHouses }} rumah</div>
                </td>
                <td class="px-4 py-3 text-sm text-[var(--ink)]">{{ env.type }}</td>
                <td class="px-4 py-3 text-sm text-[var(--ink)]">{{ env.applicant }}</td>
                <td class="px-4 py-3 text-sm text-[var(--muted)]">{{ env.submittedDate }}</td>
                <td class="px-4 py-3 text-right">
                  <button @click="openDetail(env)" class="px-3 py-1.5 rounded-lg bg-[var(--blue)] text-white text-xs font-semibold cursor-pointer">Tinjau</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile -->
        <div class="block md:hidden divide-y divide-[var(--line)]">
          <div v-for="env in pendingEnvs" :key="env.id" class="p-4">
            <div class="flex justify-between items-start mb-2">
              <div>
                <div class="font-semibold text-sm text-[var(--ink)]">{{ env.name }}</div>
                <div class="text-[11px] text-[var(--muted)]">{{ env.type }} • {{ env.totalHouses }} rumah</div>
              </div>
            </div>
            <div class="text-xs text-[var(--muted)] mb-3">Pemohon: {{ env.applicant }} • {{ env.submittedDate }}</div>
            <button @click="openDetail(env)" class="w-full py-2 rounded-lg bg-[var(--blue)] text-white text-xs font-semibold">Tinjau</button>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl border border-[var(--line)] p-8 text-center">
        <p class="text-sm text-[var(--muted)]">Tidak ada lingkungan yang menunggu verifikasi.</p>
      </div>
    </section>

    <!-- Detail Drawer -->
    <Drawer :show="showDrawer" :title="'Detail ' + selectedEnv?.name" @close="showDrawer = false">
      <div v-if="selectedEnv" class="space-y-4">
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span class="text-[var(--muted)] block">Jenis</span>
            <span class="font-semibold text-[var(--ink)]">{{ selectedEnv.type }}</span>
          </div>
          <div>
            <span class="text-[var(--muted)] block">Jumlah Rumah</span>
            <span class="font-semibold text-[var(--ink)]">{{ selectedEnv.totalHouses }}</span>
          </div>
          <div>
            <span class="text-[var(--muted)] block">Pemohon</span>
            <span class="font-semibold text-[var(--ink)]">{{ selectedEnv.applicant }}</span>
          </div>
          <div>
            <span class="text-[var(--muted)] block">Tanggal Ajuan</span>
            <span class="font-semibold text-[var(--ink)]">{{ selectedEnv.submittedDate }}</span>
          </div>
        </div>
        <div class="pt-3 border-t border-[var(--line)]">
          <p class="text-xs text-[var(--muted)] mb-2">Dokumen persyaratan:</p>
          <div class="space-y-2">
            <div class="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface-2)] text-xs">
              <svg class="w-4 h-4 text-[var(--blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>Surat pengantar RW</span>
            </div>
            <div class="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface-2)] text-xs">
              <svg class="w-4 h-4 text-[var(--blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>Data warga (.xlsx)</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2">
          <button @click="rejectEnv" class="flex-1 py-2.5 rounded-xl border border-[var(--danger)] text-[var(--danger)] text-xs font-semibold cursor-pointer">Tolak</button>
          <button @click="approveEnv" class="flex-1 py-2.5 rounded-xl bg-[var(--blue)] text-white text-xs font-semibold cursor-pointer">Setuju</button>
        </div>
      </template>
    </Drawer>

    <!-- Reject Dialog -->
    <ConfirmDialog
      :show="showRejectDialog"
      title="Tolak Pendaftaran"
      message="Pastikan alasan penolakan jelas agar pemohon dapat mengajukan ulang."
      confirm-text="Tolak"
      :is-danger="true"
      :require-reason="true"
      @confirm="handleReject"
      @cancel="showRejectDialog = false"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDataStore } from '@/stores/data';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import Drawer from '@/components/common/Drawer.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

const dataStore = useDataStore();
const layoutRef = ref(null);

const showDrawer = ref(false);
const showRejectDialog = ref(false);
const selectedEnv = ref(null);

const pendingEnvs = computed(() => dataStore.envVerifications.filter(e => e.status === 'PENDING'));

function openDetail(env) {
  selectedEnv.value = env;
  showDrawer.value = true;
}

function approveEnv() {
  if (selectedEnv.value) {
    dataStore.verifyEnvironment(selectedEnv.value.id, 'VERIFIED');
    showDrawer.value = false;
    layoutRef.value?.toast?.showToast?.('Lingkungan berhasil diverifikasi');
  }
}

function rejectEnv() {
  showDrawer.value = false;
  showRejectDialog.value = true;
}

function handleReject(reason) {
  if (selectedEnv.value && reason) {
    dataStore.verifyEnvironment(selectedEnv.value.id, 'REJECTED', reason);
    layoutRef.value?.toast?.showToast?.('Pendaftaran ditolak');
  }
  showRejectDialog.value = false;
  selectedEnv.value = null;
}
</script>