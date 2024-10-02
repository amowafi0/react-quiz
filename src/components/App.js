// import DateCounter from "./DateCounter";
import Header from "./Header";
import Main from "./main";
import {useEffect, useReducer} from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScren from "./startscren";
import Question from "./Queation";
// import nextButton from "./nextButton";
import NextButton from "./nextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./timer";
import Footer from "./footer";
const SECS = 30;
const initialState = {
    questions: [],
    status: "loading",
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
    secondsRemaining: null,

}

function reducer(state, action) {
    switch (action.type) {
        case "dataReceived":
            return {
                ...state,
                questions: action.payload,
                status: "ready",

            }
        case 'dataFailed':
            return {
                ...state, status: "error"
            }
        case "start":
            return {...state, status: "avtive" , secondsRemaining: state.questions.length*SECS}
        case "newAnswer":
            const questions = state.questions.at(state.index);
            return {
                ...state, answer: action.payload,
                points:
                    action.payload === questions.correctOption ?
                        state.points + questions.points
                        : state.points,
            }
        case "nextQuestions":
            return {
                ...state, index: state.index + 1, answer: null
            }
        case "finish":
            return {
                ...state,
                status: "finished",
                highscore: state.points > state.highscore ? state.points : state.highscore
            }
        case "restart":
            return {...initialState, questions: state.questions, status: "ready"}
        case "tick":
            return {
                ...state,secondsRemaining: state.secondsRemaining -1,
                status: state.secondsRemaining ===0 ?"finished" : state.status,
            }
        default:
            throw new Error(" action Unknown ");
    }
}

export default function App() {
    const [{questions, status, index, answer, points, highscore , secondsRemaining }, dispatch] = useReducer(reducer, initialState)
    const numQuestions = questions.length;
    const maxPoints = questions.reduce((prev, curr) => prev + curr.points, 0)
    useEffect(function () {
        fetch("http://localhost:3002/questions/")
            .then((res) => res.json())
            .then((data) => dispatch({type: "dataReceived", payload: data}))
            .catch((err) => dispatch({type: 'dataFailed'}));
    }, [])
    return (
        <div className="app">
            <Header/>
            <Main>
                {status === "loading" && <Loader/>}
                {status === "error" && <Error/>}
                {status === "ready" && <StartScren numQuestions={numQuestions} dispatch={dispatch}/>}
                {status === "avtive" && (
                    <>
                        <Progress index={index} numQuestions={numQuestions} points={points}
                                  maxPoints={maxPoints} answer={answer}/>
                        <Question
                            questions={questions[index]}
                            dispatch={dispatch}
                            answer={answer}
                        />
                        <Footer>
                            <Timer dispatch={dispatch} secondsRemaining ={secondsRemaining}/>
                            <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions}/>

                        </Footer>
                    </>
                )
                }
                {status === "finished" &&
                    <FinishScreen points={points} maxPoints={maxPoints} highscore={highscore} dispatch={dispatch}/>}
            </Main>


        </div>
    )
}