import { test, expect } from 'vitest';
import { add } from './app.js';

test('it works', () => {
  expect(true).toBe(true);
});

test.for([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3]
])('add(%i, %i) -> %i', ([a, b, expected]) => {
  expect(add(a, b)).toBe(expected);
});
