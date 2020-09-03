"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePyString = exports.generatePyTuple = exports.generatePyList = void 0;
var generatePyList = function (stringSeq) {
    var pyList = stringSeq.split('').join('", "');
    pyList = '["' + pyList + '"]';
    return pyList;
};
exports.generatePyList = generatePyList;
var generatePyTuple = function (stringSeq) {
    var pyTuple = stringSeq.split('').join('", "');
    pyTuple = '("' + pyTuple + '")';
    return pyTuple;
};
exports.generatePyTuple = generatePyTuple;
var generatePyString = function (stringSeq) {
    return '"' + stringSeq + '"';
};
exports.generatePyString = generatePyString;
//# sourceMappingURL=generateCollection.js.map