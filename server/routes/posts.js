/*import express from "express";
import Post from "../models/Post.js";
import { verifyFirebaseToken } from "../middleware/authFirebase.js";

const router = express.Router();

// ✅ Create a new post
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const { title, description, category, imageUrl, location } = req.body;

    const formattedLocation = {
      lat: location?.lat || null,
      lng: location?.lng || null,
      text:
        location?.text ||
        (location?.lat && location?.lng
          ? `Lat: ${location.lat}, Lng: ${location.lng}`
          : ""),
    };

    const post = new Post({
      title,
      description,
      category,
      imageUrl,
      location: formattedLocation,
      status: "Pending", // default
      userId: req.user?.uid || "guest",
      userName: req.user?.name || "Anonymous",
    });

    await post.save();
    console.log("✅ New post created:", post._id);
    res.status(201).json(post);
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ message: err.message });
  }
});


// ✅ Get all posts (with debug logs)
router.get("/", async (req, res) => {
  console.log("🔍 /api/posts route hit — fetching from MongoDB...");
  const startTime = Date.now();
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    console.log(`✅ Posts fetched: ${posts.length} (took ${Date.now() - startTime}ms)`);
    res.json(posts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get a single post by ID
router.get("/:id", async (req, res) => {
  try {
    console.log("🔍 Fetching post by ID:", req.params.id);
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.warn("⚠️ Post not found:", req.params.id);
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error("❌ Error fetching post:", err.message);
    res.status(500).json({ message: err.message });
  }
});


// ✅ Toggle complaint status (Pending ↔ Resolved)
router.put("/:id/status", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.status = post.status === "Resolved" ? "Pending" : "Resolved";
    await post.save();

    console.log(`✅ Updated ${post._id} → ${post.status}`);
    res.json({ status: post.status });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete a post
router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting post:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
*/
import express from "express";
import Post from "../models/Post.js";
import { verifyFirebaseToken } from "../middleware/authFirebase.js";

const router = express.Router();

/* --------------------- CREATE NEW POST --------------------- */
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const { title, description, category, imageUrl, location } = req.body;

    const formattedLocation = {
      lat: location?.lat || null,
      lng: location?.lng || null,
      text:
        location?.text ||
        (location?.lat && location?.lng
          ? `Lat: ${location.lat}, Lng: ${location.lng}`
          : ""),
    };

    const post = new Post({
      title,
      description,
      category,
      imageUrl,
      location: formattedLocation,
      status: "Pending", // default
      userId: req.user?.uid || "guest",
      userName: req.user?.name || "Anonymous",
    });

    await post.save();
    console.log("✅ New post created:", post._id);
    res.status(201).json(post);
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({ message: err.message });
  }
});

/* --------------------- FETCH ALL POSTS --------------------- */
router.get("/", async (req, res) => {
  console.log("🔍 /api/posts route hit — fetching from MongoDB...");
  const startTime = Date.now();
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    console.log(`✅ Posts fetched: ${posts.length} (took ${Date.now() - startTime}ms)`);
    res.json(posts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ message: err.message });
  }
});

/* --------------------- FETCH SINGLE POST --------------------- */
router.get("/:id", async (req, res) => {
  try {
    console.log("🔍 Fetching post by ID:", req.params.id);
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.warn("⚠️ Post not found:", req.params.id);
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error("❌ Error fetching post:", err.message);
    res.status(500).json({ message: err.message });
  }
});

/* --------------------- ADD COMMENT --------------------- */
router.post("/:id/comment", verifyFirebaseToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = {
      userId: req.user.uid,
      name: req.user.name || "Anonymous",
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    console.log(`💬 New comment added to post ${req.params.id}`);
    res.status(201).json(post);
  } catch (err) {
    console.error("❌ Error adding comment:", err);
    res.status(500).json({ message: err.message });
  }
});

/* --------------------- SUPPORT / UNSUPPORT POST --------------------- */
router.post("/:id/support", verifyFirebaseToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existing = post.supports.find((s) => s.userId === req.user.uid);
    if (existing) {
      post.supports = post.supports.filter((s) => s.userId !== req.user.uid);
      console.log(`👎 Support removed by ${req.user.uid}`);
    } else {
      post.supports.push({ userId: req.user.uid, name: req.user.name });
      console.log(`👍 Supported by ${req.user.uid}`);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("❌ Error toggling support:", err);
    res.status(500).json({ message: err.message });
  }
});

/* --------------------- TOGGLE STATUS --------------------- */
router.put("/:id/status", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.status = post.status === "Resolved" ? "Pending" : "Resolved";
    await post.save();

    console.log(`✅ Updated ${post._id} → ${post.status}`);
    res.json({ status: post.status });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ message: err.message });
  }
});

/* --------------------- DELETE POST --------------------- */
router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    console.log(`🗑️ Post deleted: ${req.params.id}`);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting post:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
