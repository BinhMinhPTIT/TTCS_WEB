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
    setEditProductData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      subCategory: item.subCategory,
      sizes: JSON.stringify(item.sizes), // Convert sizes to JSON string
      bestseller: item.bestseller,
      images: item.image || [], // Ensure images is initialized with existing URLs
    });
    setSelectedProductId(item._id); // Store the product ID
    setIsEditing(true); // Open the modal
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const sizesArray = editProductData.sizes
        .split(",")
        .map((size) => size.trim());
  
      const payload = {
        productId: selectedProductId,
        name: editProductData.name.trim(),
        description: editProductData.description.trim(),
        price: parseFloat(editProductData.price),
        category: editProductData.category.trim(),
        subCategory: editProductData.subCategory.trim(),
        sizes: sizesArray,
        bestseller: editProductData.bestseller,
        images: editProductData.images
          .map((img) => (typeof img === "string" ? img : null))
          .filter(Boolean),
      };
  
      console.log("Payload being sent:", payload); // Debug payload
  
      const response = await axios.put(
        `${backEndURL}/api/product/edit`,
        payload,
        { headers: { token } }
      );
  
      if (response.data.success) {
        toast.success("Product updated successfully!");
        fetchList();
        setIsEditing(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error updating product.");
      console.error("Error response:", error.response?.data || error.message);
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
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <img src={item.image[0]} alt="" className="w-12" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <div className="flex justify-end md:justify-center gap-4">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button
                className="text-red-400 hover:text-red-600"
                onClick={() => removeProduct(item._id)}
              >
                X
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* Modal for Editing Product */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Name:</label>
                  <input
                    type="text"
                    value={editProductData.name}
                    onChange={(e) =>
                      setEditProductData({ ...editProductData, name: e.target.value })
                    }
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Category:</label>
                  <input
                    type="text"
                    value={editProductData.category}
                    onChange={(e) =>
                      setEditProductData({ ...editProductData, category: e.target.value })
                    }
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Description:</label>
                <textarea
                  value={editProductData.description}
                  onChange={(e) =>
                    setEditProductData({
                      ...editProductData,
                      description: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Price:</label>
                  <input
                    type="number"
                    value={editProductData.price}
                    onChange={(e) =>
                      setEditProductData({ ...editProductData, price: e.target.value })
                    }
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Bestseller:</label>
                  <input
                    type="checkbox"
                    checked={editProductData.bestseller}
                    onChange={(e) =>
                      setEditProductData({
                        ...editProductData,
                        bestseller: e.target.checked, // Correctly update the state
                      })
                    }
                  />
                </div>

              </div>
              <div>
                <label className="block text-sm font-medium">Images:</label>
                <div className="flex gap-2 mb-2">
                  {editProductData.images &&
                    editProductData.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={typeof img === "string" ? img : URL.createObjectURL(img)}
                          alt={`Preview ${index}`}
                          className="w-12 h-12 object-cover border rounded"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditProductData({
                              ...editProductData,
                              images: editProductData.images.filter((_, i) => i !== index),
                            })
                          }
                          className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full"
                        >
                          X
                        </button>
                      </div>
                    ))}
                </div>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    setEditProductData({
                      ...editProductData,
                      images: [...editProductData.images, ...Array.from(e.target.files)],
                    })
                  }
                  className="w-full border rounded p-2"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </>
  );
};

export default List;
