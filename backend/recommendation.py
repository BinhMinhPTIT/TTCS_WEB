# recommendation.py
import sys
import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def recommend_products(products, target_product_name):
    try:
        # Convert products list to DataFrame
        df = pd.DataFrame(products)
        
        # Ensure required columns exist
        required_columns = ['name', 'description', 'category', 'subCategory']
        for col in required_columns:
            if col not in df.columns:
                return {"error": f"Missing required column: {col}"}
        
        # Combine relevant features for similarity calculation
        df['features'] = df.apply(
            lambda x: f"{x['name']} {x['description']} {x['category']} {x['subCategory']}", 
            axis=1
        )
        
        # Create TF-IDF vectors
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(df['features'])
        
        # Calculate cosine similarity
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
        
        # Get index of target product
        target_idx = df[df['name'] == target_product_name].index
        if len(target_idx) == 0:
            return {"error": f"Product not found: {target_product_name}"}
        
        idx = target_idx[0]
        
        # Get similarity scores
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Get top 5 similar products (excluding the target product)
        sim_scores = sim_scores[1:6]
        product_indices = [i[0] for i in sim_scores]
        
        # Get recommended products
        recommendations = df.iloc[product_indices][
            ['name', 'description', 'price', 'category', 'subCategory']
        ].to_dict('records')
        
        return recommendations
        
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        # Read input from Node.js
        products_json = sys.argv[1]
        target_product = sys.argv[2]
        
        # Parse JSON data
        products = json.loads(products_json)
        
        # Get recommendations
        recommendations = recommend_products(products, target_product)
        
        # Return results to Node.js
        print(json.dumps(recommendations))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)