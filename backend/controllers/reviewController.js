// controllers/reviewController.js
import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';


// Create new review
export const createReview = async (req, res) => {
  try {
    // Assuming userId is available in the request via authentication middleware
    const userId = req.user.id; // Access userId from req.user if using JWT or other auth method
    const { productId, rating, comment, images } = req.body;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return res.json({
        success: false,
        message: "You have already reviewed this product"
      });
    }

    // Create review
    const review = await Review.create({
      userId,
      productId,
      rating,
      comment,
      images: images || [],
    });

    // Update product's review stats
    const product = await Product.findById(productId);
    const totalRatings = product.totalReviews * product.averageRating;
    product.totalReviews += 1;
    product.averageRating = (totalRatings + rating) / product.totalReviews;
    product.reviews.push(review._id);
    await product.save();

    // Add review to user's reviews
    await User.findByIdAndUpdate(userId, {
      $push: { reviews: review._id }
    });

    res.json({
      success: true,
      message: "Review created successfully",
      data: review
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// Get product reviews
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get reviews for the product
    const reviews = await Review.find({ productId }).populate('userId', 'name profileImage');

    res.status(200).json({ success: true, data: { reviews } });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

// Get user reviews
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ userId })
      .populate('productId', 'name image price')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-date');

    const count = await Review.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        reviews,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id; // From auth middleware
    const { rating, comment, images } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if user owns the review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review"
      });
    }

    // Update product rating
    const product = await Product.findById(review.productId);
    const totalRatings = product.totalReviews * product.averageRating;
    product.averageRating = (totalRatings - review.rating + rating) / product.totalReviews;
    await product.save();

    // Update review
    review.rating = rating;
    review.comment = comment;
    if (images) review.images = images;
    await review.save();

    res.json({
      success: true,
      message: "Review updated successfully",
      data: review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id; // From auth middleware

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if user owns the review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review"
      });
    }

    // Update product stats
    const product = await Product.findById(review.productId);
    const totalRatings = product.totalReviews * product.averageRating;
    product.totalReviews -= 1;
    if (product.totalReviews > 0) {
      product.averageRating = (totalRatings - review.rating) / product.totalReviews;
    } else {
      product.averageRating = 0;
    }
    product.reviews = product.reviews.filter(r => r.toString() !== reviewId);
    await product.save();

    // Remove from user's reviews
    await User.findByIdAndUpdate(userId, {
      $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Like/unlike review
export const likeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    const likeIndex = review.likes.indexOf(userId);
    if (likeIndex === -1) {
      review.likes.push(userId);
    } else {
      review.likes.splice(likeIndex, 1);
    }
    await review.save();

    res.json({
      success: true,
      message: `Review ${likeIndex === -1 ? 'liked' : 'unliked'} successfully`,
      data: review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
