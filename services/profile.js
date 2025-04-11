const { User } = require('../data');
const { Order } = require('../data');

/**
 * Get or create a user profile
 * @param {Number} userId - User ID (chat ID)
 * @returns {Promise<Object>} - The user profile
 */
const getUserProfile = async (userId) => {
  try {
    // Find the user profile
    let userProfile = await User.findOne({ userId });

    // If user doesn't exist, create a new one
    if (!userProfile) {
      userProfile = new User({
        userId,
        createdAt: new Date(),
        orders: [],
        reviews: []
      });
      await userProfile.save();
    }

    return userProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Get all orders for a user
 * @param {Number} userId - User ID (chat ID)
 * @returns {Promise<Array>} - Array of orders
 */
const getUserOrders = async (userId) => {
  try {
    // Find all orders for the user, sorted by creation date (newest first)
    return await Order.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  } catch (error) {
    console.error('Error getting user orders:', error);
    return [];
  }
};

/**
 * Check if a user can leave a review for an order
 * @param {Date|String} orderDate - Date the order was created
 * @returns {Boolean} - Whether the user can leave a review
 */
const canLeaveReview = (orderDate) => {
  return true;
  if (!orderDate) return false;
  
  // Convert string date to Date object if needed
  const orderDateObj = typeof orderDate === 'string' ? new Date(orderDate) : orderDate;
  
  // Calculate date 5 days ago
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  
  // User can leave review if order is at least 5 days old
  return orderDateObj <= fiveDaysAgo;
};

/**
 * Add a review to a user's profile
 * @param {Number} userId - User ID (chat ID)
 * @param {Object} review - Review object with product, rating, and comment
 * @returns {Promise<Object>} - The updated user profile
 */
const addReview = async (userId, review) => {
  try {
    // Add the review to the user's profile
    return await User.findOneAndUpdate(
      { userId },
      { 
        $push: { reviews: { ...review, createdAt: new Date() } },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

/**
 * Get all reviews for a user
 * @param {Number} userId - User ID (chat ID)
 * @returns {Promise<Array>} - Array of reviews
 */
const getUserReviews = async (userId) => {
  try {
    const user = await User.findOne({ userId });
    return user ? user.reviews : [];
  } catch (error) {
    console.error('Error getting user reviews:', error);
    return [];
  }
};

/**
 * Format user profile for display
 * @param {Object} user - User object
 * @returns {Object} - Formatted user profile
 */
const formatUserProfile = (user) => {
  if (!user) return null;
  
  return {
    userId: user.userId,
    username: user.username || 'No username',
    firstName: user.firstName || 'No first name',
    lastName: user.lastName || 'No last name',
    joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
    ordersCount: user.orders ? user.orders.length : 0,
    reviewsCount: user.reviews ? user.reviews.length : 0
  };
};

module.exports = {
  getUserProfile,
  getUserOrders,
  canLeaveReview,
  addReview,
  getUserReviews,
  formatUserProfile
};
