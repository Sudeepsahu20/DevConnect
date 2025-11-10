import express from "express";
import { verifyToken } from "../middleware/auth.js";
import Post from "../models/Post.js";

const router = express.Router();

// 📝 Create a post
router.post("/", verifyToken, async (req, res) => {
  try {
    const newPost = new Post({
      user: req.user.id,
      text: req.body.text,
    });
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 📜 Get all posts
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find().populate("user", ["name", "email"]).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ❌ Delete my post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    await post.deleteOne();
    res.json({ msg: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ❤️ Like a post
router.put("/like/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Already liked" });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 💬 Add a comment
router.post("/comment/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const newComment = {
      user: req.user.id,
      text: req.body.text,
    };

    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
