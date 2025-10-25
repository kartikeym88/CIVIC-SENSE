import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch"; // if you plan to use fetch


dotenv.config();
const router = express.Router();


// Placeholder endpoint. Replace with real Gemini integration.
router.post("/ask", async (req, res) => {
const { prompt } = req.body;
// TODO: Replace this with a call to Google Generative API (Gemini) from server side.
const reply = `Civic-Sense (prototype): I received your prompt: "${prompt}".\n\n(Replace this with Gemini API integration.)`;
res.json({ reply });
});


export default router;