# Skenario tes manual

17 pengecekan sebagai pelengkap tes otomatis di folder ini. Jalankan sebelum rilis, di Chromium dan di Firefox (140+). Versi bahasa Inggris: [`MANUAL.md`](MANUAL.md).

## Persiapan

1. Build: `python3 build.py`.
2. Pasang extension:
   - **Chromium:** `chrome://extensions` → Developer mode → **Load unpacked** → `dist/chromium`.
   - **Firefox:** `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on** → `dist/firefox/manifest.json`. Lalu klik **Allow access** di banner halaman Settings.
3. Siapkan minimal satu provider yang berfungsi. Defaultnya 9router yang berjalan lokal (`http://localhost:20128/v1`). Skenario 8 juga butuh key OpenAI-compatible, key Claude, dan key DeepL.
4. Pakai halaman artikel biasa (misalnya artikel Wikipedia) yang punya judul, paragraf, dan blok kode.

Tiap skenario berisi langkah, lalu hasil yang **diharapkan**. Catat browser, versinya, dan skenario yang gagal.

## Pengaturan

1. **Setup 9router.** Di Settings, pilih 9router, klik **Connect**, pilih model, lalu klik **Save settings** dan **Test translation**.
   **Diharapkan:** daftar model muncul setelah Connect, dan tes menampilkan terjemahan.

## Teks yang diseleksi

2. **Seleksi dasar.** Seleksi satu kalimat di halaman biasa, lalu klik tombol 文.
   **Diharapkan:** tombol muncul tepat di atas seleksi. Tooltip menampilkan hasil lengkap tanpa scrollbar di dalamnya.

3. **Kolom teks.** Seleksi teks di dalam `<textarea>`.
   **Diharapkan:** tombol tetap muncul.

4. **Bahasa lain dan menutup tooltip.** Di tooltip, ganti menu **Translate to**. Lalu tekan `Esc`, dan pada terjemahan berikutnya klik di tempat lain di halaman.
   **Diharapkan:** teks yang sama diterjemahkan ulang ke bahasa yang dipilih, dan bahasa tujuan yang tersimpan di Settings tidak berubah. `Esc` dan klik di tempat lain sama-sama menutup tooltip.

5. **API key salah.** Simpan API key yang salah, lalu terjemahkan seleksi.
   **Diharapkan:** tooltip menampilkan pesan 401/403 dan tombol **Open settings**.

6. **Provider tidak bisa dihubungi.** Matikan 9router, lalu terjemahkan seleksi.
   **Diharapkan:** muncul pesan "Cannot reach…".

7. **Terlalu panjang.** Seleksi lebih dari 5.000 karakter, lalu terjemahkan.
   **Diharapkan:** muncul pesan "Text is too long".

8. **Provider lain.** Ganti ke Custom (pilih preset, klik **Connect**), lalu Claude (**Load models**), lalu DeepL. Simpan masing-masing dan ulangi skenario 2.
   **Diharapkan:** tiap provider menerjemahkan seleksi. Bagian atas tooltip menampilkan nama provider.

9. **Halaman browser.** Seleksi teks di `chrome://extensions` (Firefox: `about:addons`).
   **Diharapkan:** tombol tidak muncul. Extension memang tidak bisa berjalan di halaman ini.

10. **Extension di-reload.** Reload extension di halaman extensions tanpa reload tab, lalu terjemahkan seleksi di tab itu.
    **Diharapkan:** muncul pesan "Extension was updated. Reload this page and try again."

## Saklar fitur

11. **Seleksi dimatikan.** Di Settings, matikan **Translate selected text**, simpan, lalu reload tab.
    **Diharapkan:** menyeleksi teks tidak memunculkan tombol. Tombol **Translate this page** di popup tetap berfungsi.

12. **Halaman penuh dimatikan.** Matikan **Translate full page** lalu simpan.
    **Diharapkan:** menu klik kanan "Translate this page with Wraith Translate" hilang, dan tombol halaman di popup nonaktif.

## Terjemahan satu halaman

13. **Mode Replace.** Pilih **Replace text**, biarkan **Translate as you scroll** menyala, lalu terjemahkan artikel panjang dari popup.
    **Diharapkan:** teks yang terlihat berubah dan blok kode tidak tersentuh. Scroll ke bawah menerjemahkan sisanya. **Show original page** di popup (atau `Alt+W`) mengembalikan semuanya.

14. **Mode Show both.** Pilih **Show both** lalu terjemahkan halaman.
    **Diharapkan:** terjemahan muncul di bawah tiap paragraf. Tombol **Original** di bar bawah menyembunyikan dan menampilkan terjemahan.

15. **Error saat terjemahan halaman.** Simpan API key yang salah lalu terjemahkan halaman.
    **Diharapkan:** teks halaman tidak berubah. Bar bawah menampilkan error dengan tombol **Retry** dan **Settings**.

## Popup

16. **Tab yang dibuka sebelum instal.** Buka sebuah tab, lalu pasang atau reload extension. Di tab itu, tanpa reload, klik ikon di toolbar lalu **Translate this page**.
    **Diharapkan:** popup terbuka dan halaman diterjemahkan. Content script disuntikkan saat dibutuhkan.

17. **Halaman yang tidak bisa diterjemahkan.** Klik ikon di toolbar saat membuka `chrome://extensions`.
    **Diharapkan:** popup menyatakan halaman ini tidak bisa diterjemahkan. **Open settings** tetap berfungsi.
