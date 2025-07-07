# 🔁 NongKripto.id — SumaSwap Web (Citrea Testnet)

Sistem swap token 10% dari saldo **WCBTC** ke **SUMA** di jaringan **Citrea Testnet**.  
Dibuat dalam bentuk **Single Page Application (SPA)** menggunakan:

- 🚀 Frontend: Bootstrap 5, jQuery, Toastr, AOS
- 🛠 Backend: Node.js + Express
- 🔐 Keamanan: Private key tidak disimpan, hanya digunakan lokal
- 📦 Penyimpanan: File JSON (`swap_history.json`), tanpa database
- 🧪 RPC: https://rpc.testnet.citrea.xyz (Citrea testnet)

---

## 📷 Tampilan

![Tampilan](https://user-images.githubusercontent.com/your-image-preview.png)

---

## 🚀 Cara Menjalankan (Local / Replit)

### 📁 1. Buat struktur proyek:

```
project/
├── server.js
├── package.json
├── swap_history.json     ← isi awal: []
└── public/
    ├── index.html
    └── js/
        └── app.js
```

### 📦 2. Install dependency

```bash
npm install
```

### ▶️ 3. Jalankan server

```bash
npm start
```

Lalu akses:  
[http://localhost:3000](http://localhost:3000)

---

## 💡 Fitur

- Input private key untuk swap token
- Swap 10% dari saldo WCBTC ke SUMA
- Estimasi dan hash transaksi via Satsuma SDK
- Riwayat swap tersimpan di `swap_history.json`
- Tabel histori swap interaktif (SPA style)

---

## 🧾 Contoh Request (backend API)

**POST** `/swap`

```json
{
  "privateKey": "0xabc123..."
}
```

**Response:**

```json
{
  "success": true,
  "address": "0x123...",
  "amountIn": "0.0005",
  "amountOut": "123.45",
  "txHash": "0xhash",
  "explorer": "https://explorer.testnet.citrea.xyz/tx/0xhash",
  "timestamp": "2025-07-06T07:00:00Z"
}
```

---

## 📚 Teknologi Digunakan

| Tool          | Fungsi                 |
|---------------|------------------------|
| Express       | Backend server         |
| @satsuma/sdk  | SDK swap Citrea        |
| ethers.js     | Wallet & transaksi     |
| Bootstrap     | Tampilan frontend      |
| AOS           | Animasi scroll         |
| Toastr        | Notifikasi swap        |
| JSON          | Penyimpanan histori    |

---

## 🛡️ Keamanan

- Private key tidak pernah disimpan ke server
- Histori hanya menyimpan address, jumlah, txHash, dan waktu
- Aman digunakan untuk testnet swap (Citrea only)

---

## 📌 Kredit

- Dibuat oleh: **Jhody**
- Branding: [NongKripto.id](https://t.me/nongkripto)
- Telegram: [@nongkripto](https://t.me/nongkripto)

---

## ⚠️ Catatan

🔸 Proyek ini hanya untuk **keperluan edukasi** dan dijalankan di **Citrea Testnet**.  
🔸 Jangan gunakan private key wallet utama Anda di versi ini.

---

## ✅ Lisensi

MIT © 2025 NongKripto.id
