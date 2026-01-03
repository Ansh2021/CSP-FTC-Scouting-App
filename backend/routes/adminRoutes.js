import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
    const {password} = req.body;

    console.log("Admin login hit");

    if(!password) {
        return res.status(400).json({ error: "Password is required" });
    }

    const isValid = await bcrypt.compare(password, process.env.ADMIN_HASHED_PASSWORD);

    if(!isValid) {
        return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token });
});

export default router;