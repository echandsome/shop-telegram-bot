const logger = require('../../utils/log');
const {
  getChatHistory,
  addMessage,
  clearChatHistory,
  enterSupportChat,
  exitSupportChat,
  formatChatHistory
} = require('../../services/support');

module.exports = async (msg, bot, type, text) => {
    const chatId = msg.chat.id;

    try {
        if (!type || type === 'open') {
            // Get chat history
            const chatHistory = await getChatHistory(chatId);

            // Format chat history for display
            const historyText = formatChatHistory(chatHistory);

            // Send message with chat history
            const sentMessage = await bot.sendMessage(chatId, historyText, {
                reply_markup: {
                    keyboard: [
                        ["Clear Chat History", "Close Chat"]
                    ],
                    resize_keyboard: true
                }
            });

            // Store message ID for future reference (you might want to store this in the database)
            const supportInitialId = sentMessage.message_id;
            console.log("support_initial_id", supportInitialId);

            // Set user state to support chat
            await enterSupportChat(chatId);

            // Add system message to chat history
            await addMessage(chatId, "Support chat opened", 'system');
        } else if (type === 'message') {
            // Add user message to chat history
            await addMessage(chatId, text, 'user');

            // Get updated chat history
            const chatHistory = await getChatHistory(chatId);

            // Format chat history for display
            const historyText = formatChatHistory(chatHistory);

            // Send updated chat history
            await bot.sendMessage(chatId, historyText, {
                reply_markup: {
                    keyboard: [
                        ["Clear Chat History", "Close Chat"]
                    ],
                    resize_keyboard: true
                }
            });
        } else if (type === 'clear') {
            // Clear chat history
            await clearChatHistory(chatId);

            // Add system message to chat history
            await addMessage(chatId, "Chat history cleared", 'system');

            // Get updated chat history
            const chatHistory = await getChatHistory(chatId);

            // Format chat history for display
            const historyText = formatChatHistory(chatHistory);

            // Send updated chat history
            await bot.sendMessage(chatId, historyText, {
                reply_markup: {
                    keyboard: [
                        ["Clear Chat History", "Close Chat"]
                    ],
                    resize_keyboard: true
                }
            });
        } else if (type === 'close') {
            // Add system message to chat history
            await addMessage(chatId, "Support chat closed", 'system');

            // Set user state back to main menu
            await exitSupportChat(chatId);

            // Send message to user
            await bot.sendMessage(chatId, "Support chat closed. You can open it again by clicking on Support in the menu.", {
                reply_markup: {
                    keyboard: [
                        ["🚀Products", "🛒Cart"],
                        ["👤My Profile", "⭐️Reviews"],
                        ["🛟Support", "🔒PGP Key"]
                    ],
                    resize_keyboard: true
                }
            });
        }
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error with the support chat.");
    }
}