import { parseArgs } from 'node:util';
import { type Options, run } from './app.js';
import logger from './configs/logger.js';

const DEFAULT_NUMBERS = ['1', '2', '3'];

const options = {
  help: {
    type: 'boolean',
    short: 'h',
    description: 'Show help'
  },
  numbers: {
    type: 'string',
    multiple: true,
    short: 'n',
    default: DEFAULT_NUMBERS,
    description: 'Numbers'
  },
  output: {
    type: 'string',
    short: 'o',
    description: 'Output file'
  }
} as const;

const allowPositionals = true;

const args = parseArgs({
  options,
  allowPositionals,
  strict: true
});

logger.debug('Arguments: %o', args);

const { values, positionals } = args;
const { help, numbers, ...rest } = values;

if (help) {
  showUsage();
  process.exit(0);
}

if (positionals.length === 0) {
  console.error('Missing entries');
  showUsage();
  process.exit(1);
}

run({
  numbers: numbers.map((number) => parseInt(number)),
  entries: positionals,
  ...rest
} as Options);

function showUsage() {
  console.log(
    `\nUsage: cli [options]${allowPositionals ? ' <entries...>' : ''}`
  );
  Object.entries(options).forEach(([name, option]) => {
    const defaultValue =
      'default' in option ? ` [default: ${option.default.toString()}]` : '';
    const alias = option.short ? `, -${option.short}` : '';
    const description = option.description;
    console.log(`  --${name}${alias}${description}${defaultValue}`);
  });
  console.log();
}
