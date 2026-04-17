import { useState } from 'react'
import { questions } from './data/questions'

function App() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const score = questions.reduce(
    (total, question) =>
      total + (answers[question.id] === question.correctAnswer ? 1 : 0),
    0,
  )

  const handleChange = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
    setSubmitted(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      <h1>Quiz de historia</h1>
      <p>Puntaje: {submitted ? `${score} / ${questions.length}` : `0 / ${questions.length}`}</p>

      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <fieldset key={question.id}>
            <legend>{question.prompt}</legend>
            {question.options.map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={() => handleChange(question.id, option)}
                />
                {option}
              </label>
            ))}
          </fieldset>
        ))}

        <button type="submit">Enviar</button>
      </form>

      {submitted && <p>Respuestas correctas: {score} de {questions.length}</p>}
    </div>
  )
}

export default App
