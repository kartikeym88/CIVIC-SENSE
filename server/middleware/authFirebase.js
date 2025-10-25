import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();


if (!admin.apps.length) {
const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!path || !fs.existsSync(path)) {
console.warn("Firebase service account file not found. Make sure FIREBASE_SERVICE_ACCOUNT_PATH is set.");
} else {
const serviceAccount = JSON.parse(fs.readFileSync(path, "utf8"));
admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
});
}
}


export async function verifyFirebaseToken(req, res, next) {
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith("Bearer ")) {
return res.status(401).json({ message: "Missing or invalid authorization header" });
}
const idToken = authHeader.split("Bearer ")[1];
try {
const decoded = await admin.auth().verifyIdToken(idToken);
req.user = { uid: decoded.uid, email: decoded.email, name: decoded.name || decoded.email };
next();
} catch (err) {
console.error("Error verifying Firebase ID token", err);
res.status(401).json({ message: "Unauthorized" });
}
}