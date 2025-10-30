import User from "../models/user.js";

// 🟢 Register / create user with role
export const createUser = async (req, res) => {
  try {
    const { uid, name, email, role } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the user already exists
    let user = await User.findOne({ uid });
    if (user) {
      return res.status(200).json({ message: "User already exists", user });
    }

    // Create a new user (default role = citizen)
    user = new User({
      uid,
      name,
      email,
      role: role || "citizen",
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get all users (for admin dashboard)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get current logged-in user info (with role)
export const getCurrentUser = async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ message: "No user UID found" });
    }

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
