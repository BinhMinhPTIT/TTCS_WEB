// recommendationService.js
import { PythonShell } from 'python-shell';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import productModel from "../models/productModel.js";

export class RecommendationService {
  constructor() {
    // Initialize paths and configuration
    this.pythonScriptPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'recommendation.py');
    this.pythonPath = process.platform === 'win32' ? 'python' : '/usr/bin/python3';
    
    // Configure Python shell options
    this.pythonOptions = {
      mode: 'text',
      pythonPath: this.pythonPath,
      pythonOptions: ['-u'], // Unbuffered output
      scriptPath: dirname(this.pythonScriptPath)
    };
  }

  /**
   * Get product recommendations based on cart items
   * @param {Array} cartItems - Array of products in cart
   * @returns {Promise<Array>} Array of recommended products
   */
  async getProductRecommendations(cartItems) {
    try {
      // Validate input
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return [];
      }

      // Get all products for comparison
      const allProducts = await this.getAllProducts();
      
      // Get target product (most recently added item)
      const targetProduct = cartItems[cartItems.length - 1];
      
      // Get recommendations using Python script
      const recommendations = await this.executePythonScript(allProducts, targetProduct.name);
      
      return recommendations;

    } catch (error) {
      console.error('Error in recommendation service:', error);
      throw new Error('Failed to get product recommendations');
    }
  }

  /**
   * Fetch all products from database
   * @returns {Promise<Array>} Array of all products
   */
  async getAllProducts() {
    try {
      const products = await productModel.find()
        .select('name description price category subCategory')
        .lean();
      
      if (!products || products.length === 0) {
        throw new Error('No products found in database');
      }
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Execute Python recommendation script
   * @param {Array} products - Array of all products
   * @param {string} targetProductName - Name of target product
   * @returns {Promise<Array>} Array of recommended products
   */
  async executePythonScript(products, targetProductName) {
    return new Promise((resolve, reject) => {
      // Configure Python shell options with arguments
      const options = {
        ...this.pythonOptions,
        args: [
          JSON.stringify(products),
          targetProductName
        ]
      };

      // Execute Python script
      PythonShell.run('recommendation.py', options)
        .then(results => {
          try {
            if (!results || results.length === 0) {
              throw new Error('No results from Python script');
            }

            // Parse Python script output
            const recommendations = JSON.parse(results[results.length - 1]);
            
            if (recommendations.error) {
              throw new Error(recommendations.error);
            }

            resolve(recommendations);
          } catch (parseError) {
            console.error('Error parsing Python results:', parseError);
            reject(new Error('Failed to parse recommendations'));
          }
        })
        .catch(err => {
          console.error('Python script execution error:', err);
          reject(new Error('Failed to execute recommendation script'));
        });
    });
  }
}