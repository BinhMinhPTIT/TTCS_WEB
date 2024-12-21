// routes/blogRoutes.js
import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();




// Create a new blog
router.post("/", async (req, res) => {
  try {
    const { title, content, tags, thumbnail } = req.body;
    const newBlog = new Blog({ title, content, tags, thumbnail });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Error creating blog", error });
  }
});

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching blogs", error });
  }
});

// Get a single blog by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error fetching blog", error });
  }
});

// Update a blog by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(updatedBlog);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error updating blog", error });
  }
});

// Delete a blog by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error deleting blog", error });
  }
});

export default router;
