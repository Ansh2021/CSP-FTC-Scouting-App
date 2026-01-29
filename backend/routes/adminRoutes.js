import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { requireAdmin } from "../middleware/adminAuthorization.js";
import {
  getSchedule,
  getTeamStats,
} from "../ftcscoutapi/ftcscoutcontroller.js";

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

    if (!year) {
      return res.status(400).json("Missing schedule year parameter.");
    } else if (!eventCode) {
      return res.status(400).json("Missing schedule event code parameter.");
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

router.post("/team-stats", requireAdmin, async (req, res) => {
  try {
    const { number, season } = req.body;

    if (!number) {
      return res.status(400).json({ error: "Missing team number parameter." });
    } else if (!season) {
      return res.status(400).json({ error: "Missing team season parameter." });
    }

    const stats = await getTeamStats(number, season);

    res.json({
      message: "Team stats triggered",
      number,
      season,
      stats,
    });

    console.log("Team stats request body:", req.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
