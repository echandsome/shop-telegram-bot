const logger = require('../../utils/log');
const { getPriceFromQuantity } = require('../../utils/utility');
const { addToCart } = require('../../services/cart');

module.exports = async (chatId, text, bot) => {
  try {
    const loadingMsg = await bot.sendMessage(chatId, 'Adding to cart...');

    // Example of how to call the addToCart function
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
  } catch (e) {
    logger.error(e);
    await bot.sendMessage(chatId, "Sorry, there was an error adding the item to your cart.");
  }
};

// Export the addToCart function separately so it can be used by other modules
module.exports.addToCart = addToCart;