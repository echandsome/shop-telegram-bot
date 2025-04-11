require('dotenv').config();
console.log(process.env.TELEGRAM_BOT_TOKEN)
module.exports = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  DB_URL: "mongodb://localhost:27017/telegramBot",
};