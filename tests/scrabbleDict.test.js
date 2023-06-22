"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const scrabbleDict_1 = require("../src/scrabbleDict");
describe('Scrabble Dictionary', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, scrabbleDict_1.initializeDawg)();
    }));
    test('check function should return a boolean', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(typeof (yield (0, scrabbleDict_1.check)('word'))).toBe('boolean');
    }));
    test('check function should return true for a real word', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, scrabbleDict_1.check)('dog');
        expect(result).toBe(true);
    }));
    test('check function should return false for a non-existent word', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, scrabbleDict_1.check)('dgo');
        expect(result).toBe(false);
    }));
    test('iterator function should return an iterator', () => __awaiter(void 0, void 0, void 0, function* () {
        const iter = yield (0, scrabbleDict_1.iterator)();
        expect(typeof iter[Symbol.iterator]).toBe('function');
    }));
    test('children function should return a list of letters', () => __awaiter(void 0, void 0, void 0, function* () {
        const childLetters = yield (0, scrabbleDict_1.children)('pre');
        expect(Array.isArray(childLetters)).toBe(true);
        expect(childLetters.length).toBeGreaterThan(0);
    }));
    test('anagram function should yield words that can be formed with given letters', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const words = [];
        try {
            for (var _d = true, _e = __asyncValues((0, scrabbleDict_1.anagram)('lohw')), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const word = _c;
                words.push(word);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        expect(words).toContain('how');
        expect(words).toContain('owl');
        +expect(words).not.toContain('lwh'); // Ensure invalid words are not included
    }));
    test('check function should be case-insensitive', () => __awaiter(void 0, void 0, void 0, function* () {
        const result1 = yield (0, scrabbleDict_1.check)('Word');
        const result2 = yield (0, scrabbleDict_1.check)('wOrD');
        expect(result1).toBe(result2);
    }));
});
