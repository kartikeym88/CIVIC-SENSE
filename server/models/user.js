/*import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
uid: { type: String, unique: true },
name: String,
email: { type: String, unique: true },
role: { type: String, enum: ["citizen","official","admin"], default: "citizen" },
createdAt: { type: Date, default: Date.now }
});


export default mongoose.model("User", userSchema);
*/
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

// ✅ Prevent OverwriteModelError in dev/hot reload
export default mongoose.models.User || mongoose.model("User", userSchema);

