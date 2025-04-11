const logger = require('../../utils/log');
const { products } = require('../keyboards');
const { setSessionValue } = require('../../utils/session');

module.exports = async (chatId, text, bot) => {
    
    try {
        setSessionValue(chatId, 'category', text);

        bot.sendMessage(chatId, `There are 4 products in ${text}:`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: products[text]
            }
        });
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error loading the Products.");
    }
}
