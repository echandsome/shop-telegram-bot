const { paymentMethods } = require('../keyboards');
const logger = require('../../utils/log');
const { createOrder } = require('../../services/order');

module.exports = async (chatId, text, bot, type, callbackQuery) => {
    try {
        if (type === 'payment') {
            const paymentMethod = text.replace('payment_', '');

            if (paymentMethods[paymentMethod]) {
                await bot.sendMessage(chatId, `You selected ${paymentMethod}. Please choose shipping option:`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: paymentMethods[paymentMethod]
                    }
                });
            }
        } else if (type === 'confirm_payment') {
            // Extract order number and shipping address from callback data
            const data = text || '';
            const orderNumber = data.split('confirm_payment_')[1];
            const shippingAddress = 'Default Shipping Address'; // This should be collected from the user

            try {
                // Create the order using our service
                const order = await createOrder(chatId, orderNumber, shippingAddress);

                // Send confirmation message
                await bot.sendMessage(chatId,
                    `✅ Order confirmed!\n\n` +
                    `Order #: ${order.orderNumber}\n` +
                    `Status: ${order.status}\n` +
                    `Total: $${order.totalAmount}\n\n` +
                    `You can check your order status in your profile.\n` +
                    `Thank you for your purchase!`, {
                    parse_mode: 'Markdown'
                });

                // Answer callback query if it exists
                if (callbackQuery && callbackQuery.id) {
                    await bot.answerCallbackQuery(callbackQuery.id, {
                        text: 'Order has been confirmed and added to your profile!'
                    });
                }
            } catch (error) {
                logger.error('Error creating order:', error);

                // Handle empty cart error
                if (error.message === 'Cart is empty') {
                    if (callbackQuery && callbackQuery.id) {
                        await bot.answerCallbackQuery(callbackQuery.id, {
                            text: 'Your cart is empty!',
                            show_alert: true
                        });
                    } else {
                        await bot.sendMessage(chatId, 'Your cart is empty!. Please add items before checking out.');
                    }
                } else {
                    // Handle other errors
                    if (callbackQuery && callbackQuery.id) {
                        await bot.answerCallbackQuery(callbackQuery.id, {
                            text: 'Error processing your order. Please try again.',
                            show_alert: true
                        });
                    }
                    await bot.sendMessage(chatId, 'Sorry, there was an error processing your order. Please try again later.');
                }
            }
        }
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error with the payment process.");
    }
}