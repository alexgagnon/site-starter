# Node Starter

Starter repo for Node.JS apps.

- wireit - script manager
- typescript - static typing
- vite-node - running typescript files directly
- eslint & typescript-eslint - linting
- prettier & editorconfig - formatting
- vitest - unit testing using vite config
- husky & lint-staged - commit control
- pino - logging
- opentelemetry (OTel) - telemetry

NOTES:

- Make sure you redact PII using pino's redact option in src/configs/logger.ts
- Prettier will use configurations from the .editorconfig file.
- You must require `pino-debug` before the process starts to initialize it correctly. For more options see [here](https://github.com/pinojs/pino-debug).
- OTel still has limited support for ESM, so results may vary depending on what you're trying to instrument.

## Usage

Scripts are controlled using Wireit, which includes features like script dependencies, automatic cleaning of output folders, caching, and a watch mode. If you make substantial changes to the project structure, you may need to update the `files` and/or `outputs` properties of the wireit tasks, otherwise the caching won't work as expected. See [the wireit docs](https://github.com/google/wireit/blob/main/README.md) for more details.

ESLint has been augmented with typescript-eslint with Type Information mode activated for extra linting powers.

When you commit, Husky runs Lint-Staged, which will run both ESLint and Prettier in "check" mode. If it fails, you need to correct the errors in the staged files (can often be done with `npm run format -- --write` and/or `npm run lint -- --fix`).

When deploying, the only files that are needed are those in `dist`, `package.json`, and potentially `ecosystem.config.cjs` if using `pm2` for process management.
