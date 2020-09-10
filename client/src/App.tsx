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
    const [solutionInput, setSolutionInput] = useState<(string | undefined)[]>([]);
    const [correctInput, setCorrectInput] = useState<(boolean | undefined | null)[]>([]);
    const [showSolution, setShowSolution] = useState<string[]>([]);
    const [userScore, setUseScore] = useState<number>(0);

    useEffect(() => {
        axios.get('/api/problems/slice')
            .then(res => {
                setProblemList(res.data);
                setSolutionInput(new Array(10).fill(undefined));
                setCorrectInput(new Array(10).fill(undefined));
                setShowSolution(new Array(10).fill(''));
            });
    }, []);

    const handleSubmit = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const inputId = Number(e.currentTarget.id);
        let userInput = solutionInput[inputId];

        if (userInput === undefined) {
            // do not allow a submit when the input is undefined
            return;
        }

        // convert all single quotes to double quotes
        // FUTURE: will need to handle all weird double and single quotes in text
        const quotes = ["'", '”', '“', '‘', '’', '”', '“', '‘', '’'];
        for (const quote of quotes) {
            while (userInput.indexOf(quote) !== -1) {
                userInput = userInput.replace(quote, '"');
            }
        }

        // trim user input
        userInput = userInput.trim();

        // characters that aren't affected by whitespace
        const trimWhitespaceChars = [',', '[', '[', '(', ')'];

        for (const char of trimWhitespaceChars) {
            // remove left-side whitespace
            while (userInput.indexOf(` ${char}`) !== -1) {
                userInput = userInput.replace(` ${char}`, `${char}`);
            }

            // remove right-side whitespace
            while (userInput.indexOf(`${char} `) !== -1) {
                userInput = userInput.replace(`${char} `, `${char}`);
            }
        }

        // check if the userInput matches the solutions
        if (problemList) {
            const solution = problemList.problems[inputId].solution;
            if (userInput === solution) {
                console.log('Correct!');
                // if the previous input was not true, update the user Score
                if (correctInput[inputId] !== true && correctInput[inputId] !== null) {
                    setUseScore(userScore + 1);
                    let newCorrectInput = [...correctInput];
                    newCorrectInput[inputId] = true;
                    setCorrectInput(newCorrectInput);
                }
                
            } else if ((userInput.toLowerCase() === 'error' ||
                       userInput.toLowerCase() === 'valueerror') &&
                       solution.indexOf('ValueError slice step cannot be zero')){
                console.log('Correct!');
                // if the previous input was not true, update the user Score
                if (correctInput[inputId] !== true && correctInput[inputId] !== null) {
                    setUseScore(userScore + 1);
                }
                let newCorrectInput = [...correctInput];
                newCorrectInput[inputId] = true;
                setCorrectInput(newCorrectInput);
            } else {
                console.log('Incorrect.');

                // if the previous input was true, user will not recieve credit for toggling
                // state from false => true
                let newCorrectInput = [...correctInput];
                // correctInput[inputId] !== true &&
                if (correctInput[inputId] !== null) {
                    console.log('hit');
                    newCorrectInput[inputId] = false;
                    setCorrectInput(newCorrectInput);
                    // If someone received no credit, don't penalize them for selecting the submit button
                    // later in the questons list
                    setUseScore(0);
                }

                console.log('solution is: ', solution);
            }
        }
    };

    const handleViewSolution = (e: React.MouseEvent<HTMLAnchorElement>) => {

        // Get question ID
        const questionId = Number(e.currentTarget.id);

        // Look through answer key for the ID's solution
        if (problemList) {
            let solution = problemList.problems[questionId].solution;
            let solutionsToShow = [...showSolution];

            // if the solution has not been shown before, set the score to 0
            if (solutionsToShow[questionId] === "") {
                // set the score to 0 - you aren't allowed any help
                setUseScore(0);
            }

            // if the solution is an error, show that we can take "Error" or "ValueError"
            console.log('solution', solution);
            if (solution === '"ValueError slice step cannot be zero"') {
                solution += ' - Error or ValueError are the accepted answers';
            }
            solutionsToShow[questionId] = solution;
            setShowSolution(solutionsToShow);
        }

        // no credit receieved for viewing a solution
        let newCorrectInput = [...correctInput];
        newCorrectInput[questionId] = null;
        setCorrectInput(newCorrectInput);
    };

    const handleGenerateProblems = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        setProblemList(undefined);
        axios.get('/api/problems/slice').then((res) => {
            setProblemList(res.data);
            setSolutionInput(new Array(10).fill(undefined));
            setCorrectInput(new Array(10).fill(undefined));
            setShowSolution(new Array(10).fill(''));
            window.scrollTo(0, 0);
        });
    };

    const problemListJSX = problemList !== undefined
        ? problemList.problems.map(({ problem, solution, id }) => {
                return (
                    <div className={`slice-problem-${id}`} key={id}>
                        <p className="question-problem"><b>Problem #{id + 1}: </b> 
                        <span className="problem-text">{problem}</span>
                        </p>
                        {/* <p>Solution: {String(solution)}</p> */}
                        <div className="one-line-code-editor">
                            <CodeMirror
                                value=''
                                options={{
                                    mode: 'xml',
                                    theme: 'material',
                                    lineNumbers: false,
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
                        <a
                            className="view-solution waves-effect waves-light btn"
                            onClick={handleViewSolution}
                            id={`${id}`}
                        >
                            View Solution
                        </a>

                        <div className="display-message">
                            {
                                correctInput[id] === true ? <div className="correct-answer">
                                        <strong>✓ Correct</strong> </div> : (
                                    correctInput[id] === false ? <div className="incorrect-answer">
                                        <strong>✘ Incorrect</strong></div> : (
                                        correctInput[id] === null ? <div className="view-solution">
                                            <strong>No credit</strong></div> : <br/>
                                    )
                                )
                            }
                            {
                                showSolution[id] !== '' ? <div className="view-solution">Solution: {showSolution[id]}</div>: false
                            }
                        </div>
                    </div>
                );
            })
        : null;
    return (
        <div className="outer-container">
        <div className="container problem-container">
            <h1 className="center">Python Slice Problems</h1>

            {
                problemList !== undefined ? (
                    <div className="problem-list">
                    {problemListJSX}
                    <a
                        className="generate-problems waves-effect waves-light btn light-blue"
                        onClick={handleGenerateProblems}
                    >
                        Generate Problems
                    </a>
                    </div>
                ) : (false)
            }

        </div>
        <div className="fixed"><strong>Your score: {userScore}</strong></div>
        </div>
    );
};

export default App;
