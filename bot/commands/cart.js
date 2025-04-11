const logger = require('../../utils/log');
const { getCart } = require('../../services/cart');
const { carts } = require('../keyboards');

module.exports = async (msg, bot, mode = true) => {
    const chatId = msg.chat.id;

    try {
        const loadingMsg = await bot.sendMessage(chatId, 'Loading cart...');
        const cart = await getCart(chatId);

        if (mode) {

            if (cart && cart.items && cart.items.length > 0) {
                let cartText = `🛒 Your Cart:\n----------------------------------\n`;
                const remove_buttons = [];
                let subtotal = 0;

                cart.items.forEach((item, index) => {
                    subtotal += item.price;
                    remove_buttons.push([{
                        text: `Remove ${index + 1}. ${item.product}       $${item.price}`,
                        callback_data: `remove_item_${index}`
                    }]);
                    cartText += `${item.product}        ${item.quantity} - $${item.price}\n`;
                });

                cartText += `----------------------------------\n`;
                cartText += `Subtotal: $${subtotal.toFixed(2)}\n`;

                if (cart.discountCode) {
                    cartText += `Discount (${cart.discountCode}): -$${cart.discountAmount.toFixed(2)}\n`;
                    cartText += `Final Total: $${cart.finalPrice.toFixed(2)}`;
                } else {
                    cartText += `Total: $${subtotal.toFixed(2)}`;
                }
                
                await bot.editMessageText(cartText, {
                    chat_id: chatId,
                    message_id: loadingMsg.message_id,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            ...remove_buttons,
                            ...carts
                        ]
                    }
                });
            } else {
                await bot.editMessageText("Your cart is empty", {
                    chat_id: chatId,
                    message_id: loadingMsg.message_id,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: carts
                    }
                });
            }
        } else {
    
            if (cart && cart.items && cart.items.length > 0) {
                const cartText = cart.items.map(item =>
                    `${item.product} - ${item.quantity} - $${item.price}`
                ).join('\n');
        
                await bot.editMessageText(`Your Cart:\n${cartText}`, {
                    chat_id: chatId,
                    message_id: loadingMsg.message_id,
                    reply_markup: {
                        inline_keyboard: carts
                    }
                });
            } else {
                await bot.editMessageText('Your cart is empty', {
                    chat_id: chatId,
                    message_id: loadingMsg.message_id
                });
            }
        }
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error loading the Cart.");
    }
}