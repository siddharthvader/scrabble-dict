import { check, iterator, children, anagram, initializeDawg } from '../src/scrabbleDict';

describe('Scrabble Dictionary', () => {
  beforeAll(async () => {
    await initializeDawg();
  });

  test('check function should return a boolean', async () => {
    expect(typeof await check('word')).toBe('boolean');
  });

  test('check function should return true for a real word', async () => {
    const result = await check('dog');
    expect(result).toBe(true);
  });

  test('check function should return false for a non-existent word', async () => {
    const result = await check('dgo');
    expect(result).toBe(false);
  });

  test('iterator function should return an iterator', async () => {
    const iter = await iterator();
    expect(typeof iter[Symbol.iterator]).toBe('function');
  });

  test('children function should return a list of letters', async () => {
    const childLetters = await children('pre');
    expect(Array.isArray(childLetters)).toBe(true);
    expect(childLetters.length).toBeGreaterThan(0);
  });

  test('anagram function should yield words that can be formed with given letters', async () => {
    const words = [];
    for await (const word of anagram('lohw')) {
      words.push(word);
    }
    expect(words).toContain('how');
    expect(words).toContain('owl');
+   expect(words).not.toContain('lwh'); // Ensure invalid words are not included
  });

  test('check function should be case-insensitive', async () => {
    const result1 = await check('Word');
    const result2 = await check('wOrD');
    expect(result1).toBe(result2);
  });
});
