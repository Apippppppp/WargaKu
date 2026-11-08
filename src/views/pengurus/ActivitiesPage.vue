<template>
  <DashboardLayout ref="layoutRef">
    <div class="mb-6">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Daftar Kegiatan</h1>
          <p class="text-xs text-[var(--muted)] mt-1">{{ scopeStore.selectedScope.label }}</p>
        </div>
        <button @click="showActivityModal = true" class="shrink-0 px-4 py-2.5 rounded-xl bg-[var(--blue)] hover:bg-[var(--blue-d)] text-white text-xs font-semibold shadow-sm cursor-pointer">
          Tambah kegiatan
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <div v-for="act in dataStore.activities" :key="act.id" class="bg-white rounded-2xl border border-[var(--line)] p-4">
        <h3 class="font-semibold text-[var(--ink)] mb-2">{{ act.name }}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--muted)]">
          <div class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ act.schedule }}
          </div>
          <div class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {{ act.location }}
          </div>
          <div class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            PIC: {{ act.pic }}
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showActivityModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="showActivityModal = false">
        <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl">
          <h3 class="font-heading font-bold text-base text-[var(--ink)] mb-4">Tambah Kegiatan</h3>
          <div class="space-y-3 mb-4">
            <input v-model="form.name" placeholder="Nama kegiatan" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)]" />
            <input v-model="form.schedule" placeholder="Jadwal" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)]" />
            <input v-model="form.location" placeholder="Lokasi" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)]" />
            <input v-model="form.pic" placeholder="Penanggung Jawab" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)]" />
          </div>
          <div class="flex gap-2">
            <button @click="showActivityModal = false" class="flex-1 py-2.5 rounded-xl border border-[var(--line)] text-xs font-semibold text-[var(--muted)]">Batal</button>
            <button @click="createActivity" class="flex-1 py-2.5 rounded-xl bg-[var(--blue)] text-white text-xs font-semibold">Simpan</button>
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

const scopeStore = useScopeStore();
const dataStore = useDataStore();
const layoutRef = ref(null);

const showActivityModal = ref(false);
const form = ref({ name: '', schedule: '', location: '', pic: '' });

function createActivity() {
  dataStore.activities.unshift({ id: `act_${Date.now()}`, ...form.value });
  showActivityModal.value = false;
  layoutRef.value?.toast?.showToast?.(' Kegiatan berhasil ditambahkan');
  form.value = { name: '', schedule: '', location: '', pic: '' };
}
</script>