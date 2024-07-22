import logger from './configs/logger.js';

if (process.env.NODE_ENV !== 'production') {
  throw new Error('Only run with `NODE_ENV=production` for consistency');
}

export type Options = {
  numbers: number[];
  entries: string[];
  output: string;
};

export function run(options: Options) {
  logger.info('Running with options:', options);
  logger.info(add(1, 2));
}

export function add(a: number, b: number) {
  return a + b;
}

process.on('SIGINT', () => {
  logger.debug('SIGINT received');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.debug('SIGTERM received');
  process.exit(0);
});
