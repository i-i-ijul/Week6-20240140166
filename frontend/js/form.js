/**
 * @file form.js — halaman Caption.
 * Validasi input nama produk & harga, lalu buat caption dari template yang dipilih.
 */

/**
 * Fungsi pembuat caption.
 * @callback TemplateFn
 * @param {string} nama - Nama produk.
 * @param {string} harga - Harga yang sudah diformat Rupiah, contoh `"Rp 25.000"`.
 * @param {string} tag - Nama produk dalam bentuk hashtag (PascalCase, tanpa `#`).
 * @returns {string} Caption lengkap.
 */

/**
 * Template caption. Key-nya harus sama dengan `value` di `<select id="template">`.
 * @type {Object<string, TemplateFn>}
 */
const templates = {
    promo: (nama, harga, tag) => `🔥🔥 PROMO SPESIAL HARI INI! 🔥🔥

Siapa yang udah nungguin ${nama}? Akhirnya hadir dengan harga yang bikin kaget! 😱

💰 Cuma ${harga} aja!
✅ Kualitas terjamin
✅ Stok terbatas, siapa cepat dia dapat
✅ Pengiriman cepat ke seluruh Indonesia

Jangan sampai nyesel karena kehabisan ya! ⏰
Langsung checkout sekarang sebelum harga balik normal 🛒💨

#Promo #${tag} #DiskonHariIni #BelanjaHemat`,

    santai: (nama, harga, tag) => `Hai bestie! 👋✨

Lagi cari ${nama}? Pas banget, kamu nyasar ke tempat yang tepat 😎

Gak perlu nguras dompet, cukup ${harga} aja udah bisa kamu bawa pulang. Worth it parah sih ini, beneran deh! 🤌

Cocok buat dipakai sendiri, atau dijadiin kado buat orang tersayang 🎁💕

Yuk mampir, chat aja kalau ada yang mau ditanyain~ 💬

#${tag} #RekomendasiProduk #RacunBelanja #WorthIt`,

    formal: (nama, harga, tag) => `Dengan bangga kami persembahkan:
✦ ${nama} ✦

Produk ini dipilih secara cermat untuk memberikan kualitas terbaik dan pengalaman yang memuaskan bagi Anda.

Harga: ${harga}

Keunggulan:
• Kualitas terjamin dan telah melalui kontrol mutu
• Layanan pelanggan yang responsif
• Pengiriman aman dan tepat waktu

Untuk pemesanan dan informasi lebih lanjut, silakan hubungi kami melalui pesan langsung. Terima kasih atas kepercayaan Anda.

#${tag} #ProdukBerkualitas #BelanjaAman`,
};

const form = document.getElementById("form");

/**
 * Aturan validasi per input. Key-nya sama dengan `id` input di form.
 * Tiap aturan menerima nilai input dan mengembalikan pesan error,
 * atau string kosong `""` kalau valid.
 * @type {Object<string, function(string): string>}
 */
const rules = {
    nama: (v) => {
        v = v.trim();
        if (!v) return "Nama produk wajib diisi.";
        if (v.length < 3) return `Nama produk minimal 3 karakter (sekarang ${v.length}).`;
        if (v.length > 60) return `Nama produk maksimal 60 karakter (sekarang ${v.length}).`;
        if (!/\p{L}/u.test(v)) return "Nama produk harus mengandung huruf.";
        return "";
    },
    harga: (v) => {
        if (!v) return "Harga wajib diisi.";
        const n = Number(v);
        if (!Number.isInteger(n)) return "Harga harus angka bulat, tanpa koma.";
        if (n < 1000) return "Harga minimal Rp 1.000.";
        if (n > 100000000) return "Harga maksimal Rp 100.000.000.";
        return "";
    },
};

/**
 * Validasi satu input: tampilkan pesan error di bawahnya dan set `aria-invalid`.
 * @param {string} id - `id` input, harus ada di {@link rules}.
 * @returns {boolean} `true` kalau valid.
 */
function validate(id) {
    const input = document.getElementById(id);
    const msg = rules[id](input.value);
    document.getElementById(`${id}-error`).textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
}

// langsung cek pas ngetik, biar error ketahuan tanpa nunggu submit
for (const id in rules) {
    document.getElementById(id).addEventListener("input", () => validate(id));
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const invalid = Object.keys(rules).filter((id) => !validate(id));
    if (invalid.length) {
        document.getElementById(invalid[0]).focus();
        document.getElementById("caption").value = "";
        return;
    }

    const nama = document.getElementById("nama").value.trim();
    const harga = Number(document.getElementById("harga").value)
        .toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
    const template = document.getElementById("template").value;
    // "kopi susu aren" -> "KopiSusuAren"
    const tag = nama.replace(/[^\p{L}\p{N}\s]/gu, "").split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");

    document.getElementById("caption").value = templates[template](nama, harga, tag);
});