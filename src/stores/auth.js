import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // Available demo user profiles
  const users = [
    {
      id: 'usr_1',
      name: 'Budi Santoso',
      email: 'budi@wargaku.id',
      role: 'RESIDENT_HEAD', // Kepala Keluarga
      roleLabel: 'Kepala Keluarga',
      houseNo: 'B-14',
      rt: '03',
      rw: '07',
      permissions: ['VIEW_BILLS', 'PAY_BILLS', 'INVITE_MEMBERS'],
    },
    {
      id: 'usr_2',
      name: 'Siti Aminah',
      email: 'siti@wargaku.id',
      role: 'RESIDENT_MEMBER', // Anggota Keluarga (no pay permission demo option)
      roleLabel: 'Anggota Keluarga',
      houseNo: 'B-14',
      rt: '03',
      rw: '07',
      permissions: ['VIEW_BILLS'],
    },
    {
      id: 'usr_3',
      name: 'Pak Hendra (Bendahara)',
      email: 'hendra@wargaku.id',
      role: 'TREASURER', // Bendahara
      roleLabel: 'Bendahara RT 03',
      rt: '03',
      rw: '07',
      permissions: ['VERIFY_PAYMENTS', 'VIEW_REPORTS', 'MANAGE_FEES'],
    },
    {
      id: 'usr_4',
      name: 'Pak Bambang (Ketua RT 03)',
      email: 'bambang@wargaku.id',
      role: 'RT_ADMIN', // Admin RT
      roleLabel: 'Ketua RT 03',
      rt: '03',
      rw: '07',
      permissions: ['MANAGE_HOUSEHOLDS', 'GENERATE_BILLS', 'MANAGE_ANNOUNCEMENTS', 'VIEW_REPORTS'],
    },
    {
      id: 'usr_5',
      name: 'Pak Gunawan (Ketua RW 07)',
      email: 'gunawan@wargaku.id',
      role: 'RW_ADMIN', // Admin RW
      roleLabel: 'Ketua RW 07',
      rt: 'Semua',
      rw: '07',
      permissions: ['MANAGE_HOUSEHOLDS', 'GENERATE_BILLS', 'MANAGE_ANNOUNCEMENTS', 'VIEW_REPORTS', 'VIEW_RW_RECAP'],
    },
    {
      id: 'usr_6',
      name: 'Super Admin Platform',
      email: 'admin@wargaku.id',
      role: 'PLATFORM_ADMIN', // Platform Admin
      roleLabel: 'Platform Administrator',
      permissions: ['VERIFY_ENV', 'CONFIG_PLATFORM', 'VIEW_AUDIT_LOGS'],
    },
  ];

  const currentUser = ref(users[0]); // Default: Kepala Keluarga (Budi)

  const getDashboardPath = (role = currentUser.value.role) => {
    switch (role) {
      case 'PLATFORM_ADMIN':
        return '/platform';
      case 'RT_ADMIN':
      case 'RW_ADMIN':
        return '/pengurus';
      case 'TREASURER':
        return '/keuangan';
      case 'RESIDENT_HEAD':
      case 'RESIDENT_MEMBER':
      default:
        return '/warga';
    }
  };

  function switchUserRole(userId) {
    const found = users.find((u) => u.id === userId);
    if (found) {
      currentUser.value = found;
    }
  }

  function hasPermission(permission) {
    return currentUser.value.permissions?.includes(permission) ?? false;
  }

  return {
    users,
    currentUser,
    getDashboardPath,
    switchUserRole,
    hasPermission,
  };
});
