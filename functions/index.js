import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import { requireAdmin } from "./middleware/adminAuthorization.js";
import { onRequest } from "firebase-functions/v2/https";
import {
  getAdminApp,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_PROJECT_ID,
} from "./firebaseAdmin.js";

// const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
// app.use(cors({ origin: 'http://your-frontend-domain.com' })); // Restrict to specific origin
app.use(
  cors({
    origin: [
      "https://csp-ftc-scout.web.app",
      "https://csp-ftc-scout.firebaseapp.com/",
    ], // Allow all origins (for development only)
  }),
);
app.use(express.json()); // Parse JSON bodies

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

app.use("/api/admin", adminRoutes);

export const api = onRequest(
  {
    timeoutSeconds: 120,
    secrets: [FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID],
  },
  app,
);
