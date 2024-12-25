import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

const BlogEditor = ({ onSave, blog }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setContent(blog.content || "");
      setThumbnail(blog.thumbnail || "");
    } else {
      setTitle("");
      setContent("");
      setThumbnail("");
    }
  }, [blog]);


  const handleSave = () => {
    console.log({ title, content, thumbnail });
    onSave({ title, content, thumbnail });
    setTitle("");
    setContent("");
    setThumbnail("");
  };


  return (
    <div className="p-4 border rounded mb-4 bg-white">
      <div>
        <label className="block mb-2 font-semibold">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="Nhập tiêu đề bài viết..."
        />
      </div>
      <div>
        <label className="block mb-2 font-semibold">Thumbnail</label>
        <input
          type="text"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="Nhập URL ảnh đại diện..."
        />
      </div>
      <div>
        <label className="block mb-2 font-semibold">Content:</label>
        <Editor
          apiKey="lvivh3c8qfloh6xetl80ia75j1hvrojjz6hetavcdqupft3r"
          value={content}
          init={{
            height: 300,
            menubar: false,
            plugins: ["link image code"],
            toolbar: "undo redo | bold italic | alignleft aligncenter alignright | code",
          }}
          onEditorChange={(newContent) => setContent(newContent)}
        />
      </div>
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save blog
      </button>
    </div>
  );
};

export default BlogEditor;
