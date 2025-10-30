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
// server/models/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String, required: true },
    role: { type: String, enum: ["citizen", "admin"], default: "citizen" }, // 🟢 new
  },
  { timestamps: true } // automatically manages createdAt and updatedAt
);

const User = mongoose.model("User", userSchema);
export default User;

