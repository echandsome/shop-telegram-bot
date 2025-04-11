const { menuOptions } = require('../keyboards');
const logger = require('../../utils/log');

module.exports = async (msg, bot) => {
    const chatId = msg.chat.id;

    try {

        await bot.sendMessage(chatId,
            "Main Menu:", {
            reply_markup: {
                inline_keyboard: menuOptions,
            }
        });
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error starting the bot. Please try again.");
    }
}