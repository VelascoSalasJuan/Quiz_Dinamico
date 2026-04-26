import './OptionsPanel.css'

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
  return (
    <section className="options-panel">
      <h2>Opciones</h2>
      <div className="options-grid">
        {currentQuestion?.options.map((option) => (
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
      {isAnswered && (
        <p className="answer-feedback">
          Respuesta correcta: <strong>{currentQuestion.correctAnswer}</strong>
        </p>
      )}
    </section>
  )
}

export default OptionsPanel
