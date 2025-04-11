const logger = require('../../utils/log');
const { paymentMethodButtons } = require('../keyboards');
const { setAwaitingDiscount } = require('../../services/user');
const { applyDiscount, removeDiscount } = require('../../services/discount');
const { getCart } = require('../../services/cart');

module.exports = async (msg, bot, type, text, query) => {
    const chatId = msg.chat.id;

    try {
        if (type === 'checkout') {
            const cart = await getCart(chatId);

            if (cart && cart.items && cart.items.length > 0) {
                await bot.sendMessage(chatId, "Please Choose a Payment Method💸", {
                    parse_mode: 'HTML',
                    reply_markup: {
                    inline_keyboard: paymentMethodButtons
                    }
                });
            } else {
                await bot.sendMessage(chatId, "Your cart is empty. Please add items before checkout.");
            }
        } else if (type === 'enter_discount' || type === 'discount') {
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
        } else if (type === 'shipping') {
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
        }
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error loading the Checkout.");
    }
}