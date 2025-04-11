const logger = require('../../utils/log');
const { getCart } = require('../../services/cart');

module.exports = async (chatId, text, bot) => {

    try {
        const cart = await getCart(chatId);
        let total = 0;
  
        if (cart && cart.items && cart.items.length > 0) {
            cart.items.forEach(item => {
                total += item.price;
            });
    
            const orderNumber = 'ORD-' + Math.floor(Math.random() * 1000000);
    
            await bot.sendMessage(chatId,
                `*Order Summary*\n` +
                `Order #: ${orderNumber}\n` +
                `Total: $${total}\n\n` +
                `Please send exactly $${total} to the following BTC address:\n\n` +
                `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh\n\n` +
                `Once you have sent the payment, click the Confirm button below.`, {
                parse_mode: 'Markdown',
                reply_markup: {
                inline_keyboard: [
                    [{ text: "Confirm Payment", callback_data: `confirm_payment_${orderNumber}` }]
                ]
                }
            });
        } else {
            await bot.sendMessage(chatId, "Your cart is empty. Please add items before checkout.");
        }
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error loading the Shipping.");
    }
}