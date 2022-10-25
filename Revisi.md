# Fix Menu

- Fixing Menu pengajuan sub divisi [OK]
  -- on progress dan completed tetap [ALL] [OK]
  -- need approval dengan format sebelumnya [!WR2-!WR2bendahara-!WR2lpj] [OK]
  -- List pencairan [DIRKEU-WR2-REKTOR] [OK]
  -- Pencairan dan belum pencairan [WR2Bendahara] [OK]
  -- LPJ Kegiatan dan belum lpj kegiatan [SEKNIV] [OK]
  -- LPJ Keuangan dan belum lpj keuangan [WR2LPJ] [OK]

## Revisi 04 Februari 2022 [OK]

- RAB di aplikasi [Validasi-!=-0-Testing-update-data]
- Print pengajuan tampilkan history pengajuan [OK]
- Dir keuangan :
  -- Buat periode
  -- list periode
  -- list pencairan by periode (get where pengajuan.periode_id = periode.id)
  -- input nominal pencairan
  -- add pengajuan ke list pencairan (update where pengajuan.periode_id = periode.id)
- WR2 : (Tampilkan berdasarkan periode dan next == wr2 di tabel pengajuan)
  -- Select periode
  -- List pengajuan by periode
  -- Aksi OK, untuk banyak data gunakan looping
- Rektor :
  -- Select periode
  -- List pengajuan by periode
  -- Aksi OK, untuk banyak data gunakan looping
- Sekniv :
  -- Select periode
  -- List pengajuan by periode
  -- Cek LPJ

## 08/02/2022 [OK]

- Perubahan warna untuk item yang sudah terima [OK]
- Tambah kolom catatan di bottom RAB [OK]
- Fields list pencairan WR 2 [OK]
- Default kop surat [OK]

## 09/02/2022 [OK]

- Perubahan formaat penamaan file pdf (Nomor rkat-nama-kegiatan-timenow()) [OK]
- Print list pencairan (rkat-periode-timenow) [OK]
- List pencairan langsung periode terbaru [OK]
- Tambah detail periode diatas table list pencairan dan tanggal pembuatan periode [OK]
- Tab baru telah dicairkan (Bendahara) [OK]
- Pangkas fields (Bank, Nomor Rekening, Nama Rekening - Sekniv dan dir keuangan lpj) [OK]
- Pencairan langsung dihalaman dashboard [OK]
- LPJ Keuangan langsung dihalaman dashboard [OK]
- Nominal biaya dan nama program gantikan user
- Nominal biaya disetujui dan diajukan [OK]
- Max 5 pengajuan per user [Belum]
- Total menjadi biaya program (Input pengajuan) [OK]
- Total di bawah table [OK]
- Form login [OK]
- Tolak pengajuan oleh rektor agar dibuat periode baru [OK]

## Continue hasil rapat [OK]

- Tambah filter pengajuan berdasarkan status, per tanggal, per bulan, per tahun [Not-Fix]
- List notifikasi (baru ditambahkan, revisi, list harus di approve dll)
- Link refensi satuan harga barang
- Ubah warna menjadi orange [Pertimbangan]
- Preview pencairan, lpj keuangan, lpj kegiatan langsung di table [BELUM-LINK-TO-PDF]
- Filter otomatis berdasarkan tahun sekarang (dropdown tahun sebelumnya)
- List pencairan langsung tabel per periode (Jadi tabel bertumpuk) [Pertimbangan]

## 16/02/2022 [OK]

- Filter berdasarkan periode rkat
  -- [Lumen] Semua pengajuan with rkat select periode
  -- [Nuxt] Filter berdasarkan rkat.periode
  -- [Nuxt] List year by lowest year in rkat.periode between now year
  -- Hanya bisa pengajuan di periode tahun yang sama
  -- Tambah dropdown periode rkat di input rkat
- Sebelum deploy apa saja yang perlu diubah

## 22/02/2022 [OK]

- semua data yang tampil berdasarkan periode terbaru misal total anggaran dashboard [OK]
- waktu pengajuan didasboard hapus ganti dengan periode [OK]
- Data inputan pengajuan yang diambil dari rkat readonly saja [OK]

## 02/03/2022 [WOP]

- Import nominal tidak bisa kalau ada RP(Kak cana)
- [Bug] Keterangan tidak word wrap dan harus setting width:300px tag p untuk tampilkan keterangan

## Mba winda

- masing-masing fakultas kadang nanya pengajuan disetujui berapa
  -- tampilkan nominal disetujui pada tabel fakultas dan divisi diatasnya

## 28/03/2022 (Pak widi)

- Tampilkan nominal rkat pd hal. pengajuan sesuai rkat yg dipilih
- LPJ pararel

## 13/04/2022

- Tambah file satuan harga
- Tambah draf laporan keuangan

### Work on progress [Delete-dan-OK-sesuai-item]

- tampilkan periode pencairan [OK]
  -- Dashboard dan pengajuan sendiri [OK]
  -- Divisi diatasnya [OK]
- tampilkan nominal pengajuan dan disetujui pada tabel fakultas dan divisi diatasnya [OK]
- Tambah file satuan harga [OK]
- Tambah draf laporan keuangan [OK]
- Import nominal tidak bisa kalau ada RP(Kak cana)
- LPJ pararel

### 12/05/2022

- Bug:
  -- validasi rab tidak bisa kalau ada RP(Kak cana)
  -- Validasi semua fields RAB dulu setelah itu baru post pengajuan

### 25/05/2022

- Lisensi cwp pro expired jadi server error (2Hari fixing sampai begadang)
- 93 halaman rkat untuk perubahan nama
- penambahan fitur lpj keuangan sudah selesai
- penambahan fitur summary untuk wr 2
- nama program di hal. pengajuan
- hapus user (yg mengajukan)
- biaya program tambah dari rkat
- detail pada halaman summary (total rkat, diajukan, belum diajukan, total anggaran)
- akses ke bu atun (lpj keuangan)
- download exel
- ubah nama direktur kuangan (2) menjadi pencairan

## debugging tools
- [axios-catch-error](https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253)
