<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors"
    :class="styleClasses"
  >
    <svg v-if="icon === 'check'" class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    <svg v-else-if="icon === 'alert'" class="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
    <span>{{ label }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'bill', // 'bill' | 'payment' | 'membership' | 'org'
  },
});

const config = computed(() => {
  const s = (props.status || '').toUpperCase();
  switch (s) {
    // Bill Statuses
    case 'UNPAID':
      return { label: 'Belum dibayar', class: 'bg-[#f1f4fb] text-[var(--muted)] border border-[var(--line)]', icon: null };
    case 'PARTIALLY_PAID':
      return { label: 'Dibayar sebagian', class: 'bg-[var(--tint)] text-[var(--blue)] border border-[var(--line)]', icon: null };
    case 'PAID':
      return { label: 'Lunas', class: 'bg-[var(--blue)] text-white', icon: 'check' };
    case 'OVERDUE':
      return { label: 'Terlambat', class: 'bg-[var(--danger-bg)] text-[var(--danger)] border border-red-200', icon: 'alert' };
    case 'CANCELLED':
      return { label: 'Dibatalkan', class: 'bg-[#f1f4fb] text-[var(--muted)] line-through border border-[var(--line)]', icon: null };

    // Payment Statuses
    case 'PENDING':
      return { label: 'Menunggu verifikasi', class: 'bg-[var(--tint)] text-[var(--blue)] border border-[var(--line)]', icon: null };
    case 'CONFIRMED':
    case 'VERIFIED':
      return { label: 'Dikonfirmasi', class: 'bg-[var(--blue)] text-white', icon: 'check' };
    case 'REJECTED':
      return { label: 'Ditolak', class: 'bg-[var(--danger-bg)] text-[var(--danger)] border border-red-200', icon: 'alert' };
    case 'FAILED':
      return { label: 'Gagal', class: 'bg-[var(--danger-bg)] text-[var(--danger)] border border-red-200', icon: 'alert' };

    // Membership / Org Statuses
    case 'INVITED':
      return { label: 'Menunggu diterima', class: 'bg-[var(--tint)] text-[var(--blue)]', icon: null };
    case 'ACTIVE':
      return { label: 'Aktif', class: 'bg-[var(--blue)] text-white', icon: 'check' };
    case 'REVOKED':
    case 'EXPIRED':
    case 'SUSPENDED':
      return { label: 'Dicabut / Expired', class: 'bg-[#f1f4fb] text-[var(--muted)]', icon: null };

    default:
      return { label: props.status, class: 'bg-[#f1f4fb] text-[var(--muted)]', icon: null };
  }
});

const label = computed(() => config.value.label);
const styleClasses = computed(() => config.value.class);
const icon = computed(() => config.value.icon);
</script>
