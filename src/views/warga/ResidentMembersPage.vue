<template>
  <DashboardLayout>
    <div class="mb-6">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Anggota Keluarga</h1>
          <p class="text-xs text-[var(--muted)] mt-1">Rumah {{ authStore.currentUser.houseNo }}</p>
        </div>
        <button
          v-if="authStore.currentUser.role === 'RESIDENT_HEAD'"
          @click="showInvite = true"
          class="shrink-0 px-4 py-2.5 rounded-xl bg-[var(--blue)] hover:bg-[var(--blue-d)] text-white text-xs font-semibold shadow-sm cursor-pointer"
        >
          Undang anggota
        </button>
      </div>
    </div>

    <!-- Members List -->
    <div class="bg-white rounded-2xl border border-[var(--line)] divide-y divide-[var(--line)]">
      <!-- Kepala Keluarga -->
      <div class="p-4 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-[var(--blue)] text-white flex items-center justify-center font-bold text-lg shrink-0">
          {{ authStore.currentUser.name.charAt(0) }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-[var(--ink)]">{{ authStore.currentUser.name }}</div>
          <div class="text-xs text-[var(--muted)]">Kepala Keluarga</div>
        </div>
        <StatusChip status="ACTIVE" />
      </div>

      <!-- Anggota (Mock data for demo) -->
      <div class="p-4 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-[var(--surface-2)] text-[var(--ink)] flex items-center justify-center font-bold text-lg shrink-0">
          A
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-[var(--ink)]">Ani Budiati</div>
          <div class="text-xs text-[var(--muted)]">Istri</div>
        </div>
        <StatusChip status="ACTIVE" />
      </div>

      <div class="p-4 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-[var(--surface-2)] text-[var(--ink)] flex items-center justify-center font-bold text-lg shrink-0">
          B
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-[var(--ink)]">Bagus Prasetyo</div>
          <div class="text-xs text-[var(--muted)]">Anak</div>
        </div>
        <StatusChip status="INVITED" />
      </div>
    </div>

    <!-- Invite Modal -->
    <Teleport to="body">
      <div v-if="showInvite" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="showInvite = false">
        <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl">
          <h3 class="font-heading font-bold text-base text-[var(--ink)] mb-1">Undang Anggota Keluarga</h3>
          <p class="text-xs text-[var(--muted)] mb-4">Kirim undangan melalui email.</p>
          <div class="space-y-3 mb-4">
            <input v-model="email" type="email" placeholder="Email" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)]" />
            <input v-model="name" type="text" placeholder="Nama" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)]" />
          </div>
          <div class="flex gap-2">
            <button @click="showInvite = false" class="flex-1 py-2.5 rounded-xl border border-[var(--line)] text-xs font-semibold text-[var(--muted)]">Batal</button>
            <button @click="sendInvite" class="flex-1 py-2.5 rounded-xl bg-[var(--blue)] text-white text-xs font-semibold">Kirim</button>
          </div>
        </div>
      </div>
    </Teleport>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import StatusChip from '@/components/common/StatusChip.vue';

const authStore = useAuthStore();
const showInvite = ref(false);
const email = ref('');
const name = ref('');

function sendInvite() {
  showInvite.value = false;
  email.value = '';
  name.value = '';
}
</script>