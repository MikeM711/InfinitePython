import express from 'express';
import { PythonShell } from 'python-shell';
import { printScope } from '../utils/helperStrings';
import randomWords from 'random-words';
import { generateRandomNumbers, generateChance } from '../utils/helperMethods';

const router = express.Router();

// let testString = "x=1+1;print(x)";

// testString =
//     "\narr = [1,2,3,4,5]" + "\nfor x in arr:" + "\n\tprint(x + 3)" + printScope;

// testString =
// `
// __myArr = [1,2,3,4]` +
// printScope +
// `f newSlice = __myArr[0:2]
// ` +
// printScope;

const paramPythonFunction = (testString: string): Promise<string[] | null> => {
    return new Promise((resolve, reject) => {
        PythonShell.runString(testString, undefined, (err, results) => {
            if (err) {
                reject(err);
            }
            console.log('finished');
            console.log('results', results);
            resolve(results);
        });
    });
};

const createCollection = (
    tupleCollection: boolean,
    arrayCollection: boolean,
    word: string
): string => {
    // create appropriate collection
    let problemCollection: string = word;

    if (tupleCollection === true) {
        // create a Python tuple
        problemCollection = word.split('').join('", "');
        problemCollection = '("' + problemCollection + '")';
    } else if (arrayCollection === true) {
        // create a Python array
        problemCollection = word.split('').join('", "');
        problemCollection = '["' + problemCollection + '"]';
    } else {
        // a simple Python string
        problemCollection = '"' + problemCollection + '"';
    }

    return problemCollection;
};

const appendSlice = (
    problemCollection: string,
    word: string,
    twoColons: boolean,
    outOfBoundsSlice: boolean,
    misMatchSequence: boolean,
    negativeSequence: boolean
): string => {
    const length = word.length;

    if (twoColons) {
        // append two colons
    } else {
        // append one colon

        // generate 2 random numbers from 0 to length of word
        // where the length index will actually be an empty slice operand
        const randIdx1 = generateRandomNumbers(0, length);
        const randIdx2 = generateRandomNumbers(0, length);

        let min: number | string;
        let max: number | string;
        if (randIdx2 > randIdx1) {
            // randIdx2 is the max
            max = randIdx2;
            min = randIdx1;
        } else {
            // randIdx1 is equal to or greater than randIdx1
            max = randIdx1;
            min = randIdx2;
        }

        // operands are positive or negative?
        if (misMatchSequence === true) {
            // the operation is possible, but with flipped indicies
            const flipFirstOperand = generateChance(50);
            if (flipFirstOperand) {
                min = min - length;
            } else {
                max = max - length;
            }
        } else if (negativeSequence) {
            min = min - length;
            max = max - length;
        }

        // are operands out of bounds?
        // they could yield a string result or empty string
        if (outOfBoundsSlice) {
            // generate a slice of empty string
            const emptyStringSlice = generateChance(50);

            if (emptyStringSlice) {
                // swap max and min
                console.log('operands have been flipped');
                [max, min] = [min, max];
            } else {
                // make an operand go out of bounds
                // using length as the number to make operand out of bounds

                if (Math.abs(max) > Math.abs(min)) {
                    max *= length;
                } else {
                    min *= length;
                }
            }
        }

        if (randIdx1 === length) {
            // as said earlier, if an operand equals the length, we will set it to nothing
            min = '';
        } else if (randIdx2 === length) {
            // as said earlier, if an operand equals the length, we will set it to nothing
            max = '';
        }

        return (problemCollection += `[${min}:${max}]`);
    }

    return 'placeholder for 2 colons';
};

router.get('/slicing', async (req: express.Request, res: express.Response) => {
    // console.log(randomWords({ exactly: 5, join: '' }))
    // send out 10 slicing problems
    const problemWords: string[] = randomWords({
        exactly: 10,
        wordsPerString: 2,
        separator: ''
    });

    // RNG:
    // # of colons
    // possibility of extra slice
    // collection is a string, tuple or array
    // slice returns empty

    // how many colons should we use?

    // one word example
    const word = problemWords[0];

    // Generate the number of colons
    // if two colons is false, the default is one colon
    // const twoColons = generateChance(35);
    const twoColons = generateChance(0);

    console.log('twoColons', twoColons);

    const extraSlice = generateChance(5);

    // Generate the type of collection
    // if both tuple and array are false, the default is a string
    const tupleCollection = generateChance(15);
    const arrayCollection = generateChance(15);

    // problem results in an empty string or operands outside of the string index
    const outOfBoundsSlice = generateChance(15);

    // Generate the slice operands
    // problem uses both positive and negative index search or all negative operands
    // if none of the above, operands are positive
    const misMatchSequence = generateChance(15);
    const negativeSequence = generateChance(15);

    const problemCollection = createCollection(
        tupleCollection,
        arrayCollection,
        word
    );

    const problemSlice = appendSlice(
        problemCollection,
        word,
        twoColons,
        outOfBoundsSlice,
        misMatchSequence,
        negativeSequence
    );

    console.log(problemSlice);
    const pyExec = `print(${problemSlice})`;
    let result: string[] | null;
    try {
        result = await paramPythonFunction(pyExec);
        // res.json({ pythonResult: result });
        res.json({ question: problemSlice, pythonResult: result });
    } catch (err) {
        res.json({ error: err });
    }
});

router.get('/:id', async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    let result: string[] | null;
    try {
        result = await paramPythonFunction(id);
        res.json({ pythonResult: result });
    } catch (err) {
        res.json({ error: err });
    }
});

export default router;
