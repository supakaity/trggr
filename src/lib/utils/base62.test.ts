import { describe, it, expect } from 'vitest';
import { base62Encode, base62Decode } from './base62';

describe('Base62 Encoding and Decoding', () => {
  it('should encode and decode simple strings', () => {
    const input = 'Hello, World!';
    const encoded = base62Encode(input);
    const decoded = base62Decode(encoded);
    expect(decoded).toBe(input);
  });

  it('should handle empty input', () => {
    const input = '';
    const encoded = base62Encode(input);
    const decoded = base62Decode(encoded);
    expect(decoded).toEqual('');
  });

  it('should encode and decode special characters', () => {
    const input = '!@#$%^&*()_+{}[]|":;<>?,./-=';
    const encoded = base62Encode(input);
    const decoded = base62Decode(encoded);
    expect(decoded).toBe(input);
  });

  it('should perform roundtrip encoding and decoding', () => {
    const testCases = [
      'Short string',
      'A somewhat longer string with some numbers 12345',
      'A string with unicode characters: 你好，世界！',
      '',
      'a',
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    ];

    testCases.forEach(testCase => {
      const input = testCase;
      const encoded = base62Encode(input);
      const decoded = base62Decode(encoded);
      expect(decoded).toBe(input);
    });
  });

  it('should handle null byte', () => {
    const input = '\0';
    const encoded = base62Encode(input);
    console.log('encoded', encoded);
    const decoded = base62Decode(encoded);
    console.log('decoded', decoded);
    expect(decoded).toBe(input);
  });

  it('should handle all possible single-byte inputs', () => {
    for (let i = 0; i < 256; i++) {
      const input = String.fromCharCode(i);
      const encoded = base62Encode(input);
      const decoded = base62Decode(encoded);
      expect(decoded).toBe(input);
    }
  });

  it('should fail on invalid input', () => {
    const input = 'wag';
    const decoded = base62Decode(input);
    expect(decoded).toBe(undefined);
  });
});
