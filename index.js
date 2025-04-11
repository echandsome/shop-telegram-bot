const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('./data/database.js');

const { TELEGRAM_BOT_TOKEN } = require('./config/config');
const { handleCommands } = require('./bot/handlers');

// Create bot object
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Pass bot to command handling function
handleCommands(bot);

console.log('Bot is running...');