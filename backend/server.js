import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";
import adminRoutes from "./routes/adminRoutes.js";
import { requireAdmin } from "./middleware/adminAuthorization.js";

dotenv.config();
  
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
// app.use(cors({ origin: 'http://your-frontend-domain.com' })); // Restrict to specific origin
app.use(cors({
  origin: '*', // Allow all origins (for development only)
}));
app.use(express.json()); // Parse JSON bodies

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// // Example API route
// app.get("/api/hello", (req, res) => {
//   res.json({ message: "Hello from Express!" });
// });

app.use("/api/admin", adminRoutes);

app.post("/api/admin/protected", requireAdmin, (req, res) => {
  res.json({ message: "Hello Admin!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
