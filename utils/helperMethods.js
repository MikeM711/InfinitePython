"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChance = exports.generateRandomNumber = void 0;
var generateRandomNumber = function (min, max) {
    /*
      Will generate numbers between start and end INCLUSIVE
      Example:
      Start = 5
      End = 10
      Will Generate the possibilities: 5,6,7,8,9,10
      */
    return Math.floor(Math.random() * (max + 1 - min)) + min;
};
exports.generateRandomNumber = generateRandomNumber;
var generateChance = function (percentChance) {
    /*
      Will generate a chance for something to occur
      */
    // decrement percent chance by 1 - we are indexing by 0
    percentChance -= 1;
    var randomNum = generateRandomNumber(0, 100);
    // Probability is true when the number of percent is equal or less than
    // the random number generated
    return percentChance >= randomNum;
};
exports.generateChance = generateChance;
//# sourceMappingURL=helperMethods.js.map