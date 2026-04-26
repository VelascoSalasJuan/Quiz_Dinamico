import './EnemyStatusDisplay.css'
import CooldownIndicator from '../CooldownIndicator/CooldownIndicator.jsx'

const EnemyStatusDisplay = ({ 
  getEnemyCooldownRemaining, 
  checkEnemyCooldown 
}) => {
  const actions = [
    { emoji: '⚔️', name: 'attack', hasCooldown: false },
    { emoji: '💥', name: 'strong', hasCooldown: true },
    { emoji: '🛡️', name: 'dodge', hasCooldown: true },
    { emoji: '💚', name: 'heal', hasCooldown: true }
  ]

  return (
    <div className="enemy-status-display">
      <div className="status-title">Estado Enemigo</div>
      <div className="enemy-actions">
        {actions.map((action) => (
          <div 
            key={action.name}
            className={`enemy-action ${checkEnemyCooldown(action.name) ? 'on-cooldown' : 'available'}`}
          >
            <div className="action-hexagon">
              <span className="action-emoji">{action.emoji}</span>
              {action.hasCooldown && (
                <CooldownIndicator remaining={getEnemyCooldownRemaining(action.name)} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EnemyStatusDisplay
