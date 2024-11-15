import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;
    const image1 = req.files.image1?.[0] || null;
    const image2 = req.files.image2?.[0] || null;
    const image3 = req.files.image3?.[0] || null;
    const image4 = req.files.image4?.[0] || null;

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== null
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );
    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };
    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added Successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for list product
const listProduct = async (req, res) => {
  console.log("List Product Route Accessed");
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.json({ success: false, message: error.message });
  }
};

// Function for removing product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const singleProduct = await productModel.findById(productId);
    res.json({ success: true, singleProduct });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) {
      filter.category = category;
    }

    const products = await productModel.find(filter);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Function for editing product
const editProduct = async (req, res) => {
  try {
    const { productId } = req.body; 
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req.files?.image1?.[0] || null;
    const image2 = req.files?.image2?.[0] || null;
    const image3 = req.files?.image3?.[0] || null;
    const image4 = req.files?.image4?.[0] || null;

    const images = [image1, image2, image3, image4].filter(item => item !== null);

    let imagesUrl = [];
    if (images.length > 0) {
      imagesUrl = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    const updatedProductData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl.length > 0 ? imagesUrl : undefined, 
    };

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      updatedProductData,
      { new: true } 
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export { addProduct, listProduct, removeProduct, singleProduct, getProductsByCategory, editProduct };
