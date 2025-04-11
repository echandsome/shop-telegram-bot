const { User } = require('../data');

/**
 * Updates a user if they exist or inserts a new one if they don't
 * @param {Object} msg - Telegram message object
 * @param {Number} chatId - Telegram chat ID (used as userId)
 * @returns {Promise<Object>} - The updated or inserted user document
 */
const upsertUser = async (msg, chatId) => {
  try {
    // Update user if exists, insert if not
    const result = await User.findOneAndUpdate(
      { userId: chatId }, // filter
      {
        // Update these fields
        $set: {
          userId: chatId,
          username: msg.from.username || null,
          firstName: msg.from.first_name || null,
          lastName: msg.from.last_name || null,
          state: 'main_menu',
          lastActive: new Date(),
          updatedAt: new Date()
        }
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create the document if it doesn't exist
        setDefaultsOnInsert: true // Apply schema defaults if creating new document
      }
    );

    return result;
  } catch (error) {
    console.error('Error upserting user:', error);
    throw error;
  }
};

/**
 * Set the awaitingDiscount flag for a user
 * @param {Number} userId - User ID (chat ID)
 * @param {Boolean} value - Value to set (true/false)
 * @returns {Promise<Object>} - The updated user document
 */
const setAwaitingDiscount = async (userId, value = true) => {
  try {
    return await User.findOneAndUpdate(
      { userId },
      {
        $set: {
          awaitingDiscount: value,
          updatedAt: new Date()
        }
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error setting awaitingDiscount:', error);
    throw error;
  }
};

/**
 * Get a user by their userId
 * @param {Number} userId - User ID (chat ID)
 * @returns {Promise<Object>} - The user document
 */
const getUserById = async (userId) => {
  try {
    return await User.findOne({ userId });
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

/**
 * Update a user's state
 * @param {Number} userId - User ID (chat ID)
 * @param {String} state - New state
 * @returns {Promise<Object>} - The updated user document
 */
const updateUserState = async (userId, state) => {
  try {
    return await User.findOneAndUpdate(
      { userId },
      {
        $set: {
          state,
          lastActive: new Date(),
          updatedAt: new Date()
        }
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating user state:', error);
    throw error;
  }
};

module.exports = {
  upsertUser,
  setAwaitingDiscount,
  getUserById,
  updateUserState
};