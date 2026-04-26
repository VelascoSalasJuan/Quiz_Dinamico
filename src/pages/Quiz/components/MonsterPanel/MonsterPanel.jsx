import './MonsterPanel.css'
import NextActionIndicator from './subcomponents/NextActionIndicator.jsx'
import HealthBars from './subcomponents/HealthBars.jsx'
import ActionButtons from './subcomponents/ActionButtons.jsx'

const MonsterPanel = ({ 
  selectedMonster, 
  playerHp, 
  enemyHp, 
  playerMaxHp, 
  enemyMaxHp, 
  playerHpPercent, 
  enemyHpPercent, 
  selectedAction, 
  isPlayerTurn, 
  isGameFinished, 
  feedbackMessage, 
  nextAction, 
  getActionIcon, 
  getActionText, 
  onSelectAction, 
  onRestartBattle 
}) => {
  return (
    <aside className="right-panel">
      <div className="monster-container">
        <div className="monster-model">{selectedMonster.icon}</div>
        <NextActionIndicator 
          nextAction={nextAction}
          getActionIcon={getActionIcon}
          getActionText={getActionText}
        />
      </div>
      <h2>{selectedMonster.name}</h2>
      <HealthBars 
        playerHp={playerHp}
        enemyHp={enemyHp}
        playerMaxHp={playerMaxHp}
        enemyMaxHp={enemyMaxHp}
        playerHpPercent={playerHpPercent}
        enemyHpPercent={enemyHpPercent}
      />
      <p className="battle-feedback">{feedbackMessage}</p>
      <ActionButtons 
        selectedAction={selectedAction}
        isPlayerTurn={isPlayerTurn}
        isGameFinished={isGameFinished}
        onSelectAction={onSelectAction}
        onRestartBattle={onRestartBattle}
      />
    </aside>
  )
}

export default MonsterPanel
