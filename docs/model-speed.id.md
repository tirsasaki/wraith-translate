# Memilih model: uji kecepatan

[← Kembali ke README](../README.id.md#memilih-model)

Terjemahan tidak butuh reasoning, jadi model terbaik adalah yang **kecil dan cepat**. Di **Settings**, model yang direkomendasikan diberi tanda **★** dan muncul sebagai tombol sekali klik di bawah daftar model (rekomendasinya ada di `src/lib/recommended.js`).

Berikut hasil uji kecepatan, supaya Anda tidak perlu mengulangnya. Kondisi: model diakses lewat [9router](https://github.com/decolua/9router) di PC lokal, satu prompt (`Translate to Indonesian: CachyOS Dethroned SteamOS on Steam — Desktop Linux Gaming Has a New Center of Gravity`), streaming aktif, masing-masing dua putaran, pada 2026-10-04. Waktu dalam detik sampai **kata pertama / sampai selesai**, diukur dengan `curl`.

| Model | Putaran 1 | Putaran 2 | Kesimpulan |
|---|---|---|---|
| `gemini/gemini-3.5-flash-lite` | 0,87 / 1,21 | 0,83 / 1,14 | 🥇 **Tercepat dan stabil. Direkomendasikan.** |
| `kr/claude-haiku-4.5` | 3,03 / 3,04 | 1,47 / 1,47 | 👍 Alternatif bagus |
| `gemini/gemini-3.1-flash-lite-preview` | 3,63 / 3,89 | 2,02 / 2,37 | 👌 Cukup |
| `kr/deepseek-3.2` | 2,22 / 2,22 | 8,43 / 8,43 | ⚠️ Tidak stabil |
| `ag/gemini-3.8-flash-low` | 2,66 / 3,39 | 6,17 / 7,20 | ⚠️ Tidak stabil |
| `ag/gemini-3-flash` | 8,94 / 9,54 | 12,47 / 12,75 | 🐌 Lambat: hindari |
| `gemini/gemma-4-31b-it` | 22,44 / 24,18 | 27,95 / 59,49 | 🐌 Sangat lambat: hindari |
| `ag/gemini-3.5-flash-extra-low` | n/a | n/a | ❌ Sudah dihentikan (lihat di bawah) |
| `cx/gpt-5.4-mini` | n/a | n/a | ❔ HTTP 400 pada request ini, tidak terukur |

**Yang ditunjukkan hasil uji ini**

- **Modellah yang menentukan kecepatan, bukan extension.** Setelah kata pertama muncul, terjemahan singkat selesai dalam sekitar setengah detik. Menunggunya terjadi sebelum kata pertama, dan sangat berbeda antar model dan rute.
- **Meminta thinking lebih sedikit tidak membantu di sini.** Pada `ag/gemini-3-flash`, nilai `reasoning_effort` `none`, `minimal`, `low`, dan bawaan semuanya tetap 4,6–12,5 detik sampai kata pertama, karena 9router menyatakan pengaturan itu tidak didukung untuk model tersebut. Extension tetap mengirim pengaturan teringan yang diterima tiap model (dan mengingatnya), tetapi yang benar-benar berhasil adalah memilih model yang cepat.
- **Model yang sudah dihentikan bisa tampak seperti berhasil.** `ag/gemini-3.5-flash-extra-low` menjawab dalam 0,09 detik dengan HTTP 200, tetapi "terjemahannya" ternyata pesan *"Gemini 3.5 Flash is no longer available…"*. Jika hasil terasa terlalu cepat, baca isinya.
- Model "lite" paling cepat, tetapi bisa terdengar kurang halus pada teks panjang atau bernuansa. Jika begitu, `kr/claude-haiku-4.5` (atau Claude Haiku lewat provider Claude) adalah langkah berikutnya.

> [!NOTE]
> Ini satu prompt, dua putaran, satu mesin dan jaringan, lewat satu gateway. Nama dan ketersediaan model sering berubah, dan hasil bergantung pada beban dan lokasi. Anggap urutannya sebagai panduan, lalu ulangi uji dengan model Anda sendiri.

<details>
<summary><b>Jalankan uji kecepatan sendiri</b></summary>

```bash
KEY="ISI_KEY_9ROUTER"            # hapus header Authorization jika gateway Anda tanpa auth
URL=http://localhost:20128/v1/chat/completions
for M in gemini/gemini-3.5-flash-lite kr/claude-haiku-4.5 MODEL/LAIN-ANDA; do
  echo "== $M"
  for i in 1 2; do
    curl -s -o /dev/null -w "status=%{http_code} kata-pertama=%{time_starttransfer}s total=%{time_total}s\n" $URL \
      -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' \
      -d "{\"model\":\"$M\",\"stream\":true,\"max_tokens\":80,\"messages\":[{\"role\":\"user\",\"content\":\"Translate to Indonesian: CachyOS Dethroned SteamOS on Steam — Desktop Linux Gaming Has a New Center of Gravity\"}]}"
  done
done
```

`kata-pertama` adalah yang Anda rasakan sebagai "menunggu". `status` harus `200`; jika bukan, modelnya tidak tersedia untuk Anda. Tambahkan `"reasoning_effort":"low"` ke JSON untuk melihat apakah model Anda bereaksi terhadapnya.

</details>
