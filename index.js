
const express = require('express');

const app = express();
const PORT = 3000;

// Membaca data JSON dari request
app.use(express.json());

app.use(express.static("public"));

// Daftar paket internet awal
const paket = [
    {
        id: 1,
        nama: 'Paket Hemat',
        harga: 15000,
        kuota: '5 GB'
    },
    {
        id: 2,
        nama: 'Paket Internet Bulanan',
        harga: 50000,
        kuota: '25 GB'
    },
    {
        id: 3,
        nama: 'Paket Unlimited',
        harga: 100000,
        kuota: 'Unlimited'
    }
];



// GET: Menampilkan semua paket
app.get('/api/paket', (req, res) => {
    res.json(paket);
});

// GET: Menampilkan satu paket berdasarkan ID
app.get('/api/paket/:id', (req, res) => {
    const id = Number(req.params.id);
    const hasil = paket.find(item => item.id === id);

    if (!hasil) {
        return res.status(404).json({
            message: 'Paket tidak ditemukan'
        });
    }

    res.json(hasil);
});

// POST: Menambahkan paket baru
app.post('/api/paket', (req, res) => {
    const { nama, harga, kuota } = req.body;

    if (
        typeof nama !== 'string' || !nama.trim() ||
        typeof harga !== 'number' || !Number.isFinite(harga) || harga <= 0 ||
        typeof kuota !== 'string' || !kuota.trim()
    ) {
        return res.status(400).json({
            message: 'Nama, harga berupa angka positif, dan kuota wajib diisi'
        });
    }

    const paketBaru = {
        id: paket.length > 0
            ? Math.max(...paket.map(item => item.id)) + 1
            : 1,
        nama: nama.trim(),
        harga,
        kuota: kuota.trim()
    };

    paket.push(paketBaru);

    res.status(201).json({
        message: 'Paket berhasil ditambahkan',
        data: paketBaru
    });
});

// PUT: Memperbarui data paket berdasarkan ID
app.put('/api/paket/:id', (req, res) => {
    const id = Number(req.params.id);
    const hasil = paket.find(item => item.id === id);

    if (!hasil) {
        return res.status(404).json({
            message: 'Paket tidak ditemukan'
        });
    }

    const { nama, harga, kuota } = req.body;

    if (nama !== undefined) {
        if (typeof nama !== 'string' || !nama.trim()) {
            return res.status(400).json({
                message: 'Nama harus berupa teks dan tidak boleh kosong'
            });
        }
        hasil.nama = nama.trim();
    }

    if (harga !== undefined) {
        if (
            typeof harga !== 'number' ||
            !Number.isFinite(harga) ||
            harga <= 0
        ) {
            return res.status(400).json({
                message: 'Harga harus berupa angka positif'
            });
        }
        hasil.harga = harga;
    }

    if (kuota !== undefined) {
        if (typeof kuota !== 'string' || !kuota.trim()) {
            return res.status(400).json({
                message: 'Kuota harus berupa teks dan tidak boleh kosong'
            });
        }
        hasil.kuota = kuota.trim();
    }

    res.json({
        message: 'Paket berhasil diperbarui',
        data: hasil
    });
});

// DELETE: Menghapus paket berdasarkan ID
app.delete('/api/paket/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = paket.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Paket tidak ditemukan'
        });
    }

    const paketDihapus = paket.splice(index, 1)[0];

    res.json({
        message: 'Paket berhasil dihapus',
        data: paketDihapus
    });
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
