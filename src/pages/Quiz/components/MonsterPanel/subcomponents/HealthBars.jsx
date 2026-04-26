import './HealthBars.css'

const HealthBars = ({ 
  playerHp, 
  playerMaxHp, 
  enemyHp, 
  enemyMaxHp, 
  playerHpPercent, 
  enemyHpPercent 
}) => {
  return (
    <div className="status-box">
      <p>HP jugador: {playerHp} / {playerMaxHp}</p>
      <div className="hp-bar">
        <span className="hp-fill player-hp" style={{ width: `${playerHpPercent}%` }} />
      </div>
      <p>HP enemigo: {enemyHp} / {enemyMaxHp}</p>
      <div className="hp-bar">
        <span className="hp-fill enemy-hp" style={{ width: `${enemyHpPercent}%` }} />
      </div>
    </div>
  )
}

export default HealthBars
