import { Level } from 'pino';

export function parseEnvVar<T>(name: string, defaultValue: T): T {
  const value = process.env[name]?.trim();

  if (value === undefined) {
    return defaultValue;
  }

  try {
    if (typeof defaultValue === 'number') {
      const parsedValue = parseFloat(value);

      if (isNaN(parsedValue)) {
        return defaultValue;
      }

      if (Number.isInteger(value)) {
        return parseInt(value) as unknown as T;
      }

      return parsedValue as unknown as T;
    }

    if (typeof defaultValue === 'boolean') {
      return (value.toLowerCase() === 'true' || value === '1') as unknown as T;
    }

    if (typeof defaultValue === 'object' && defaultValue !== null) {
      return JSON.parse(value) as T;
    }

    if (/^\/.*\/$/.test(value)) {
      return new RegExp(value.slice(1, -1)) as unknown as T;
    }

    return value as unknown as T;
  } catch {
    return defaultValue;
  }
}

// logging & telemetry
export const LOG_LEVEL: Level = parseEnvVar('LOG_LEVEL', 'info');
export const LOG_PRETTY = parseEnvVar('LOG_PRETTY', false);
export const DISABLE_TELEMETRY = parseEnvVar('DISABLE_TELEMETRY', false);
export const SAMPLER_PERCENTAGE = parseEnvVar('SAMPLER_PERCENTAGE', 0.1);

// fetching
export const RETRY = parseEnvVar('RETRY', true);
export const MAX_SOCKETS = parseEnvVar('MAX_SOCKETS', 32);
export const MAX_RETRIES = parseEnvVar('MAX_RETRIES', 3);
export const STATUSES_TO_RETRY = parseEnvVar(
  'STATUSES_TO_RETRY',
  [408, 500, 502, 503, 504]
);
export const RETRY_DELAY = parseEnvVar('RETRY_DELAY', 1000);
export const RETRY_BACKOFF = parseEnvVar('RETRY_BACKOFF', 1);
