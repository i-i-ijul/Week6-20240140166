import express from "express";
const router = express.Router();

// Mock Data Produk Roti
const products = [
  { id: 1, nama: "Croissant Butter", harga: 25000, kategori: "Pastry", deskripsi: "Roti croissant berlapis dengan mentega Prancis asli." },
  { id: 2, nama: "Cinnamon Roll", harga: 20000, kategori: "Sweet", deskripsi: "Roti kayu manis lembut dengan topping cream cheese." },
  { id: 3, nama: "Focaccia Rosemary", harga: 32000, kategori: "Bread", deskripsi: "Roti khas Italia dengan taburan rosemary & minyak zaitun." },
  { id: 4, nama: "Fudgy Brownies", harga: 45000, kategori: "Cake", deskripsi: "Brownies cokelat lumer dengan potongan dark chocolate." },
  { id: 5, nama: "Sourdough Bread", harga: 38000, kategori: "Bread", deskripsi: "Roti ragi alami tinggi serat & kaya rasa." },
  { id: 6, nama: "Matcha Choco Cheese", harga: 28000, kategori: "Sweet", deskripsi: "Roti lembut isian matcha krim keju pilihan." }
];

// GET /api/products - Ambil semua produk
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: products
  });
});

export default router;