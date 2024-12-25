import React, { useState, useEffect } from "react";
import BlogEditor from "../components/BlogEditor";
import axios from "axios";
import { backEndURL } from "../App";
import { toast } from "react-toastify";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${backEndURL}/api/blogs`);
      console.log("Blogs fetched:", response.data);
      setBlogs(response.data);
    } catch (error) {
      console.error("Fetch blogs failed:", error);
      toast.error("Không thể tải danh sách bài viết!");
    }
  };

  const handleSaveBlog = async (blogData) => {
    try {
      if (selectedBlog) {
        console.log("Updating blog:", blogData);
        await axios.put(`${backEndURL}/api/blogs/${selectedBlog._id}`, blogData);
        toast.success("Cập nhật bài viết thành công!");
      } else {
        console.log("Adding new blog:", blogData);
        await axios.post(`${backEndURL}/api/blogs`, blogData);
        toast.success("Thêm bài viết mới thành công!");
      }
      fetchBlogs(); // Reload danh sách bài viết
      setSelectedBlog(null);
    } catch (error) {
      console.error("Save blog failed:", error);
      toast.error("Lưu bài viết thất bại!");
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      await axios.delete(`${backEndURL}/api/blogs/${id}`);
      toast.success("Xóa bài viết thành công!");
      fetchBlogs(); // Reload danh sách bài viết
    } catch (error) {
      toast.error("Xóa bài viết thất bại!");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Blog Manager</h1>
      <BlogEditor onSave={handleSaveBlog} blog={selectedBlog} />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Blog list</h2>
        <ul>
          {blogs.map((blog) => (
            <li key={blog._id} className="border-b py-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{blog.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="text-blue-500 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogManagement;
