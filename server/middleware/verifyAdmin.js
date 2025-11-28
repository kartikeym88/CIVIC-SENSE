import User from "../models/user.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User not found in DB" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: not an admin" });
    }

    next();
  } catch (err) {
    console.error("❌ verifyAdmin error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
