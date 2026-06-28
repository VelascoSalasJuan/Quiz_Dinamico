import './OptionsPanel.css'
import ShuffledOptions from './ShuffledOptions.jsx'

const OptionsPanel = ({
  currentQuestion,
  selectedOption,
  isAnswered,
  selectedAction,
  isPlayerTurn,
  isGameFinished,
  onOptionClick,
  getOptionClass
}) => {
  // Usar el ID de la pregunta como key para forzar el remontaje cuando cambia la pregunta
  const questionKey = currentQuestion?.id || 'default'

  return (
    <section className="options-panel">
      <h2>Opciones</h2>
      <ShuffledOptions key={questionKey} options={currentQuestion?.options}>
        {(shuffledOptions) => (
          <div className="options-grid">
            {shuffledOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={getOptionClass(option)}
                onClick={() => onOptionClick(option)}
                disabled={!selectedAction || !isPlayerTurn || isGameFinished}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </ShuffledOptions>
      {isAnswered && (
        <p className="answer-feedback">
          Respuesta correcta: <strong>{currentQuestion.correctAnswer}</strong>
        </p>
      )}
    </section>
  )
}

export default OptionsPanel
