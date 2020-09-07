import express, {Request, Response, Router} from 'express';
import { pyShell } from '../utils/pyShell';
import { generateSliceProblemSet } from './createSliceProblems';
import { generatePrimitiveProblemSet } from './createPrimitiveProblems';

const router: Router = express.Router();

router.get('/problems/slice', async (req: Request, res: Response) => {
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

router.get('/problems/primitives', async (req: Request, res: Response) => {
    /*
    Route generates primitive problems
    Problems can be integer, float, character, boolean or complex primitive type
    */

    const primitiveProblems = generatePrimitiveProblemSet();
    res.json({ problems: primitiveProblems });
});

router.get('/problems/collections', async (req: express.Request, res: express.Response) => {
    /*
    Route generates primitive problems
    Problems can be a string, list, tuple, set or dict type
    */

    //    x_str = 'pineapple'
    //    x_list = [1, 2, 2, 3]
    //    x_tuple = (1, 2, 2, 3)
    //    x_set = {1, 2, 2, 3} # note duplicates
    //    x_dict = {1: 'NY', 2: 'LA'}

    const primitiveProblems = generatePrimitiveProblemSet();
    res.json({ problems: primitiveProblems });
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
