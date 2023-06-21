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

    private _get_child(index: number, letter: string) {
        while (true) {
            const { more, other, link } = this._get_record(index);
            if (other === letter) {
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

async function initializeDawg() {
    const rawData = await import('./assets/data.txt');
    // Remove " and \n characters
    const base64Data = rawData.default.replace(/["\n]/g, '');
    return new _Dawg(base64Data);
}

export const _DAWG = initializeDawg();

function check(word: string) {
    return _DAWG.contains(word);
}

function iterator() {
    return _DAWG.iterator();
}

function children(prefix: string) {
    return _DAWG.children(prefix);
}

function anagram(letters: string) {
    return _DAWG.anagram(letters);
}
