const { 
  startCommand, 
  productCommand, 
  cartCommand, 
  profileCommand, 
  reviewCommand, 
  supportCommand, 
  pgpkeyCommand,
  productsDetailCommand,
  subproductsCommand,
  addToCartCommand } = require('./commands');
const { products_detail, subproducts } = require('./keyboards');

module.exports = {
  handleCommands: (bot) => {
    // Handle /start command
    bot.onText(/\/start/, (msg) => startCommand(msg, bot));

    bot.onText(/\/products/, (msg) => productCommand(msg, bot));
    bot.onText(/\/cart/, (msg) => cartCommand(msg, bot));
    bot.onText(/\/profile/, (msg) => profileCommand(msg, bot));
    bot.onText(/\/reviews/, (msg) => reviewCommand(msg, bot));
    bot.onText(/\/support/, (msg) => supportCommand(msg, bot));
    bot.onText(/\/pgpkey/, (msg) => pgpkeyCommand(msg, bot));

    bot.on('callback_query', (query) => {
      const message = query.message;
      const text = query.data;
      const chatId = message.chat.id;
      const messageId = message.message_id;

      console.log(text)
      if (products_detail[text]) {
        productsDetailCommand (chatId, text, bot);
      } else if (subproducts[text]) {
        subproductsCommand(chatId, text, bot);
      } else if (text.startsWith('add_')) {
        addToCartCommand(chatId, text, bot)
      }
    });

    bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (text == '🚀Products') {
        productCommand(msg, bot);
      } else if (text == '🛒Cart') {
        cartCommand(msg, bot);
      } else if (text == '👤My Profile') {
        profileCommand(msg, bot);
      } else if (text == '⭐️Reviews') {
        reviewCommand(msg, bot);
      } else if (text == '🛟Support') {
        supportCommand(msg, bot);
      } else if (text == '🔒PGP Key') {
        pgpkeyCommand(msg, bot);
      }
    })
  }
};
