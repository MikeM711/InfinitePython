"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePrimitiveProblemSet = void 0;
var helperMethods_1 = require("../utils/helperMethods");
var generateFloat = function () {
    var float; // only way to get a trailing zero in JS is to make it a string
    var intDigit;
    var decimalDigit;
    if (helperMethods_1.generateChance(60)) {
        // 60% chance of a float between 0 and 10
        intDigit = helperMethods_1.generateRandomNumber(0, 10);
        decimalDigit = helperMethods_1.generateRandomNumber(0, 9);
        float = parseFloat(intDigit + '.' + decimalDigit).toFixed(1);
    }
    else if (helperMethods_1.generateChance(50)) {
        // 50% of a 60% chance of a number with 3 decimal places
        intDigit = helperMethods_1.generateRandomNumber(-10, 10);
        decimalDigit = helperMethods_1.generateRandomNumber(0, 999);
        float = parseFloat(intDigit + '.' + decimalDigit).toFixed(3);
    }
    else {
        intDigit = helperMethods_1.generateRandomNumber(-1000, 1000);
        decimalDigit = helperMethods_1.generateRandomNumber(0, 1000);
        float = parseFloat(intDigit + '.' + decimalDigit).toFixed(3);
    }
    return float;
};
var generateInt = function () {
    var int;
    if (helperMethods_1.generateChance(60)) {
        // 60% chance of a number between 0 and 10
        int = helperMethods_1.generateRandomNumber(0, 10);
    }
    else if (helperMethods_1.generateChance(75)) {
        // a 75% chance of a 40% chance the number is negative
        int = helperMethods_1.generateRandomNumber(-10, -1);
    }
    else {
        // have a possibility of generating a large number
        int = helperMethods_1.generateRandomNumber(-10000, 10000);
    }
    return int;
};
var generatePrimitiveProblemSet = function () {
    /*
    Function generates an integer, float, character, boolean or complex primitive type
    */
    // x_int = 5
    // x_float = 5.0
    // x_char = 'a'
    // x_boolean = True
    // x_complex = 1 + 2j
    var charList = 'abcdefghijklmnopqrstuvwxyz' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ!$%&?@0123456789';
    var boolList = ['True', 'False'];
    var primitiveProblems = [];
    for (var i = 0; i < 10; i++) {
        // const randomNum = generateRandomNumber(1, 100);
        var randomNum = helperMethods_1.generateRandomNumber(1, 100);
        if (randomNum <= 20) {
            // int
            var int = generateInt();
            primitiveProblems.push({
                problem: int,
                solution: 'Integer'
            });
        }
        else if (randomNum <= 40) {
            // float
            var float = generateFloat();
            primitiveProblems.push({
                problem: float,
                solution: 'Float'
            });
        }
        else if (randomNum <= 60) {
            // char
            var randChar = charList[helperMethods_1.generateRandomNumber(0, charList.length - 1)];
            primitiveProblems.push({
                problem: randChar,
                solution: 'Char'
            });
        }
        else if (randomNum <= 80) {
            // bool
            var randBool = boolList[helperMethods_1.generateRandomNumber(0, boolList.length - 1)];
            primitiveProblems.push({
                problem: randBool,
                solution: 'Boolean'
            });
        }
        else {
            // complex
            var isInt = helperMethods_1.generateChance(50);
            var complex = void 0;
            if (isInt) {
                complex = String(generateInt());
            }
            else {
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
exports.generatePrimitiveProblemSet = generatePrimitiveProblemSet;
//# sourceMappingURL=createPrimitiveProblems.js.map