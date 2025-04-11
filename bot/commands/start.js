const { menuOptions, products } = require('../keyboards');
const productCommand = require('./products');
const { upsertUser } = require('../../services/user');
const logger = require('../../utils/log');

module.exports = async (msg, bot) => {
    const chatId = msg.chat.id;

    try {
        const user = await upsertUser(msg, chatId);

        if (user.state == 'main_menu') {
            await bot.sendMessage(chatId,
                "Welcome! Please choose an option from the menu below:", {
                reply_markup: {
                    keyboard: menuOptions,
                    resize_keyboard: true
                }
        });

        await productCommand(msg, bot);
        }
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error starting the bot. Please try again.");
    }
}