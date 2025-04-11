const logger = require('../../utils/log');
const { products_detail } = require('../keyboards');

module.exports = async (chatId, text, bot) => {

    try {
        bot.sendMessage(chatId, `There are 4 products in ${text}:`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: products_detail[text]
            }
        });
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error loading the PGP key.");
    }
}