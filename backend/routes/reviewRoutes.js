import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  likeReview
} from '../controllers/reviewController.js';

const router = express.Router();

// Protected routes - require authentication
router.post('/create', authMiddleware, createReview);
router.post('/like/:reviewId', authMiddleware, likeReview);
router.put('/update/:reviewId', authMiddleware, updateReview);
router.delete('/delete/:reviewId', authMiddleware, deleteReview);

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/user/:userId', getUserReviews);

export default router;