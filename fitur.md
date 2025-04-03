# Ide Fitur untuk Web Transkrip Video YouTube

- [x] **Input dan Validasi URL Video**
  - [x] Form input untuk memasukkan URL video YouTube.
  - [x] Validasi otomatis agar hanya URL yang valid yang diproses.

- [x] **Transkrip Otomatis**
  - [x] Mengambil transkrip otomatis menggunakan API atau library (misalnya `youtube-transcript`).
  - [x] Menangani error jika video tidak menyediakan caption.

- [x] **Penandaan Waktu (Timestamp)**
  - [ ] Menampilkan setiap baris transkrip dengan timestamp.
  - [ ] Fitur klik pada timestamp untuk melompat ke bagian terkait pada video.

- [x] **Fitur Pencarian**
  - [x] Pencarian dalam transkrip untuk menemukan kata atau frasa tertentu.
  - [x] Highlight kata kunci yang dicari.

- [ ] **Dukungan Multi-Bahasa dan Terjemahan**
  - [ ] Opsi pemilihan bahasa untuk transkrip.
  - [ ] Integrasi dengan API terjemahan untuk menerjemahkan transkrip ke bahasa lain.

- [ ] **Download dan Ekspor**
  - [ ] Download transkrip dalam format teks (.txt), subtitle (.srt), atau PDF.
  - [ ] Ekspor data transkrip untuk penggunaan offline.

- [ ] **Highlight dan Catatan**
  - [ ] Menandai bagian penting dari transkrip.
  - [ ] Fitur untuk menambahkan catatan atau komentar pribadi pada transkrip.

- [ ] **Mode Gelap/Terang**
  - [ ] Opsi tampilan dark mode dan light mode untuk kenyamanan pengguna.

- [ ] **Integrasi dengan API Speech-to-Text (Fallback)**
  - [ ] Menggunakan layanan speech-to-text (misalnya Google Cloud Speech-to-Text) jika video tidak memiliki caption.
  - [ ] Otomatisasi pengambilan audio dan konversi ke teks.

- [ ] **User Authentication dan Riwayat**
  - [ ] Fitur login/register untuk pengguna.
  - [ ] Menyimpan riwayat transkrip yang pernah diambil agar bisa diakses kembali.

- [ ] **Feedback dan Rating**
  - [ ] Opsi bagi pengguna untuk memberikan feedback terhadap akurasi transkrip.
  - [ ] Rating kualitas transkrip untuk membantu pengembangan fitur lebih lanjut.

- [ ] **Optimasi Performa dan Caching**
  - [ ] Menyimpan transkrip dalam cache atau database untuk video yang sama.
  - [ ] Mengurangi waktu loading dan beban pada server.
