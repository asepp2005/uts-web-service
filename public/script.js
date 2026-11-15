
const paketList = document.getElementById("paket-list");
const statusElement = document.getElementById("status");
const refreshButton = document.getElementById("refresh-btn");

// Format harga menjadi Rupiah
function formatRupiah(harga) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(harga);
}

// Membuat elemen HTML dengan teks yang aman
function buatElemen(tag, className, text = "") {
    const elemen = document.createElement(tag);
    elemen.className = className;
    elemen.textContent = text;
    return elemen;
}

// Mengambil paket dari REST API
async function muatPaket() {
    statusElement.textContent = "Memuat paket internet...";
    paketList.replaceChildren();

    try {
        const response = await fetch("/api/paket");

        if (!response.ok) {
            throw new Error("Gagal mengambil data paket.");
        }

        const hasil = await response.json();

        const daftarPaket = Array.isArray(hasil)
            ? hasil
            : hasil.paket;

        if (!Array.isArray(daftarPaket)) {
            throw new Error("Format data paket tidak sesuai.");
        }

        if (daftarPaket.length === 0) {
            statusElement.textContent = "Belum ada paket tersedia.";
            return;
        }

        daftarPaket.forEach((paket, index) => {
            // Kartu utama
            const kartu = buatElemen("article", "package-card");

            // Ikon paket
            const ikonPaket = ["⌁", "▥", "∞"];
            const ikon = buatElemen(
                "div",
                "package-symbol",
                ikonPaket[index % ikonPaket.length]
            );

            // Nama dan deskripsi
            const nama = buatElemen("h3", "package-name", paket.nama);
            const deskripsi = buatElemen(
                "p",
                "package-description",
                index === 1
                    ? "Pilihan untuk aktivitas harian."
                    : index === 2
                        ? "Pilihan untuk kebutuhan internetmu."
                        : "Cocok untuk penggunaan sehari-hari."
            );

            const informasi = buatElemen("div", "package-info");
            informasi.append(nama, deskripsi);

            const kepala = buatElemen("div", "package-header");
            kepala.append(ikon, informasi);

            // Label nomor paket
            const tag = buatElemen(
                "span",
                "package-tag",
                `PAKET ${String(index + 1).padStart(2, "0")}`
            );

            // Label populer untuk paket kedua
            if (index === 1) {
                const populer = buatElemen(
                    "span",
                    "popular-badge",
                    "⭐ Paling Populer"
                );
                kartu.appendChild(populer);
            }

            // Harga paket
            const harga = buatElemen("p", "package-price");

            const nilaiHarga = Number(paket.harga);
            harga.textContent =
                Number.isFinite(nilaiHarga) && nilaiHarga >= 0
                    ? formatRupiah(nilaiHarga)
                    : "Harga belum tersedia";

            // Informasi kuota
            const kuota = buatElemen("div", "package-quota");
            const labelKuota = buatElemen("strong", "", "Kuota: ");
            const nilaiKuota = buatElemen(
                "span",
                "",
                String(paket.kuota ?? "Tidak tersedia")
            );

            kuota.append(labelKuota, nilaiKuota);

            // Tombol pilihan paket
            const tombol = buatElemen(
                "button",
                "package-button",
                "🛒 Pilih Paket"
            );
            tombol.type = "button";

            tombol.addEventListener("click", () => {
                alert(
                    `Paket yang kamu pilih: ${paket.nama}\n` +
                    `Harga: ${harga.textContent}\n` +
                    `Kuota: ${paket.kuota ?? "Tidak tersedia"}`
                );
            });

            // Susun semua elemen kartu
            kartu.append(tag, kepala, harga, kuota, tombol);
            paketList.appendChild(kartu);
        });

        statusElement.textContent =
            `Menampilkan ${daftarPaket.length} paket internet.`;

    } catch (error) {
        console.error(error);

        statusElement.textContent =
            "Gagal memuat paket internet.";

        const pesan = buatElemen(
            "p",
            "empty-message",
            "Pastikan server berjalan, lalu tekan Muat Ulang."
        );

        paketList.appendChild(pesan);
    }
}

// Tombol untuk mengambil data terbaru
refreshButton.addEventListener("click", muatPaket);

// Jalankan ketika halaman dibuka
muatPaket();
