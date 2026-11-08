import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDataStore = defineStore('data', () => {
  // 1. Tagihan (Bills)
  const bills = ref([
    {
      id: 'b_1',
      title: 'Iuran keamanan, November 2026',
      dueDate: '10 Nov 2026',
      dueDateRaw: '2026-11-10',
      totalAmount: 100000,
      paidAmount: 55000,
      remainingAmount: 45000,
      status: 'PARTIALLY_PAID', // UNPAID | PARTIALLY_PAID | PAID | OVERDUE | CANCELLED
      houseNo: 'B-14',
      residentName: 'Budi Santoso',
      category: 'Keamanan',
      period: 'Nov 2026',
    },
    {
      id: 'b_2',
      title: 'Iuran sampah, November 2026',
      dueDate: '15 Nov 2026',
      dueDateRaw: '2026-11-15',
      totalAmount: 25000,
      paidAmount: 0,
      remainingAmount: 25000,
      status: 'UNPAID',
      houseNo: 'B-14',
      residentName: 'Budi Santoso',
      category: 'Kebersihan',
      period: 'Nov 2026',
    },
    {
      id: 'b_3',
      title: 'Iuran kas RT, November 2026',
      dueDate: '05 Nov 2026',
      dueDateRaw: '2026-11-05',
      totalAmount: 50000,
      paidAmount: 50000,
      remainingAmount: 0,
      status: 'PAID',
      houseNo: 'B-14',
      residentName: 'Budi Santoso',
      category: 'Kas RT',
      period: 'Nov 2026',
    },
    {
      id: 'b_4',
      title: 'Iuran keamanan, Oktober 2026',
      dueDate: '10 Okt 2026',
      dueDateRaw: '2026-10-10',
      totalAmount: 100000,
      paidAmount: 0,
      remainingAmount: 100000,
      status: 'OVERDUE',
      houseNo: 'C-02',
      residentName: 'Ahmad Subagyo',
      category: 'Keamanan',
      period: 'Okt 2026',
    },
    {
      id: 'b_5',
      title: 'Iuran perbaikan gapura (Batal)',
      dueDate: '01 Nov 2026',
      dueDateRaw: '2026-11-01',
      totalAmount: 50000,
      paidAmount: 0,
      remainingAmount: 50000,
      status: 'CANCELLED',
      houseNo: 'A-05',
      residentName: 'Dedi Kurniawan',
      category: 'Insidental',
      period: 'Nov 2026',
    },
  ]);

  // 2. Antrean Verifikasi Pembayaran (Bendahara)
  const pendingPayments = ref([
    {
      id: 'pay_101',
      houseNo: 'B-14',
      residentName: 'Budi Santoso',
      billTitle: 'Keamanan, Nov 2026',
      billId: 'b_1',
      method: 'Transfer BCA',
      amount: 45000,
      date: '02 Nov 2026 09:30',
      proofUrl: '#',
      status: 'PENDING',
    },
    {
      id: 'pay_102',
      houseNo: 'C-02',
      residentName: 'Ahmad Subagyo',
      billTitle: 'Sampah, Nov 2026',
      billId: 'b_2',
      method: 'Tunai',
      amount: 25000,
      date: '02 Nov 2026 10:15',
      proofUrl: '#',
      status: 'PENDING',
    },
    {
      id: 'pay_103',
      houseNo: 'D-08',
      residentName: 'Eko Prasetyo',
      billTitle: 'Kas RT, Nov 2026',
      billId: 'b_3',
      method: 'Online (Simulasi QRIS)',
      amount: 50000,
      date: '01 Nov 2026 18:45',
      proofUrl: '#',
      status: 'PENDING',
    },
  ]);

  // 3. Riwayat Transaksi (Immutable log)
  const transactionHistory = ref([
    { id: 'trx_1', date: '12 Okt 2026', houseNo: 'B-14', residentName: 'Budi Santoso', billTitle: 'Iuran Keamanan Okt', amount: 75000, method: 'Transfer', status: 'CONFIRMED' },
    { id: 'trx_2', date: '12 Okt 2026', houseNo: 'B-14', residentName: 'Budi Santoso', billTitle: 'Iuran Sampah Okt', amount: 25000, method: 'Tunai', status: 'CONFIRMED' },
    { id: 'trx_3', date: '05 Okt 2026', houseNo: 'A-01', residentName: 'Agus Wijaya', billTitle: 'Iuran Keamanan Okt', amount: 100000, method: 'Online', status: 'CONFIRMED' },
    { id: 'trx_4', date: '28 Sep 2026', houseNo: 'C-02', residentName: 'Ahmad Subagyo', billTitle: 'Iuran Sampah Sep', amount: 25000, method: 'Transfer', status: 'REJECTED', reason: 'Bukti transfer tidak terbaca' },
  ]);

  // 4. Rumah & Warga (Admin RT/RW)
  const households = ref([
    { id: 'h_1', houseNo: 'B-14', headName: 'Budi Santoso', phone: '081234567890', membersCount: 4, status: 'Aktif', arrearsCount: 1, totalArrears: 45000, nik: '3271************' },
    { id: 'h_2', houseNo: 'C-02', headName: 'Ahmad Subagyo', phone: '081987654321', membersCount: 3, status: 'Aktif', arrearsCount: 2, totalArrears: 125000, nik: '3271************' },
    { id: 'h_3', houseNo: 'A-05', headName: 'Dedi Kurniawan', phone: '085611223344', membersCount: 5, status: 'Aktif', arrearsCount: 0, totalArrears: 0, nik: '3271************' },
    { id: 'h_4', houseNo: 'D-08', headName: 'Eko Prasetyo', phone: '081399887766', membersCount: 2, status: 'Aktif', arrearsCount: 0, totalArrears: 0, nik: '3271************' },
  ]);

  // 5. Antrean Verifikasi Lingkungan (Platform Admin)
  const envVerifications = ref([
    { id: 'env_1', name: 'RT 05 / RW 02 Melati', type: 'RT', applicant: 'Suryono', submittedDate: '28 Okt 2026', status: 'PENDING', totalHouses: 35 },
    { id: 'env_2', name: 'RW 09 Graha Asri', type: 'RW', applicant: 'Bambang Tri', submittedDate: '29 Okt 2026', status: 'PENDING', totalHouses: 180 },
    { id: 'env_3', name: 'RT 02 / RW 04 Cempaka', type: 'RT', applicant: 'Rinawati', submittedDate: '30 Okt 2026', status: 'PENDING', totalHouses: 42 },
  ]);

  // 6. Pengumuman & Kegiatan
  const announcements = ref([
    { id: 'ann_1', title: 'Rapat Rutin Bulanan RT 03', date: 'Sab 14 Nov 2026', location: 'Balai Warga RT 03', category: 'Undangan', status: 'Published' },
    { id: 'ann_2', title: 'Kerja Bakti Masal Kebersihan Saluran', date: 'Min 8 Nov 2026', location: 'Lingkungan RT 03', category: 'Kegiatan', status: 'Published' },
    { id: 'ann_3', title: 'Jadwal Ronda Malam Bulan November', date: '01 Nov 2026', location: 'Pos Ronda RT 03', category: 'Informasi', status: 'Draft' },
  ]);

  const activities = ref([
    { id: 'act_1', name: 'Kerja Bakti Lingkungan', schedule: 'Minggu, 8 Nov 2026 - 07.00 WIB', location: 'Taman & Saluran Air RT 03', pic: 'Pak Dedi' },
    { id: 'act_2', name: 'Posyandu Lansia & Balita', schedule: 'Selasa, 17 Nov 2026 - 09.00 WIB', location: 'Posyandu RW 07', pic: 'Ibu Rina' },
  ]);

  // 7. Audit Log
  const auditLogs = ref([
    { id: 'log_1', timestamp: '02 Nov 2026 10:15', actor: 'Siti Aminah (Bendahara)', action: 'Konfirmasi Pembayaran', target: 'Tagihan B-14', details: 'Nominal Rp55.000 via Transfer' },
    { id: 'log_2', timestamp: '01 Nov 2026 08:00', actor: 'Pak Bambang (Ketua RT)', action: 'Terbitkan Tagihan', target: 'Periode Nov 2026', details: 'Total 48 Rumah' },
    { id: 'log_3', timestamp: '28 Okt 2026 14:20', actor: 'Super Admin', action: 'Verifikasi Lingkungan', target: 'RT 03 / RW 07', details: 'Status diubah ke VERIFIED' },
  ]);

  // Financial summary (Dipisah 3 total: Terbit, Diterima, Belum Dibayar)
  const financeSummary = computed(() => {
    const totalIssued = 4200000;
    const totalReceived = 2875000;
    const totalUnpaid = totalIssued - totalReceived;
    return { totalIssued, totalReceived, totalUnpaid };
  });

  // Actions
  function confirmPayment(paymentId) {
    const idx = pendingPayments.value.findIndex((p) => p.id === paymentId);
    if (idx !== -1) {
      const item = pendingPayments.value[idx];
      pendingPayments.value.splice(idx, 1);
      
      // Update bill paid amount
      const targetBill = bills.value.find((b) => b.id === item.billId);
      if (targetBill) {
        targetBill.paidAmount += item.amount;
        targetBill.remainingAmount = Math.max(0, targetBill.totalAmount - targetBill.paidAmount);
        targetBill.status = targetBill.remainingAmount === 0 ? 'PAID' : 'PARTIALLY_PAID';
      }

      // Add to immutable history
      transactionHistory.value.unshift({
        id: `trx_${Date.now()}`,
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        houseNo: item.houseNo,
        residentName: item.residentName,
        billTitle: item.billTitle,
        amount: item.amount,
        method: item.method,
        status: 'CONFIRMED',
      });

      // Add audit log
      auditLogs.value.unshift({
        id: `log_${Date.now()}`,
        timestamp: new Date().toLocaleString('id-ID'),
        actor: 'Bendahara',
        action: 'Konfirmasi Pembayaran',
        target: `Rumah ${item.houseNo}`,
        details: `Nominal Rp${item.amount.toLocaleString('id-ID')}`,
      });
    }
  }

  function rejectPayment(paymentId, reason) {
    const idx = pendingPayments.value.findIndex((p) => p.id === paymentId);
    if (idx !== -1) {
      const item = pendingPayments.value[idx];
      pendingPayments.value.splice(idx, 1);

      transactionHistory.value.unshift({
        id: `trx_${Date.now()}`,
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        houseNo: item.houseNo,
        residentName: item.residentName,
        billTitle: item.billTitle,
        amount: item.amount,
        method: item.method,
        status: 'REJECTED',
        reason: reason || 'Alasan tidak dispesifikasikan',
      });
    }
  }

  function submitResidentPayment({ billId, amount, method }) {
    const b = bills.value.find((item) => item.id === billId);
    if (b) {
      pendingPayments.value.unshift({
        id: `pay_${Date.now()}`,
        houseNo: b.houseNo,
        residentName: b.residentName,
        billTitle: b.title,
        billId: b.id,
        method: method,
        amount: amount,
        date: 'Baru Saja',
        proofUrl: '#',
        status: 'PENDING',
      });
    }
  }

  function generateBills({ feeType, period }) {
    // Add mock bill iteration
    const newBill = {
      id: `b_${Date.now()}`,
      title: `${feeType}, ${period}`,
      dueDate: '20 Nov 2026',
      dueDateRaw: '2026-11-20',
      totalAmount: 35000,
      paidAmount: 0,
      remainingAmount: 35000,
      status: 'UNPAID',
      houseNo: 'B-14',
      residentName: 'Budi Santoso',
      category: feeType,
      period: period,
    };
    bills.value.unshift(newBill);
  }

  function verifyEnvironment(envId, status, reason = '') {
    const env = envVerifications.value.find((e) => e.id === envId);
    if (env) {
      env.status = status;
      auditLogs.value.unshift({
        id: `log_${Date.now()}`,
        timestamp: new Date().toLocaleString('id-ID'),
        actor: 'Platform Admin',
        action: `Verifikasi Lingkungan (${status})`,
        target: env.name,
        details: reason ? `Catatan: ${reason}` : 'Disetujui tanpa catatan',
      });
    }
  }

  return {
    bills,
    pendingPayments,
    transactionHistory,
    households,
    envVerifications,
    announcements,
    activities,
    auditLogs,
    financeSummary,
    confirmPayment,
    rejectPayment,
    submitResidentPayment,
    generateBills,
    verifyEnvironment,
  };
});
