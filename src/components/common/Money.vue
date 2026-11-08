<template>
  <span class="tabular-nums inline-flex items-center font-mono font-medium">
    Rp{{ formattedValue }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
});

const formattedValue = computed(() => {
  if (props.value === undefined || props.value === null || isNaN(props.value)) return '0';
  return Math.round(props.value).toLocaleString('id-ID');
});
</script>
