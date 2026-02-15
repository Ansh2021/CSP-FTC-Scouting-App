import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { requireAdmin } from "../middleware/adminAuthorization.js";
import {
  getSchedule,
  getTeamStats,
  getEventStats,
} from "../ftcscoutapi/ftcScoutController.js";
import { defineSecret } from "firebase-functions/params";

const router = express.Router();

export const ADMINHASH = defineSecret("ADMIN_HASHED_PASSWORD");
export const JWT_SECRET = defineSecret("JWT_SECRET");

router.post("/login", async (req, res) => {
  const { password } = req.body;

  console.log("Admin login hit");

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const adminHash = ADMINHASH.value() || "";
  console.log("given password", password);
  console.log("admin hash", adminHash);
  // console.log(
  //   "password type:",
  //   typeof password,
  //   "hash type:",
  //   typeof adminHash,
  // );
  if (!adminHash) {
    throw new Error("ADMINHASH not set");
  }

  const isValid = await bcrypt.compare(password, adminHash);

  if (!isValid) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const jwtSecret = JWT_SECRET.value();
  const token = jwt.sign({ role: "admin" }, jwtSecret, {
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

router.post("/event-stats", requireAdmin, async (req, res) => {
  try {
    const { year, eventCode } = req.body;

    if (!year) {
      return res.status(400).json("Missing event stats year parameter.");
    } else if (!eventCode) {
      return res.status(400).json("Missing event stats event code parameter.");
    }

    const eventStats = await getEventStats(year, eventCode);

    res.json({
      message: "Event stats triggered",
      year,
      eventCode,
      eventStats,
    });

    console.log("Event stats request body:", req.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
