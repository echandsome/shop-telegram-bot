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

module.exports = {
  upsertUser
};