import log4js from "log4js";

const {
    LOG_FILE: logFile = "logs/combined.log",
    ERROR_LOG_FILE: errorFile = "logs/error.log",
} = process.env;

log4js.configure({
    appenders: {
        console: { type: "console" },
        file: { type: "file", filename: logFile },
        error: { type: "file", filename: errorFile },
    },
    categories: {
        default: { appenders: ["console", "file"], level: "info" },
        error: { appenders: ["error", "file"], level: "error" },
    },
});

export const logger = {
    defaultLogger: log4js.getLogger("default"),
    errorLogger: log4js.getLogger("error"),
};
