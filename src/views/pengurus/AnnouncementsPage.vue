<template>
  <DashboardLayout ref="layoutRef">
    <div class="mb-6">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="font-heading font-bold text-2xl sm:text-[28px] text-[var(--ink)]">Pengumuman</h1>
          <p class="text-xs text-[var(--muted)] mt-1">{{ scopeStore.selectedScope.label }}</p>
        </div>
        <button @click="showAnnouncementModal = true" class="shrink-0 px-4 py-2.5 rounded-xl bg-[var(--blue)] hover:bg-[var(--blue-d)] text-white text-xs font-semibold shadow-sm cursor-pointer">
          Buat pengumuman
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <div v-for="ann in dataStore.announcements" :key="ann.id" class="bg-white rounded-2xl border border-[var(--line)] p-4">
        <div class="flex items-start justify-between gap-3 mb-2">
          <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold" :class="ann.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
            {{ ann.status }}
          </span>
          <span class="text-xs text-[var(--muted)]">{{ ann.date }}</span>
        </div>
        <h3 class="font-semibold text-[var(--ink)] mb-1">{{ ann.title }}</h3>
        <p v-if="ann.location" class="text-xs text-[var(--muted)] flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ ann.location }}
        </p>
      </div>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <div v-if="showAnnouncementModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="showAnnouncementModal = false">
        <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl">
          <h3 class="font-heading font-bold text-base text-[var(--ink)] mb-4">Buat Pengumuman</h3>
          <div class="space-y-3 mb-4">
            <input v-model="form.title" placeholder="Judul" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)]" />
            <input v-model="form.location" placeholder="Lokasi (opsional)" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)]" />
            <input v-model="form.date" type="date" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)]" />
            <select v-model="form.category" class="w-full text-sm p-2.5 rounded-xl border border-[var(--line)]">
              <option value="Informasi">Informasi</option>
              <option value="Undangan">Undangan</option>
              <option value="Peringatan">Peringatan</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button @click="showAnnouncementModal = false" class="flex-1 py-2.5 rounded-xl border border-[var(--line)] text-xs font-semibold text-[var(--muted)]">Batal</button>
            <button @click="createAnnouncement" class="flex-1 py-2.5 rounded-xl bg-[var(--blue)] text-white text-xs font-semibold">Publikasi</button>
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

const showAnnouncementModal = ref(false);
const form = ref({ title: '', location: '', date: '', category: 'Informasi' });

function createAnnouncement() {
  dataStore.announcements.unshift({
    id: `ann_${Date.now()}`,
    title: form.value.title,
    location: form.value.location,
    date: new Date(form.value.date).toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }),
    category: form.value.category,
    status: 'Published',
  });
  showAnnouncementModal.value = false;
  layoutRef.value?.toast?.showToast?.('Pengumuman berhasil dipublikasi');
  form.value = { title: '', location: '', date: '', category: 'Informasi' };
}
</script>