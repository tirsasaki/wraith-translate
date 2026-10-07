<div align="center">

<img src="assets/logo-512.png" alt="Logo Wraith Translate: hantu cyan dengan balon terjemahan" width="148" height="148">

# Wraith Translate <img src="https://img.shields.io/badge/version-1.4.0-5DE0FF?style=flat-square&labelColor=1B1A2E" alt="versi 1.4.0" align="top">

<sub>🌐 [English](README.md) &nbsp;·&nbsp; **Bahasa Indonesia**</sub>

### Seleksi teks atau terjemahkan satu halaman penuh, langsung di browser Anda.

Penerjemah browser yang ringan, dengan AI pilihan Anda sendiri.<br>
Tanpa akun. Tanpa backend. Tanpa pelacakan. Hanya teks Anda dan provider yang Anda percaya.

<br>

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-A78BFA?style=for-the-badge&labelColor=1B1A2E)](src/manifest.json)
[![Tanpa dependensi](https://img.shields.io/badge/runtime_deps-0-5DE0FF?style=for-the-badge&labelColor=1B1A2E)](#build)
[![Bahasa](https://img.shields.io/badge/bahasa_tujuan-16-A78BFA?style=for-the-badge&labelColor=1B1A2E)](#fitur)

<sub>**Bekerja dengan**</sub><br>
![9router](https://img.shields.io/badge/9router-5DE0FF?style=flat-square&labelColor=1B1A2E)
![OpenAI-compatible](https://img.shields.io/badge/OpenAI--compatible-A78BFA?style=flat-square&labelColor=1B1A2E)
![Claude](https://img.shields.io/badge/Claude-5DE0FF?style=flat-square&labelColor=1B1A2E)
![DeepL](https://img.shields.io/badge/DeepL-A78BFA?style=flat-square&labelColor=1B1A2E)
![Ollama](https://img.shields.io/badge/Ollama-5DE0FF?style=flat-square&labelColor=1B1A2E)

<a href="https://addons.mozilla.org/en-US/firefox/addon/wraith-translate/"><img src="https://img.shields.io/badge/Firefox-Pasang_add--on-FF7139?style=for-the-badge&logo=firefoxbrowser&logoColor=white&labelColor=1B1A2E" alt="Pasang add-on untuk Firefox"></a>
<a href="#instalasi"><img src="https://img.shields.io/badge/Edge-sedang_diverifikasi-0078D7?style=for-the-badge&logo=microsoftedge&logoColor=white&labelColor=1B1A2E" alt="Add-on Edge sedang diverifikasi"></a>
<a href="#instalasi"><img src="https://img.shields.io/badge/Chrome-instal_manual-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=1B1A2E" alt="Instal manual di Chrome"></a>

<sub>**Berjalan di** &nbsp;Chrome · Edge · Brave · Opera · Vivaldi · Arc · Firefox 140+</sub>

<br>

[**Fitur**](#fitur) &nbsp;•&nbsp;
[**Instalasi**](#instalasi) &nbsp;•&nbsp;
[**Provider**](#konfigurasi-provider) &nbsp;•&nbsp;
[**Cara pakai**](#cara-pakai) &nbsp;•&nbsp;
[**Privasi**](#izin-dan-privasi) &nbsp;•&nbsp;
[**Pemecahan masalah**](#pemecahan-masalah) &nbsp;•&nbsp;
[**Pengembangan**](#build)

</div>

<br>

---

<a id="fitur"></a>

## ✨ Fitur

<table>
<tr>
<td width="50%" valign="top">

### 🔤 Terjemahan teks terseleksi
Seleksi teks, klik tombol kecil **文**, lalu baca hasilnya di tooltip. Ada tombol **Copy** dan menu *Translate to* yang tidak pernah mengubah bahasa tersimpan Anda. Terjemahan **tampil bertahap** saat model menulisnya.

</td>
<td width="50%" valign="top">

### 📄 Terjemahan satu halaman
Dua mode tampilan:
- **Replace text**: teks diganti di tempat, tata letak tetap utuh.
- **Show both**: terjemahan ditambahkan di bawah tiap paragraf, teks asli tetap terlihat.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📜 Terjemahkan sambil scroll
Hanya teks di sekitar layar yang dikirim ke provider; sisanya diterjemahkan saat Anda sampai di sana. Hemat waktu dan biaya di halaman panjang.

</td>
<td width="50%" valign="top">

### 🧰 Popup, bar, shortcut
Popup toolbar, bar di halaman dengan progres, pengganti bahasa, tombol *Original/Translation*, dan Retry. Tekan **`Alt+W`** atau pakai menu klik kanan.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔌 4 jenis provider
**9router**, **Custom (OpenAI-compatible)**, **Claude**, **DeepL**. Hanya provider yang dipilih yang dipakai; pengaturan provider lain tetap tersimpan.

</td>
<td width="50%" valign="top">

### 🌍 16 bahasa tujuan
Indonesia, English, Japanese, Korean, Chinese (Simplified), Arabic, Spanish, French, German, Portuguese (Brazil), Russian, Italian, Dutch, Turkish, Polish, Ukrainian. Bahasa sumber dideteksi otomatis.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### ⚡ Cepat dan tangguh
Teks halaman dikirim dalam batch kecil paralel (12 string, 5 sekaligus, teks yang tampil di layar lebih dulu) dan string yang sama diterjemahkan sekali. Error rate limit dan server diulang dengan backoff, dan batch yang dirusak model dipecah otomatis.

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
| Chrome, Brave, Opera, Vivaldi, Arc | `wraith-translate-chromium-v*.zip` | ✅ Diuji di Chromium; instal manual (Load unpacked) |
| Edge | `wraith-translate-chromium-v*.zip` | ⏳ Listing Edge Add-ons sedang diverifikasi; sementara instal manual |
| Firefox 140+ | [Firefox Add-ons (resmi)](https://addons.mozilla.org/en-US/firefox/addon/wraith-translate/) atau `wraith-translate-firefox-v*.zip` | ✅ Tersedia di addons.mozilla.org; lolos `web-ext lint` |
| Safari (macOS/iOS) | belum dibuat | ⚠️ Perlu Xcode: `xcrun safari-web-extension-converter dist/chromium` |

<a id="instalasi"></a>

## 📦 Instalasi

<details open>
<summary><b>Chrome, Edge, Brave, Opera, Vivaldi, Arc</b></summary>

1. Ekstrak `wraith-translate-chromium-v*.zip` ke sebuah folder (atau jalankan [build](#build) lalu pakai `dist/chromium`).
2. Buka halaman extension: `chrome://extensions` (`edge://extensions`, `brave://extensions`, `opera://extensions`, `vivaldi://extensions`).
3. Aktifkan **Developer mode**, klik **Load unpacked**, lalu pilih folder hasil ekstrak.
4. Halaman pengaturan terbuka otomatis. Pilih provider, isi detailnya, klik **Save settings**, lalu **Test translation**.

> [!TIP]
> Setelah mengubah kode, klik ikon reload pada kartu extension, lalu reload tab yang sedang diuji.

</details>

<details open>
<summary><b>Firefox (140 atau lebih baru)</b></summary>

1. Buka halaman add-on resmi: **[Wraith Translate di Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/wraith-translate/)**.
2. Klik **Add to Firefox** (Tambahkan ke Firefox) lalu setujui permintaan izin. Update datang otomatis.
3. Buka halaman pengaturan, pilih provider, isi detailnya, klik **Save settings**, lalu **Test translation**.
4. Klik **Allow access** pada banner di Settings agar tombol seleksi bekerja di semua situs. (Terjemahan halaman dari popup tetap jalan tanpa izin ini.)

<details>
<summary>Pasang dari source (untuk pengembangan)</summary>

Buka `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on** → pilih `manifest.json` dari `dist/firefox` (atau zip-nya). Add-on sementara hilang saat Firefox ditutup.

</details>

</details>

<a id="konfigurasi-provider"></a>

## 🔑 Konfigurasi provider

<details open>
<summary><b>9router</b></summary>

1. Pastikan 9router berjalan dan minimal satu koneksi AI aktif di dashboard-nya.
2. **Base URL**: misalnya `http://localhost:20128/v1` (atau alamat server Anda).
3. **API key**: dari dashboard 9router (kosongkan jika auth mati).
4. Klik **Connect**. Model dimuat dari `GET {baseUrl}/models` dan dikelompokkan berdasarkan prefix sebelum `/`.
5. Pilih model lalu **Save settings**.

Terjemahan dikirim ke `POST {baseUrl}/chat/completions` dengan header `Authorization: Bearer …`. Untuk alamat selain `localhost` / `127.0.0.1`, browser meminta izin akses saat Anda klik Connect atau Save.

</details>

<details>
<summary><b>Custom (OpenAI-compatible)</b></summary>

Pilih preset **Service**, atau *Other* lalu ketik Base URL sendiri.

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

Jika Ollama membalas 403, jalankan dengan `OLLAMA_ORIGINS=chrome-extension://*`. Beberapa layanan tidak menyediakan `/models`; periksa dokumentasi layanan tersebut.

</details>

<details>
<summary><b>Claude</b></summary>

Buat API key di Anthropic Console, tempel ke **API key**, klik **Load models** (`GET https://api.anthropic.com/v1/models`), pilih model, lalu simpan. Terjemahan memakai `POST /v1/messages`. Model yang lebih kecil biasanya lebih cepat dan murah untuk terjemahan pendek.

</details>

<details>
<summary><b>DeepL</b></summary>

Tempel authentication key. Key berakhiran `:fx` otomatis memakai `api-free.deepl.com`; selain itu memakai `api.deepl.com`. Tidak ada pilihan model. Saat kuota habis muncul error 456.

</details>

### Provider mana yang sebaiknya dipilih?

| | 9router | Custom | Claude | DeepL |
|---|---|---|---|---|
| **Jenis** | Gateway ke banyak model AI | Model bahasa, per layanan | Model bahasa | Mesin terjemahan |
| **Pilihan model** | Dari 9router Anda | Dari layanan | Dari akun Anda | Tidak ada |
| **Kecepatan** | Tergantung model | Tergantung layanan | Cepat sampai sedang | Sangat cepat |
| **Konteks dan gaya** | Bagus | Bagus | Sangat bagus | Terbatas, konsisten |
| **Biaya** | Mengikuti provider di belakangnya | Mengikuti layanan | Bayar per token | Gratis dengan batas, atau Pro |

> [!TIP]
> Model bahasa menulis hasil token demi token, jadi lebih lambat dari DeepL. Pilih model kecil yang cepat (varian *flash*, *mini*, *haiku*) dan hindari model *reasoning* untuk terjemahan. Hasil pengukurannya ada di [Memilih model](#memilih-model).

<a id="memilih-model"></a>

### 🏁 Memilih model

Terjemahan tidak butuh reasoning, jadi model terbaik adalah yang **kecil dan cepat** (varian *flash*, *lite*, *mini*, *haiku*). Di **Settings**, model yang direkomendasikan diberi tanda **★** dan tersedia sebagai tombol sekali klik di bawah daftar model (daftarnya ada di `src/lib/recommended.js`).

Pada uji kecepatan kami, `gemini/gemini-3.5-flash-lite` paling cepat dan stabil (sekitar 1 detik sampai selesai), `kr/claude-haiku-4.5` alternatif yang bagus, sedangkan model besar atau yang banyak "berpikir" butuh 10 detik atau lebih. Model yang menentukan kecepatan, bukan extension. Hasil lengkap, catatan, dan skrip untuk mengulang tes: **[docs/model-speed.id.md](docs/model-speed.id.md)**.

<a id="cara-pakai"></a>

## 🚀 Cara pakai

### Teks terseleksi
1. Seleksi teks di halaman web.
2. Klik tombol **文** yang muncul di dekat seleksi.
3. Baca hasilnya di tooltip. Tekan `Esc` atau klik di tempat lain untuk menutupnya. Setiap terjemahan dibatasi **5.000 karakter**.

### Halaman penuh

| Cara | Langkah |
|---|---|
| Toolbar | Klik ikon extension → **Translate this page** |
| Klik kanan | **Translate this page with Wraith Translate** |
| Shortcut | **`Alt+W`** (ubah di `chrome://extensions/shortcuts` / `about:addons` → Manage Extension Shortcuts) |

Untuk mengembalikan halaman: popup → **Show original page**, tombol **×** di bar, atau `Alt+W` lagi.

## ⚙️ Pengaturan

Buka tab **Settings** (atau *Open settings* di popup):

| Pengaturan | Fungsi |
|---|---|
| Translate selected text | Mati = tombol seleksi tidak muncul di mana pun |
| Translate full page | Mati = tombol popup, shortcut, dan menu klik kanan nonaktif, dan halaman yang sedang diterjemahkan dikembalikan |
| Page display | *Replace text* atau *Show both* (berlaku pada terjemahan halaman berikutnya) |
| Translate as you scroll | Hidup = terjemahkan teks dekat layar saja. Mati = terjemahkan semuanya sekaligus |
| Provider, model, dan bahasa tujuan | Lihat [Konfigurasi provider](#konfigurasi-provider). Model yang direkomendasikan diberi tanda ★ dan tersedia sebagai tombol sekali klik, lihat [Memilih model](#memilih-model) |

Perubahan fitur langsung berlaku di tab yang sudah terbuka, tanpa reload. Tab **Docs** berisi dokumentasi lengkap di dalam extension.

<a id="izin-dan-privasi"></a>

## 🔒 Izin dan privasi

| Izin | Alasan |
|---|---|
| `storage` | Menyimpan pengaturan di browser ini |
| `activeTab`, `scripting` | Menyiapkan tab aktif untuk terjemahan halaman (klik ikon, shortcut, menu klik kanan) |
| `contextMenus` | Menambahkan *Translate this page* ke menu klik kanan |
| Semua situs (content script) | Tombol seleksi, tooltip, dan penerjemahan teks di halaman |
| `api.anthropic.com`, `api.deepl.com`, `api-free.deepl.com` | Memanggil API Claude dan DeepL |
| `localhost`, `127.0.0.1` | 9router lokal atau server model lokal |
| Akses opsional per alamat | Hanya diminta saat 9router/Custom memakai alamat lain |

- 📤 Teks yang diseleksi dikirim **hanya ke provider pilihan Anda**, dan hanya setelah Anda menekan tombol terjemahkan. Teks halaman dikirim hanya setelah Anda memulai terjemahan halaman.
- 🗝️ API key disimpan di `chrome.storage.local` pada perangkat ini (tidak disinkronkan ke akun browser Anda). Key tidak pernah masuk ke halaman web: semua panggilan API dilakukan oleh service worker.
- 🧱 Terjemahan ditampilkan sebagai teks biasa, bukan HTML, dan teks sumber diperlakukan sebagai data, bukan perintah, untuk mengurangi risiko prompt injection dari halaman web.

> [!WARNING]
> Jangan menerjemahkan teks rahasia lewat provider yang tidak Anda percaya. Baca [kebijakan privasi](PRIVACY.md) selengkapnya.

<a id="pemecahan-masalah"></a>

## 🩺 Pemecahan masalah

<details>
<summary><b>Buka tabel gejala</b></summary>

<br>

| Gejala | Penyebab dan solusi |
|---|---|
| Tombol seleksi tidak muncul | Reload tab setelah instalasi atau update. Pastikan halamannya bukan `chrome://`, Web Store, atau PDF viewer bawaan. Di Firefox, klik **Allow access** di Settings. |
| Tanda ! merah di ikon / "Couldn't reach this page" | Halaman tidak bisa menjalankan extension (`chrome://`, Web Store, PDF viewer) atau memblokir script. Jika masih gagal, reload tab. |
| "Cannot reach…" | 9router atau layanan lokal tidak berjalan, Base URL salah, atau izin akses alamat belum diberikan. Klik Connect lagi dan setujui izinnya. |
| 401 / 403 | API key salah, kedaluwarsa, atau tidak punya akses ke model itu. |
| 404 | Base URL tidak berakhiran `/v1`, atau modelnya sudah tidak ada. Muat ulang daftar model. |
| 429 | Rate limit tercapai. Tunggu sebentar atau ganti model. |
| 456 (DeepL) | Kuota karakter bulanan habis. |
| Daftar model kosong | Belum ada AI yang terhubung di 9router, atau key tidak bisa membaca daftar model. |
| Hasil mengandung komentar tambahan | Sebagian model kecil mengabaikan instruksi. Pilih model lain. |
| Terjemahan lambat | Biasanya penyebabnya model, bukan extension. Pilih model bertanda ★ di Settings, hindari model reasoning, atau pakai DeepL. Lihat [Memilih model](#memilih-model). |
| Halaman hanya sebagian diterjemahkan | Kode, kolom input, dan elemen tersembunyi sengaja dilewati. Matikan *Translate as you scroll* untuk menerjemahkan semuanya sekaligus, atau tekan Retry setelah error. |
| "Extension was updated" | Reload tab yang sedang Anda buka. |

</details>

## 📌 Batasan

- Mode *Replace text* menerjemahkan potongan demi potongan, sehingga kalimat yang terpecah oleh tag inline (`<b>`, `<a>`) diterjemahkan terpisah. Mode *Show both* menerjemahkan seluruh blok dan terbaca lebih natural.
- Konten yang dimuat setelah terjemahan dimulai (infinite scroll) diterjemahkan begitu scroll berhenti; konten dinamis yang terus berubah bisa memicu terjemahan berulang.
- Terjemahan teks terseleksi tampil bertahap saat model menulisnya. Terjemahan satu halaman terisi per batch (satu batch muncul setelah seluruh balasannya selesai).
- Firefox belum punya tes otomatis (hanya lint dan pengecekan manual); Safari belum dibuat.

## 🧩 Arsitektur

`content.js` (tombol seleksi, tooltip, penerjemah halaman) berkomunikasi dengan `background.js` (service worker), yang membaca pengaturan lalu memanggil `lib/providers.js` untuk 9router, layanan kompatibel OpenAI, Claude, atau DeepL. Peta file, alur pesan, protokol batch, serta cara menambah provider, bahasa, atau pengaturan ada di [`AGENTS.md`](AGENTS.md).

<a id="build"></a>

## 🛠️ Build

Tanpa dependensi runtime atau bundler. Butuh Python 3:

```bash
python3 build.py
```

```
dist/chromium/                              folder siap untuk Load unpacked
dist/firefox/                               folder siap untuk Load Temporary Add-on
dist/wraith-translate-chromium-v<ver>.zip
dist/wraith-translate-firefox-v<ver>.zip
```

Manifest Firefox dibuat otomatis dari `src/manifest.json` (background script + `browser_specific_settings.gecko`). Naikkan `version` di `src/manifest.json` untuk setiap rilis. Lint Firefox: `npx web-ext lint -s dist/firefox`.

<a id="pengujian"></a>

## 🧪 Pengujian

Tes otomatis memakai server OpenAI tiruan lokal dan Chromium headless:

```bash
pip install playwright
python3 build.py
python3 tests/e2e_page.py            # replace/bilingual/lazy/restore, kode dan notranslate dilewati, saklar fitur, jalur error
python3 tests/e2e_popup_inject.py    # popup menyimpan pengaturan, togglePage, injeksi script sesuai kebutuhan
```

Screenshot tes disimpan di `tests/out/`.

Skenario tes manual (17 pengecekan) ada di [`tests/MANUAL.id.md`](tests/MANUAL.id.md).

## 🤝 Kontribusi

Edit hanya `src/`, jalankan `python3 build.py`, lalu jalankan tes di atas. Aturan dan panduan lengkap (peta file, protokol pesan, cara menambah provider, bahasa, atau pengaturan, jebakan umum) ada di [`AGENTS.md`](AGENTS.md).

> [!NOTE]
> Jaga agar `README.md` dan `README.id.md` tetap sinkron saat mengubah dokumentasi.

<br>

---

<div align="center">

<img src="assets/logo.svg" alt="Wraith Translate" width="44" height="44">

<sub>**Wraith Translate** · v1.4.0 · Menerjemahkan diam-diam, seperti hantu 👻</sub>

</div>
