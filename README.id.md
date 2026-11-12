# 🩺 EnvDoctor

**Dokter lingkungan pengembangan yang gratis, open source, offline-first, dan mengutamakan privasi.**

EnvDoctor membantu mendiagnosis setup lokal Anda: runtime, port, dependensi, variabel lingkungan, dan izin file. Tanpa kunci API, akun, telemetri, layanan AI, maupun permintaan jaringan.

## Mana yang nyata, mana yang demo?

- **CLI** (`cli/envdoctor.mjs`): menjalankan pemeriksaan **nyata** dan hanya-baca di komputer Anda.
- **Web UI** (`src/`): dasbor interaktif dengan **data contoh simulasi**, karena browser tidak bisa memeriksa sistem operasi.
- Rencana: aplikasi desktop **Tauri + Rust** akan memasok data nyata ke UI yang sama lewat antarmuka `DiagnosticProvider`.

## Instalasi

Butuh **Node.js 18+**.

```bash
git clone https://github.com/FIQTOR/envdoctor.git
cd envdoctor
npm install
```

## Penggunaan

```bash
npm run dev     # UI web (data simulasi) di http://localhost:5173
npm run cli     # pemeriksaan nyata di terminal, folder saat ini
node cli/envdoctor.mjs --json > laporan.json
node cli/envdoctor.mjs --md  > laporan.md
npm test        # uji unit
```

Nilai variabel lingkungan tidak pernah ditampilkan (hanya nama dan panjang). CLI keluar dengan kode `1` jika ada pemeriksaan yang gagal.

## Berkontribusi & lisensi

Lihat [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), dan [SECURITY.md](SECURITY.md). Lisensi [MIT](LICENSE). Dokumentasi lengkap (arsitektur, roadmap) ada di [README.md](README.md).
