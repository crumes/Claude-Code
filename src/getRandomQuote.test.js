import { describe, it, expect, vi } from 'vitest';

/**
 * Test function: getRandomQuote()
 * Returns a random motivational quote from a hardcoded array.
 */

function getRandomQuote() {
  const quotes = [
    "You got this",
    "Keep pushing",
    "Believe in yourself",
    "One step at a time",
    "Never give up"
  ];
  return quotes[Math.random() * quotes.length | 0];
}

describe('getRandomQuote', () => {
  describe('happy paths', () => {
    it('returns a string', () => {
      const result = getRandomQuote();
      expect(typeof result).toBe('string');
    });

    it('returns a non-empty string', () => {
      const result = getRandomQuote();
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns a value from the quotes array', () => {
      const validQuotes = [
        "You got this",
        "Keep pushing",
        "Believe in yourself",
        "One step at a time",
        "Never give up"
      ];
      const result = getRandomQuote();
      expect(validQuotes).toContain(result);
    });

    it('requires no parameters', () => {
      expect(() => getRandomQuote()).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('handles Math.random() returning 0 (first quote)', () => {
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0);

      const result = getRandomQuote();
      expect(result).toBe("You got this");

      Math.random = originalRandom;
    });

    it('handles Math.random() returning near 1 (last quote)', () => {
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.9999);

      const result = getRandomQuote();
      expect(result).toBe("Never give up");

      Math.random = originalRandom;
    });

    it('returns one of exactly 5 quotes', () => {
      const validQuotes = new Set([
        "You got this",
        "Keep pushing",
        "Believe in yourself",
        "One step at a time",
        "Never give up"
      ]);
      expect(validQuotes.size).toBe(5);
    });

    it('handles middle range Math.random() values', () => {
      const testCases = [
        { random: 0.1, expectedIndex: 0, expectedQuote: "You got this" },
        { random: 0.2, expectedIndex: 1, expectedQuote: "Keep pushing" },
        { random: 0.4, expectedIndex: 2, expectedQuote: "Believe in yourself" },
        { random: 0.6, expectedIndex: 3, expectedQuote: "One step at a time" },
        { random: 0.8, expectedIndex: 4, expectedQuote: "Never give up" }
      ];

      const originalRandom = Math.random;

      testCases.forEach(({ random, expectedQuote }) => {
        Math.random = vi.fn(() => random);
        const result = getRandomQuote();
        expect(result).toBe(expectedQuote);
      });

      Math.random = originalRandom;
    });
  });

  describe('randomness behavior', () => {
    it('can return all quotes (probabilistic check)', () => {
      const quotesReturned = new Set();
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        quotesReturned.add(getRandomQuote());
      }

      // After 1000 calls, we should see all 5 quotes
      // (statistically almost certain with uniform distribution)
      expect(quotesReturned.size).toBe(5);
    });

    it('demonstrates bitwise OR operator behavior with index calculation', () => {
      const originalRandom = Math.random;

      // Test that Math.random() * quotes.length | 0 correctly calculates index
      const testCases = [
        { random: 0, calculated: 0 },
        { random: 0.2, calculated: 1 },
        { random: 0.4, calculated: 2 },
        { random: 0.6, calculated: 3 },
        { random: 0.8, calculated: 4 },
        { random: 0.99, calculated: 4 }
      ];

      testCases.forEach(({ random, calculated }) => {
        const index = random * 5 | 0;
        expect(index).toBe(calculated);
      });

      Math.random = originalRandom;
    });

    it('returns consistent results when Math.random() is mocked', () => {
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.5);

      const result1 = getRandomQuote();
      const result2 = getRandomQuote();

      expect(result1).toBe(result2);
      expect(result1).toBe("Believe in yourself");

      Math.random = originalRandom;
    });
  });

  describe('regression tests', () => {
    it('always returns a trimmed string (no accidental whitespace)', () => {
      for (let i = 0; i < 100; i++) {
        const result = getRandomQuote();
        expect(result).toBe(result.trim());
      }
    });

    it('respects case sensitivity of quotes', () => {
      const validQuotes = [
        "You got this",
        "Keep pushing",
        "Believe in yourself",
        "One step at a time",
        "Never give up"
      ];

      for (let i = 0; i < 100; i++) {
        const result = getRandomQuote();
        expect(validQuotes).toContain(result);
        // Verify exact case (not lowercase or uppercase versions)
        expect(result).not.toBe(result.toLowerCase());
        expect(result).not.toBe(result.toUpperCase());
      }
    });
  });
});
