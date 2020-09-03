const generatePyList = (stringSeq: string): string => {
    let pyList = stringSeq.split('').join('", "');
    pyList = '["' + pyList + '"]';
    return pyList;
};

const generatePyTuple = (stringSeq: string): string => {
    let pyTuple = stringSeq.split('').join('", "');
    pyTuple = '("' + pyTuple + '")';
    return pyTuple;
};
const generatePyString = (stringSeq: string): string => {
    return '"' + stringSeq + '"';
};

export { generatePyList, generatePyTuple, generatePyString };
