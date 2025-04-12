const { User } = require('../data');
const { Order } = require('../data');
const { Review } = require('../data');

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
        createdAt: new Date()
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
    joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'
  };
};

module.exports = {
  getUserProfile,
  getUserOrders,
  formatUserProfile
};
