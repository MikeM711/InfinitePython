"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePySet = exports.generatePyString = exports.generatePyTuple = exports.generatePyList = void 0;
var helperMethods_1 = require("./helperMethods");
var stringToRandomArr = function (stringSeq) {
    /*
    Function takes a string and creates an array of items from 1-3 characters long
    */
    var stringArr = [];
    while (stringSeq.length) {
        var randomNum = helperMethods_1.generateRandomNumber(1, 3);
        stringArr.push(stringSeq.substr(0, randomNum));
        stringSeq = stringSeq.substr(randomNum);
    }
    return stringArr;
};
var generatePyList = function (stringSeq) {
    /*
    Generates a Python List of items from 1-3 characters long
    */
    var randStringArr = stringToRandomArr(stringSeq);
    var pyList = randStringArr.join('", "');
    pyList = '["' + pyList + '"]';
    return pyList;
};
exports.generatePyList = generatePyList;
var generatePyTuple = function (stringSeq) {
    /*
    Generates a Python Tuple of items from 1-3 characters long
    */
    var randStringArr = stringToRandomArr(stringSeq);
    var pyTuple = randStringArr.join('", "');
    pyTuple = '("' + pyTuple + '")';
    return pyTuple;
};
exports.generatePyTuple = generatePyTuple;
var generatePyString = function (stringSeq) {
    /*
    Generates a Python String
    */
    return '"' + stringSeq + '"';
};
exports.generatePyString = generatePyString;
var generatePySetHelper = function (stringSeq) {
    /*
    Helper method takes in a stringSequence and outputs an array of randomly
    placed items
    */
    var _a;
    // Convert stringSeq into an array of items 1-3 characters long
    var randStringArr = stringToRandomArr(stringSeq);
    var dictSet = {};
    var pySetItems = [];
    // put set items into dictionary
    for (var _i = 0, randStringArr_1 = randStringArr; _i < randStringArr_1.length; _i++) {
        var item = randStringArr_1[_i];
        if (dictSet[item] === undefined) {
            dictSet[item] = true;
            pySetItems.push(item);
        }
    }
    // we have a distinct set of items
    // drive home to the fact that set items are not in order
    // we will make a random number of swaps
    var numberSwaps = helperMethods_1.generateRandomNumber(0, pySetItems.length);
    for (var i = 0; i < numberSwaps; i++) {
        // perform a swap
        // Idx to swap
        var idx1 = helperMethods_1.generateRandomNumber(0, pySetItems.length - 1);
        var idx2 = helperMethods_1.generateRandomNumber(0, pySetItems.length - 1);
        _a = [
            pySetItems[idx2],
            pySetItems[idx1]
        ], pySetItems[idx1] = _a[0], pySetItems[idx2] = _a[1];
    }
    return pySetItems;
};
var generatePySet = function (stringSeq) {
    var pySetItems = generatePySetHelper(stringSeq);
    return "{\"" + pySetItems.join('", "') + "\"}";
};
exports.generatePySet = generatePySet;
var generateSimpleDict = function (stringSeq) {
    /*
    Function generates a simple Dictionary:
    All Keys are either strings or positive numbers
    All values are the opposite type
    */
    var dict = {};
    var stringKeys = helperMethods_1.generateChance(100);
    if (stringKeys) {
        // All keys will be strings and values will be numbers
        var pySetItems = generatePySetHelper(stringSeq);
        for (var _i = 0, pySetItems_1 = pySetItems; _i < pySetItems_1.length; _i++) {
            var setItem = pySetItems_1[_i];
            dict[String(setItem)] = helperMethods_1.generateRandomNumber(0, 99);
        }
        return dict;
    }
    else {
        // All keys will be numbers and values will be strings
    }
    // idk do something lol
    return dict;
};
console.log(generateSimpleDict('hello world'));
//# sourceMappingURL=generateCollection.js.map