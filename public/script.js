
"use strict";

// ==============================
// ELEMEN WEBSITE
// ==============================
const daftarPaket = document.getElementById("paket-list");
const statusElement = document.getElementById("status");
const refreshButton = document.getElementById("refresh-btn");

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartSummary = document.getElementById("cart-summary");
const cartTotal = document.getElementById("cart-total");
const clearCartButton = document.getElementById("clear-cart");

const STORAGE_KEY = "paketku-cart";

let semuaPaket = [];
let keranjang = bacaKeranjang();

// ==============================
// PENYIMPANAN KERANJANG
// ==============================
function bacaKeranjang() {
    try {
        const tersimpan = localStorage.getItem(STORAGE_KEY);

        if (!tersimpan) return [];

        const data = JSON.parse(tersimpan);

        if (!Array.isArray(data)) return [];

        // Validasi sederhana data yang dibaca dari browser.
        return data
            .filter(item =>
                item &&
                typeof item.nama === "string" &&
                Number.isFinite(Number(item.harga))
            )
            .map(item => ({
                id: String(item.id ?? ""),
                nama: item.nama,
                harga: Math.max(0, Number(item.harga)),
                kuota: String(item.kuota ?? "Tidak disebutkan")
            }));
    } catch (error) {
        console.error("Gagal membaca keranjang:", error);
        return [];
    }
}

function simpanKeranjang() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(keranjang));
        return true;
    } catch (error) {
        console.error("Gagal menyimpan keranjang:", error);
        alert("Keranjang tidak dapat disimpan di browser.");
        return false;
    }
}

// ==============================
// FUNGSI PEMBANTU
// ==============================
function buatElemen(tag, className = "", teks = "") {
    const elemen = document.createElement(tag);

    if (className) {
        elemen.className = className;
    }

    elemen.textContent = teks;

    return elemen;
}

function formatRupiah(nilai) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(Number(nilai) || 0);
}

function ambilNama(paket) {
    return String(
        paket.nama ??
        paket.name ??
        paket.nama_paket ??
        paket.title ??
        "Paket Internet"
    );
}

function ambilHarga(paket) {
    const nilai =
        paket.harga ??
        paket.price ??
        paket.harga_paket ??
        0;

    if (typeof nilai === "number") {
        return Number.isFinite(nilai) ? Math.max(0, nilai) : 0;
    }

    return Math.max(
        0,
        Number(String(nilai).replace(/[^\d]/g, "")) || 0
    );
}

function ambilKuota(paket) {
    return String(
        paket.kuota ??
        paket.quota ??
        paket.data ??
        "Tidak disebutkan"
    );
}

function ambilId(paket, index) {
    return String(
        paket.id ??
        paket.id_paket ??
        paket._id ??
        index
    );
}

// ==============================
// MENGAMBIL DATA DARI REST API
// ==============================
async function muatPaket() {
    if (statusElement) {
        statusElement.textContent = "Memuat paket internet...";
    }

    if (refreshButton) {
        refreshButton.disabled = true;
        refreshButton.textContent = "Memuat...";
    }

    try {
        const respons = await fetch("/api/paket");

        if (!respons.ok) {
            throw new Error(`HTTP ${respons.status}`);
        }

        const data = await respons.json();

        if (Array.isArray(data)) {
            semuaPaket = data;
        } else if (Array.isArray(data.paket)) {
            semuaPaket = data.paket;
        } else {
            throw new Error("Format data paket dari API tidak sesuai.");
        }

        tampilkanPaket();

        if (statusElement) {
            statusElement.textContent = semuaPaket.length > 0
                ? `${semuaPaket.length} paket internet tersedia. Pilih paket favoritmu!`
                : "Belum ada paket internet yang tersedia.";
        }
    } catch (error) {
        console.error("Gagal memuat paket:", error);

        if (statusElement) {
            statusElement.textContent =
                "Paket gagal dimuat. Pastikan server Node.js berjalan.";
        }

        if (daftarPaket) {
            daftarPaket.replaceChildren();
        }
    } finally {
        if (refreshButton) {
            refreshButton.disabled = false;
            refreshButton.textContent = "↻ Muat Ulang Paket";
        }
    }
}

// ==============================
// MENAMPILKAN KARTU PAKET
// ==============================
function tampilkanPaket() {
    if (!daftarPaket) return;

    daftarPaket.replaceChildren();

    const simbol = ["⌁", "▥", "∞"];

    semuaPaket.forEach((paket, index) => {
        const id = ambilId(paket, index);
        const nama = ambilNama(paket);
        const harga = ambilHarga(paket);
        const kuota = ambilKuota(paket);

        const kartu = buatElemen("article", "package-card");

        const header = buatElemen("div", "package-header");

        header.appendChild(
            buatElemen(
                "div",
                "package-symbol",
                simbol[index % simbol.length]
            )
        );

        if (index === 1) {
            header.appendChild(
                buatElemen(
                    "span",
                    "popular-badge",
                    "⭐ Paling Populer"
                )
            );
        }

        kartu.appendChild(header);

        const info = buatElemen("div", "package-info");

        info.appendChild(
            buatElemen("h3", "", nama)
        );

        info.appendChild(
            buatElemen("p", "package-description", `Kuota: ${kuota}`)
        );

        info.appendChild(
            buatElemen("p", "package-price", formatRupiah(harga))
        );

        kartu.appendChild(info);

        const tombol = buatElemen(
            "button",
            "package-button",
            "🛒 Pilih Paket"
        );

        tombol.type = "button";

        tombol.addEventListener("click", () => {
            tambahKeKeranjang({
                id,
                nama,
                harga,
                kuota
            });
        });

        kartu.appendChild(tombol);
        daftarPaket.appendChild(kartu);
    });
}

// ==============================
// MENAMBAHKAN PAKET
// ==============================
function tambahKeKeranjang(paket) {
    keranjang.push({
        id: paket.id,
        nama: paket.nama,
        harga: paket.harga,
        kuota: paket.kuota
    });

    simpanKeranjang();
    tampilkanKeranjang();

    // Beri tahu pengguna bahwa paket sudah ditambahkan.
    alert(`${paket.nama} berhasil ditambahkan ke keranjang!`);

    // Arahkan pengguna ke bagian keranjang.
    const bagianKeranjang = document.getElementById("keranjang");

    if (bagianKeranjang) {
        bagianKeranjang.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

// ==============================
// MENGHAPUS SATU PAKET
// ==============================
function hapusDariKeranjang(index) {
    if (index < 0 || index >= keranjang.length) return;

    keranjang.splice(index, 1);
    simpanKeranjang();
    tampilkanKeranjang();
}

// ==============================
// MENAMPILKAN KERANJANG
// ==============================
function tampilkanKeranjang() {
    if (!cartItems || !cartCount || !cartSummary || !cartTotal) {
        return;
    }

    cartItems.replaceChildren();

    // Jumlah item di ikon keranjang.
    cartCount.textContent = String(keranjang.length);

    // Tampilkan ringkasan hanya jika keranjang berisi paket.
    cartSummary.hidden = keranjang.length === 0;

    if (keranjang.length === 0) {
        const kosong = buatElemen("div", "cart-empty");

        kosong.appendChild(
            buatElemen("div", "empty-icon", "🛍️")
        );

        kosong.appendChild(
            buatElemen("h3", "", "Keranjang masih kosong")
        );

        kosong.appendChild(
            buatElemen(
                "p",
                "",
                "Yuk, pilih paket internet favoritmu!"
            )
        );

        const link = buatElemen(
            "a",
            "button button-primary cart-back-button",
            "Lihat Paket Internet"
        );

        link.href = "#daftar-paket";

        kosong.appendChild(link);
        cartItems.appendChild(kosong);
        cartTotal.textContent = formatRupiah(0);

        return;
    }

    let total = 0;

    keranjang.forEach((paket, index) => {
        const harga = Math.max(0, Number(paket.harga) || 0);
        total += harga;

        const kartu = buatElemen("article", "cart-item");
        const info = buatElemen("div", "cart-item-info");

        info.appendChild(
            buatElemen("h3", "", paket.nama)
        );

        info.appendChild(
            buatElemen("p", "", `Kuota: ${paket.kuota}`)
        );

        info.appendChild(
            buatElemen(
                "p",
                "cart-item-price",
                formatRupiah(harga)
            )
        );

        const tombolHapus = buatElemen(
            "button",
            "cart-remove-button",
            "Hapus"
        );

        tombolHapus.type = "button";

        tombolHapus.addEventListener("click", () => {
            hapusDariKeranjang(index);
        });

        kartu.appendChild(info);
        kartu.appendChild(tombolHapus);

        cartItems.appendChild(kartu);
    });

    cartTotal.textContent = formatRupiah(total);
}

// ==============================
// MENGOSONGKAN KERANJANG
// ==============================
if (clearCartButton) {
    clearCartButton.addEventListener("click", () => {
        if (keranjang.length === 0) return;

        const yakin = confirm(
            "Apakah kamu yakin ingin mengosongkan keranjang?"
        );

        if (!yakin) return;

        keranjang = [];
        simpanKeranjang();
        tampilkanKeranjang();
    });
}

// ==============================
// TOMBOL REFRESH PAKET
// ==============================
if (refreshButton) {
    refreshButton.addEventListener("click", muatPaket);
}

// ==============================
// SAAT WEBSITE DIBUKA
// ==============================
tampilkanKeranjang();
muatPaket();
