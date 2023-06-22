"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.anagram = exports.children = exports.iterator = exports.check = exports.initializeDawg = exports._DAWG = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const END = '$';
const WILD = '?';
class _Dawg {
    constructor(data) {
        let buffer = Buffer.from(data, 'base64');
        let decompressed = require('zlib').inflateSync(buffer);
        this.data = decompressed;
        this._anagram = this._anagram.bind(this);
    }
    _get_record(index) {
        if (index === null) {
            return null;
        }
        const a = index * 4;
        const b = index * 4 + 4;
        const x = this.data.readUInt32LE(a);
        const more = Boolean(x & 0x80000000);
        const letter = String.fromCharCode((x >> 24) & 0x7f);
        const link = x & 0xffffff;
        return { more, letter, link };
    }
    _get_child(index, targetLetter) {
        while (true) {
            const record = this._get_record(index);
            if (record === null || index === null) {
                return null;
            }
            const { more, letter, link } = record;
            if (letter === targetLetter) {
                return link;
            }
            if (!more || index === null) {
                return null;
            }
            index += 1;
        }
    }
    _get_children(index) {
        const result = [];
        while (true) {
            const record = this._get_record(index);
            if (record === null || index === null) {
                return null;
            }
            const { more, letter, link } = record;
            result.push(letter);
            if (!more) {
                break;
            }
            index += 1;
        }
        return result;
    }
    _anagram(bag, index = 0, letters = []) {
        return __asyncGenerator(this, arguments, function* _anagram_1() {
            var _a, e_1, _b, _c, _d, e_2, _e, _f;
            while (true) {
                const record = this._get_record(index);
                if (record === null || index === null) {
                    return yield __await(null);
                }
                const { more, letter, link } = record;
                if (letter === END) {
                    yield yield __await(letters.join(''));
                }
                else if (bag[letter]) {
                    bag[letter] -= 1;
                    letters.push(letter);
                    try {
                        for (var _g = true, _h = (e_1 = void 0, __asyncValues(this._anagram(bag, link, letters))), _j; _j = yield __await(_h.next()), _a = _j.done, !_a; _g = true) {
                            _c = _j.value;
                            _g = false;
                            const word = _c;
                            yield yield __await(word);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_g && !_a && (_b = _h.return)) yield __await(_b.call(_h));
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    letters.pop();
                    bag[letter] += 1;
                }
                else if (bag[WILD]) {
                    bag[WILD] -= 1;
                    letters.push(letter);
                    try {
                        for (var _k = true, _l = (e_2 = void 0, __asyncValues(this._anagram(bag, link, letters))), _m; _m = yield __await(_l.next()), _d = _m.done, !_d; _k = true) {
                            _f = _m.value;
                            _k = false;
                            const word = _f;
                            yield yield __await(word);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (!_k && !_d && (_e = _l.return)) yield __await(_e.call(_l));
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    letters.pop();
                    bag[WILD] += 1;
                }
                if (!more) {
                    break;
                }
                index += 1;
            }
        });
    }
    contains(word) {
        let index = 0;
        for (const letter of [...word, END]) {
            index = this._get_child(index, letter);
            if (index === null) {
                return false;
            }
        }
        return true;
    }
    *iterator(index = 0, letters = []) {
        while (true) {
            const record = this._get_record(index);
            if (record === null || index === null) {
                return null;
            }
            const { more, letter, link } = record;
            if (letter === END) {
                yield letters.join('');
            }
            else {
                letters.push(letter);
                for (const word of this.iterator(link, letters)) {
                    yield word;
                }
                letters.pop();
            }
            if (!more) {
                break;
            }
            index += 1;
        }
    }
    children(prefix) {
        let index = 0;
        for (const letter of prefix) {
            index = this._get_child(index, letter);
            if ([0, null].includes(index)) {
                return [];
            }
        }
        return this._get_children(index);
    }
    anagram(letters) {
        return __asyncGenerator(this, arguments, function* anagram_1() {
            var _a, e_3, _b, _c;
            const bag = new Map();
            for (const letter of letters) {
                bag.set(letter, (bag.get(letter) || 0) + 1);
            }
            try {
                for (var _d = true, _e = __asyncValues(this._anagram(bag)), _f; _f = yield __await(_e.next()), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const word = _c;
                    yield yield __await(word);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
                }
                finally { if (e_3) throw e_3.error; }
            }
        });
    }
}
exports._DAWG = null;
function initializeDawg() {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path.resolve(__dirname, '../assets/data.txt');
        const data = fs.readFileSync(filePath, 'utf-8');
        const cleanedData = data.replace(/"/g, '').replace(/\n/g, '');
        exports._DAWG = new _Dawg(cleanedData);
    });
}
exports.initializeDawg = initializeDawg;
function check(word) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!exports._DAWG) {
            throw new Error('DAWG not initialized. Please run initializeDawg() before using.');
        }
        return exports._DAWG.contains(word);
    });
}
exports.check = check;
function iterator() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!exports._DAWG) {
            throw new Error('DAWG not initialized. Please run initializeDawg() before using.');
        }
        return exports._DAWG.iterator();
    });
}
exports.iterator = iterator;
function children(prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!exports._DAWG) {
            throw new Error('DAWG not initialized. Please run initializeDawg() before using.');
        }
        return exports._DAWG.children(prefix) || [];
    });
}
exports.children = children;
function defaultdict(defaultValue) {
    return new Proxy({}, {
        get: (target, name) => name in target ? target[name] : defaultValue
    });
}
function anagram(letters) {
    return __asyncGenerator(this, arguments, function* anagram_2() {
        var _a, e_4, _b, _c;
        if (!exports._DAWG) {
            throw new Error('DAWG not initialized. Please run initializeDawg() before using.');
        }
        const bag = defaultdict(0);
        for (const letter of letters) {
            bag[letter] = (bag[letter] || 0) + 1;
        }
        try {
            for (var _d = true, _e = __asyncValues(exports._DAWG._anagram(bag)), _f; _f = yield __await(_e.next()), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const word = _c;
                yield yield __await(word);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
            }
            finally { if (e_4) throw e_4.error; }
        }
    });
}
exports.anagram = anagram;
