import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { requireAdmin } from "../middleware/adminAuthorization.js";
import { getSchedule } from "../ftcscoutapi/ftcscoutcontroller.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { password } = req.body;

  console.log("Admin login hit");

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const isValid = await bcrypt.compare(
    password,
    process.env.ADMIN_HASHED_PASSWORD,
  );

  if (!isValid) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  res.json({ token });
});

router.post("/update-schedule", requireAdmin, async (req, res) => {
  try {
    const { year, eventCode } = req.body;

    if (!year || !eventCode) {
      return res.status(400).json("Missing parameter(s).");
    }

    const schedule = await getSchedule(year, eventCode);

    res.json({
      message: "Schedule updated triggered",
      year,
      eventCode,
      schedule,
    });

    console.log("Schedule request body:", req.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// router.post("/update-schedule", (req, res) => {
//   const schedule = [
//     { match: 1, red: [111, 222], blue: [333, 444] },
//     { match: 2, red: [555, 666], blue: [777, 888] },
//   ];

//   res.json({
//     success: true,
//     schedule,
//   });
// });

router.post("/team-stats", requireAdmin, (req, res) => {
  console.log("not yet");
});

export default router;
