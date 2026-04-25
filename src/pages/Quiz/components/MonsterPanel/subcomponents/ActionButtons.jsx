import '../../../QuizPage.css'

const ActionButtons = ({ 
  selectedAction, 
  isPlayerTurn, 
  isGameFinished, 
  onSelectAction, 
  onRestartBattle 
}) => {
  return (
    <div className="action-buttons">
      <button
        type="button"
        onClick={() => onSelectAction('attack')}
        disabled={!isPlayerTurn || isGameFinished}
        className={selectedAction === 'attack' ? 'action-active' : ''}
      >
        Atacar
      </button>
      <button
        type="button"
        onClick={() => onSelectAction('heal')}
        disabled={!isPlayerTurn || isGameFinished}
        className={selectedAction === 'heal' ? 'action-active' : ''}
      >
        Curar
      </button>
      <button
        type="button"
        onClick={() => onSelectAction('dodge')}
        disabled={!isPlayerTurn || isGameFinished}
        className={selectedAction === 'dodge' ? 'action-active' : ''}
      >
        Esquivar
      </button>
      {isGameFinished && (
        <button
          type="button"
          onClick={onRestartBattle}
        >
          Reiniciar batalla
        </button>
      )}
    </div>
  )
}

export default ActionButtons
