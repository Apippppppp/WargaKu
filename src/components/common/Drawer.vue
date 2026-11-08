<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-xs transition-opacity duration-240"
      @click.self="close"
    >
      <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          class="w-screen max-w-[440px] bg-white shadow-2xl border-l border-[var(--line)] flex flex-col transform transition-transform duration-240 ease-out translate-x-0"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-5 border-b border-[var(--line)] bg-[var(--surface-2)]">
            <h3 class="text-base font-bold text-[var(--ink)] font-heading">
              {{ title }}
            </h3>
            <button
              @click="close"
              class="p-2 rounded-xl text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] cursor-pointer transition"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-5 space-y-4">
            <slot></slot>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="p-4 border-t border-[var(--line)] bg-white">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: 'Detail' },
});

const emit = defineEmits(['close']);

function close() {
  emit('close');
}

function handleKeyDown(e) {
  if (e.key === 'Escape' && props.show) {
    close();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
