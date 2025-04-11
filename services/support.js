const { SupportMessage, User } = require('../data');

/**
 * Get chat history for a user
 * @param {Number} userId - User ID (chat ID)
 * @returns {Promise<Array>} - Array of chat messages
 */
const getChatHistory = async (userId) => {
  try {
    return await SupportMessage.find({ userId })
      .sort({ timestamp: 1 })
      .exec();
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};

/**
 * Add a message to the support chat
 * @param {Number} userId - User ID (chat ID)
 * @param {String} message - Message text
 * @param {String} from - Who sent the message ('user', 'seller', or 'system')
 * @returns {Promise<Object>} - The saved message
 */
const addMessage = async (userId, message, from = 'user') => {
  try {
    const supportMessage = new SupportMessage({
      userId,
      message,
      from,
      timestamp: new Date()
    });
    
    return await supportMessage.save();
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
};

/**
 * Clear chat history for a user
 * @param {Number} userId - User ID (chat ID)
 * @returns {Promise<Object>} - Result of the delete operation
 */
const clearChatHistory = async (userId) => {
  try {
    return await SupportMessage.deleteMany({ userId });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
};

/**
 * Set user state to support chat
 * @param {Number} userId - User ID (chat ID)
 * @returns {Promise<Object>} - The updated user
 */
const enterSupportChat = async (userId) => {
  try {
    return await User.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          state: 'in_support_chat',
          updatedAt: new Date()
        } 
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error entering support chat:', error);
    throw error;
  }
};

/**
 * Set user state back to main menu
 * @param {Number} userId - User ID (chat ID)
 * @returns {Promise<Object>} - The updated user
 */
const exitSupportChat = async (userId) => {
  try {
    return await User.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          state: 'main_menu',
          updatedAt: new Date()
        } 
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error exiting support chat:', error);
    throw error;
  }
};

/**
 * Format chat history for display
 * @param {Array} chatHistory - Array of chat messages
 * @returns {String} - Formatted chat history text
 */
const formatChatHistory = (chatHistory) => {
  let historyText = "You have opened a chat with the seller - send\nmessages to this chat!\n\n" +
    "It is important to remember that this is not a live chat,\n" +
    "the seller will see your messages as soon as possible.\n" +
    "---------------------------------------------------------------\n\n" +
    "🗣 Chat history:\n\n";
  
  if (!chatHistory || chatHistory.length === 0) {
    historyText += "No messages yet. Type something to start the conversation.\n";
    return historyText;
  }
  
  chatHistory.forEach(message => {
    if (message.from === 'user') {
      historyText += `You: ${message.message}\n`;
    } else if (message.from === 'seller') {
      historyText += `Seller: ${message.message}\n`;
    } else if (message.from === 'system') {
      historyText += `${message.message}\n`;
    }
  });
  
  return historyText;
};

/**
 * Get unread messages count for a seller
 * @returns {Promise<Number>} - Count of unread messages
 */
const getUnreadMessagesCount = async () => {
  try {
    return await SupportMessage.countDocuments({ 
      from: 'user',
      read: false
    });
  } catch (error) {
    console.error('Error getting unread messages count:', error);
    return 0;
  }
};

/**
 * Mark messages as read
 * @param {Number} userId - User ID (chat ID)
 * @returns {Promise<Object>} - Result of the update operation
 */
const markMessagesAsRead = async (userId) => {
  try {
    return await SupportMessage.updateMany(
      { userId, from: 'user', read: false },
      { $set: { read: true } }
    );
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

module.exports = {
  getChatHistory,
  addMessage,
  clearChatHistory,
  enterSupportChat,
  exitSupportChat,
  formatChatHistory,
  getUnreadMessagesCount,
  markMessagesAsRead
};
