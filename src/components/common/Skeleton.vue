<template>
  <div class="animate-pulse space-y-3">
    <div
      v-for="i in count"
      :key="i"
      class="bg-[var(--tint)] rounded-xl"
      :style="{ height: height }"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  count: { type: Number, default: 3 },
  height: { type: String, default: '48px' },
});
</script>
