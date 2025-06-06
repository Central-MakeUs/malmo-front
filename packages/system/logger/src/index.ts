import pino, { LoggerOptions, stdTimeFunctions } from 'pino'

let logLevel: string
try {
  logLevel = process.env.LOG_LEVEL ?? 'info'
} catch (e) {
  logLevel = import.meta?.['env']?.VITE_LOG_LEVEL ?? 'info'
}
let disabledLogger: boolean
try {
  disabledLogger = process.env.NODE_ENV === 'production'
} catch (e) {
  disabledLogger = !!import.meta?.['env']?.PROD
}

const pinoConfig: LoggerOptions = {
  base: null,
  level: logLevel,
  messageKey: 'log',
  timestamp: stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label }
    },
  },
  redact: {
    paths: ['req', 'res', 'err'],
    remove: true,
  },
  browser: {
    serialize: false,
    disabled: disabledLogger,
  },
}

let logger = pino(pinoConfig)
if (!disabledLogger) {
  logger = pino({
    ...pinoConfig,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        hideObject: false,
        translateTime: `yyyy-mm-dd'T'HH:MM:ss.l'Z'`,
      },
    },
  })
}

function trace(message: any, ...optionalParams: any[]): any {
  logger.trace(message, ...optionalParams)
}

function debug(message: any, ...optionalParams: any[]): any {
  logger.debug(message, ...optionalParams)
}

function log(message: any, ...optionalParams: any[]): any {
  logger.info(message, ...optionalParams)
}

function info(message: any, ...optionalParams: any[]): any {
  logger.info(message, ...optionalParams)
}

function warn(message: any, ...optionalParams: any[]): any {
  logger.warn(message, ...optionalParams)
}

function error(message: any, ...optionalParams: any[]): any {
  logger.error(message, ...optionalParams)
}

function fatal(message: any, ...optionalParams: any[]): any {
  logger.fatal(message, ...optionalParams)
}

export default {
  logger,
  trace,
  debug,
  log,
  info,
  warn,
  error,
  fatal,
}
