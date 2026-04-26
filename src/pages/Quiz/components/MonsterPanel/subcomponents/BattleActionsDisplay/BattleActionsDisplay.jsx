import './BattleActionsDisplay.css'

const BattleActionsDisplay = ({ battleActions, getActionIcon, getActionText }) => {
  if (!battleActions.showActions) return null

  const getActionEmoji = (action) => {
    const actionEmojis = {
      attack: '⚔️',
      strong: '💥',
      dodge: '🛡️',
      heal: '💚'
    }
    return actionEmojis[action] || '❓'
  }

  return (
    <div className="battle-actions-display">
      <div className="actions-title">⚔️ Acciones Seleccionadas</div>
      <div className="actions-container">
        <div className={`action-card player-action ${battleActions.playerFailed ? 'failed' : battleActions.executingActions ? 'executing' : 'selected'}`}>
          <div className="action-label">Jugador</div>
          <div className="action-content">
            <span className="action-emoji">{getActionEmoji(battleActions.playerAction)}</span>
            <span className="action-name">{getActionText(battleActions.playerAction)}</span>
          </div>
          {battleActions.playerFailed && <div className="failed-x">✕</div>}
        </div>
        
        <div className="vs-divider">VS</div>
        
        <div className={`action-card enemy-action ${battleActions.executingActions ? 'executing' : 'selected'}`}>
          <div className="action-label">Enemigo</div>
          <div className="action-content">
            <span className="action-emoji">{getActionEmoji(battleActions.enemyAction)}</span>
            <span className="action-name">{getActionText(battleActions.enemyAction)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BattleActionsDisplay
