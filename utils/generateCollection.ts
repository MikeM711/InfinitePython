import { generateChance, generateRandomNumber } from './helperMethods';

const stringToRandomArr = (stringSeq: string): string[] => {
    /*
    Function takes a string and creates an array of items from 1-3 characters long
    */
    let stringArr = [];
    while (stringSeq.length) {
        const randomNum = generateRandomNumber(1, 3);
        stringArr.push(stringSeq.substr(0, randomNum));
        stringSeq = stringSeq.substr(randomNum);
    }
    return stringArr;
};

const generatePyList = (stringSeq: string): string => {
    /*
    Generates a Python List of items from 1-3 characters long
    */
    const randStringArr = stringToRandomArr(stringSeq);
    let pyList = randStringArr.join('", "');
    pyList = '["' + pyList + '"]';
    return pyList;
};

const generatePyTuple = (stringSeq: string): string => {
    /*
    Generates a Python Tuple of items from 1-3 characters long
    */
    const randStringArr = stringToRandomArr(stringSeq);
    let pyTuple = randStringArr.join('", "');
    pyTuple = '("' + pyTuple + '")';
    return pyTuple;
};

const generatePyString = (stringSeq: string): string => {
    /*
    Generates a Python String
    */
    return '"' + stringSeq + '"';
};

const generatePySetHelper = (stringSeq: string): string[] => {
    /*
    Helper method takes in a string sequence and outputs an array of randomly
    placed items
    */

    interface dictSetType {
        [character: string]: boolean;
    }

    // Convert stringSeq into an array of items 1-3 characters long
    const randStringArr = stringToRandomArr(stringSeq);

    // grab distinct characters
    let dictSet: dictSetType = {};

    // create an array of those distinct characters
    let pySetItems: string[] = [];

    // put set items into dictionary
    for (const item of randStringArr) {
        if (dictSet[item] === undefined) {
            dictSet[item] = true;
            pySetItems.push(item);
        }
    }

    // we have a distinct set of items

    // drive home to the fact that set items are not in order
    // we will make a random number of swaps
    const numberSwaps = generateRandomNumber(0, pySetItems.length);

    for (let i = 0; i < numberSwaps; i++) {
        // perform a swap
        // idx to swap
        let idx1 = generateRandomNumber(0, pySetItems.length - 1);
        let idx2 = generateRandomNumber(0, pySetItems.length - 1);

        [pySetItems[idx1], pySetItems[idx2]] = [pySetItems[idx2], pySetItems[idx1]];
    }
    return pySetItems;
};

const generatePySet = (stringSeq: string): string => {
    const pySetItems = generatePySetHelper(stringSeq);
    return `{"${pySetItems.join('", "')}"}`;
};

// https://stackoverflow.com/questions/56353396/dictionary-type-in-typescript
type dictType = Record<string | number, string | number>;

const generateSimplePyDict = (stringSeq: string): dictType | null => {
    /*
    Function generates a simple python Dictionary:
    All Keys are either strings or positive numbers
    All values are the opposite type
    */

    const MAXLEN: number = 99;
    if (stringSeq.length > MAXLEN) {
        // if the incoming string is greater than 99 (we shouldn't be operating
        // on strings this large), we will leave the function
        // this is to help the "else" clause below
        return null;
    }

    let dict: dictType = {};

    // 50% chance that the keys are strings, otherwise keys are numbers
    const stringKeys = generateChance(50);

    if (stringKeys) {
        // All keys will be strings and values will be numbers
        const pySetItems = generatePySetHelper(stringSeq);

        for (const setItem of pySetItems) {
            dict[String(setItem)] = generateRandomNumber(0, 99);
        }
        return dict;
    } else {
        // All keys will be numbers and values will be strings

        // Convert stringSeq into an array of items 1-3 characters long
        const randStringArr = stringToRandomArr(stringSeq);

        for (const stringItem of randStringArr) {
            let randomNum = generateRandomNumber(0, MAXLEN);
            // make sure that the random number we insert as a value is currently undefined
            while (dict[randomNum] !== undefined) {
                randomNum = generateRandomNumber(0, MAXLEN);
            }

            // We have a random number that is not defined in the dictionary currently
            dict[randomNum] = stringItem;
        }
    }

    return dict;
};

// console.log(generateSimplePyDict('helloworld'));

export { generatePyList, generatePyTuple, generatePyString, generatePySet };
