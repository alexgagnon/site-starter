import { describe, it, expect } from 'vitest';
import {
  parseEnvVar,
  LOG_LEVEL,
  LOG_PRETTY,
  DISABLE_TELEMETRY,
  SAMPLER_PERCENTAGE,
  MAX_SOCKETS
} from './constants.js';

describe('constants', () => {
  it('parseEnvVar', () => {
    expect(parseEnvVar('PORT', 8080)).toBe(8080);
    expect(parseEnvVar('PUBLIC_DIRS', [])).toEqual([]);
    expect(parseEnvVar('LOG_LEVEL', 'info')).toBe('info');
    expect(parseEnvVar('LOG_PRETTY', false)).toBe(false);
    expect(parseEnvVar('DISABLE_TELEMETRY', false)).toBe(false);
    expect(
      parseEnvVar('CSP', {
        defaultSrc: ["'self'"],
        scriptSrc: ["'unsafe-inline'"]
      })
    ).toStrictEqual({
      defaultSrc: ["'self'"],
      scriptSrc: ["'unsafe-inline'"]
    });
    expect(parseEnvVar('SAMPLER_PERCENTAGE', 0.1)).toBe(0.1);
    expect(parseEnvVar('MAX_SOCKETS', 32)).toBe(32);
  });

  it('should export sane defaults', () => {
    expect(LOG_LEVEL).toBe('info');
    expect(LOG_PRETTY).toBe(false);
    expect(DISABLE_TELEMETRY).toBe(false);
    expect(SAMPLER_PERCENTAGE).toBe(0.1);
    expect(MAX_SOCKETS).toBe(32);
  });
});
// Path: src/configs/constants.ts
