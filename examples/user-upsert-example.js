/**
 * Example of how to use the upsertUser function in a Telegram bot handler
 */

const { upsertUser } = require('../services/user');

// Example of using the upsertUser function in a message handler
const handleMessage = async (msg, bot) => {
  try {
    const chatId = msg.chat.id;
    
    // Update or insert user information
    const user = await upsertUser(msg, chatId);
    
    console.log(`User ${user.username || user.firstName || 'Unknown'} updated/inserted`);
    
    // Now you can use the user information for further processing
    if (user.state === 'main_menu') {
      // Send main menu options
      bot.sendMessage(chatId, 'Welcome to the main menu!');
    }
    
    // Continue with your bot logic...
    
  } catch (error) {
    console.error('Error handling message:', error);
    // Handle error appropriately
  }
};

// Example usage in a bot command handler
const startCommandHandler = async (msg, bot) => {
  try {
    const chatId = msg.chat.id;
    
    // Update or insert user when they start the bot
    await upsertUser(msg, chatId);
    
    // Send welcome message
    bot.sendMessage(chatId, 'Welcome to our shop! Type /shop to view products.');
    
  } catch (error) {
    console.error('Error in start command:', error);
    // Handle error appropriately
  }
};

// Export the example handlers
module.exports = {
  handleMessage,
  startCommandHandler
};
