import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bio: { type: String },
  skills: [String],
  github: { type: String },
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);
