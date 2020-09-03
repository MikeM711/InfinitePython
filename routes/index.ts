import express from 'express';
import { pyShell } from '../utils/pyShell';
import { generateSliceProblemSet } from './createSliceProblems';
import { generatePrimitiveProblemSet } from './createPrimitiveProblems';

const router = express.Router();

router.get('/api/problems/slice', async (req: express.Request, res: express.Response) => {
    /*
    Route generates slice problems

    Problems can have one or two colons
    Operands can be positive or negative
    Collections can be a string, tuple or array
    Operands can go out-of-bounds
    */
    const slicingProblems = await generateSliceProblemSet();
    res.json({ problems: slicingProblems });
});

router.get('/api/problems/primitives', async (req: express.Request, res: express.Response) => {
    
    const primitiveProblems = generatePrimitiveProblemSet();
    res.json({problems: primitiveProblems})
});

/*
Week #1
float() int() string()
copy and deep copy
== and is
variable names
for loop
if statement
indentation


*/


router.get('/testing/:id', async (req: express.Request, res: express.Response) => {
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
