import log4js from "log4js";
import fs from "fs"


const temp = process.cwd()
const LOG_PATH = process.env.LOG_BASE_DIR;
const log_backend = fs.readFileSync("logs/starting_backend.txt").toString('utf-8').split("\n")
const log_logo = fs.readFileSync("logs/logo.txt").toString('utf-8').split("\n")



log4js.configure({
    appenders: {
        access: {
            type: 'dateFile',
            filename: `${LOG_PATH}/access.log`,
            pattern: '-yyyy-MM-dd',
            backups: 3,
        },
        info: {
            type: 'dateFile',
            filename: `${LOG_PATH}/info.log`,
            pattern: '-yyyy-MM-dd',
            backups: 3,
        },
    },
    categories: {
        default: { appenders: ['access'], level: 'ALL' },
        access: { appenders: ['access'], level: 'DEBUG' },
        info: { appenders: ['info'], level: 'DEBUG' },
    },
});

export const accessLogger = log4js.getLogger('access')
export const infoLogger = log4js.getLogger('info')
export const expressLogger = log4js.connectLogger(log4js.getLogger('access'), { level: log4js.levels.INFO })

//Log Start Message
log_backend.forEach(line => {
    infoLogger.info(line)
    accessLogger.info(line)
})

//Log Logo
log_logo.forEach(line => {
    infoLogger.info(line)
    accessLogger.info(line)
})

