import './NextActionIndicator.css'

const NextActionIndicator = ({ nextAction, getActionIcon, showQuestion }) => {
  // Mostrar ? mientras el jugador está respondiendo la pregunta
  const displayAction = showQuestion ? null : nextAction
  
  return (
    <div className="next-enemy-action">
      <div className="action-circle">
        {displayAction ? getActionIcon(displayAction) : '❓'}
      </div>
      <div className="action-label">siguiente</div>
    </div>
  )
}

export default NextActionIndicator
