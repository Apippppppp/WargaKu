import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useScopeStore = defineStore('scope', () => {
  const selectedScope = ref({
    rt: 'RT 03',
    rw: 'RW 07',
    label: 'RT 03 / RW 07',
  });

  const availableScopes = ref([
    { rt: 'RT 01', rw: 'RW 07', label: 'RT 01 / RW 07' },
    { rt: 'RT 02', rw: 'RW 07', label: 'RT 02 / RW 07' },
    { rt: 'RT 03', rw: 'RW 07', label: 'RT 03 / RW 07' },
    { rt: 'RT 04', rw: 'RW 07', label: 'RT 04 / RW 07' },
  ]);

  const selectedPeriod = ref('Nov 2026');
  const availablePeriods = ref(['Nov 2026', 'Okt 2026', 'Sep 2026', 'Agt 2026']);

  function setScope(scopeObj) {
    selectedScope.value = scopeObj;
  }

  function setPeriod(period) {
    selectedPeriod.value = period;
  }

  return {
    selectedScope,
    availableScopes,
    selectedPeriod,
    availablePeriods,
    setScope,
    setPeriod,
  };
});
