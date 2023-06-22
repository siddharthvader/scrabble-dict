# Scrabble Dictionary [scrabble-dict]

(https://badge.fury.io/js/scrabble-dict) (https://www.npmjs.com/package/scrabble-dict)

Taken from https://github.com/fogleman/TWL06

Scrabble Dictionary is a JavaScript/TypeScript library that can be used in browsers for word games like Scrabble, Words with Friends, and others. It provides an efficient way to check the validity of words, find anagrams, and more. It's perfect for game developers or enthusiasts looking to add dictionary functionality to their web-based word games.

## Features

- Check if a word exists in the Scrabble dictionary.
- Find all possible anagrams of a given set of letters.
- Efficient and fast, suitable for real-time use in web games.

## Installation

Install the package via npm:

`npm install scrabble-dict`

## Usage

### Importing the Library

Import the library in your JavaScript or TypeScript file:

`import 'scrabble-dict';`

### Initializing the Dictionary

Before you can use the dictionary, you need to initialize it. This is typically done once at the start of your application.

```
import { initializeDawg } from 'scrabble-dict';

(async () => {
    await initializeDawg();
})();
```

### Checking if a Word Exists

To check if a word exists in the dictionary, use the `check` method:

```
import { check } from 'scrabble-dict';

(async () => {
    const word = 'example';
    const exists = await check(word);

    console.log(`Does the word "${word}" exist? ${exists ? 'Yes' : 'No'}`);
})();
```

### Finding Children

To find all possible children of a given set of letters, use the `children` method:

```
import { children } from 'scrabble-dict';

(async () => {
    const prefix = 'ex';
    const childWords = await children(prefix);

    console.log(`Children of the prefix "${prefix}":`, childWords);
})();
```

### Finding Anagrams

To find all possible anagrams of a given set of letters, use the `anagram` method:

```
import { anagram } from 'scrabble-dict';

(async () => {
    const letters = 'hat';

    for await (const word of anagram(letters)) {
        console.log(`An anagram of "${letters}": ${word}`);
    }
})();
```

## Contributing

Contributions are welcome!

## License

ISC
