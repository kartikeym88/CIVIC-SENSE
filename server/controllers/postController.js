import Post from "../models/Post.js";

// 🟢 Fetch all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Fetch a single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, description, category, imageUrl, location, userId, userName } = req.body;

    const newPost = new Post({
      title,
      description,
      category,
      imageUrl,
      location,
      userId,
      userName
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🟢 Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { userId, name, text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ userId, name, text });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🟢 Add support to a post
export const addSupport = async (req, res) => {
  try {
    const { userId, name } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // prevent same user from supporting twice
    const alreadySupported = post.supports.some((s) => s.userId === userId);
    if (alreadySupported) {
      return res.status(400).json({ message: "User already supported this post" });
    }

    post.supports.push({ userId, name });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
