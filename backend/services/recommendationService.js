// services/recommendationService.js
import { PythonShell } from 'python-shell';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import productModel from "../models/productModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class RecommendationService {
  constructor() {
    this.pythonScriptPath = join(__dirname, '..', 'recommendation.py');
    // Determine the correct Python path based on the operating system
    this.pythonPath = process.platform === 'win32' ? 'python' : '/usr/bin/python3';
  }

  async getProductRecommendations(cartItems) {
    try {
      // Get all products for comparison
      const allProducts = await productModel.find().lean();
      
      if (!cartItems || cartItems.length === 0) {
        return [];
      }

      // If cart has multiple items, use the most recently added one
      const targetProduct = cartItems[cartItems.length - 1];
      
      // Prepare python shell options with error handling
      const options = {
        mode: 'text',
        pythonPath: this.pythonPath,
        pythonOptions: ['-u'], // Unbuffered output
        scriptPath: dirname(this.pythonScriptPath),
        args: [
          JSON.stringify(allProducts),
          targetProduct.name
        ]
      };

      // Return promise for Python shell execution with better error handling
      return new Promise((resolve, reject) => {
        PythonShell.run('recommendation.py', options)
          .then(results => {
            try {
              if (!results || results.length === 0) {
                throw new Error('No results from Python script');
              }
              // Parse the last output from Python
              const recommendations = JSON.parse(results[results.length - 1]);
              if (recommendations.error) {
                throw new Error(recommendations.error);
              }
              resolve(recommendations);
            } catch (parseError) {
              console.error('Error parsing Python results:', parseError);
              reject(parseError);
            }
          })
          .catch(err => {
            console.error('Python script execution error:', err);
            reject(err);
          });
      });
    } catch (error) {
      console.error('Error in recommendation service:', error);
      throw error;
    }
  }
}