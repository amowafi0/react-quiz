function nextButton({dispatch, answer, index, numQuestions}) {
    if (answer === null) return null;
    if (index < numQuestions - 1) return (
        <button className="btn btn-ui"
                onClick={() => dispatch({type: "nextQuestions"})}
        >
            next
        </button>
    )
    if (index === numQuestions - 1) return (
        <button className="btn btn-ui"
                onClick={() => dispatch({type: "finish"})}
        >
            finish
        </button>
    )
}

export default nextButton;
