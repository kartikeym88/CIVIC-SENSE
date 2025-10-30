/*import express from "express";
const router = express.Router();

// basic test route
router.get("/", (req, res) => {
  res.send("Users route working!");
});

export default router;*/
import express from "express";
import {
  createUser,
  getUsers,
  getCurrentUser,
} from "../controllers/userController.js";
import { verifyFirebaseToken } from "../middleware/authFirebase.js";

const router = express.Router();

// Register user
router.post("/register", createUser);

// Get all users
router.get("/", getUsers);

// Get current user info (requires Firebase token)
router.get("/me", verifyFirebaseToken, getCurrentUser);

export default router;


