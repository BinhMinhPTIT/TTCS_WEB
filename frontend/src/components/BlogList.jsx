import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs", error);
      }
    };
    
    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      <div>
        {blogs.map((blog) => (
          <div key={blog._id} className="mb-4 p-4 border-b">
            <Link to={`/blog/${blog._id}`} className="text-xl font-semibold text-blue-600 hover:underline">
              {blog.title}
            </Link>
            <p className="text-gray-600 mt-2">{blog.content.slice(0, 150)}...</p>
            <p className="text-sm text-gray-500 mt-2">Posted on: {new Date(blog.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
