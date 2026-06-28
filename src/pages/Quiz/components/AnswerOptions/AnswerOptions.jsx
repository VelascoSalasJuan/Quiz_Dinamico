import './AnswerOptions.css'

function AnswerOptions({ options }) {
  return (
    <div className="answer-options">
      {options?.map((option) => (
        <div key={option}>{option}</div>
      ))}
    </div>
  )
}

export default AnswerOptions
