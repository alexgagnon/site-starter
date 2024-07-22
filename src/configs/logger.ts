import { pino } from 'pino';
import { LOG_LEVEL, LOG_PRETTY } from './constants.js';

export default pino({
  level: LOG_LEVEL,
  redact: {
    paths: [],
    censor: '[Redacted]',
    remove: false
  },
  ...(LOG_PRETTY ? { transport: { target: 'pino-pretty' } } : {})
});
