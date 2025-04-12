const logger = require('../../utils/log');
const pgpKey = require('../../constants/pgpkey');

module.exports = async (msg, bot) => {
    const chatId = msg.chat.id;

    try {
        // Send the PGP key with the additional message
        await bot.sendMessage(chatId,
            `\`\`\`\n${pgpKey}\n\`\`\`\n\n⚠️ Encryption is optional.\n\n🔑 You can encrypt your sensitive data with that key.`,
            { parse_mode: 'Markdown' }
        );
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error loading the PGP key.");
    }
}