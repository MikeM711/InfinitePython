import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

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

    const handleChange = (e: any) => {
        const userInput:string = e.currentTarget.textContent;
        const inputId = Number(e.currentTarget.id);
        let newSolnInput = [...solutionInput];
        newSolnInput[inputId] = userInput;
        setSolutionInput(newSolnInput);
    };

    const problemListJSX = problemList !== undefined
        ? problemList.problems.map(({ problem, solution, id }) => {
                return (
                    <div className={`slice-problem-${id}`} key={id}>
                        <p className="question-problem">Problem #{id + 1}: {problem}</p>
                        {/* <p>Solution: {String(solution)}</p> */}
                        <div
                            className={`solution-input ${id}`}
                            contentEditable="true"
                            id={`${id}`}
                            onInput={handleChange}
                        ></div>
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
