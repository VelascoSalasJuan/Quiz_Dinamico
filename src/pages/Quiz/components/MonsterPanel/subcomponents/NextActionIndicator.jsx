import '../../../QuizPage.css'

const NextActionIndicator = ({ nextAction, getActionIcon, getActionText }) => {
  return (
    <div className="next-enemy-action">
      <div className="action-label">El monstruo preparará:</div>
      <div className="action-icon">{getActionIcon(nextAction)}</div>
      <div className="action-text">{getActionText(nextAction)}</div>
    </div>
  )
}

export default NextActionIndicator
