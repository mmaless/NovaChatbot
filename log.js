const { createLogger, format, transports } = require('winston');

const MYFORMAT = format.printf(
  (info) => `${new Date().toISOString()} [${info.label}] ${info.level}: ${info.message}`
);

const LOGGER = createLogger({
  format: format.combine(MYFORMAT),
  level: 'debug',
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'events.log',
    }),
  ],
});

function log(label, level, message) {
  LOGGER.log({
    label,
    level,
    message,
  });
}

module.exports = log;