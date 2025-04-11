const logger = require('../../utils/log');

module.exports = async (msg, bot) => {
    const chatId = msg.chat.id;

    try {
        // TODO: show PGP public key
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error loading the PGP key.");
    }
}