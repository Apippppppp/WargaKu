<template>
  <div class="space-y-3">
    <!-- Filters Bar -->
    <div v-if="searchable || hasFilters" class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[var(--surface-2)] p-3 rounded-2xl border border-[var(--line)]">
      <div class="relative flex-1 min-w-[200px]" v-if="searchable">
        <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--line)] bg-white text-[var(--ink)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)] transition"
        />
      </div>

      <slot name="filters"></slot>
    </div>

    <!-- Desktop Table (>=768px) -->
    <div class="hidden md:block overflow-x-auto rounded-2xl border border-[var(--line)] bg-white">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-[var(--surface-2)] border-b border-[var(--line)]">
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 text-[13px] font-semibold text-[var(--muted)] tracking-tight whitespace-nowrap"
              :class="[col.align === 'right' ? 'text-right' : 'text-left']"
            >
              {{ col.label }}
            </th>
            <th v-if="$slots.actions || hasActions" class="px-4 py-3 text-right text-[13px] font-semibold text-[var(--muted)] whitespace-nowrap">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--line)]">
          <tr v-if="filteredItems.length === 0">
            <td :colspan="columns.length + 1" class="py-12 text-center text-sm text-[var(--muted)]">
              <slot name="empty">
                {{ emptyText }}
              </slot>
            </td>
          </tr>
          <tr
            v-for="(item, idx) in filteredItems"
            :key="item.id || idx"
            class="h-[52px] hover:bg-[var(--surface-2)] transition-colors text-sm"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 whitespace-nowrap"
              :class="[col.align === 'right' ? 'text-right tabular-nums' : 'text-left']"
            >
              <slot :name="`col-${col.key}`" :item="item" :value="item[col.key]">
                <template v-if="col.type === 'money'">
                  <Money :value="item[col.key]" />
                </template>
                <template v-else-if="col.type === 'status'">
                  <StatusChip :status="item[col.key]" />
                </template>
                <template v-else>
                  {{ item[col.key] }}
                </template>
              </slot>
            </td>
            <td v-if="$slots.actions || hasActions" class="px-4 py-3 text-right whitespace-nowrap">
              <slot name="actions" :item="item"></slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Stacked Card List (<768px) -->
    <div class="block md:hidden space-y-2.5">
      <div v-if="filteredItems.length === 0" class="p-8 text-center bg-white rounded-2xl border border-[var(--line)] text-sm text-[var(--muted)]">
        <slot name="empty">
          {{ emptyText }}
        </slot>
      </div>
      <div
        v-for="(item, idx) in filteredItems"
        :key="item.id || idx"
        class="bg-white p-4 rounded-2xl border border-[var(--line)] space-y-2.5 shadow-2xs"
      >
        <div class="flex items-start justify-between gap-2 border-b border-[var(--surface-2)] pb-2.5">
          <div>
            <div class="font-semibold text-sm text-[var(--ink)]">
              <slot name="mobile-title" :item="item">
                {{ item[columns[0]?.key] }}
              </slot>
            </div>
            <div class="text-xs text-[var(--muted)] mt-0.5">
              <slot name="mobile-subtitle" :item="item">
                {{ item[columns[1]?.key] }}
              </slot>
            </div>
          </div>
          <div>
            <slot name="mobile-badge" :item="item">
              <StatusChip v-if="item.status" :status="item.status" />
            </slot>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs py-1">
          <div v-for="col in columns.slice(2)" :key="col.key">
            <span class="text-[var(--muted)] block text-[11px] font-medium">{{ col.label }}</span>
            <span class="text-[var(--ink)] font-semibold">
              <slot :name="`col-${col.key}`" :item="item" :value="item[col.key]">
                <template v-if="col.type === 'money'">
                  <Money :value="item[col.key]" />
                </template>
                <template v-else>
                  {{ item[col.key] }}
                </template>
              </slot>
            </span>
          </div>
        </div>

        <div v-if="$slots.actions || hasActions" class="pt-2 border-t border-[var(--surface-2)] flex items-center justify-end gap-2">
          <slot name="actions" :item="item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import StatusChip from '@/components/common/StatusChip.vue';
import Money from '@/components/common/Money.vue';

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  searchable: {
    type: Boolean,
    default: true,
  },
  searchPlaceholder: {
    type: String,
    default: 'Cari data...',
  },
  hasFilters: {
    type: Boolean,
    default: false,
  },
  hasActions: {
    type: Boolean,
    default: true,
  },
  emptyText: {
    type: String,
    default: 'Tidak ada data ditemukan.',
  },
});

const searchQuery = ref('');

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) return props.items;
  const q = searchQuery.value.toLowerCase();
  return props.items.filter((item) =>
    Object.values(item).some((val) => String(val).toLowerCase().includes(q))
  );
});
</script>
