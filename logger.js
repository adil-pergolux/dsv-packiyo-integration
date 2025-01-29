// logger.js
const { createLogger, transports, format } = require("winston");
const path = require("path");

// Define logger
const logger = createLogger({
    level: "error", // Log levels: error, warn, info, http, verbose, debug, silly
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
        new transports.File({ filename: path.join(__dirname, "error-logs.txt") }), // Log into logs.txt
    ],
});

module.exports = logger;