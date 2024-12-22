import mongoose from "mongoose";
import productModel from "../models/productModel.js"; // Đường dẫn đến Product model
import { PythonShell } from "python-shell";

// Kết nối MongoDB
mongoose.connect("mongodb+srv://BinhMinhPTIT:dshfklsjdhfk1510@nodeandexpresscourse.8jwr01s.mongodb.net/WebTTCS?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Lấy danh sách sản phẩm từ MongoDB
const getProducts = async () => {
  try {
    const products = await productModel.find().lean();
    return products;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};

// Gọi file Python
const recommendProducts = (products, productName) => {
  return new Promise((resolve, reject) => {
    const options = {
      args: [JSON.stringify(products), productName], // Truyền dữ liệu sang Python
    };

    PythonShell.run("recommendation.py", options, (err, results) => {
      if (err) return reject(err);

      try {
        // Kết quả trả về từ Python
        const recommendations = JSON.parse(results);
        resolve(recommendations);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
};

// Endpoint xử lý gợi ý
const getRecommendations = async (productName) => {
  try {
    const products = await getProducts(); // Lấy dữ liệu từ MongoDB
    const recommendations = await recommendProducts(products, productName); // Gọi Python xử lý
    console.log("Recommendations:", recommendations);
  } catch (err) {
    console.error("Error:", err);
  }
};

// Gọi API ví dụ
getRecommendations("Shirt");
