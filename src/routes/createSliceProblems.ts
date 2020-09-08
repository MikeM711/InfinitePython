import randomWords from 'random-words';
import res from 'express/lib/response';

import { generateChance, generateRandomNumber } from '../utils/helperMethods';
import { pyShell } from '../utils/pyShell';
import { generatePyList, generatePyTuple, generatePyString } from '../utils/generateCollection';

interface slicingProblemProperties {
    problem: string;
    solution: string;
    id: number
}

const createCollection = (
    tupleCollection: boolean,
    listCollection: boolean,
    word: string
): { problemCollection: string; size: number } => {
    // create appropriate collection
    let problemCollection: string;
    let size: number;

    if (tupleCollection === true) {
        // create a Python tuple
        let { pyTuple, length } = generatePyTuple(word);
        problemCollection = pyTuple;
        size = length;
    } else if (listCollection === true) {
        // create a Python list
        let { pyList, length } = generatePyList(word);
        problemCollection = pyList;
        size = length;
    } else {
        // a simple Python string
        let { pyStr, length } = generatePyString(word);
        problemCollection = pyStr;
        size = length;
    }

    // return number of items too
    return { problemCollection, size };
};

const appendSlice = (
    length: number,
    twoColons: boolean,
    outOfBoundsSlice: boolean,
    misMatchOperands: boolean,
    negativeOperands: boolean
): string => {
    // append one colon

    // generate 2 random numbers from 0 to length of word
    // where the length index will actually be an empty slice operand
    const randOp1 = generateRandomNumber(0, length);
    let randOp2 = generateRandomNumber(0, length);

    if (randOp1 === randOp2 && generateChance(50)) {
        // operands that equal each other happen a lot
        // 50% of the time, we will swap an operand with a different one
        while (randOp1 === randOp2) {
            randOp2 = generateRandomNumber(0, length);
        }
    }

    let min: number | string;
    let max: number | string;
    if (randOp2 > randOp1) {
        // randOp2 is the max
        max = randOp2;
        min = randOp1;
    } else {
        // randOp1 is equal to or greater than randOp2
        max = randOp1;
        min = randOp2;
    }

    // operands are positive or negative?
    if (misMatchOperands === true) {
        // the operation is possible, but with flipped indicies
        const flipFirstOperand = generateChance(50);
        if (flipFirstOperand) {
            min = min - length;
        } else {
            max = max - length;
        }
    } else if (negativeOperands) {
        min = min - length;
        max = max - length;
    }

    // are operands out of bounds?
    // #1: swap the operands for a "" result
    // #2: make an operand go past the array indicies
    if (outOfBoundsSlice) {
        // generate a slice of empty string
        const emptyStringSlice = generateChance(25);

        if (emptyStringSlice) {
            // swap max and min
            console.log('operands have been flipped');
            [max, min] = [min, max];
        } else {
            // make an operand go past the array indicies
            // using length as the number to make an operand out of bounds
            // Make a 20% chance that ALL indicies will be out of bounds
            if (Math.abs(max) > Math.abs(min)) {
                max *= length;
                min = generateChance(20) ? min * length : min;
            } else {
                min *= length;
                max = generateChance(20) ? max * length : max;
            }
        }
    }

    if (randOp1 === length) {
        // as said earlier, if an operand equals the length, we will set it to nothing
        min = '';
    } else if (randOp2 === length) {
        // as said earlier, if an operand equals the length, we will set it to nothing
        max = '';
    }

    if (twoColons === false) {
        return `[${min}:${max}]`;
    } else {
        // two colons is true - create a random step
        let step = generateRandomNumber(0, length);

        // put a bit of emphasis on step of 0 (error)
        const step_0 = generateChance(5);

        // put emphasis on step of 2
        const step_2 = generateChance(70);

        // put emphasis on step of 3
        const step_3 = generateChance(70);

        // bad step chance is 10%
        const bad_step = generateChance(10);
        // console.log("bad_step", bad_step)

        // ValueError slice step cannot be zero
        // Drilling home that 0 cannot be a step
        step = step_0 ? 0 : step;

        // if ste_2 is true, supply the step of 2
        // If step_2 is false, keep the random step;
        step = !step_0 && step_2 ? 2 : step;

        // if step_3 is true, supply the step of 3
        // If step_3 is false, keep the random step;
        step = step_0 && !step_2 && step_3 ? 3 : step;

        // create positive scaled slice operands to find out where the bad
        // step will be if the chance occurs
        let posScaleMin: number;
        let posScaleMax: number;

        if (!min) {
            posScaleMin = 0;
        } else if (min < 0) {
            // The only time min is a string is if it == ''
            posScaleMin = Number(min) + length;
        } else {
            posScaleMin = Number(min);
        }

        if (!max) {
            posScaleMax = 0;
        } else if (max < 0) {
            // The only time min is a string is if it == ''
            posScaleMax = Number(max) + length;
        } else {
            posScaleMax = Number(max);
        }

        // determine the appropriate direction of the step
        if (posScaleMax - posScaleMin < 0) {
            // The appropriate step will be negative
            step = -step;
        }

        // steps are now in the proper direction

        // but a bad step will flip signs
        step = bad_step ? -step : step;

        // 10% chance to multiple step by length
        step = generateChance(10) ? step * length : step;

        return `[${min}:${max}:${step}]`;
    }
};

const generateSliceProblemSet = async (): Promise<slicingProblemProperties[]> => {
    let slicingProblems: slicingProblemProperties[] = [];

    // Create 2 words and put them together for one word

    // random chance there is a number in the word separator
    let separator = '';

    if (generateChance(50)) {
        separator = String(generateRandomNumber(0, 99));
    }

    const problemWord: string[] = randomWords({
        exactly: 1,
        wordsPerString: 2,
        separator: separator
    });

    const problemList: string[] = [];

    // make 10 problems for one word
    const word = problemWord[0];
    for (let i = 0; i < 10; i++) {
        console.log('start loop');

        // should there be one or two colons?
        const twoColons = generateChance(30);

        // should there be an extra slice?
        const extraSlice = generateChance(10);

        // Generate the type of collection
        // if both tuple and list are false, the default is a string
        const tupleCollection = generateChance(15);
        const listCollection = generateChance(15);

        // problem results in an empty string (swapped operands)
        // or operands outside of the string index
        const outOfBoundsSlice = generateChance(15);

        // Generate the slice operands
        // problem uses both positive and negative index search or all negative operands
        // if none of the above, operands are positive
        let misMatchOperands = generateChance(15);
        let negativeOperands =
            !misMatchOperands && generateChance(15) === true ? true : false;

        const {problemCollection, size } = createCollection(
            tupleCollection,
            listCollection,
            word
        );

        const problemSlice = appendSlice(
            size,
            twoColons,
            outOfBoundsSlice,
            misMatchOperands,
            negativeOperands
        );

        let sliceProblem = problemCollection + problemSlice;

        if (extraSlice) {
            misMatchOperands = generateChance(15);
            negativeOperands =
                !misMatchOperands && generateChance(15) === true ? true : false;
            const wordLength = 3; // Generally, the word is small after the first slice
            const secondProblemSlice = appendSlice(
                wordLength,
                generateChance(30),
                generateChance(15),
                misMatchOperands,
                negativeOperands
            );

            sliceProblem += secondProblemSlice;
        }
        // push the problem to problemList;
        console.log(sliceProblem);
        problemList.push(sliceProblem);
    }

    // iterate through problems list into Python format
    // All slices will be wrapped in try
    let pyExec: string = '';
    for (const sliceProblem of problemList) {
        // create a try/except for the sliceProblem
        // and print all results
        pyExec +=
            'try:' +
            `\n\tprint(${sliceProblem})` +
            '\nexcept Exception as err:' +
            '\n\tprint(type(err).__name__, err)\n';
    }

    let solutionList: string[] | null;
    try {
        // do not let a step of 0 enter the Python Shell (generates an error)
        solutionList = await pyShell(pyExec);
    } catch (err) {
        // we should not be catching any errors...
        solutionList = [];
        res.json({ Error: err });
    }

    if (solutionList) {
        // if there are results, we will iterate through them

        // loop through all results and append them to the slicingProblems array
        for (let i = 0; i < solutionList.length; i++) {
            let soln: string;
            if (solutionList[i][0] == '(' || solutionList[i][0] == '[') {
                // The first element shows that the solution is a tuple or array
                // keep the solution
                soln = solutionList[i];
            } else {
                // Otherwise the slice is a string, where we tack on single quotes
                // for the solution
                soln = '"' + solutionList[i] + '"';
            }

            // Stay consistent - we will have our answers in double quotes
            // not single quotes
            while (soln.indexOf("'") !== -1) {
                soln = soln.replace("'", '"');
            }

            // remove all whitespace from solution
            while (soln.indexOf(' ') !== -1) {
                soln = soln.replace(' ', '');
            }

            slicingProblems.push({
                problem: problemList[i],
                solution: soln,
                id: i
            });
        }
    }

    // console.log('final result: ', solutionList);
    return slicingProblems;
};

export { generateSliceProblemSet };
