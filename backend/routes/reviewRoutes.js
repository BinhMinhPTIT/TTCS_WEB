import express from 'express';
import {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  likeReview
} from '../controllers/reviewController.js';

const router = express.Router();

// Review routes
router.post('/create', createReview);
router.get('/product/:productId', getProductReviews);
router.get('/user/:userId', getUserReviews);
router.put('/update/:reviewId', updateReview);
router.delete('/delete/:reviewId', deleteReview);
router.post('/like/:reviewId', likeReview);

export default router;