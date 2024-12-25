# recommendation.py
import sys
import json
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Union, Any
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ProductRecommender:
    def __init__(self, products: List[Dict[str, Any]]):
        """
        Initialize the ProductRecommender with a list of products.
        
        Args:
            products (List[Dict]): List of product dictionaries containing product information
        """
        self.df = pd.DataFrame(products)
        self.required_columns = ['name', 'description', 'category', 'subCategory']
        self.tfidf_vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_features=5000,
            strip_accents='unicode'
        )
        
    def validate_data(self) -> bool:
        """
        Validate that all required columns exist in the DataFrame.
        
        Returns:
            bool: True if validation passes, False otherwise
        """
        missing_cols = [col for col in self.required_columns if col not in self.df.columns]
        if missing_cols:
            logger.error(f"Missing required columns: {missing_cols}")
            return False
        return True

    def preprocess_features(self) -> None:
        """
        Combine relevant features and preprocess text data for similarity calculation.
        """
        try:
            self.df['features'] = self.df.apply(
                lambda x: ' '.join(filter(None, [
                    str(x['name']),
                    str(x['description']),
                    str(x['category']),
                    str(x['subCategory'])
                ])).lower(),
                axis=1
            )
        except Exception as e:
            logger.error(f"Error in preprocessing features: {str(e)}")
            raise

    def calculate_similarity(self) -> np.ndarray:
        """
        Calculate cosine similarity matrix for all products.
        
        Returns:
            np.ndarray: Similarity matrix
        """
        try:
            tfidf_matrix = self.tfidf_vectorizer.fit_transform(self.df['features'])
            return cosine_similarity(tfidf_matrix, tfidf_matrix)
        except Exception as e:
            logger.error(f"Error calculating similarity: {str(e)}")
            raise

    def get_recommendations(self, target_product_name: str, num_recommendations: int = 5) -> List[Dict[str, Any]]:
        """
        Get product recommendations based on target product name.
        
        Args:
            target_product_name (str): Name of the product to get recommendations for
            num_recommendations (int): Number of recommendations to return
            
        Returns:
            List[Dict]: List of recommended products with their details
        """
        try:
            if not self.validate_data():
                raise ValueError("Data validation failed")

            self.preprocess_features()
            
            # Find target product
            target_idx = self.df[self.df['name'] == target_product_name].index
            if len(target_idx) == 0:
                raise ValueError(f"Product not found: {target_product_name}")
            
            # Calculate similarities
            cosine_sim = self.calculate_similarity()
            sim_scores = list(enumerate(cosine_sim[target_idx[0]]))
            
            # Sort by similarity and get top N recommendations
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
            sim_scores = sim_scores[1:num_recommendations + 1]
            product_indices = [i[0] for i in sim_scores]
            
            # Get recommended products with similarity scores
            recommendations = []
            for idx, (prod_idx, score) in enumerate(sim_scores, 1):
                product = self.df.iloc[prod_idx]
                recommendations.append({
                    'rank': idx,
                    'name': product['name'],
                    'description': product['description'],
                    'price': product['price'],
                    'category': product['category'],
                    'subCategory': product['subCategory'],
                    'similarity_score': round(score * 100, 2)
                })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error getting recommendations: {str(e)}")
            return {"error": str(e)}

def main():
    """
    Main function to handle command line arguments and return recommendations.
    """
    try:
        # Read input from Node.js
        products_json = sys.argv[1]
        target_product = sys.argv[2]
        
        # Parse JSON data
        products = json.loads(products_json)
        
        # Initialize recommender and get recommendations
        recommender = ProductRecommender(products)
        recommendations = recommender.get_recommendations(target_product)
        
        # Return results to Node.js
        print(json.dumps(recommendations))
        
    except Exception as e:
        logger.error(f"Error in main function: {str(e)}")
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()