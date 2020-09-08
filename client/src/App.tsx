import React, { useEffect, useState } from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import axios from 'axios';
import './App.css';
// The following two imports is for the theme.
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

// This import is for the language syntax highlighting.
// import 'codemirror/mode/javascript/javascript.js';

interface problemType {
    problem: string;
    solution: string;
    id: number;
}

interface problemListType {
    problems: problemType[];
}

const App: React.FC = () => {
    const [problemList, setProblemList] = useState<problemListType | undefined>();
    const [solutionInput, setSolutionInput] = useState<string[]>([]);

    useEffect(() => {
        axios.get('/api/problems/slice')
             .then((res) => setProblemList(res.data))
             .then(() => setSolutionInput(new Array(10).fill('')));
    }, []);

    const handleSubmit = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const inputId = Number(e.currentTarget.id);
        let userInput = solutionInput[inputId];

        // convert all single quotes to double quotes
        // FUTURE: will need to handle all weird double and single quotes in text
        while (userInput.indexOf("'") !== -1) {
            userInput = userInput.replace("'", '"');
        }

        // remove all whitespace from user input
        while (userInput.indexOf(' ') !== -1) {
            userInput = userInput.replace(' ', '');
        }

        // check if the userInput matches the solutions
        if (problemList) {
            const solution = problemList.problems[inputId].solution;
            if (userInput === solution) {
                console.log('Correct!');
            } else if ((userInput.toLowerCase() === 'error' ||
                       userInput.toLowerCase() === 'valueerror') &&
                       solution.toLowerCase().indexOf('valueerrorslicestepcannotbezero')
            ) {
                console.log('Correct!');
            } else {
                console.log('Incorrect.');
                console.log('solution is: ', solution);
            }
        }
    };

    const problemListJSX = problemList !== undefined
        ? problemList.problems.map(({ problem, solution, id }) => {
                return (
                    <div className={`slice-problem-${id}`} key={id}>
                        <p className="question-problem">Problem #{id + 1}: {problem}</p>
                        {/* <p>Solution: {String(solution)}</p> */}
                        <div className="one-line-code-editor">
                            <CodeMirror
                                value=''
                                options={{
                                    mode: 'xml',
                                    theme: 'material',
                                    lineNumbers: true,
                                    noNewLines: true
                                }}
                                onBeforeChange={(editor, data, value, next) => {
                                    if(data.text.length !== 1) {
                                        // turn all newlines into nothing
                                        // this data.text will be sent to onChange
                                        data.text = [''];
                                    }
                                    next();
                                }}
                                onChange={(editor, data, value) => {
                                    let newSolnInput = [...solutionInput];
                                    newSolnInput[id] = value;
                                    setSolutionInput(newSolnInput);
                                }}
                            />
                        </div>
                        <a
                            className="problem-submission waves-effect waves-light btn"
                            onClick={handleSubmit}
                            id={`${id}`}
                        >
                            Submit
                        </a>
                    </div>
                );
            })
        : null;
    return (
        <div className="container problem-container">
            <h1 className="center">Python Problems</h1>
            {problemListJSX}
        </div>
    );
};

export default App;
