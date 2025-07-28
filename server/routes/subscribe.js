// server/routes/subscribe.js
import express from "express";
import Subscriber from "../models/Subscriber.js"; // Create a model
const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    await Subscriber.create({ email });
    res.json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
