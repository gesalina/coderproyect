import winston from "winston";
import dotenv from "dotenv";
dotenv.config();

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    fatal: "red",
    error: "orange",
    warning: "yellow",
    info: "blue",
    debug: "white",
  },
};

const logger = (env) => {
  if (env == "PROD") {
    return winston.createLogger({
      levels: customLevelOptions.levels,
      transports: [
        new winston.transports.File({
          filename: "./logs/serverlogs.log",
          level: "fatal",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple()
          ),
        }),
      ],
    });
  } else {
    return winston.createLogger({
      levels: customLevelOptions.levels,
      transports: [
        new winston.transports.Console({
          level: "fatal",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize({colors: customLevelOptions.colors}),
            winston.format.simple()
          ),
        }),
      ],
    });
  }
};

export default logger;
