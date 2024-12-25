import mongoose from "mongoose";
import productModel from "../models/productModel.js"; // Path to Product model
import { PythonShell } from "python-shell";

// Connect to MongoDB
mongoose.connect("mongodb+srv://BinhMinhPTIT:dshfklsjdhfk1510@nodeandexpresscourse.8jwr01s.mongodb.net/WebTTCS?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Fetch products from MongoDB
const getProducts = async () => {
  try {
    const products = await productModel.find().lean();
    return products;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};

// Call Python script
const recommendProducts = (products, productName) => {
  return new Promise((resolve, reject) => {
    const options = {
      args: [JSON.stringify(products), productName], // Pass data to Python
    };

    PythonShell.run("recommendation.py", options, (err, results) => {
      if (err) return reject(err);

      try {
        // Ensure that the Python output is valid JSON
        const recommendations = JSON.parse(results[results.length - 1]);
        resolve(recommendations);
      } catch (parseError) {
        console.error("Error parsing Python results:", parseError);
        reject(parseError);
      }
    });
  });
};

// Get recommendations
const getRecommendations = async (productName) => {
  try {
    const products = await getProducts(); // Get products from MongoDB
    const recommendations = await recommendProducts(products, productName); // Call Python for processing
    console.log("Recommendations:", recommendations);
  } catch (err) {
    console.error("Error:", err);
  }
};

// Example API call
getRecommendations("Áo giữ nhiệt nam");
