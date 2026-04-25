import '../../QuizPage.css'

const QuestionPanel = ({ currentQuestion, selectedAction }) => {
  return (
    <article className="question-panel">
      <p>
        {selectedAction
          ? currentQuestion?.prompt
          : 'Selecciona una accion en el panel derecho para ver la pregunta.'}
      </p>
    </article>
  )
}

export default QuestionPanel
