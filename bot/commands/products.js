const logger = require('../../utils/log');
const { products } = require('../keyboards');

module.exports = async (chatId, text, bot) => {

    try {
        bot.sendMessage(chatId, `${text} (In stock: Unlimited)`, {
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: products[text]
            }
        });
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error loading the PGP key.");
    }
}