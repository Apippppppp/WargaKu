import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Views
import LoginPage from '@/views/auth/LoginPage.vue';
import ResidentHomePage from '@/views/warga/ResidentHomePage.vue';
import ResidentBillsPage from '@/views/warga/ResidentBillsPage.vue';
import ResidentHistoryPage from '@/views/warga/ResidentHistoryPage.vue';
import ResidentMembersPage from '@/views/warga/ResidentMembersPage.vue';
import ResidentAnnouncementsPage from '@/views/warga/ResidentAnnouncementsPage.vue';
import VerificationPage from '@/views/keuangan/VerificationPage.vue';
import TreasurerBillsPage from '@/views/keuangan/TreasurerBillsPage.vue';
import TransactionsPage from '@/views/keuangan/TransactionsPage.vue';
import ReportsPage from '@/views/keuangan/ReportsPage.vue';
import SummaryPage from '@/views/pengurus/SummaryPage.vue';
import HouseholdsPage from '@/views/pengurus/HouseholdsPage.vue';
import BillingPage from '@/views/pengurus/BillingPage.vue';
import PengurusReportsPage from '@/views/pengurus/ReportsPage.vue';
import AnnouncementsPage from '@/views/pengurus/AnnouncementsPage.vue';
import ActivitiesPage from '@/views/pengurus/ActivitiesPage.vue';
import AuditLogPage from '@/views/pengurus/AuditLogPage.vue';
import PlatformVerificationPage from '@/views/platform/VerificationPage.vue';
import ActiveEnvPage from '@/views/platform/ActiveEnvPage.vue';
import ConfigPage from '@/views/platform/ConfigPage.vue';
import PlatformAuditLogPage from '@/views/platform/PlatformAuditLogPage.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  // Warga Routes (Kepala Keluarga & Anggota)
  {
    path: '/warga',
    name: 'WargaHome',
    component: ResidentHomePage,
    meta: { roles: ['RESIDENT_HEAD', 'RESIDENT_MEMBER'] },
  },
  {
    path: '/warga/tagihan',
    name: 'WargaTagihan',
    component: ResidentBillsPage,
    meta: { roles: ['RESIDENT_HEAD', 'RESIDENT_MEMBER'] },
  },
  {
    path: '/warga/riwayat',
    name: 'WargaRiwayat',
    component: ResidentHistoryPage,
    meta: { roles: ['RESIDENT_HEAD', 'RESIDENT_MEMBER'] },
  },
  {
    path: '/warga/anggota',
    name: 'WargaAnggota',
    component: ResidentMembersPage,
    meta: { roles: ['RESIDENT_HEAD', 'RESIDENT_MEMBER'] },
  },
  {
    path: '/warga/pengumuman',
    name: 'WargaPengumuman',
    component: ResidentAnnouncementsPage,
    meta: { roles: ['RESIDENT_HEAD', 'RESIDENT_MEMBER'] },
  },
  // Keuangan Routes (Bendahara)
  {
    path: '/keuangan',
    name: 'KeuanganVerifikasi',
    component: VerificationPage,
    meta: { roles: ['TREASURER'] },
  },
  {
    path: '/keuangan/tagihan',
    name: 'KeuanganTagihan',
    component: TreasurerBillsPage,
    meta: { roles: ['TREASURER'] },
  },
  {
    path: '/keuangan/transaksi',
    name: 'KeuanganTransaksi',
    component: TransactionsPage,
    meta: { roles: ['TREASURER'] },
  },
  {
    path: '/keuangan/laporan',
    name: 'KeuanganLaporan',
    component: ReportsPage,
    meta: { roles: ['TREASURER'] },
  },
  // Pengurus Routes (Admin RT/RW)
  {
    path: '/pengurus',
    name: 'PengurusRingkasan',
    component: SummaryPage,
    meta: { roles: ['RT_ADMIN', 'RW_ADMIN'] },
  },
  {
    path: '/pengurus/rumah',
    name: 'PengurusRumah',
    component: HouseholdsPage,
    meta: { roles: ['RT_ADMIN', 'RW_ADMIN'] },
  },
  {
    path: '/pengurus/iuran',
    name: 'PengurusIuran',
    component: BillingPage,
    meta: { roles: ['RT_ADMIN', 'RW_ADMIN'] },
  },
  {
    path: '/pengurus/laporan',
    name: 'PengurusLaporan',
    component: PengurusReportsPage,
    meta: { roles: ['RT_ADMIN', 'RW_ADMIN'] },
  },
  {
    path: '/pengurus/pengumuman',
    name: 'PengurusPengumuman',
    component: AnnouncementsPage,
    meta: { roles: ['RT_ADMIN', 'RW_ADMIN'] },
  },
  {
    path: '/pengurus/kegiatan',
    name: 'PengurusKegiatan',
    component: ActivitiesPage,
    meta: { roles: ['RT_ADMIN', 'RW_ADMIN'] },
  },
  {
    path: '/pengurus/log',
    name: 'PengurusLog',
    component: AuditLogPage,
    meta: { roles: ['RT_ADMIN', 'RW_ADMIN'] },
  },
  // Platform Admin Routes
  {
    path: '/platform',
    name: 'PlatformVerifikasi',
    component: PlatformVerificationPage,
    meta: { roles: ['PLATFORM_ADMIN'] },
  },
  {
    path: '/platform/aktif',
    name: 'PlatformAktif',
    component: ActiveEnvPage,
    meta: { roles: ['PLATFORM_ADMIN'] },
  },
  {
    path: '/platform/konfigurasi',
    name: 'PlatformKonfigurasi',
    component: ConfigPage,
    meta: { roles: ['PLATFORM_ADMIN'] },
  },
  {
    path: '/platform/log',
    name: 'PlatformLog',
    component: PlatformAuditLogPage,
    meta: { roles: ['PLATFORM_ADMIN'] },
  },
  // Default redirect
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Allow login page
  if (to.path === '/login') {
    next();
    return;
  }
  
  // Check if user has a role
  if (!authStore.currentUser) {
    next('/login');
    return;
  }
  
  // Check role permission
  const userRole = authStore.currentUser.role;
  const allowedRoles = to.meta?.roles || [];
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to user's dashboard
    next(authStore.getDashboardPath());
    return;
  }
  
  next();
});

export default router;