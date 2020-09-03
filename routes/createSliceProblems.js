"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSliceProblemSet = void 0;
var random_words_1 = __importDefault(require("random-words"));
var response_1 = __importDefault(require("express/lib/response"));
var helperMethods_1 = require("../utils/helperMethods");
var pyShell_1 = require("../utils/pyShell");
var generateCollection_1 = require("../utils/generateCollection");
var createCollection = function (tupleCollection, listCollection, word) {
    // create appropriate collection
    var problemCollection;
    if (tupleCollection === true) {
        // create a Python tuple
        problemCollection = generateCollection_1.generatePyTuple(word);
    }
    else if (listCollection === true) {
        // create a Python list
        problemCollection = generateCollection_1.generatePyList(word);
    }
    else {
        // a simple Python string
        problemCollection = generateCollection_1.generatePyString(word);
    }
    return problemCollection;
};
var appendSlice = function (length, twoColons, outOfBoundsSlice, misMatchOperands, negativeOperands) {
    // append one colon
    var _a;
    // generate 2 random numbers from 0 to length of word
    // where the length index will actually be an empty slice operand
    var randOp1 = helperMethods_1.generateRandomNumber(0, length);
    var randOp2 = helperMethods_1.generateRandomNumber(0, length);
    if (randOp1 === randOp2 && helperMethods_1.generateChance(50)) {
        // operands that equal each other happen a lot
        // 50% of the time, we will swap an operand with a different one
        while (randOp1 === randOp2) {
            randOp2 = helperMethods_1.generateRandomNumber(0, length);
        }
    }
    var min;
    var max;
    if (randOp2 > randOp1) {
        // randOp2 is the max
        max = randOp2;
        min = randOp1;
    }
    else {
        // randOp1 is equal to or greater than randOp2
        max = randOp1;
        min = randOp2;
    }
    // operands are positive or negative?
    if (misMatchOperands === true) {
        // the operation is possible, but with flipped indicies
        var flipFirstOperand = helperMethods_1.generateChance(50);
        if (flipFirstOperand) {
            min = min - length;
        }
        else {
            max = max - length;
        }
    }
    else if (negativeOperands) {
        min = min - length;
        max = max - length;
    }
    // are operands out of bounds?
    // #1: swap the operands for a "" result
    // #2: make an operand go past the array indicies
    if (outOfBoundsSlice) {
        // generate a slice of empty string
        var emptyStringSlice = helperMethods_1.generateChance(25);
        if (emptyStringSlice) {
            // swap max and min
            console.log('operands have been flipped');
            _a = [min, max], max = _a[0], min = _a[1];
        }
        else {
            // make an operand go past the array indicies
            // using length as the number to make an operand out of bounds
            // Make a 20% chance that ALL indicies will be out of bounds
            if (Math.abs(max) > Math.abs(min)) {
                max *= length;
                min = helperMethods_1.generateChance(20) ? min * length : min;
            }
            else {
                min *= length;
                max = helperMethods_1.generateChance(20) ? max * length : max;
            }
        }
    }
    if (randOp1 === length) {
        // as said earlier, if an operand equals the length, we will set it to nothing
        min = '';
    }
    else if (randOp2 === length) {
        // as said earlier, if an operand equals the length, we will set it to nothing
        max = '';
    }
    if (twoColons === false) {
        return "[" + min + ":" + max + "]";
    }
    else {
        // two colons is true - create a random step
        var step = helperMethods_1.generateRandomNumber(0, length);
        // put a bit of emphasis on step of 0 (error)
        var step_0 = helperMethods_1.generateChance(5);
        // put emphasis on step of 2
        var step_2 = helperMethods_1.generateChance(70);
        // put emphasis on step of 3
        var step_3 = helperMethods_1.generateChance(70);
        // bad step chance is 10%
        var bad_step = helperMethods_1.generateChance(10);
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
        var posScaleMin = void 0;
        var posScaleMax = void 0;
        if (!min) {
            posScaleMin = 0;
        }
        else if (min < 0) {
            // The only time min is a string is if it == ''
            posScaleMin = Number(min) + length;
        }
        else {
            posScaleMin = Number(min);
        }
        if (!max) {
            posScaleMax = 0;
        }
        else if (max < 0) {
            // The only time min is a string is if it == ''
            posScaleMax = Number(max) + length;
        }
        else {
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
        step = helperMethods_1.generateChance(10) ? step * length : step;
        return "[" + min + ":" + max + ":" + step + "]";
    }
};
var generateSliceProblemSet = function () { return __awaiter(void 0, void 0, void 0, function () {
    var slicingProblems, separator, problemWord, problemList, word, i, twoColons, extraSlice, tupleCollection, listCollection, outOfBoundsSlice, misMatchOperands, negativeOperands, problemCollection, problemSlice, sliceProblem, wordLength, secondProblemSlice, pyExec, _i, problemList_1, sliceProblem, solutionList, err_1, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                slicingProblems = [];
                separator = '';
                if (helperMethods_1.generateChance(50)) {
                    separator = String(helperMethods_1.generateRandomNumber(0, 99));
                }
                problemWord = random_words_1.default({
                    exactly: 1,
                    wordsPerString: 2,
                    separator: separator
                });
                problemList = [];
                word = problemWord[0];
                for (i = 0; i < 10; i++) {
                    console.log('start loop');
                    twoColons = helperMethods_1.generateChance(30);
                    extraSlice = helperMethods_1.generateChance(10);
                    tupleCollection = helperMethods_1.generateChance(15);
                    listCollection = helperMethods_1.generateChance(15);
                    outOfBoundsSlice = helperMethods_1.generateChance(15);
                    misMatchOperands = helperMethods_1.generateChance(15);
                    negativeOperands = !misMatchOperands && helperMethods_1.generateChance(15) === true ? true : false;
                    problemCollection = createCollection(tupleCollection, listCollection, word);
                    problemSlice = appendSlice(word.length, twoColons, outOfBoundsSlice, misMatchOperands, negativeOperands);
                    sliceProblem = problemCollection + problemSlice;
                    if (extraSlice) {
                        misMatchOperands = helperMethods_1.generateChance(15);
                        negativeOperands =
                            !misMatchOperands && helperMethods_1.generateChance(15) === true ? true : false;
                        wordLength = 3;
                        secondProblemSlice = appendSlice(wordLength, helperMethods_1.generateChance(30), helperMethods_1.generateChance(15), misMatchOperands, negativeOperands);
                        sliceProblem += secondProblemSlice;
                    }
                    // push the problem to problemList;
                    console.log(sliceProblem);
                    problemList.push(sliceProblem);
                }
                pyExec = '';
                for (_i = 0, problemList_1 = problemList; _i < problemList_1.length; _i++) {
                    sliceProblem = problemList_1[_i];
                    // create a try/except for the sliceProblem
                    // and print all results
                    pyExec +=
                        'try:' +
                            ("\n\tprint(" + sliceProblem + ")") +
                            '\nexcept Exception as err:' +
                            '\n\tprint(type(err).__name__, err)\n';
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, pyShell_1.pyShell(pyExec)];
            case 2:
                // do not let a step of 0 enter the Python Shell (generates an error)
                solutionList = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                // we should not be catching any errors...
                solutionList = [];
                response_1.default.json({ Error: err_1 });
                return [3 /*break*/, 4];
            case 4:
                if (solutionList) {
                    // if there are results, we will iterate through them
                    // loop through all results and append them to the slicingProblems array
                    for (i = 0; i < solutionList.length; i++) {
                        slicingProblems.push({
                            problem: problemList[i],
                            solution: solutionList[i]
                        });
                    }
                }
                console.log('final result: ', solutionList);
                return [2 /*return*/, slicingProblems];
        }
    });
}); };
exports.generateSliceProblemSet = generateSliceProblemSet;
//# sourceMappingURL=createSliceProblems.js.map