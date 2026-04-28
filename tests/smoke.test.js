import { describe, it, expect } from 'vitest';

describe('vitest harness', () => {
  it('runs in jsdom', () => {
    expect(typeof document).toBe('object');
    expect(typeof window.localStorage).toBe('object');
  });
});
