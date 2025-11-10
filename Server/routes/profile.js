import express from "express";
import Profile from "../models/Profile.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { bio, skills, github } = req.body;
    const existingProfile = await Profile.findOne({ user: req.user.id });

    if (existingProfile) {
      existingProfile.bio = bio;
      existingProfile.skills = skills;
      existingProfile.github = github;
      await existingProfile.save();
      return res.json({ msg: "Profile updated", profile: existingProfile });
    }

    const newProfile = new Profile({
      user: req.user.id,
      bio,
      skills,
      github,
    });

    await newProfile.save();
    res.status(201).json({ msg: "Profile created", profile: newProfile });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/me", verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "email"]);
    if (!profile) return res.status(404).json({ msg: "No profile found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
