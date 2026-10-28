/**
 * Template Caption Generator
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
- Kualitas terjamin dan telah melalui kontrol mutu
- Layanan pelanggan yang responsif
- Pengiriman aman dan tepat waktu

Untuk pemesanan dan informasi lebih lanjut, silakan hubungi kami melalui pesan langsung. Terima kasih atas kepercayaan Anda.

#${tag} #ProdukBerkualitas #BelanjaAman`,

  fresh_bake: (nama, harga, tag) => `🥐 FRESH FROM OVEN! 🥖

Aroma hangat ${nama} baru saja keluar dari oven kami hari ini! 🤤
Dibuat dengan bahan-bahan premium untuk menemani teman ngopi kamu.

💰 Harga: ${harga}

Yuk mampir ke toko atau pesan online via DM sebelum kehabisan! ☕✨

#TokoRoti #${tag} #FreshBake #KulinerEnak`
};

/**
 * Aturan Validasi Form
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
  }
};

// State Navigasi Halaman
const btnEtalase = document.getElementById("btn-etalase");
const btnCaption = document.getElementById("btn-caption");
const pageEtalase = document.getElementById("page-etalase");
const pageCaption = document.getElementById("page-caption");
const form = document.getElementById("form");

function switchTab(page) {
  if (page === "etalase") {
    pageEtalase.classList.add("active");
    pageCaption.classList.remove("active");
    btnEtalase.classList.add("active");
    btnCaption.classList.remove("active");
  } else {
    pageCaption.classList.add("active");
    pageEtalase.classList.remove("active");
    btnCaption.classList.add("active");
    btnEtalase.classList.remove("active");
  }
}

btnEtalase.addEventListener("click", () => switchTab("etalase"));
btnCaption.addEventListener("click", () => switchTab("caption"));

/**
 * Fetch Data Produk & Render ke Etalase
 */
async function loadProducts() {
  const grid = document.getElementById("product-grid");
  try {
    // Memanggil API backend (pastikan server backend berjalan)
    const response = await fetch("http://localhost:3000/api/products");
    const result = await response.json();
    
    grid.innerHTML = "";
    result.data.forEach((p) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div>
          <h3>${p.nama}</h3>
          <p>${p.deskripsi}</p>
        </div>
        <div>
          <div class="price">Rp ${p.harga.toLocaleString("id-ID")}</div>
          <button class="btn-primary" onclick="orderProduct('${p.nama}', ${p.harga})">Buat Caption</button>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = "<p>Gagal memuat produk dari server backend. Pastikan server sudah dijalankan.</p>";
  }
}

// Auto-fill dari Etalase ke Form Caption
window.orderProduct = function(nama, harga) {
  document.getElementById("nama").value = nama;
  document.getElementById("harga").value = harga;
  switchTab("caption");
  validate("nama");
  validate("harga");
};

/**
 * Validasi Form Realtime & Submit
 */
function validate(id) {
  const input = document.getElementById(id);
  const msg = rules[id](input.value);
  document.getElementById(`${id}-error`).textContent = msg;
  input.setAttribute("aria-invalid", msg ? "true" : "false");
  return !msg;
}

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
  
  const tag = nama
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  document.getElementById("caption").value = templates[template](nama, harga, tag);
});

// Fitur Salin Caption
document.getElementById("copy-btn").addEventListener("click", () => {
  const captionText = document.getElementById("caption");
  if (!captionText.value) return;
  captionText.select();
  navigator.clipboard.writeText(captionText.value);
  alert("Caption berhasil disalin!");
});

// Inisialisasi
loadProducts();