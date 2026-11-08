<template>
  <div
    class="p-4 rounded-2xl border transition-all duration-150"
    :class="[
      bill.status === 'CANCELLED' ? 'bg-[#fbfcfd] border-[var(--line)] opacity-75' : 'bg-white border-[var(--line)] hover:border-[#b3c7f9]',
    ]"
  >
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <!-- Title & Info -->
      <div class="space-y-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <h4 class="font-semibold text-[15px] text-[var(--ink)] truncate" :class="{ 'line-through text-[var(--muted)]': bill.status === 'CANCELLED' }">
            {{ bill.title }}
          </h4>
          <StatusChip :status="bill.status" />
        </div>
        <p class="text-xs text-[var(--muted)]">
          <span v-if="bill.status === 'OVERDUE'" class="text-[var(--danger)] font-medium">
            Lewat jatuh tempo ({{ bill.dueDate }})
          </span>
          <span v-else>Jatuh tempo {{ bill.dueDate }}</span>
          <span class="mx-1.5">•</span>
          <span>Kategori: {{ bill.category }}</span>
        </p>
      </div>

      <!-- Action & Remaining Amount -->
      <div class="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-dashed border-[var(--line)]">
        <div class="text-left sm:text-right">
          <span class="text-xs text-[var(--muted)] block">
            {{ bill.remainingAmount === 0 ? 'Total' : 'Sisa tagihan' }}
          </span>
          <Money
            :value="bill.remainingAmount === 0 ? bill.totalAmount : bill.remainingAmount"
            class="text-base font-bold text-[var(--ink)]"
            :class="{ 'text-[var(--blue)]': bill.status === 'PARTIALLY_PAID' || bill.status === 'UNPAID', 'line-through text-[var(--muted)]': bill.status === 'CANCELLED' }"
          />
        </div>

        <div v-if="bill.status !== 'CANCELLED' && bill.status !== 'PAID'">
          <button
            v-if="canPay"
            @click="$emit('pay', bill)"
            class="px-4 py-2 rounded-xl bg-[var(--blue)] hover:bg-[var(--blue-d)] active:scale-97 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer min-h-[40px]"
          >
            Bayar
          </button>
          <button
            v-else
            disabled
            title="Hanya kepala keluarga atau anggota yang diizinkan yang bisa membayar."
            class="px-4 py-2 rounded-xl bg-[#e5ebf8] text-[var(--muted)] text-xs font-semibold cursor-not-allowed opacity-75 min-h-[40px]"
          >
            Bayar
          </button>
        </div>
      </div>
    </div>

    <!-- Progress Bar (Only for active bills) -->
    <div v-if="bill.status !== 'CANCELLED'" class="mt-3.5 pt-2 border-t border-[var(--surface-2)]">
      <div class="flex items-center justify-between text-xs text-[var(--muted)] mb-1.5">
        <span>Dibayar: <Money :value="bill.paidAmount" /></span>
        <span>Total: <Money :value="bill.totalAmount" /></span>
      </div>
      <div class="w-full bg-[var(--tint)] h-2 rounded-full overflow-hidden">
        <div
          class="bg-[var(--blue)] h-full transition-all duration-400 ease-out rounded-full"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import StatusChip from '@/components/common/StatusChip.vue';
import Money from '@/components/common/Money.vue';

const props = defineProps({
  bill: {
    type: Object,
    required: true,
  },
  canPay: {
    type: Boolean,
    default: true,
  },
});

defineEmits(['pay']);

const progressPercentage = computed(() => {
  if (!props.bill.totalAmount) return 0;
  const pct = (props.bill.paidAmount / props.bill.totalAmount) * 100;
  return Math.min(100, Math.max(0, pct));
});
</script>
