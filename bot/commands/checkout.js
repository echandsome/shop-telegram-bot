const logger = require('../../utils/log');
const { paymentMethodButtons } = require('../keyboards');
const { setAwaitingDiscount } = require('../../services/user');
const { applyDiscount, removeDiscount } = require('../../services/discount');
const { getCart } = require('../../services/cart');

module.exports = async (msg, bot, type, text, query) => {
    const chatId = msg.chat.id;

    try {
        if (type === 'checkout') {
            await bot.sendMessage(chatId, "Please Choose a Payment Method💸", {
                parse_mode: 'HTML',
                reply_markup: {
                  inline_keyboard: paymentMethodButtons
                }
            });
        } else if (type === 'enter_discount') {
            const messageId = query.message.message_id;

            await bot.editMessageText(
                "Type the discount code to this chat. If possible, it will be applied to all items in the cart.",
                {
                  chat_id: chatId,
                  message_id: messageId,
                  reply_markup: {
                    inline_keyboard: [
                      [{ text: "Back to Cart", callback_data: "cart" }]
                    ]
                  }
                }
            );

            // Set awaitingDiscount flag to true using our user service
            await setAwaitingDiscount(chatId, true);

        } else if (type === 'discount') {
            await bot.sendMessage(chatId,
                "Type the discount code to this chat. If possible, it will be applied to all items in the cart.\n\n" +
                "Format: /discount YOURCODE\n" +
                "Example: /discount WELCOME10",
                {
                  reply_markup: {
                    inline_keyboard: [[{ text: "Back to Cart", callback_data: "cart" }]]
                  }
                }
            );
        } else if (type === 'input_discount') {
            // Reset the awaitingDiscount flag
            await setAwaitingDiscount(chatId, false);
          
            const result = await applyDiscount(chatId, msg.text);
        
            if (result.success) {
                const cart = await getCart(chatId);
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
                    cartText += `Discount (${cart.discountCode}): -$${cart.discountAmount.toFixed(2)}\n`;
                    cartText += `Final Total: $${cart.finalPrice.toFixed(2)}`;
            
                    await bot.sendMessage(chatId, cartText, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                            ...remove_buttons,
                            [{ text: "Checkout", callback_data: "checkout" }],
                            [
                                { text: "🤑I have discount code", callback_data: "enter_discount" },
                                { text: "Menu", callback_data: "menu" }
                            ]
                            ]
                        }
                    });
                }
            } else {
                await bot.sendMessage(chatId, result.message, {
                    reply_markup: {
                        inline_keyboard: [[{ text: "Back to Cart", callback_data: "cart" }]]
                    }
                });
            }
        }

    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error loading the Checkout.");
    }
}