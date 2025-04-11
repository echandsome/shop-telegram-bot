const { createLogger, format, transports } = require('winston');
const path = require('path');
const { COMBINED_LOG_URL, ERROR_LOG_URL } = require('../config/config');

// Function to extract location from stack trace
const extractLocation = (stack) => {
  if (!stack) return 'unknown';
  const match = stack.split('\n')[1]?.match(/\((.*):(\d+):(\d+)\)/) ||
                stack.split('\n')[1]?.match(/at (.*):(\d+):(\d+)/);
  if (match) {
    const filePath = match[1];
    const line = match[2];
    return `[${path.relative(process.cwd(), filePath)}:${line}]`;
  }
  return '[unknown]';
};

// Create and configure logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => {
      const base = `[${info.timestamp}] ${info.level.toUpperCase()} -`;

      if (info instanceof Error || info.stack) {
        const location = extractLocation(info.stack);
        return `${base} ${location} ${info.message}`;
      }

      return `${base} ${info.message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: ERROR_LOG_URL, level: 'error' }),
    new transports.File({ filename: COMBINED_LOG_URL }),
  ]
});

module.exports = logger;
