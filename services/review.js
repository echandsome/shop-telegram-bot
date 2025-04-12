const { Review, Order } = require('../data');

/**
 * Add a new review
 * @param {Number} userId - User ID (chat ID)
 * @param {Object} reviewData - Review data with productId, orderNumber, rating, and comment
 * @returns {Promise<Object>} - The created review
 */
const addReview = async (userId, reviewData) => {
  try {
    // Create a new review
    const review = new Review({
      userId,
      productId: reviewData.productId,
      orderNumber: reviewData.orderNumber,
      rating: reviewData.rating,
      comment: reviewData.comment || 'No comment provided',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save the review
    const savedReview = await review.save();

    // Update the order to mark it as reviewed
    await Order.findOneAndUpdate(
      { orderNumber: reviewData.orderNumber },
      {
        $set: {
          hasReview: true,
          updatedAt: new Date()
        }
      }
    );

    return savedReview;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

/**
 * Get reviews for a user with pagination
 * @param {Number} userId - User ID (chat ID)
 * @param {Number} page - Page number (starting from 0)
 * @param {Number} limit - Number of reviews per page
 * @returns {Promise<Object>} - Object with reviews array and pagination info
 */
const getUserReviews = async (userId, page = 0, limit = 8) => {
  try {
    // Convert page and limit to numbers to ensure they're valid
    page = parseInt(page) || 0;
    limit = parseInt(limit) || 8;

    // Get total count of reviews for pagination
    const totalReviews = await Review.countDocuments({ userId });

    // Calculate total pages
    const totalPages = Math.ceil(totalReviews / limit);

    // Get reviews for the requested page
    const reviews = await Review.find({ userId })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .exec();

    // Calculate average rating
    let averageRating = 0;
    if (totalReviews > 0) {
      // Get all ratings (this could be optimized with an aggregation pipeline)
      const allRatings = await Review.find({ userId }, 'rating');
      const sumRatings = allRatings.reduce((sum, review) => sum + review.rating, 0);
      averageRating = sumRatings / totalReviews;
    }

    return {
      reviews,
      pagination: {
        totalReviews,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages - 1,
        hasPrevPage: page > 0
      },
      summary: {
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews
      }
    };
  } catch (error) {
    console.error('Error getting user reviews:', error);
    return {
      reviews: [],
      pagination: { totalReviews: 0, totalPages: 0, currentPage: 0, hasNextPage: false, hasPrevPage: false },
      summary: { averageRating: 0, totalReviews: 0 }
    };
  }
};

/**
 * Get reviews for a product with pagination
 * @param {String} productId - Product ID
 * @param {Number} page - Page number (starting from 0)
 * @param {Number} limit - Number of reviews per page
 * @returns {Promise<Object>} - Object with reviews array and pagination info
 */
const getProductReviews = async (productId, page = 0, limit = 8) => {
  try {
    // Convert page and limit to numbers to ensure they're valid
    page = parseInt(page) || 0;
    limit = parseInt(limit) || 8;

    // Get total count of reviews for pagination
    const totalReviews = await Review.countDocuments({ productId });

    // Calculate total pages
    const totalPages = Math.ceil(totalReviews / limit);

    // Get reviews for the requested page
    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .exec();

    // Calculate average rating
    let averageRating = 0;
    if (totalReviews > 0) {
      // Get all ratings (this could be optimized with an aggregation pipeline)
      const allRatings = await Review.find({ productId }, 'rating');
      const sumRatings = allRatings.reduce((sum, review) => sum + review.rating, 0);
      averageRating = sumRatings / totalReviews;
    }

    return {
      reviews,
      pagination: {
        totalReviews,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages - 1,
        hasPrevPage: page > 0
      },
      summary: {
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews
      }
    };
  } catch (error) {
    console.error('Error getting product reviews:', error);
    return {
      reviews: [],
      pagination: { totalReviews: 0, totalPages: 0, currentPage: 0, hasNextPage: false, hasPrevPage: false },
      summary: { averageRating: 0, totalReviews: 0 }
    };
  }
};

/**
 * Check if a user can leave a review for an order
 * @param {Date|String} orderDate - Date the order was created
 * @returns {Boolean} - Whether the user can leave a review
 */
const canLeaveReview = (orderDate) => {
  // For development, always allow reviews
  // In production, uncomment the code below
  return true;

  /*
  if (!orderDate) return false;

  // Convert string date to Date object if needed
  const orderDateObj = typeof orderDate === 'string' ? new Date(orderDate) : orderDate;

  // Calculate date 5 days ago
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  // User can leave review if order is at least 5 days old
  return orderDateObj <= fiveDaysAgo;
  */
};

/**
 * Check if an order has been reviewed
 * @param {String} orderNumber - Order number
 * @returns {Promise<Boolean>} - Whether the order has been reviewed
 */
const hasOrderBeenReviewed = async (orderNumber) => {
  try {
    const review = await Review.findOne({ orderNumber });
    return !!review;
  } catch (error) {
    console.error('Error checking if order has been reviewed:', error);
    return false;
  }
};

/**
 * Get all reviews with pagination
 * @param {Number} page - Page number (starting from 0)
 * @param {Number} limit - Number of reviews per page
 * @returns {Promise<Object>} - Object with reviews array and pagination info
 */
const getAllReviews = async (page = 0, limit = 5) => {
  try {
    // Convert page and limit to numbers to ensure they're valid
    page = parseInt(page) || 0;
    limit = parseInt(limit) || 5;

    // Get total count of reviews for pagination
    const totalReviews = await Review.countDocuments({});

    // Calculate total pages
    const totalPages = Math.ceil(totalReviews / limit);

    // Get reviews for the requested page with user information
    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .exec();

    // Populate user information for each review
    const { User } = require('../data');
    const reviewsWithUserInfo = [];

    for (const review of reviews) {
      const user = await User.findOne({ userId: review.userId });
      reviewsWithUserInfo.push({
        ...review.toObject(),
        username: user ? (user.username || `User ${review.userId}`) : `User ${review.userId}`,
        firstName: user ? user.firstName : '',
        lastName: user ? user.lastName : ''
      });
    }

    // Calculate average rating
    let averageRating = 0;
    if (totalReviews > 0) {
      // Get all ratings (this could be optimized with an aggregation pipeline)
      const allRatings = await Review.find({}, 'rating');
      const sumRatings = allRatings.reduce((sum, review) => sum + review.rating, 0);
      averageRating = sumRatings / totalReviews;
    }

    return {
      reviews: reviewsWithUserInfo,
      pagination: {
        totalReviews,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages - 1,
        hasPrevPage: page > 0
      },
      summary: {
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews
      }
    };
  } catch (error) {
    console.error('Error getting all reviews:', error);
    return {
      reviews: [],
      pagination: { totalReviews: 0, totalPages: 0, currentPage: 0, hasNextPage: false, hasPrevPage: false },
      summary: { averageRating: 0, totalReviews: 0 }
    };
  }
};

module.exports = {
  addReview,
  getUserReviews,
  getProductReviews,
  getAllReviews,
  canLeaveReview,
  hasOrderBeenReviewed
};
