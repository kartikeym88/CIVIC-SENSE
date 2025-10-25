import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import postsRouter from "./routes/posts.js";
import usersRouter from "./routes/users.js";
import aiRouter from "./routes/ai.js";

import fs from "fs";
import admin from "firebase-admin";


let firebaseApp;

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;

try {
    // Only initialize if no default app exists
    if (!admin.apps.length) {
        const serviceAccount = JSON.parse(
            fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf-8")
        );

        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        console.log("✅ Firebase initialized successfully");
    } else {
        // Reuse existing app
        firebaseApp = admin.app();
        console.log("ℹ️ Firebase already initialized, reusing existing app");
    }
} catch (error) {
    console.error("❌ Firebase failed to initialize:", error.message);
}

app.get("/test-firebase", async (req, res) => {
    try {
        // Example: list all users (first 10)
        const listUsersResult = await admin.auth().listUsers(10);
        res.json(listUsersResult.users.map(u => u.email));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => res.send("Civic-Bridge Server Running"));


app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);
app.use("/api/ai", aiRouter);



app.listen(PORT, () => console.log(`Server listening on ${PORT}`));