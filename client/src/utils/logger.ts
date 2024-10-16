enum LogLevel {
    INFO,
    WARN,
    ERROR
  }
  
  export const logger = {
    info: (message: string) => log(LogLevel.INFO, message),
    warn: (message: string) => log(LogLevel.WARN, message),
    error: (message: string, error?: unknown) => log(LogLevel.ERROR, message, error),
  };
  
  function log(level: LogLevel, message: string, error?: unknown) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${LogLevel[level]}: ${message}`;
    
    switch (level) {
      case LogLevel.INFO:
        console.log(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.ERROR:
        console.error(logMessage, error);
        break;
    }
  
    // Here you could also send logs to a server or save them to a file
  }