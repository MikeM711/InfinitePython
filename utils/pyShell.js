"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pyShell = void 0;
var python_shell_1 = require("python-shell");
var pyShell = function (pyCode) {
    return new Promise(function (resolve, reject) {
        python_shell_1.PythonShell.runString(pyCode, undefined, function (err, results) {
            if (err) {
                reject(err);
            }
            console.log('Python results: ', results);
            resolve(results);
        });
    });
};
exports.pyShell = pyShell;
//# sourceMappingURL=pyShell.js.map