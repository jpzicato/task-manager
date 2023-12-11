import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { format, transports, createLogger } from 'winston';

const { Console, File } = transports;
const { combine, timestamp, printf } = format;

const __dirname = dirname(fileURLToPath(import.meta.url));

const logFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const definedTransports = [
  new Console(),
  new File({
    filename: join(__dirname, 'error.log'),
    level: 'error',
  }),
  new File({ filename: join(__dirname, 'combined.log') }),
];

export default createLogger({
  format: combine(timestamp(), logFormat),
  transports: definedTransports,
});
