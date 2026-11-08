<template>
  <div
    class="px-4 py-3 rounded-xl border flex items-start gap-3"
    :class="[variant === 'info' ? 'bg-[var(--tint)] border-[var(--line)] text-[var(--blue)]' : variant === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' : variant === 'danger' ? 'bg-[var(--danger-bg)] border-red-200 text-[var(--danger)]' : 'bg-[var(--surface-2)] border-[var(--line)] text-[var(--ink)]']"
  >
    <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path v-if="variant === 'info'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path v-else-if="variant === 'warning'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div class="text-xs font-medium leading-relaxed">
      <strong v-if="title" class="block mb-0.5">{{ title }}</strong>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'info' }, // info | warning | danger | neutral
  title: { type: String, default: '' },
});
</script>