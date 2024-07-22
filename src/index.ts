import { run } from './app.js';
import logger from './configs/logger.js';

logger.debug('Running...');

run({
  numbers: [1, 2, 3],
  entries: [],
  output: 'output.txt'
});
