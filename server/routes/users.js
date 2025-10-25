/*import express from "express";
const router = express.Router();

// basic test route
router.get("/", (req, res) => {
  res.send("Users route working!");
});

export default router;*/
import express from "express";
import { createUser, getUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.get("/", getUsers);

export default router;

