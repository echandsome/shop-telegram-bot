const { menuOptions, categories } = require('../keyboards');
const logger = require('../../utils/log');

module.exports = async (msg, bot) => {
    const chatId = msg.chat.id;

    try {
        await bot.sendMessage(chatId, "Please select a category from the list:", {
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: categories
            }
        });
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error loading the Categories.");
    }
}