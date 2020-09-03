import { generateChance, generateRandomNumbers } from '../utils/helperMethods';

interface primitiveProblemProperties {
    problem: string | number;
    solution: string;
}

const generateFloat = (): string => {
    let float: string; // only way to get a trailing zero in JS is to make it a string
    let intDigit: number;
    let decimalDigit: number;
    if (generateChance(60)) {
        // 60% chance of a float between 0 and 10
        intDigit = generateRandomNumbers(0, 10);
        decimalDigit = generateRandomNumbers(0, 9);
        float = parseFloat(intDigit + '.' + decimalDigit).toFixed(1);
    } else if (generateChance(50)) {
        // 50% of a 60% chance of a number with 3 decimal places
        intDigit = generateRandomNumbers(-10, 10);
        decimalDigit = generateRandomNumbers(0, 999);
        float = parseFloat(intDigit + '.' + decimalDigit).toFixed(3);
    } else {
        intDigit = generateRandomNumbers(-1000, 1000);
        decimalDigit = generateRandomNumbers(0, 1000);
        float = parseFloat(intDigit + '.' + decimalDigit).toFixed(3);
    }
    return float;
};

const generateInt = (): number => {
    let int: number;
    if (generateChance(60)) {
        // 60% chance of a number between 0 and 10
        int = generateRandomNumbers(0, 10);
    } else if (generateChance(75)) {
        // a 75% chance of a 40% chance the number is negative
        int = generateRandomNumbers(-10, -1);
    } else {
        // have a possibility of generating a large number
        int = generateRandomNumbers(-10000, 10000);
    }
    return int;
};

const generatePrimitiveProblemSet = () => {
    /*
    Function generates an integer, float, character, boolean or complex primitive type
    */

    // x_int = 5
    // x_float = 5.0
    // x_char = 'a'
    // x_boolean = True
    // x_complex = 1 + 2j

    const charList: string =
        'abcdefghijklmnopqrstuvwxyz' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ!$%&?@0123456789';
    const boolList: string[] = ['True', 'False'];

    let primitiveProblems: primitiveProblemProperties[] = [];

    for (let i = 0; i < 10; i++) {
        // const randomNum = generateRandomNumbers(1, 100);
        const randomNum = generateRandomNumbers(1, 100);

        if (randomNum <= 20) {
            // int
            const int = generateInt();
            primitiveProblems.push({
                problem: int,
                solution: 'Integer'
            });
        } else if (randomNum <= 40) {
            // float
            const float = generateFloat();
            primitiveProblems.push({
                problem: float,
                solution: 'Float'
            });
        } else if (randomNum <= 60) {
            // char
            const randChar =
                charList[generateRandomNumbers(0, charList.length - 1)];
            primitiveProblems.push({
                problem: randChar,
                solution: 'Char'
            });
        } else if (randomNum <= 80) {
            // bool
            const randBool =
                boolList[generateRandomNumbers(0, boolList.length - 1)];
            primitiveProblems.push({
                problem: randBool,
                solution: 'Boolean'
            });
        } else {
            // complex
            const isInt = generateChance(50);
            let complex: string;
            if (isInt) {
                complex = String(generateInt());
            } else {
                complex = generateFloat();
            }
            // append a "j"
            complex += 'j';
            primitiveProblems.push({
                problem: complex,
                solution: 'Complex'
            });
        }
    }

    return primitiveProblems;
};

export { generatePrimitiveProblemSet };
