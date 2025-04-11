const { TelegramBot } = require('./handlers');
const menuOptions = require('./keyboard');
const logger = require('../utils/log');

module.exports = {
  startCommand: async (msg, bot) => {

    const chatId = msg.chat.id;

    try {

      console.log("client name", msg.chat);

      await bot.sendMessage(chatId,
        "Welcome! Please choose an option from the menu below:", {
        reply_markup: {
          keyboard: menuOptions,
          resize_keyboard: true
        }
      });
    } catch (e) {
      logger.error(e);
      await bot.sendMessage(chatId, "Sorry, there was an error starting the bot. Please try again.");
    }
  },
};
