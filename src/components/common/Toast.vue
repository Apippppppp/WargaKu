<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--ink)] text-white text-xs font-medium shadow-2xl transition-all duration-200 translate-y-0"
    >
      <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
      </svg>
      <span>{{ message }}</span>
      <button @click="visible = false" class="ml-2 text-gray-400 hover:text-white">
        ✕
      </button>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
const message = ref('');
let timer = null;

function showToast(msg) {
  message.value = msg;
  visible.value = true;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    visible.value = false;
  }, 4000);
}

defineExpose({ showToast });
</script>
