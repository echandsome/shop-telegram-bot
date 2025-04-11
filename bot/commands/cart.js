const logger = require('../../utils/log');
const { getCart, addToCart, removeFromCart } = require('../../services/cart');
const { getPriceFromQuantity } = require('../../utils/utility');
const { carts } = require('../keyboards');

module.exports = async (msg, bot, type, text, query) => {
    const chatId = msg.chat.id;

    try {
        if (type == 'cart') {
            const loadingMsg = await bot.sendMessage(chatId, 'Loading cart...');
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
        } else if (type == '_cart') {
            const loadingMsg = await bot.sendMessage(chatId, 'Loading cart...');
            const cart = await getCart(chatId);

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
        } else if (type == 'add_to_cart') {
            const loadingMsg = await bot.sendMessage(chatId, 'Adding to cart...');

            await addToCart(chatId, {
                product: text.split('_')[0], // Assuming the product ID is the first part of the text
                quantity: text.replace(/^[^_]+_/, ''), // Get everything after the first underscore
                price: getPriceFromQuantity(text),
                addedAt: new Date()
            });

            await bot.editMessageText('Item added to cart!', {
                chat_id: chatId,
                message_id: loadingMsg.message_id
            });
        } else if (type == 'remove_item') {
            const messageId = query.message.message_id;
            const index = parseInt(text.replace('remove_item_', ''), 10);

            const success = await removeFromCart(chatId, index);

            if (success) {
                const updatedCart = await getCart(chatId);
                if (updatedCart && updatedCart.items && updatedCart.items.length > 0) {
                totalPrice = 0;
                const remove_buttons = [];

                const cartText = updatedCart.items.map((item, index) => {
                    totalPrice += item.price;
                    remove_buttons.push([{ text: `Remove ${index + 1}. ${item.product}       $${item.price}`, callback_data: `remove_item_${index}` }]);
                    const quantityToShow = item.quantityDisplay || item.quantity;
                    return `${item.product}        ${quantityToShow} - $${item.price}`;
                }).join('\n');

                if (messageId) {
                    await bot.editMessageText(
                        `You can proceed to 🛒Checkout or apply a 🤑discount or return to the store.
                        ----------------------------------
                        ${cartText}
                        ----------------------------
                        Total: $${totalPrice}`,
                        {
                            chat_id: chatId,
                            message_id: messageId,
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [...remove_buttons, ...carts]
                            }
                        }
                    );
                } else {
                    await bot.sendMessage(chatId,
                        `You can proceed to 🛒Checkout or apply a 🤑discount or return to the store.
                        ----------------------------------
                        ${cartText}
                        ----------------------------
                        Total: $${totalPrice}`,
                        {
                            parse_mode: 'HTML',
                            reply_markup: {
                            inline_keyboard: [...remove_buttons, ...carts]
                            }
                        }
                    );
                }
                } else {
                    const messageText = 'Your cart is now empty.';

                    if (messageId) {
                        await bot.editMessageText(messageText, {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: carts
                        }
                        });
                    } else {
                        await bot.sendMessage(chatId, messageText, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: menuOptions["🛒Cart"].reply_markup.inline_keyboard
                        }
                        });
                    }
                }
            } else {
                await bot.answerquery(query.id, {
                text: "Failed to remove item. Please try again.",
                show_alert: true
                });
            }
        }

    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error loading the Cart.");
    }
}