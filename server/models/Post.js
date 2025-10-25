import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: String,
  name: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const supportSchema = new mongoose.Schema({
  userId: String,
  name: String,
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  imageUrl: String,
  location: {
    lat: Number,
    lng: Number,
    text: String,
  },
  userId: String,
  userName: String,
  comments: [commentSchema],
  supports: [supportSchema],
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" },
});

export default mongoose.model("Post", postSchema);
