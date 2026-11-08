<template>
  <DashboardLayout ref="layoutRef">
    <div class="mb-6">
      <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Konfigurasi Platform</h1>
      <p class="text-xs text-[var(--muted)] mt-1">Pengaturan sistem WargaKu</p>
    </div>

    <div class="space-y-6 max-w-2xl">
      <section class="bg-white rounded-2xl border border-[var(--line)] p-5">
        <h2 class="font-heading font-bold text-base text-[var(--ink)] mb-4">Umum</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-[var(--ink)] mb-1">Nama Platform</label>
            <input v-model="config.platformName" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)]" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--ink)] mb-1">Email Kontak</label>
            <input v-model="config.contactEmail" type="email" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)]" />
          </div>
        </div>
      </section>

      <section class="bg-white rounded-2xl border border-[var(--line)] p-5">
        <h2 class="font-heading font-bold text-base text-[var(--ink)] mb-4">Pembayaran</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-semibold text-[var(--ink)]">Mode Simulasi</div>
              <div class="text-xs text-[var(--muted)]">Tidak memproses pembayaran nyata</div>
            </div>
            <button @click="config.simulatedMode = !config.simulatedMode" class="w-12 h-6 rounded-full transition-colors" :class="config.simulatedMode ? 'bg-[var(--blue)]' : 'bg-[var(--line)]'">
              <div class="w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform" :class="config.simulatedMode ? 'translate-x-6' : 'translate-x-0.5'"></div>
            </button>
          </div>
          <div>
            <label class="block text-xs font-semibold text-[var(--ink)] mb-1">Biaya Admin (%)</label>
            <input v-model.number="config.adminFee" type="number" class="w-24 text-sm p-2.5 rounded-xl border border-[var(--line)]" />
          </div>
        </div>
      </section>

      <button @click="saveConfig" class="px-6 py-2.5 rounded-xl bg-[var(--blue)] hover:bg-[var(--blue-d)] text-white text-xs font-semibold shadow-sm cursor-pointer">
        Simpan Perubahan
      </button>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';

const layoutRef = ref(null);
const config = ref({
  platformName: 'WargaKu',
  contactEmail: 'admin@wargaku.id',
  simulatedMode: true,
  adminFee: 0,
});

function saveConfig() {
  layoutRef.value?.toast?.showToast?.('Konfigurasi disimpan');
}
</script>