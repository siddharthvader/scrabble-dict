import { check, iterator, children, anagram, initializeDawg } from '../src/scrabbleDict';

describe('Scrabble Dictionary', () => {
    beforeAll(async () => {
        // Initialization can be done here if necessary.
        await initializeDawg();
    });

    test('check function should return a boolean', async () => {
        expect(typeof await check('word')).toBe('boolean');
    });

    test('iterator function should return an iterator', async () => {
        const iter = await iterator();
        expect(typeof iter[Symbol.iterator]).toBe('function');
    });

    // Add more tests...
});
