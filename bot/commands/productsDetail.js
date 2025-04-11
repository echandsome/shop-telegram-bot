const fs = require('fs');
const logger = require('../../utils/log');
const { products_detail } = require('../keyboards');
const { setSessionValue, getSessionValue } = require('../../utils/session');

const productImages = {
    "Hydroxide": "./assets/botinfo/hydroxide.jpg",
    "Ammonia": "./assets/botinfo/ammonia.jpg",
    "Ethanol": "./assets/botinfo/ethanol.png",
    "Acetone": "./assets/botinfo/acetone.png",
    "Sulphuric acid": "./assets/botinfo/sulphuricacid.png",
    "Sodium bicarbonate": "./assets/botinfo/sodiumbicarbonate.jpg",
    "Benzene": "./assets/botinfo/benzene.jpg"
};

module.exports = async (chatId, text, bot) => {

    try {
        setSessionValue(chatId, 'product', text);

        const photoPath = productImages[getSessionValue(chatId, 'category')]; // Use the stored image path

        if (photoPath && fs.existsSync(photoPath)) {

            const photoStream = fs.createReadStream(photoPath);
            bot.sendPhoto(chatId, photoStream, {
                caption: `${text} (In stock: Unlimited)`,
                parse_mode: 'HTML'
            }).then(() => {
                bot.sendMessage(chatId,
                    `**Please select quantity in shipping field**\n\n` +
                    `Carefully read our refund policy and browse our page for other options.\n\n` +
                    `SHIPPING\nPlease Encrypt Address in the following format:\n\n` +
                    `FIRST LAST\n270 BREMNER BLVO\nTORONTO, ON M7K BW7\n\n` +
                    `CUT OFF time is 11am EST for same day shipping\n` +
                    `If your order is market as shipped it is 100% shipped\n` +
                    `Tracking NUMBERS WILL ONLY BE SENT AFTER 7 WORKING DAYS`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: products_detail[text]
                }
                });
            }).catch(error => {
                console.error('Error sending photo:', error);
                bot.sendMessage(chatId, `${text} (In stock: Unlimited)\n\n...`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: products_detail[text]
                }
                });
            });
        } else {
            bot.sendMessage(chatId, `${text} (In stock: Unlimited)\n\n...`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: products_detail[text]
                }
            });
        }
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error loading the Product Detail.");
    }
}