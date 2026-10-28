import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.js"; // Perhatikan penambahan ekstensi .js

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Bakery Store API!" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});