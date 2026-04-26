import './NextActionIndicator.css'

const NextActionIndicator = ({ nextAction, getActionIcon }) => {
  return (
    <div className="next-enemy-action">
      <div className="action-circle">
        {getActionIcon(nextAction)}
      </div>
      <div className="action-label">siguiente</div>
    </div>
  )
}

export default NextActionIndicator
