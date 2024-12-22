import { useState, useEffect } from 'react';
import { assets } from '../assets/assets';

const ProductReviews = ({ productId, token, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({
    rating: 5,
    comment: '',
    images: [],
  });
  const [editingReview, setEditingReview] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState('reviews');

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/reviews/product/${productId}?page=${page}&limit=5`
      );
      const data = await response.json();

      if (data?.success) {
        setReviews(data.data.reviews || []);
        setTotalPages(data.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Network Error:', error);
    }
  };

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please login to submit a review');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:4000/api/reviews/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          ...userReview,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUserReview({ rating: 5, comment: '', images: [] });
        fetchReviews();
        setSelectedTab('reviews');
      } else {
        setError(data.message || 'Error submitting review');
      }
    } catch (error) {
      setError('Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit review
  const handleEditReview = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please login to edit review');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:4000/api/reviews/update/${editingReview._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          rating: userReview.rating,
          comment: userReview.comment,
          images: userReview.images,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEditingReview(null);
        setUserReview({ rating: 5, comment: '', images: [] });
        fetchReviews();
        setSelectedTab('reviews');
      } else {
        setError(data.message || 'Error updating review');
      }
    } catch (error) {
      setError('Error updating review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!token) {
      setError('Please login to delete review');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/reviews/delete/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        fetchReviews();
      } else {
        setError(data.message || 'Error deleting review');
      }
    } catch (error) {
      setError('Error deleting review');
    }
  };

  // Start editing a review
  const startEditReview = (review) => {
    setEditingReview(review);
    setUserReview({
      rating: review.rating,
      comment: review.comment,
      images: review.images || [],
    });
    setSelectedTab('write');
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingReview(null);
    setUserReview({ rating: 5, comment: '', images: [] });
  };

  // Like review
  const handleLikeReview = async (reviewId) => {
    if (!token) {
      setError('Please login to like reviews');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/reviews/like/${reviewId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();
      if (data.success) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Like Review Error:', error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, page]);

  return (
    <div className="mt-20">
      <div className="flex">
        <button
          className={`px-5 py-3 text-sm ${selectedTab === 'reviews' ? 'border-b-2 border-black font-bold' : 'border'
            }`}
          onClick={() => setSelectedTab('reviews')}
        >
          Reviews ({reviews.length})
        </button>
        <button
          className={`px-5 py-3 text-sm ${selectedTab === 'write' ? 'border-b-2 border-black font-bold' : 'border'
            }`}
          onClick={() => setSelectedTab('write')}
        >
          {editingReview ? 'Edit Review' : 'Write a Review'}
        </button>
      </div>

      <div className="border p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button className="float-right font-bold" onClick={() => setError('')}>
              ×
            </button>
          </div>
        )}

        {selectedTab === 'write' ? (
          <form onSubmit={editingReview ? handleEditReview : handleSubmitReview} className="flex flex-col gap-4">
            {editingReview && (
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Editing Review</h3>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel Edit
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    src={star <= userReview.rating ? assets.star_icon : assets.star_dull_icon}
                    alt=""
                    className="w-5 cursor-pointer"
                    onClick={() => setUserReview((prev) => ({ ...prev, rating: star }))}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <textarea
                value={userReview.comment}
                onChange={(e) => setUserReview((prev) => ({ ...prev, comment: e.target.value }))}
                className="w-full border p-2 rounded"
                rows="4"
                required
                minLength="10"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {review.userId.profileImage && (
                          <img
                            src={review.userId.profileImage}
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-medium">{review.userId.name}</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <img
                                key={star}
                                src={star <= review.rating ? assets.star_icon : assets.star_dull_icon}
                                alt=""
                                className="w-4"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600">{review.comment}</p>
                      {review.images?.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {review.images.map((img, idx) => (
                            <img key={idx} src={img} alt="" className="w-20 h-20 object-cover" />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => handleLikeReview(review._id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        ❤️ {review.likes?.length || 0}
                      </button>

                      {review.userId.$oid === userId && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditReview(review)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      )}


                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No reviews yet. Be the first to review!</p>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPage(idx + 1)}
                    className={`px-3 py-1 border rounded ${page === idx + 1 ? 'bg-black text-white' : ''
                      }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;