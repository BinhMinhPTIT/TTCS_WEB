import React, { useEffect, useState } from "react";
import axios from "axios";
import { backEndURL, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductData, setEditProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: "",
    bestseller: false,
    images: [],
  });
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backEndURL + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleEdit = (item) => {
    console.log("Editing item:", item); // Log the item you're trying to edit
    setEditProductData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      subCategory: item.subCategory,
      sizes: JSON.stringify(item.sizes),  // Ensure it's stringified for editing
      bestseller: item.bestseller,
      images: item.image || [],
    });
    setSelectedProductId(item._id);
    setIsEditing(true);  // Set to true to show the modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("productId", selectedProductId);
      formData.append("name", editProductData.name);
      formData.append("description", editProductData.description);
      formData.append("price", editProductData.price);
      formData.append("category", editProductData.category);
      formData.append("subCategory", editProductData.subCategory);
      formData.append("sizes", editProductData.sizes);
      formData.append("bestseller", editProductData.bestseller);

      Array.from(editProductData.images).forEach((image, index) => {
        formData.append(`image${index + 1}`, image);
      });

      const response = await axios.post(backEndURL + "/api/product/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
      });

      if (response.data.success) {
        toast.success("Product updated successfully!");
        fetchList();  // Refresh the product list
        setIsEditing(false);  // Close the modal
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error updating product.");
      console.error(error);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backEndURL + "/api/product/remove",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <strong>Image</strong>
          <strong>Name</strong>
          <strong>Category</strong>
          <strong>Price</strong>
          <strong className="text-center">Actions</strong>
        </div>

        {/* Product List */}
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 pu-1 px-2 border text-sm"
            key={index}
          >
            <img src={item.image[0]} alt="" className="w-12" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <p
              className="text-right md:text-center cursor-pointer text-lg text-red-400"
              onClick={() => removeProduct(item._id)}
            >
              X
            </p>
          </div>
        ))}
      </div>

      {/* Modal for Editing Product */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              width: "100%",
              maxWidth: "800px", // Increased width for the horizontal layout
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              overflowY: "auto", // Ensures that the modal scrolls if the content exceeds
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Product</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              {/* Left Section */}
              <div className="flex flex-col">
                <label>Name:</label>
                <input
                  type="text"
                  value={editProductData.name}
                  onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
                  style={{ padding: "8px", border: "1px solid #ccc", marginBottom: "10px" }}
                />

                <label>Description:</label>
                <textarea
                  value={editProductData.description}
                  onChange={(e) => setEditProductData({ ...editProductData, description: e.target.value })}
                  style={{ padding: "8px", border: "1px solid #ccc", marginBottom: "10px" }}
                />

                <label>Price:</label>
                <input
                  type="number"
                  value={editProductData.price}
                  onChange={(e) => setEditProductData({ ...editProductData, price: e.target.value })}
                  style={{ padding: "8px", border: "1px solid #ccc", marginBottom: "10px" }}
                />

                <label>Category:</label>
                <input
                  type="text"
                  value={editProductData.category}
                  onChange={(e) => setEditProductData({ ...editProductData, category: e.target.value })}
                  style={{ padding: "8px", border: "1px solid #ccc", marginBottom: "10px" }}
                />
              </div>

              {/* Right Section */}
              <div className="flex flex-col">
                <label>Sub Category:</label>
                <input
                  type="text"
                  value={editProductData.subCategory}
                  onChange={(e) => setEditProductData({ ...editProductData, subCategory: e.target.value })}
                  style={{ padding: "8px", border: "1px solid #ccc", marginBottom: "10px" }}
                />

                <label>Sizes (JSON format):</label>
                <textarea
                  value={editProductData.sizes}
                  onChange={(e) => setEditProductData({ ...editProductData, sizes: e.target.value })}
                  style={{ padding: "8px", border: "1px solid #ccc", marginBottom: "10px" }}
                />

                <label>Bestseller:</label>
                <input
                  type="checkbox"
                  checked={editProductData.bestseller}
                  onChange={(e) => setEditProductData({ ...editProductData, bestseller: e.target.checked })}
                  style={{ marginTop: "5px" }}
                />

                <label>Images:</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setEditProductData({ ...editProductData, images: e.target.files })}
                  style={{ marginTop: "5px" }}
                />
              </div>

              <div className="col-span-2">
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginTop: "20px",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>

            <button
              onClick={() => setIsEditing(false)}  // Close the modal
              style={{
                marginTop: "20px",
                backgroundColor: "gray",
                color: "white",
                padding: "8px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default List;
