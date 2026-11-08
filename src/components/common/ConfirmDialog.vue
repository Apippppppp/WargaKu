<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      @click.self="handleCancel"
    >
      <div
        class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[var(--line)] transform transition-all duration-200 translate-y-0 scale-100"
      >
        <h3 class="text-lg font-bold text-[var(--ink)] font-heading">
          {{ title }}
        </h3>
        <p class="text-xs text-[var(--muted)] mt-2 leading-relaxed">
          {{ message }}
        </p>

        <!-- Mandatory reason textarea for rejection or destructive actions -->
        <div v-if="requireReason" class="mt-4">
          <label class="block text-xs font-semibold text-[var(--ink)] mb-1">
            Alasan <span class="text-[var(--danger)]">*</span>
          </label>
          <textarea
            v-model="reasonText"
            rows="3"
            placeholder="Tuliskan alasan penolakan/pembatalan di sini..."
            class="w-full text-xs p-3 rounded-xl border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)] transition"
          ></textarea>
          <p v-if="errorMsg" class="text-[11px] text-[var(--danger)] mt-1 font-medium">
            {{ errorMsg }}
          </p>
        </div>

        <div class="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-[var(--surface-2)]">
          <button
            @click="handleCancel"
            class="px-4 py-2 rounded-xl border border-[var(--line)] bg-white text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] text-xs font-semibold cursor-pointer transition min-h-[40px]"
          >
            Batal
          </button>
          <button
            @click="handleConfirm"
            :class="[
              isDanger
                ? 'bg-[var(--danger)] hover:bg-red-700 text-white'
                : 'bg-[var(--blue)] hover:bg-[var(--blue-d)] text-white',
            ]"
            class="px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition active:scale-97 min-h-[40px]"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: 'Konfirmasi Tindakan' },
  message: { type: String, default: 'Apakah Anda yakin ingin melanjutkan?' },
  confirmText: { type: String, default: 'Konfirmasi' },
  isDanger: { type: Boolean, default: false },
  requireReason: { type: Boolean, default: false },
});

const emit = defineEmits(['confirm', 'cancel']);

const reasonText = ref('');
const errorMsg = ref('');

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      reasonText.value = '';
      errorMsg.value = '';
    }
  }
);

function handleConfirm() {
  if (props.requireReason && !reasonText.value.trim()) {
    errorMsg.value = 'Alasan wajib diisi untuk melanjutkan.';
    return;
  }
  emit('confirm', reasonText.value.trim());
}

function handleCancel() {
  emit('cancel');
}
</script>
