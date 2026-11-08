# Wargaku: DESIGN.md untuk Dashboard Pengguna

Dokumen ini hanya mencakup **portal pengguna** (area setelah login). Website publik sudah dibuat terpisah dan dokumen ini memakai bahasa visual yang sama: putih, biru, modern, simple.

Sumber isi: Proposal Wargaku (peran, class, fitur, aturan bisnis). Bagian yang di proposal masih bertanda [Perlu dikonfirmasi] ditandai sama di sini.

---

## 1. Tujuan desain

Dashboard dipakai berulang oleh orang yang bukan ahli teknologi: bendahara yang mencocokkan pembayaran, ketua RT yang menerbitkan tagihan, kepala keluarga yang hanya ingin tahu "bulan ini saya harus bayar apa". Maka:

1. **Pekerjaan utama setiap peran terlihat di layar pertama.** Tidak ada halaman ringkasan yang hanya berisi angka besar.
2. **Rumah adalah unit utama.** Tagihan, pembayaran, dan anggota selalu dibaca dari sudut pandang rumah, bukan akun.
3. **Kewenangan terlihat.** Pengguna selalu tahu sedang melihat data wilayah mana, dan tidak pernah melihat data lingkungan lain.
4. **Uang harus jelas.** Nominal, status, dan sisa tagihan tidak boleh ambigu atau bergantung pada warna saja.
5. **Tenang.** Putih, satu warna biru, gerak seperlunya. Dashboard bukan tempat pamer.

**Satu hal yang dibuat menonjol:** baris tagihan dengan progress pembayaran (komponen `BillRow`, bagian 6.1). Komponen ini muncul di semua peran dan sama dengan kartu simulasi di website publik. Sisanya sengaja dibuat diam.

---

## 2. Peran dan dashboard

Setelah login, sistem memanggil `user.getDashboardPath()` (polimorfisme di proposal). Setiap subclass `User` menghasilkan satu dashboard.

| Peran | Class | Rute | Pekerjaan utama di layar pertama |
| --- | --- | --- | --- |
| Platform Administrator | `PlatformAdmin` | `/platform` | Antrean verifikasi pendaftaran lingkungan |
| Admin RT | `NeighborhoodAdmin` (level RT) | `/pengurus` | Status tagihan periode ini dan tunggakan di wilayah RT |
| Admin RW | `NeighborhoodAdmin` (level RW) | `/pengurus` | Perbandingan rekap antar RT di bawah RW |
| Bendahara | `Treasurer` | `/keuangan` | Antrean verifikasi pembayaran |
| Kepala Keluarga | `Resident` (HEAD) | `/warga` | Tagihan rumah yang perlu dibayar |
| Anggota Keluarga | `Resident` (MEMBER) | `/warga` | Tagihan dan info rumah, sesuai izin |

Admin RT dan Admin RW memakai shell dan halaman yang sama; yang berbeda adalah cakupan data (`managedArea`) dan beberapa kolom rekap. Jangan membuat dua desain terpisah.

Bila satu orang memegang beberapa peran pengurus (proposal 1.3), tampilkan **pengalih peran** di topbar, bukan menggabungkan semua menu dalam satu sidebar.

---

## 3. Token visual

Melanjutkan token website publik, ditambah yang dibutuhkan antarmuka data.

### 3.1 Warna

| Token | Hex | Pemakaian |
| --- | --- | --- |
| `--bg` | `#ffffff` | Latar utama semua halaman |
| `--surface-2` | `#f6f8ff` | Latar sidebar, header tabel, panel sekunder |
| `--tint` | `#eef3ff` | Chip status netral-biru, baris terpilih, track progress |
| `--line` | `#dbe3f5` | Semua garis pemisah dan border input |
| `--ink` | `#0c1b3a` | Teks utama |
| `--muted` | `#55648a` | Teks sekunder, label, metadata |
| `--blue` | `#1f55e0` | Aksi utama, tautan, progress, status Lunas |
| `--blue-d` | `#1741b3` | Hover/pressed aksi utama |
| `--danger` | `#b42318` | Hanya untuk Terlambat, Ditolak, Gagal, dan error |
| `--danger-bg` | `#fdecea` | Latar chip danger |

Aturan:

- Putih tetap latar utama. Jangan memberi latar berwarna pada seluruh halaman.
- Biru hanya untuk hal yang bisa diklik atau yang menunjukkan kemajuan. Jangan dipakai sebagai dekorasi.
- Merah hanya untuk hal yang butuh tindakan atau gagal. Bila semuanya merah, tidak ada yang terbaca.
- Tanpa gradien, tanpa bayangan abu generik di setiap kartu. Bayangan hanya untuk elemen yang melayang (popover, dialog, drawer), memakai bayangan bernuansa biru tipis seperti di website.

### 3.2 Tipografi

| Peran | Font | Catatan |
| --- | --- | --- |
| Judul halaman, judul bagian, nominal besar | Bricolage Grotesque 600–700 | Letter-spacing −0.02em |
| Teks, tabel, form, tombol | Figtree 400–600 | Dasar 15–16px di dashboard |
| Angka dalam tabel dan baris tagihan | Figtree dengan `font-variant-numeric: tabular-nums` | Agar kolom nominal rata |

Skala (px / line-height):

| Gunakan untuk | Ukuran |
| --- | --- |
| Judul halaman | 28 / 1.15 |
| Judul bagian | 20 / 1.25 |
| Nominal utama (satu per layar maksimal) | 32 / 1.1 |
| Teks isi | 15 / 1.55 |
| Label, metadata, kepala kolom | 13 / 1.4, sentence case |

Larangan: label huruf kapital semua, eyebrow di atas setiap judul, satu kata beraksen warna di dalam judul, kode enum mentah (`PARTIALLY_PAID`) di antarmuka.

### 3.3 Spasi, sudut, garis

- Skala spasi 4 pt: 4, 8, 12, 16, 24, 32, 48.
- Radius: kontrol dan chip 10px (chip penuh 99px), panel 16px, dialog 20px. Jangan satu radius untuk semuanya; radius mengikuti ukuran elemen.
- Pemisah memakai garis `--line` 1px. Hindari kotak bergaris di dalam kotak bergaris.
- Kartu dipakai hanya bila isinya benar-benar satu unit yang berdiri sendiri (satu tagihan, satu rumah). Daftar sejenis memakai baris, bukan deretan kartu identik.

---

## 4. Layout

### 4.1 Shell desktop (≥ 1024px)

```
┌───────────┬──────────────────────────────────────────────────────┐
│ Wargaku   │ RT 03 / RW 07  ▾        Periode: Nov 2026 ▾    Budi ▾ │
│           ├──────────────────────────────────────────────────────┤
│ Ringkasan │ Judul halaman                          [Aksi utama]  │
│ Tagihan   │ ──────────────────────────────────────────────────── │
│ Pembayaran│                                                      │
│ Rumah     │ Konten                                               │
│ Laporan   │                                                      │
│ Pengumuman│                                                      │
│ Kegiatan  │                                                      │
│           │                                                      │
│ Pengaturan│                                                      │
└───────────┴──────────────────────────────────────────────────────┘
```

- Sidebar 248px, latar `--surface-2`, tidak bisa dilipat (menu per peran paling banyak 8 item).
- Topbar 64px, latar putih, garis bawah `--line`. Isinya tetap: **pemilih cakupan** (organisasi dan wilayah), **periode** (bila halaman memakainya), **menu akun**.
- Konten rata kiri, lebar maksimal 1200px. Jangan memusatkan teks panjang atau judul.
- Satu aksi utama per halaman, di kanan judul.

### 4.2 Mobile (< 768px)

- Sidebar menjadi **tab bar bawah** dengan maksimal 4 item + "Lainnya".
- Pemilih cakupan dan periode pindah ke bawah judul halaman sebagai dua chip yang bisa diketuk.
- Tabel berubah menjadi daftar baris bertumpuk (bagian 6.3). Tidak ada scroll horizontal pada badan halaman.
- Target sentuh minimal 44 × 44px. Hormati safe area atas dan bawah.

### 4.3 Tablet (768–1023px)

Sidebar menyempit menjadi ikon + label pendek 72px, atau tab bar bawah bila ikon tidak cukup jelas. Konten satu kolom.

---

## 5. Menu dan halaman per peran

Sembunyikan menu yang **tidak pernah** boleh diakses peran itu. Untuk fitur yang bergantung izin (anggota keluarga), lihat bagian 7.

| Peran | Menu (berurutan) |
| --- | --- |
| Platform Administrator | Verifikasi lingkungan, Lingkungan aktif, Konfigurasi platform, Log aktivitas |
| Admin RT / RW | Ringkasan, Rumah dan warga, Iuran dan tagihan, Laporan, Pengumuman, Kegiatan, Log aktivitas |
| Bendahara | Verifikasi pembayaran, Tagihan, Riwayat transaksi, Laporan |
| Kepala Keluarga | Beranda rumah, Tagihan, Riwayat, Anggota keluarga, Pengumuman dan kegiatan |
| Anggota Keluarga | Beranda rumah, Tagihan (bila diizinkan), Pengumuman dan kegiatan |

Semua peran: Profil, Ganti kata sandi, Keluar (di menu akun).

### 5.1 Inventaris halaman

Diambil dari daftar halaman di pembagian tugas proposal (Tabel 2.5 sampai 2.8).

| Halaman | Peran | Fungsi |
| --- | --- | --- |
| Masuk, Daftar, Lupa kata sandi | Semua | Autentikasi |
| Profil | Semua | Ubah nama, telepon, kata sandi |
| Verifikasi lingkungan | Platform Admin | Setujui atau tolak pendaftaran dengan catatan |
| Manajemen wilayah | Admin RT/RW | Susun struktur RW dan RT |
| Daftar rumah, Detail rumah | Admin RT/RW | Data rumah, kepala keluarga, anggota |
| Undangan anggota | Kepala Keluarga | Undang lewat email, lihat status undangan |
| Pengaturan jenis iuran | Admin RT/RW | Nama, kategori, nominal, periode, jatuh tempo |
| Penerbitan tagihan | Admin RT/RW | Pilih iuran dan periode, terbitkan per rumah |
| Daftar tagihan | Admin, Bendahara, Warga | Lihat dan filter tagihan |
| Form pembayaran | Warga, Bendahara | Bayar atau catat pembayaran |
| Verifikasi pembayaran | Bendahara | Konfirmasi atau tolak |
| Riwayat transaksi | Admin, Bendahara, Warga | Daftar pembayaran, tidak dapat dihapus |
| Laporan dan tunggakan | Admin, Bendahara | Rekap dan ekspor Excel |
| Pengelolaan pengumuman, Daftar kegiatan | Admin RT/RW | Buat, terbitkan, arsipkan |
| Log aktivitas | Admin, Platform Admin | Jejak perubahan penting (hanya baca) |

---

## 6. Komponen inti

### 6.1 BillRow (komponen penanda)

Satu baris = satu `Bill` (rumah × jenis iuran × periode).

```
Iuran keamanan, November 2026                         Dibayar sebagian
Jatuh tempo 10 Nov                                    Sisa Rp45.000
▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░                                [ Bayar ]
```

- Judul = jenis iuran + periode. Metadata = jatuh tempo.
- Bar progress setinggi 6–8px, isi `--blue`, track `--tint`. Lebar isi = `paidAmount / amount`.
- Nominal yang paling penting adalah **sisa**, bukan total. Total muncul di tooltip atau detail.
- Status memakai `StatusChip` (6.2). Aksi di kanan hanya yang boleh dilakukan peran itu.
- Baris `Terlambat`: chip danger dan jatuh tempo ditulis "Lewat 5 hari". Jangan mewarnai seluruh baris.
- Baris `Dibatalkan`: teks `--muted`, nominal dicoret, tanpa aksi.

### 6.2 StatusChip

Selalu berisi teks. Warna hanya penguat.

| Objek | Nilai di sistem | Label | Gaya |
| --- | --- | --- | --- |
| Bill | UNPAID | Belum dibayar | Abu-biru (`#f1f4fb`, teks `--muted`) |
| Bill | PARTIALLY_PAID | Dibayar sebagian | `--tint`, teks `--blue` |
| Bill | PAID | Lunas | `--blue`, teks putih, ikon centang |
| Bill | OVERDUE | Terlambat | `--danger-bg`, teks `--danger` |
| Bill | CANCELLED | Dibatalkan | Abu-biru, teks dicoret |
| Payment | PENDING | Menunggu verifikasi | `--tint`, teks `--blue` |
| Payment | CONFIRMED | Dikonfirmasi | `--blue`, teks putih |
| Payment | REJECTED | Ditolak | `--danger-bg` |
| Payment | FAILED | Gagal | `--danger-bg` |
| Membership | INVITED | Menunggu diterima | `--tint` |
| Membership | ACTIVE | Aktif | `--blue`, teks putih |
| Membership | REVOKED / EXPIRED | Dicabut / Kedaluwarsa | Abu-biru |
| Organisasi | PENDING / VERIFIED / REJECTED / SUSPENDED | Menunggu verifikasi / Terverifikasi / Ditolak / Ditangguhkan | Sama pola di atas |

### 6.3 DataTable

Dipakai di daftar rumah, tagihan, riwayat, tunggakan, log.

- Kepala kolom sticky, latar `--surface-2`, teks 13px `--muted`.
- Kolom nominal rata kanan, `tabular-nums`, selalu berformat `Rp1.250.000`.
- Tinggi baris 52px (kompak 44px sebagai opsi). Hover baris hanya pada perangkat yang mendukung hover.
- Filter di atas tabel: pencarian, status, periode. Filter aktif tampil sebagai chip yang bisa dilepas.
- Aksi per baris: satu aksi utama terlihat, sisanya di menu titik tiga.
- Di mobile setiap baris menjadi blok dua baris: kiri identitas (rumah, jenis iuran), kanan nominal dan status.
- Tabel kosong memakai pesan arahan (bagian 9.3).

### 6.4 ScopeSwitcher

Menampilkan organisasi dan wilayah aktif, misalnya `RT 03 / RW 07`.

- Hanya menawarkan wilayah dalam kewenangan pengguna (`canManage()` / `isWithin()`).
- Mengubah cakupan mengubah seluruh halaman, jadi perubahan harus terlihat jelas: judul halaman memuat nama wilayah.
- Pengguna dengan satu wilayah melihat chip tetap tanpa panah.

### 6.5 Komponen lain

| Komponen | Aturan |
| --- | --- |
| `Money` | Satu fungsi pemformat: `Rp` tanpa spasi, titik ribuan, tanpa desimal. Dipakai di semua tempat. |
| `ConfirmDialog` | Untuk verifikasi, penolakan, pencabutan, pembatalan. Aksi yang bisa ditolak meminta alasan (textarea, wajib). |
| `Drawer` | Detail rumah, detail tagihan, jejak audit. Masuk dari kanan, lebar 440px, menutup dengan Esc. |
| `Toast` | Satu baris, 4 detik, memakai kata kerja yang sama dengan tombol pemicunya. |
| `Skeleton` | Untuk pemuatan data. Tidak memakai spinner halaman penuh. |
| `Banner` | Informasi tingkat halaman, misalnya "Pembayaran online masih simulasi". |

---

## 7. Aturan kewenangan di antarmuka

1. **Dilarang selamanya → sembunyikan.** Warga tidak melihat menu Laporan; Bendahara tidak melihat tombol Terbitkan tagihan.
2. **Bergantung izin → tampil nonaktif dengan alasan.** Anggota keluarga tanpa izin `PAY_BILLS` tetap melihat tombol Bayar, nonaktif, dengan teks "Hanya kepala keluarga atau anggota yang diizinkan yang bisa membayar."
3. **Di luar wilayah → tidak muncul sama sekali.** Rumah atau data lingkungan lain tidak boleh tampil, bahkan sebagai baris kosong atau hitungan.
4. **Cakupan selalu tampil** di topbar dan judul halaman.
5. **Server tetap penentu.** Antarmuka hanya mencerminkan; setiap aksi tetap diperiksa di backend (`hasPermission()`, `canManage()`).
6. **NIK** (opsional, terenkripsi) tidak ditampilkan di daftar. Di detail, tampilkan tertutup dan sediakan aksi "Tampilkan" yang tercatat di log. [Perlu dikonfirmasi apakah NIK dikumpulkan]
7. **Tidak ada tombol hapus** pada pembayaran atau log. Koreksi pembayaran memakai aksi "Koreksi" dengan alasan, hasilnya perubahan status yang tercatat.

---

## 8. Rancangan dashboard per peran

### 8.1 Kepala Keluarga (`/warga`)

Pekerjaan utama: tahu apa yang harus dibayar.

```
Rumah B-14, RT 03 / RW 07                       [ Undang anggota ]
───────────────────────────────────────────────────────────────
Perlu dibayar
 Iuran keamanan, Nov 2026     Dibayar sebagian   Sisa Rp45.000  [Bayar]
 ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░
 Iuran sampah, Nov 2026       Belum dibayar      Sisa Rp25.000  [Bayar]
 ░░░░░░░░░░░░░░░░░░░░░░
───────────────────────────────────────────────────────────────
Riwayat terbaru                     │ Pengumuman dan kegiatan
 12 Okt  Rp75.000  Dikonfirmasi     │ Sab 14 Nov  Rapat rutin RT 03
 12 Okt  Rp25.000  Dikonfirmasi     │ Min 8 Nov   Kerja bakti
 Lihat semua riwayat                │
```

- Bagian pertama adalah daftar `BillRow`, bukan kartu statistik.
- Bila tidak ada tagihan: "Tidak ada tagihan yang perlu dibayar. Pembayaran terakhir Anda dikonfirmasi 12 Okt."
- Alur bayar: pilih tagihan → pilih metode (tunai/transfer dicatat bendahara; online simulasi) → isi nominal (tidak boleh melebihi sisa) → konfirmasi → bukti pembayaran.
- Anggota keluarga melihat halaman yang sama tanpa "Undang anggota", dan tombol Bayar mengikuti izin.

### 8.2 Bendahara (`/keuangan`)

Pekerjaan utama: memproses pembayaran yang menunggu.

```
Verifikasi pembayaran                              [ Catat tunai ]
───────────────────────────────────────────────────────────────
Menunggu verifikasi (7)
 Rumah   Tagihan            Metode    Nominal     Aksi
 B-14    Keamanan, Nov      Transfer  Rp45.000    [Tolak] [Konfirmasi]
 C-02    Sampah, Nov        Tunai     Rp25.000    [Tolak] [Konfirmasi]
───────────────────────────────────────────────────────────────
Periode November 2026
 Tagihan terbit   Uang diterima   Belum dibayar
 Rp4.200.000      Rp2.875.000     Rp1.325.000
```

- Tiga total **ditulis terpisah dan tidak digabung** menjadi satu "saldo". Saldo kas hanya ditampilkan bila modul pengeluaran ada. [Perlu dikonfirmasi]
- Tabel antrean bisa dioperasikan penuh dengan keyboard (panah, Enter untuk konfirmasi, tombol tolak membuka dialog alasan).
- Setelah konfirmasi, baris keluar dari antrean dan toast berbunyi "Pembayaran dikonfirmasi".

### 8.3 Admin RT dan Admin RW (`/pengurus`)

Pekerjaan utama: memastikan tagihan periode ini terbit dan terbayar.

```
Ringkasan RT 03 / RW 07                    [ Terbitkan tagihan ]
───────────────────────────────────────────────────────────────
Penagihan November 2026
 48 rumah aktif   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░  31 lunas, 9 sebagian, 8 belum
───────────────────────────────────────────────────────────────
Perlu perhatian                        │ Draf pengumuman
 8 rumah menunggak lebih dari 1 bulan  │ Jadwal kerja bakti  [Terbitkan]
 Lihat daftar tunggakan                │
```

- Admin RW mendapat tabel tambahan "Rekap per RT": satu baris per RT, kolom tagihan, diterima, menunggak.
- "Terbitkan tagihan" membuka dialog: pilih jenis iuran, periode, tampilkan jumlah rumah yang akan menerima tagihan dan jumlah yang dilewati karena sudah ada. Tagihan ganda dicegah dan dijelaskan, bukan gagal diam-diam.

### 8.4 Platform Administrator (`/platform`)

Pekerjaan utama: memeriksa pendaftaran lingkungan.

```
Verifikasi lingkungan                                   
───────────────────────────────────────────────────────────────
Menunggu verifikasi (3)
 Nama lingkungan        Jenis   Diajukan      Aksi
 RT 05 / RW 02 Melati   RT      28 Okt 2026   [Tinjau]
```

- "Tinjau" membuka drawer dengan data pendaftaran, lalu Setujui atau Tolak (alasan wajib). Perubahan status masuk ke `AuditLog`.
- Konfigurasi platform memakai form sederhana; perubahan bernilai penting meminta konfirmasi.

---

## 9. Tulisan di antarmuka

Mengikuti prinsip: kata ada untuk memudahkan, bukan menghias.

### 9.1 Kosakata tetap

| Pakai | Jangan |
| --- | --- |
| Tagihan | Invoice, Bill |
| Iuran | Fee, Biaya |
| Rumah | Household, Unit |
| Kepala keluarga | Head, Owner |
| Tunggakan | Arrears, Outstanding |
| Terbitkan tagihan | Generate bill |
| Konfirmasi pembayaran | Approve, Validate |

Satu aksi punya satu nama di seluruh alur: tombol "Konfirmasi pembayaran" → toast "Pembayaran dikonfirmasi" → baris riwayat "Dikonfirmasi".

### 9.2 Gaya

- Kalimat biasa (sentence case), kata kerja aktif, tanpa seruan.
- Tombol menyebut hasilnya: "Simpan perubahan", "Kirim undangan", "Ajukan pendaftaran". Tidak "Submit", "OK", "Lanjut" tanpa konteks.
- Tanpa tanda panah di akhir teks tombol atau tautan.
- Kesalahan menjelaskan apa yang terjadi dan cara memperbaikinya, tanpa meminta maaf. Contoh: "Nominal Rp30.000 melebihi sisa tagihan Rp15.000. Masukkan nominal yang lebih kecil atau pilih Bayar sisa."

### 9.3 Keadaan kosong

Setiap keadaan kosong mengarahkan tindakan.

| Tempat | Teks |
| --- | --- |
| Daftar rumah kosong | "Belum ada rumah di RT ini. Tambahkan rumah pertama untuk mulai menerbitkan tagihan." + [Tambah rumah] |
| Antrean verifikasi kosong | "Tidak ada pembayaran yang menunggu verifikasi." |
| Tunggakan kosong | "Tidak ada tunggakan pada periode ini." |
| Anggota keluarga kosong | "Belum ada anggota yang terhubung. Undang anggota lewat email." + [Undang anggota] |

---

## 10. Gerak

Prinsip: gerak menjawab tindakan pengguna, bukan menghias. Dashboard dipakai berulang, jadi hampir semuanya harus terasa instan.

**Kurva:** `cubic-bezier(0.23, 1, 0.32, 1)` (ease-out kuat) untuk semua elemen yang masuk atau merespons. Jangan memakai ease-in.

| Elemen | Durasi | Perilaku |
| --- | --- | --- |
| Tombol ditekan | 120–160 ms | `scale(.97)` saat `:active` |
| Hover | 150 ms | Hanya di `@media (hover: hover)`; ubah warna, bukan ukuran |
| Popover, menu, tooltip | 150–180 ms | Opacity + `scale(.96 → 1)`, `transform-origin` dari pemicunya |
| Dialog | 200 ms | Opacity + `scale(.96 → 1)` dan naik 8px |
| Drawer | 240 ms | Masuk dari kanan, `translateX` |
| Progress pembayaran | 400 ms | `scaleX` dari kiri saat nilai berubah |
| Baris baru di riwayat | 300 ms | Opacity + naik 6px, sekali |
| Toast | 200 ms | Masuk dari bawah, keluar lebih cepat dari masuk |

Aturan:

- Animasikan hanya `transform` dan `opacity`. Jangan menganimasikan tinggi, lebar, atau margin.
- Jangan menganimasikan elemen mulai dari `scale(0)`; mulai dari 0.95–0.96 dengan opacity.
- **Tanpa animasi** untuk tindakan yang sering atau digerakkan keyboard: pindah baris tabel, pindah tab data, buka palet perintah, navigasi antar halaman.
- Tidak ada animasi masuk pada setiap bagian halaman. Pemuatan data memakai skeleton lalu crossfade 150 ms.
- Hormati `prefers-reduced-motion`: matikan gerak spasial, pertahankan perubahan opacity yang singkat.

---

## 11. Aksesibilitas

- Kontras teks minimal 4.5:1. `--muted` (#55648a) di atas putih memenuhi; jangan dipakai lebih terang.
- Fokus terlihat: outline 2px `--blue`, offset 2px, di semua kontrol.
- Status tidak pernah hanya warna: selalu teks, dan ikon untuk Lunas, Terlambat, Ditolak.
- Tabel memakai elemen tabel sungguhan, `scope` pada kepala kolom, dan `aria-sort` pada kolom yang bisa diurutkan.
- Perubahan status yang terjadi tanpa pindah halaman (konfirmasi, pembayaran) diumumkan lewat `aria-live="polite"`.
- Dialog menjebak fokus dan mengembalikannya ke pemicu saat ditutup.
- Form: label terlihat di atas input, pesan error di dekat input, bukan hanya di toast.
- Teks tetap terbaca pada zoom 200% dan tidak ada informasi yang hanya muncul saat hover.

---

## 12. Keadaan khusus

| Keadaan | Perlakuan |
| --- | --- |
| Pembayaran online | Selalu tampilkan banner "Simulasi: tidak ada uang yang diproses" pada alur dan pada detail `PaymentTransaction`. Flag `simulated = true` terlihat di detail. |
| Sesi habis | Dialog masuk ulang di tempat, data form tidak hilang. |
| Gagal memuat | Pesan di area yang gagal, dengan tombol "Muat ulang", bukan halaman error penuh. |
| Tagihan sudah terbit | Mengubah nominal iuran tidak mengubah tagihan lama; tampilkan catatan di form pengaturan iuran: "Perubahan berlaku untuk tagihan berikutnya." |
| Organisasi belum aktif | Pengurus melihat status "Menunggu verifikasi" dan hanya menu yang relevan. |
| Ekspor Excel | Tombol "Ekspor ke Excel" menyebut periode dan wilayah di nama berkas, misalnya `rekap-RT03-2026-11.xlsx`. |

---

## 13. Catatan implementasi (Vue 3 + Vite + Vue Router)

- Token di bagian 3 dijadikan CSS variable di `:root`; jangan menulis hex langsung di komponen.
- Rute dikawal oleh *route guard* yang membaca peran dan memanggil jalur dashboard dari backend (`getDashboardPath()`), bukan if-else peran di front-end.
- Nama komponen mengikuti proposal: `LoginPage`, `BillListPage`, `ReportPage`, ditambah `BillRow`, `StatusChip`, `DataTable`, `ScopeSwitcher`, `Money`.
- Pemetaan label status (bagian 6.2) berada di satu berkas; enum backend tidak pernah dirender langsung.
- Komponen interaktif kompleks (dialog, menu, tab) boleh memakai pustaka headless agar aksesibilitas keyboard benar, lalu diberi gaya sesuai dokumen ini.
- Uji tiga ukuran: 375px, 768px, 1280px, dan satu pengguna per peran dengan cakupan wilayah berbeda.

---

## 14. Daftar periksa sebelum rilis

- [ ] Layar pertama setiap peran menampilkan pekerjaan utamanya.
- [ ] Cakupan wilayah terlihat dan data lingkungan lain tidak pernah muncul.
- [ ] Tiga total laporan (terbit, diterima, belum dibayar) dipisah; tidak ada "saldo" tanpa modul pengeluaran.
- [ ] Tidak ada tombol hapus pada pembayaran dan log.
- [ ] Nominal di semua tempat memakai satu pemformat `Money`.
- [ ] Setiap status punya teks, bukan hanya warna.
- [ ] Nama aksi sama pada tombol, toast, dan riwayat.
- [ ] Keadaan kosong, memuat, dan error ada di setiap daftar.
- [ ] Gerak mati pada tindakan berfrekuensi tinggi dan menghormati `prefers-reduced-motion`.
- [ ] Banner simulasi tampil pada alur pembayaran online.

## 15. Hal yang masih perlu dikonfirmasi

Mengikuti tanda [Perlu dikonfirmasi] di proposal:

1. Apakah modul pengeluaran masuk ruang lingkup. Menentukan ada tidaknya saldo kas di laporan.
2. Apakah NIK dikumpulkan. Menentukan field dan perlakuan tertutup di detail warga.
3. Apakah ada organisasi berjenis gabungan (RT + RW). Memengaruhi pemilih cakupan dan menu.
4. Rincian matriks hak akses (Tabel 1.2), terutama izin anggota keluarga.
5. Batas simulasi pembayaran online sesuai ketentuan tugas.
