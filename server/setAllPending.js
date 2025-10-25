import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./models/Post.js";

dotenv.config();

async function updateAllToPending() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const result = await Post.updateMany({}, { status: "Pending" });
    console.log(`✅ Updated ${result.modifiedCount} complaints to Pending.`);

    await mongoose.disconnect();
    console.log("✅ Database disconnected. Done!");
  } catch (error) {
    console.error("❌ Error updating complaints:", error.message);
  }
}

updateAllToPending();
