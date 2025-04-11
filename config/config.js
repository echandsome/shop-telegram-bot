require('dotenv').config();

module.exports = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  DB_URL: 'mongodb://localhost:27017/telegramBot',
  COMBINED_LOG_URL: 'logs/combined.log',
  ERROR_LOG_URL: 'logs/error.log',
};