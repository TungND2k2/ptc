'use strict';
export function logData(
  level: string,
  type: 'info' | 'warning' | 'alert',
  message: string,
  ...params: any
): void {
  if (process.env.LOGGER) {
    if (level === '' || level === '*' || level === process.env.LOGGER) {
      const pad2 = (n: number) => {
        return (n < 10 ? '0' : '') + n;
      };
      const now = new Date();
      const time =
        now.getFullYear().toString().substring(2, 4) +
        pad2(now.getMonth() + 1) +
        pad2(now.getDate()) +
        ' ' +
        pad2(now.getHours()) +
        pad2(now.getMinutes()) +
        pad2(now.getSeconds());
      let color = '\x1b[34m';
      switch (type) {
        case 'info': {
          color = '\x1b[34m';
          break;
        }
        case 'warning': {
          color = '\x1b[33m';
          break;
        }
        case 'alert': {
          color = '\x1b[31m';
          break;
        }
      }
      const fullMessage = `${color}[${time}] ${message}\x1b[0m\n`;
      if (params.length > 0) {
        console.log(fullMessage, ...params);
      } else {
        console.log(fullMessage);
      }
    }
  }
}
export function logInfo(level: string, message: string, ...params: any): void {
  logData(level, 'info', message, ...params);
}
export function logWarning(
  level: string,
  message: string,
  ...params: any
): void {
  logData(level, 'warning', message, params);
}
export function logAlert(level: string, message: string, ...params: any): void {
  logData(level, 'alert', message, ...params);
}
