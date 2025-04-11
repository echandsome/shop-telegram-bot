const { TelegramBot } = require('./handlers');

module.exports = {
  startCommand: (msg) => {
    const chatId = msg.chat.id;

    console.log("client name", msg.chat);

    const response = 'Welcome to our shop! Type /shop to view products.';
    TelegramBot.sendMessage(chatId, response);
  },
};
