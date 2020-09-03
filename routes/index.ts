import express from 'express';
import randomWords from 'random-words';
import { generateChance } from '../utils/helperMethods';
import { pyShell } from '../utils/pyShell';
import { createCollection, appendSlice } from './createSliceProblems';

const router = express.Router();

router.get('/api/problems/slice', async (req: express.Request, res: express.Response) => {
    /*
    Route generates slice problems

    Problems can have one or two colons
    Operands can be positive or negative
    Collections can be a string, tuple or array
    Operands can go out-of-bounds
    */

    interface slicingProblemProperties {
        problem: string;
        solution: string[] | null;
    }

    let slicingProblems: slicingProblemProperties[] = [];

    // Create 2 words and put them together for one word
    const problemWord: string[] = randomWords({
        exactly: 1,
        wordsPerString: 2,
        separator: ''
    });

    // make 10 problems for one word
    const word = problemWord[0];
    for (let i = 0; i < 10; i++) {
        console.log('start loop');

        // should there be one or two colons?
        const twoColons = generateChance(30);

        // should there be an extra slice?
        const extraSlice = generateChance(10);

        // Generate the type of collection
        // if both tuple and array are false, the default is a string
        const tupleCollection = generateChance(15);
        const arrayCollection = generateChance(15);

        // problem results in an empty string or operands outside of the string index
        const outOfBoundsSlice = generateChance(15);

        // Generate the slice operands
        // problem uses both positive and negative index search or all negative operands
        // if none of the above, operands are positive
        let misMatchOperands = generateChance(15);
        let negativeOperands =
            !misMatchOperands && generateChance(15) === true ? true : false;

        const problemCollection = createCollection(
            tupleCollection,
            arrayCollection,
            word
        );

        const problemSlice = appendSlice(
            word.length,
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

        console.log(sliceProblem);
        const pyExec = `print(${sliceProblem})`;
        let result: string[] | null;
        try {
            // do not let a step of 0 enter the Python Shell (generates an error)
            result = await pyShell(pyExec);
        } catch (err) {
            result = ['ValueError: slice step cannot be zero'];
        }

        // Add this slicing example to the slicingExample array
        slicingProblems.push({
            problem: sliceProblem,
            solution: result
        });
    }

    res.json({ problems: slicingProblems });
});

router.get('/:id', async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    let result: string[] | null;
    try {
        result = await pyShell(id);
        res.json({ pythonResult: result });
    } catch (err) {
        res.json({ error: err });
    }
});

export default router;
