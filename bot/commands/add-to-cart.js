const logger = require('../../utils/log');

module.exports = async (chatId, text, bot) => {

    try {
        const loadingMsg = await bot.sendMessage(chatId, 'Adding to cart...');
        
        // await addToCart(chatId, {
        //   product: image,
        //   quantity: data.replace('add_', ''),
        //   price: getPriceFromQuantity(data),
        //   addedAt: new Date()
        // });

        await bot.editMessageText('Item added to cart!', {
          chat_id: chatId,
          message_id: loadingMsg.message_id
        });
    } catch (e) {
        logger.error(e);
        await bot.sendMessage(chatId, "Sorry, there was an error loading the PGP key.");
    }
}