<div align="center">

<img src="assets/logo-512.png" alt="Logo Wraith Translate: hantu cyan dengan balon ucapan terjemahan" width="148" height="148">

# Wraith Translate <img src="https://img.shields.io/badge/versi-1.3.8-5DE0FF?style=flat-square&labelColor=1B1A2E" alt="versi 1.3.8" align="top">

<sub>🌐 [English](README.md) &nbsp;·&nbsp; **Bahasa Indonesia**</sub>

### Seleksi teks atau terjemahkan satu halaman penuh, langsung di browser.

Penerjemah ringan untuk browser dengan AI pilihan Anda sendiri.<br>
Tanpa akun. Tanpa backend. Tanpa pelacakan. Hanya teks Anda dan provider yang Anda percaya.

<br>

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-A78BFA?style=for-the-badge&labelColor=1B1A2E)](src/manifest.json)
[![Tanpa dependensi](https://img.shields.io/badge/dependensi_runtime-0-5DE0FF?style=for-the-badge&labelColor=1B1A2E)](#-build)
[![Bahasa](https://img.shields.io/badge/bahasa_tujuan-16-A78BFA?style=for-the-badge&labelColor=1B1A2E)](#-fitur)

<sub>**Kompatibel dengan**</sub><br>
![9router](https://img.shields.io/badge/9router-5DE0FF?style=flat-square&labelColor=1B1A2E)
![OpenAI-compatible](https://img.shields.io/badge/OpenAI--compatible-A78BFA?style=flat-square&labelColor=1B1A2E)
![Claude](https://img.shields.io/badge/Claude-5DE0FF?style=flat-square&labelColor=1B1A2E)
![DeepL](https://img.shields.io/badge/DeepL-A78BFA?style=flat-square&labelColor=1B1A2E)
![Ollama](https://img.shields.io/badge/Ollama-5DE0FF?style=flat-square&labelColor=1B1A2E)

<sub>**Berjalan di** &nbsp;Chrome · Edge · Brave · Opera · Vivaldi · Arc · Firefox 140+</sub>

<br>

[**Fitur**](#-fitur) &nbsp;•&nbsp;
[**Instalasi**](#-instalasi) &nbsp;•&nbsp;
[**Provider**](#-konfigurasi-provider) &nbsp;•&nbsp;
[**Cara pakai**](#-cara-pakai) &nbsp;•&nbsp;
[**Privasi**](#-izin-dan-privasi) &nbsp;•&nbsp;
[**Develop**](#-build)

</div>

<br>

---

## ✨ Fitur

<table>
<tr>
<td width="50%" valign="top">

### 🔤 Translate teks terpilih
Seleksi teks, klik tombol kecil **文**, lalu baca hasilnya di tooltip. Ada tombol **Copy** dan menu *Translate to* untuk bahasa lain tanpa mengubah pengaturan tersimpan.

</td>
<td width="50%" valign="top">

### 📄 Translate halaman penuh
Dua mode tampilan:
- **Replace text**: teks diganti di tempat, tata letak tetap.
- **Show both**: terjemahan ditambahkan di bawah tiap paragraf, teks asli tetap terlihat.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📜 Translate as you scroll
Hanya teks di sekitar layar yang dikirim ke provider, sisanya diterjemahkan saat Anda scroll. Hemat waktu dan biaya di halaman panjang.

</td>
<td width="50%" valign="top">

### 🧰 Popup, bar, shortcut
Popup toolbar, bar di halaman dengan progres, ganti bahasa, tombol *Original/Translation*, dan Retry. Tekan **`Alt+W`** atau pakai menu klik kanan.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔌 4 jenis provider
**9router**, **Custom (OpenAI-compatible)**, **Claude**, **DeepL**. Hanya provider terpilih yang dipakai; pengaturan provider lain tetap tersimpan.

</td>
<td width="50%" valign="top">

### 🌍 16 bahasa tujuan
Indonesia, English, Japanese, Korean, Chinese (Simplified), Arabic, Spanish, French, German, Portuguese (Brazil), Russian, Italian, Dutch, Turkish, Polish, Ukrainian. Bahasa sumber dideteksi otomatis.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### ⚡ Batch dan cache
Teks dikirim berkelompok dan string yang sama diterjemahkan sekali. Jika format balasan model rusak, batch dipecah otomatis sampai berhasil.

</td>
<td width="50%" valign="top">

### 🛡️ Aman untuk halaman
Kode (`<pre>`, `<code>`), kolom input, elemen `translate="no"` / `class="notranslate"`, dan elemen tersembunyi tidak disentuh.

</td>
</tr>
</table>

## 🌐 Dukungan browser

| Browser | Paket | Status |
|---|---|---|
| Chrome, Edge, Brave, Opera, Vivaldi, Arc | `wraith-translate-chromium-v*.zip` | ✅ Diuji di Chromium |
| Firefox 140+ | `wraith-translate-firefox-v*.zip` | ✅ Lolos `web-ext lint`; sudah diuji manual (add-on sementara) |
| Safari (macOS/iOS) | belum dibuat | ⚠️ Perlu Xcode: `xcrun safari-web-extension-converter dist/chromium` |

## 📦 Instalasi

<details open>
<summary><b>Chrome, Edge, Brave, Opera, Vivaldi, Arc</b></summary>

1. Ekstrak `wraith-translate-chromium-v*.zip` ke sebuah folder (atau jalankan [build](#-build) lalu pakai `dist/chromium`).
2. Buka halaman extension: `chrome://extensions` (`edge://extensions`, `brave://extensions`, `opera://extensions`, `vivaldi://extensions`).
3. Aktifkan **Developer mode**, klik **Load unpacked**, pilih folder hasil ekstrak.
4. Halaman pengaturan terbuka otomatis. Pilih provider, isi detailnya, klik **Save settings**, lalu **Test translation**.

> [!TIP]
> Setelah mengubah kode, klik ikon reload pada kartu extension, lalu reload tab yang sedang diuji.

</details>

<details>
<summary><b>Firefox (140 atau lebih baru)</b></summary>

1. Buka `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on** → pilih `manifest.json` dari folder `dist/firefox` (atau zip-nya). Add-on sementara hilang saat Firefox ditutup.
2. Untuk pemasangan permanen: tanda tangani paket di [addons.mozilla.org](https://addons.mozilla.org) (mode *unlisted* cukup), atau pakai Firefox Developer Edition / Nightly dengan `xpinstall.signatures.required` = `false`.
3. Buka halaman pengaturan dan klik **Allow access** pada banner, agar tombol seleksi bekerja di semua situs. (Translate halaman lewat popup tetap jalan tanpa izin ini.)

</details>

## 🔑 Konfigurasi provider

<details open>
<summary><b>9router</b></summary>

1. Pastikan 9router berjalan dan minimal satu koneksi AI aktif di dashboard-nya.
2. **Base URL**: mis. `http://localhost:20128/v1` (atau alamat server Anda).
3. **API key**: dari dashboard 9router (kosongkan jika auth mati).
4. Klik **Connect**. Daftar model diambil dari `GET {baseUrl}/models` dan dikelompokkan berdasarkan prefix sebelum `/`.
5. Pilih model, lalu **Save settings**.

Terjemahan dikirim ke `POST {baseUrl}/chat/completions` dengan header `Authorization: Bearer …`. Untuk alamat selain `localhost` / `127.0.0.1`, browser meminta izin akses saat Connect atau Save.

</details>

<details>
<summary><b>Custom (OpenAI-compatible)</b></summary>

Pilih preset **Service** atau *Other* lalu isi Base URL sendiri.

| Preset | Base URL |
|---|---|
| OpenAI | `https://api.openai.com/v1` |
| OpenRouter | `https://openrouter.ai/api/v1` |
| Groq | `https://api.groq.com/openai/v1` |
| Google Gemini | `https://generativelanguage.googleapis.com/v1beta/openai` |
| DeepSeek | `https://api.deepseek.com/v1` |
| Mistral | `https://api.mistral.ai/v1` |
| Together AI | `https://api.together.xyz/v1` |
| Ollama (lokal) | `http://localhost:11434/v1` |
| LM Studio (lokal) | `http://localhost:1234/v1` |

Jika Ollama membalas 403, jalankan dengan `OLLAMA_ORIGINS=chrome-extension://*`. Beberapa layanan tidak menyediakan `/models`; cek dokumentasi layanannya.

</details>

<details>
<summary><b>Claude</b></summary>

Buat API key di Anthropic Console, tempel ke **API key**, klik **Load models** (`GET https://api.anthropic.com/v1/models`), pilih model, lalu simpan. Terjemahan memakai `POST /v1/messages`. Model kecil biasanya lebih cepat dan murah untuk terjemahan pendek.

</details>

<details>
<summary><b>DeepL</b></summary>

Tempel authentication key. Key berakhiran `:fx` otomatis memakai `api-free.deepl.com`, selain itu `api.deepl.com`. Tidak ada pilihan model. Saat kuota habis muncul pesan error 456.

</details>

### Provider mana yang cocok?

| | 9router | Custom | Claude | DeepL |
|---|---|---|---|---|
| **Jenis** | Gateway banyak model AI | LLM per layanan | LLM | Mesin terjemahan |
| **Pilihan model** | Dari 9router Anda | Dari layanan | Dari akun Anda | Tidak ada |
| **Kecepatan** | Tergantung model | Tergantung layanan | Cepat–sedang | Sangat cepat |
| **Konteks dan gaya** | Bagus | Bagus | Sangat bagus | Terbatas, konsisten |
| **Biaya** | Mengikuti provider di belakangnya | Mengikuti layanan | Per token | Gratis (berbatas) atau Pro |

> [!TIP]
> Model LLM menulis hasil token demi token, jadi lebih lambat dari DeepL. Pilih model kecil/cepat (varian *flash*, *mini*, *haiku*) dan hindari model *reasoning* untuk terjemahan.

## 🚀 Cara pakai

### Teks terpilih
1. Seleksi teks di halaman web.
2. Klik tombol **文** yang muncul di dekat seleksi.
3. Baca hasil di tooltip. `Esc` atau klik di luar untuk menutup. Maksimal **5.000 karakter** per terjemahan.

### Halaman penuh

| Cara | Langkah |
|---|---|
| Toolbar | Klik ikon extension → **Translate this page** |
| Klik kanan | **Translate this page with Wraith Translate** |
| Shortcut | **`Alt+W`** (ubah di `chrome://extensions/shortcuts` / `about:addons` → Manage Extension Shortcuts) |

Untuk mengembalikan halaman: popup → **Show original page**, tombol **×** di bar, atau `Alt+W` lagi.

## ⚙️ Pengaturan

Buka tab **Settings** (atau tombol *Open settings* di popup):

| Pengaturan | Fungsi |
|---|---|
| Translate selected text | Mati = tombol seleksi tidak muncul di mana pun |
| Translate full page | Mati = popup/shortcut/menu klik kanan nonaktif dan halaman yang sedang diterjemahkan dikembalikan |
| Page display | *Replace text* atau *Show both* (berlaku pada translate halaman berikutnya) |
| Translate as you scroll | Hidup = terjemahkan yang dekat layar saja; mati = terjemahkan semuanya sekaligus |
| Provider dan target language | Lihat [Konfigurasi provider](#-konfigurasi-provider) |

Perubahan fitur berlaku langsung di tab yang sudah terbuka tanpa reload. Tab **Docs** memuat dokumentasi lengkap di dalam extension.

## 🔒 Izin dan privasi

| Izin | Alasan |
|---|---|
| `storage` | Menyimpan pengaturan di browser ini |
| `activeTab`, `scripting` | Menyiapkan tab aktif untuk translate halaman (klik ikon, shortcut, menu klik kanan) |
| `contextMenus` | Menu klik kanan *Translate this page* |
| Semua situs (content script) | Tombol seleksi, tooltip, dan translate teks halaman |
| `api.anthropic.com`, `api.deepl.com`, `api-free.deepl.com` | Memanggil API Claude dan DeepL |
| `localhost`, `127.0.0.1` | 9router atau model server lokal |
| Akses opsional per alamat | Hanya diminta bila 9router/Custom memakai alamat lain |

- 📤 Teks yang diseleksi hanya dikirim ke **provider pilihan Anda**, dan hanya setelah Anda menekan tombol terjemah. Teks halaman hanya dikirim setelah Anda memulai translate halaman.
- 🗝️ API key disimpan di `chrome.storage.local` di perangkat ini (tidak disinkronkan ke akun browser). Key tidak pernah masuk ke halaman web: semua panggilan API dilakukan oleh service worker.
- 🧱 Hasil terjemahan dirender sebagai teks biasa (bukan HTML), dan teks sumber diperlakukan sebagai data, bukan perintah, untuk mengurangi risiko prompt injection dari halaman web.

> [!WARNING]
> Jangan menerjemahkan teks rahasia lewat provider yang tidak Anda percaya. Baca [kebijakan privasi](PRIVACY.md) selengkapnya.

## 🧩 Struktur proyek

```
.
├── src/                    kode extension (Chromium manifest = sumber utama)
│   ├── manifest.json
│   ├── background.js       service worker: translate, shortcut, menu, injeksi script
│   ├── content.js          tombol seleksi, tooltip, penerjemah halaman, bar (Shadow DOM)
│   ├── popup.html/css/js   popup toolbar
│   ├── options.html/css/js halaman pengaturan + dokumentasi
│   ├── lib/
│   │   ├── providers.js    panggilan API (single + batch)
│   │   ├── defaults.js     default & pembaca pengaturan
│   │   ├── languages.js    daftar bahasa + kode DeepL
│   │   └── presets.js      preset layanan OpenAI-compatible
│   └── icons/              16, 48, 128 px
├── assets/                 logo (SVG + PNG), social preview, ikon toko
├── build.py                membuat dist/chromium, dist/firefox, dan zip
├── tests/                  tes end-to-end (Playwright + Chromium)
├── AGENTS.md               panduan arsitektur untuk developer / asisten AI
├── PRIVACY.md              kebijakan privasi (tautkan di listing toko)
├── STORE_LISTING.md        teks listing toko siap salin
└── dist/                   hasil build (di-generate, jangan diedit)
```

### Cara kerjanya

```mermaid
flowchart LR
    A["content.js<br/>seleksi · tooltip · bar halaman"] -- "translate / translateBatch" --> B["background.js<br/>service worker"]
    P["popup.js"] -- "togglePage / pageStatus" --> B
    B --> C["lib/providers.js"]
    C --> D1["9router"]
    C --> D2["OpenAI-compatible"]
    C --> D3["Claude"]
    C --> D4["DeepL"]
```

`content.js` mengirim pesan ke `background.js`, yang membaca pengaturan dan memanggil `lib/providers.js`. Detail alur pesan, protokol batch, dan cara menambah provider/bahasa/pengaturan ada di [`AGENTS.md`](AGENTS.md).

## 🛠️ Build

Tidak ada dependensi runtime atau bundler. Butuh Python 3:

```bash
python3 build.py
```

```
dist/chromium/                              folder siap Load unpacked
dist/firefox/                               folder siap Load Temporary Add-on
dist/wraith-translate-chromium-v<ver>.zip
dist/wraith-translate-firefox-v<ver>.zip
```

Manifest Firefox dibuat otomatis dari `src/manifest.json` (background script + `browser_specific_settings.gecko`). Naikkan `version` di `src/manifest.json` untuk setiap rilis. Lint Firefox: `npx web-ext lint -s dist/firefox`.

## 🧪 Pengujian

Tes otomatis memakai server OpenAI tiruan lokal dan Chromium headless:

```bash
pip install playwright
python3 build.py
python3 tests/e2e_page.py            # replace/bilingual/lazy/restore, kode & notranslate dilewati, toggle fitur, jalur error
python3 tests/e2e_popup_inject.py    # popup menyimpan pengaturan, togglePage, injeksi script otomatis
```

Screenshot hasil tes tersimpan di `tests/out/`.

<details>
<summary><b>Skenario tes manual</b></summary>

1. 9router: Connect, daftar model muncul, pilih, simpan, *Test translation* berhasil.
2. Seleksi kalimat di halaman biasa: tombol muncul, klik, tooltip menampilkan hasil penuh tanpa scrollbar dalam.
3. Seleksi teks di dalam `<textarea>`: tombol tetap muncul.
4. Menu *Translate to* di tooltip menerjemahkan ulang ke bahasa lain; bahasa tersimpan di Settings tidak berubah. `Esc` / klik di luar menutup tooltip.
5. API key salah: tooltip menampilkan pesan 401/403 dan tombol *Open settings*.
6. Matikan 9router lalu terjemahkan: muncul pesan "Cannot reach…".
7. Seleksi lebih dari 5.000 karakter: muncul pesan "Text is too long".
8. Ganti ke Custom (pilih preset, Connect), Claude, dan DeepL; ulangi langkah 2.
9. Di `chrome://extensions` tombol tidak muncul (memang begitu).
10. Reload extension tanpa reload tab: muncul pesan "Extension was updated".
11. Matikan *Translate selected text*, Save, reload tab: seleksi tidak memunculkan tombol; tombol di popup tetap menerjemahkan halaman.
12. Matikan *Translate full page*, Save: menu klik kanan hilang, tombol popup nonaktif.
13. Translate artikel panjang (*Replace text*): teks terlihat berubah, blok kode utuh, scroll menerjemahkan sisanya; *Show original page* mengembalikan semuanya.
14. Mode *Show both*: terjemahan muncul di bawah paragraf; tombol *Original* di bar menyembunyikan/menampilkan.
15. API key salah saat translate halaman: bar menampilkan error dengan Retry dan Settings.
16. Klik ikon di tab yang dibuka sebelum extension dipasang/di-reload: popup terbuka dan translate tetap berhasil.
17. Klik ikon di `chrome://extensions`: popup menyatakan halaman tidak bisa diterjemahkan; *Open settings* tetap berfungsi.

</details>

## 🩺 Pemecahan masalah

<details>
<summary><b>Buka tabel gejala</b></summary>

<br>

| Gejala | Penyebab dan solusi |
|---|---|
| Tombol seleksi tidak muncul | Reload tab setelah install/update. Pastikan bukan halaman `chrome://`, Web Store, atau PDF viewer bawaan. Di Firefox klik **Allow access** di Settings. |
| Tanda ! merah di ikon / "Couldn't reach this page" | Halaman tidak mengizinkan extension (`chrome://`, Web Store, PDF viewer) atau memblokir script. Jika masih gagal, reload tab. |
| "Cannot reach…" | 9router/layanan lokal tidak berjalan, Base URL salah, atau izin alamat belum diberikan. Klik Connect lagi dan setujui izin. |
| 401 / 403 | API key salah, kedaluwarsa, atau tidak punya akses ke model itu. |
| 404 | Base URL tidak berakhiran `/v1` atau model sudah tidak ada. Muat ulang daftar model. |
| 429 | Rate limit. Tunggu sebentar atau ganti model. |
| 456 (DeepL) | Kuota karakter bulanan habis. |
| Daftar model kosong | Belum ada AI terhubung di 9router, atau key tidak boleh membaca daftar model. |
| Hasil mengandung komentar tambahan | Sebagian model kecil mengabaikan instruksi. Pilih model lain. |
| Terjemahan lambat | LLM menulis token demi token; pilih model kecil/cepat, hindari model reasoning, atau pakai DeepL. |
| Halaman hanya sebagian diterjemahkan | Kode, kolom input, dan elemen tersembunyi memang dilewati. Matikan *Translate as you scroll* untuk menerjemahkan semuanya sekaligus, atau tekan Retry setelah error. |
| "Extension was updated" | Reload tab yang sedang dipakai. |

</details>

## 📌 Batasan

- Mode *Replace text* menerjemahkan per potongan teks, sehingga kalimat yang dipecah tag inline (`<b>`, `<a>`) diterjemahkan terpisah. Mode *Show both* menerjemahkan per blok dan hasilnya lebih natural.
- Konten yang dimuat setelah translate dimulai (infinite scroll) diterjemahkan setelah scroll berhenti sebentar; konten dinamis yang terus berganti bisa memicu terjemahan berulang.
- Terjemahan tidak di-stream; hasil tampil setelah balasan lengkap diterima.
- Firefox baru diuji manual sebagai add-on sementara (belum ada tes otomatis Firefox); Safari belum dibangun.

## 🤝 Kontribusi

Edit hanya `src/`, jalankan `python3 build.py`, lalu jalankan tes di atas. Aturan dan panduan lengkap (peta file, protokol pesan, cara menambah provider/bahasa/pengaturan, jebakan umum) ada di [`AGENTS.md`](AGENTS.md).

> [!NOTE]
> Jaga agar `README.md` dan `README.id.md` tetap sinkron saat mengubah dokumentasi.

<br>

---

<div align="center">

<img src="assets/logo.svg" alt="Wraith Translate" width="44" height="44">

<sub>**Wraith Translate** · v1.3.8 · Menerjemahkan dalam senyap, seperti hantu 👻</sub>

</div>
