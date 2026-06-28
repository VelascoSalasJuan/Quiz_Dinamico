import './HealthBars.css'

const HealthBars = ({ 
  playerHp, 
  playerMaxHp, 
  enemyHp, 
  enemyMaxHp, 
  playerHpPercent, 
  enemyHpPercent,
  playerDamageIndicator,
  enemyDamageIndicator
}) => {
  return (
    <div className="status-box">
      <div className="hp-display">
        <p>HP jugador: {playerHp} / {playerMaxHp}</p>
        {playerDamageIndicator && (
          <span className={`damage-indicator ${playerDamageIndicator > 0 ? 'heal' : 'damage'}`}>
            {playerDamageIndicator > 0 ? '+' : ''}{playerDamageIndicator}
          </span>
        )}
      </div>
      <div className="hp-bar">
        <span className="hp-fill player-hp" style={{ width: `${playerHpPercent}%` }} />
      </div>
      <div className="hp-display">
        <p>HP enemigo: {enemyHp} / {enemyMaxHp}</p>
        {enemyDamageIndicator && (
          <span className={`damage-indicator ${enemyDamageIndicator > 0 ? 'heal' : 'damage'}`}>
            {enemyDamageIndicator > 0 ? '+' : ''}{enemyDamageIndicator}
          </span>
        )}
      </div>
      <div className="hp-bar">
        <span className="hp-fill enemy-hp" style={{ width: `${enemyHpPercent}%` }} />
      </div>
    </div>
  )
}

export default HealthBars
