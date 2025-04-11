const {
  startCommand,
  categoriesCommand,
  productsCommand,
  cartCommand,
  profileCommand,
  reviewsCommand,
  supportCommand,
  pgpkeyCommand,
  productsDetailCommand,
  checkoutCommand,
  paymentsCommand,
  shippingCommand,
  menuCommand
} = require('./commands');
const { products_detail, products } = require('./keyboards');
const { getUserById } = require('../services/user');

module.exports = {
  handleCommands: (bot) => {
    // Handle /start command
    bot.onText(/\/start/, (msg) => startCommand(msg, bot));

    bot.onText(/\/products/, (msg) => categoriesCommand(msg, bot));
    bot.onText(/\/cart/, (msg) => cartCommand(msg, bot, 'cart'));
    bot.onText(/\/profile/, (msg) => profileCommand(msg, bot));
    bot.onText(/\/reviews/, (msg) => reviewsCommand(msg, bot));
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
      } else if (products[text]) {
        productsCommand(chatId, text, bot);
      } else if (text.startsWith('add_')) {
        cartCommand(message, bot, 'add_to_cart', text, query)
      } else if (text == 'cart') {
        cartCommand(message, bot, '_cart', text, query);
      } else if (text.startsWith('remove_item_')) {
        cartCommand(message, bot, 'remove_item', text, query);
      } else if (text == 'checkout') {
        checkoutCommand(message, bot, 'checkout', text, query);
      } else if (text == 'enter_discount') {
        checkoutCommand(message, bot, 'enter_discount', text, query);
      } else if (text == 'discount') {
        checkoutCommand(message, bot, 'discount', text, query);
      } else if (text === '2-5 Business Days $0.00🚚') {
        shippingCommand(chatId, text, bot);
      } else if (text.startsWith('payment_')) {
        paymentsCommand(chatId, text, bot, 'payment', query);
      } else if (text.startsWith('confirm_payment_')) {
        paymentsCommand(chatId, text, bot, 'confirm_payment', query);
      } else if (text == 'back') {
        bot.deleteMessage(chatId, messageId);
      } else if (text == 'menu') {
        menuCommand(message, bot);
      }
    });

    bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      const user = await getUserById(chatId);

      if (text == '🚀Products') {
        categoriesCommand(msg, bot);
      } else if (text == '🛒Cart') {
        cartCommand(msg, bot, 'cart');
      } else if (text == '👤My Profile') {
        profileCommand(msg, bot);
      } else if (text == '⭐️Reviews') {
        reviewsCommand(msg, bot);
      } else if (text == '🛟Support') {
        supportCommand(msg, bot);
      } else if (text == '🔒PGP Key') {
        pgpkeyCommand(msg, bot);
      } else if (text == 'Clear Chat History') {
        supportCommand(msg, bot, 'clear');
      } else if (text == 'Close Chat') {
        supportCommand(msg, bot, 'close');
      } else if (user && user.state === 'in_support_chat' && msg.text) {
        // Handle messages in support chat
        supportCommand(msg, bot, 'message', text);
      } else if (user && user.awaitingDiscount && msg.text) {
        checkoutCommand(msg, bot, 'input_discount', text);
      }
    })
  }
};
