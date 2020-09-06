import { PythonShell } from 'python-shell';

const pyShell = (pyCode: string): Promise<string[] | null> => {
    return new Promise((resolve, reject) => {
        PythonShell.runString(pyCode, undefined, (err, results) => {
            if (err) {
                reject(err);
            }
            console.log('Python results: ', results);
            resolve(results);
        });
    });
};

export { pyShell };
