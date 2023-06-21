import * as fs from 'fs';
import * as path from 'path';

const END = '$';
const WILD = '?';

class _Dawg {
    private data: Buffer;

    constructor(data: string) {
        this.data = Buffer.from(data, 'base64');
        this.data = Buffer.from(this.data.buffer, 0, this.data.byteLength); // Decompression is assumed to be handled outside
    }

    private _get_record(index: number) {
        const a = index * 4;
        const b = index * 4 + 4;
        const x = this.data.readUInt32LE(a);
        const more = Boolean(x & 0x80000000);
        const letter = String.fromCharCode((x >> 24) & 0x7f);
        const link = x & 0xffffff;
        return { more, letter, link };
    }

    private _get_child(index: number, targetLetter: string) {
        while (true) {
            const { more, letter, link } = this._get_record(index);
            if (letter === targetLetter) {
                return link;
            }
            if (!more) {
                return null;
            }
            index += 1;
        }
    }

    private _get_children(index: number) {
        const result = [];
        while (true) {
            const { more, letter, link } = this._get_record(index);
            result.push(letter);
            if (!more) {
                break;
            }
            index += 1;
        }
        return result;
    }

    private *_anagram(bag: Map<string, number>, index = 0, letters: string[] = []) {
        while (true) {
            const { more, letter, link } = this._get_record(index);
            if (letter === END) {
                yield letters.join('');
            } else if (bag.get(letter)) {
                bag.set(letter, bag.get(letter) - 1);
                letters.push(letter);
                for (const word of this._anagram(bag, link, letters)) {
                    yield word;
                }
                letters.pop();
                bag.set(letter, bag.get(letter) + 1);
            } else if (bag.get(WILD)) {
                bag.set(WILD, bag.get(WILD) - 1);
                letters.push(letter);
                for (const word of this._anagram(bag, link, letters)) {
                    yield word;
                }
                letters.pop();
                bag.set(WILD, bag.get(WILD) + 1);
            }
            if (!more) {
                break;
            }
            index += 1;
        }
    }

    contains(word: string) {
        let index = 0;
        for (const letter of [...word, END]) {
            index = this._get_child(index, letter);
            if (index === null) {
                return false;
            }
        }
        return true;
    }

    *iterator(index = 0, letters: string[] = []) {
        while (true) {
            const { more, letter, link } = this._get_record(index);
            if (letter === END) {
                yield letters.join('');
            } else {
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

    children(prefix: string) {
        let index = 0;
        for (const letter of prefix) {
            index = this._get_child(index, letter);
            if ([0, null].includes(index)) {
                return [];
            }
        }
        return this._get_children(index);
    }

    *anagram(letters: string) {
        const bag = new Map<string, number>();
        for (const letter of letters) {
            bag.set(letter, (bag.get(letter) || 0) + 1);
        }
        for (const word of this._anagram(bag)) {
            yield word;
        }
    }
}

export let _DAWG: _Dawg | null = null;

export async function initializeDawg(): Promise<void> {
    const filePath = path.resolve(__dirname, '../assets/data.txt');
    const data = fs.readFileSync(filePath, 'utf-8');
    const cleanedData = data.replace(/"/g, '').replace(/\n/g, '');
    _DAWG = new _Dawg(cleanedData);
}

export async function check(word: string): Promise<boolean> {
    if (!_DAWG) {
        throw new Error('DAWG not initialized. Please run initializeDawg() before using.');
    }
    return _DAWG.contains(word);
}

export async function iterator(): Promise<IterableIterator<string>> {
    if (!_DAWG) {
        throw new Error('DAWG not initialized. Please run initializeDawg() before using.');
    }
    return _DAWG.iterator();
}

export async function children(prefix: string): Promise<string[]> {
    if (!_DAWG) {
        throw new Error('DAWG not initialized. Please run initializeDawg() before using.');
    }
    return _DAWG.children(prefix);
}

export async function anagram(letters: string): Promise<IterableIterator<string>> {
    if (!_DAWG) {
        throw new Error('DAWG not initialized. Please run initializeDawg() before using.');
    }
    return _DAWG.anagram(letters);
}

