// api/recommendations.js
import { RecommendationService } from '../services/recommendationService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { cartData } = req.body;
    
    // Convert cartData object to array if needed
    const cartItems = Object.values(cartData);
    
    if (!cartItems.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const recommendationService = new RecommendationService();
    const recommendations = await recommendationService.getProductRecommendations(cartItems);

    res.status(200).json({ recommendations });
  } catch (error) {
    console.error('Error in recommendations API:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
}