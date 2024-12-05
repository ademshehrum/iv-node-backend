const { createLogger, format, transports } = require("winston");
const path = require("path");

const logFilePath = path.join(__dirname, "../../logs/app.log");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: logFilePath }),
  ],
});

const logHelper = {
  info: (message) => logger.info(message),
  warn: (message) => logger.warn(message),
  error: (message) => logger.error(message),
};

module.exports = logHelper;
