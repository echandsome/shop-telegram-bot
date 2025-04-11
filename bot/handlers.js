const { startCommand } = require('./commands');

module.exports = {
  handleCommands: (bot) => {
    // Handle /start command
    bot.onText(/\/start/, (msg) => startCommand(msg, bot));

    // Other commands can be added here
    bot.onText(/\/shop/, (msg) => shopCommand(msg, bot));

    bot.on('message', (msg) => {
      //console.log(msg);
    })
  }
};
