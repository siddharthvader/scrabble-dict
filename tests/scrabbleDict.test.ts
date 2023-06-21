import { check, iterator, children, anagram, _DAWG } from '../src/scrabbleDict';

describe('Scrabble Dictionary', () => {
    beforeAll(() => {
        // Initialization can be done here if necessary.
    });

    test('check function should return a boolean', () => {
        expect(typeof check('word')).toBe('boolean');
    });

    test('iterator function should return an iterator', () => {
        const iter = iterator();
        expect(typeof iter[Symbol.iterator]).toBe('function');
    });

    // Add more tests...
});