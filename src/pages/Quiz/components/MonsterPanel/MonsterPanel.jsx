import './MonsterPanel.css'
import NextActionIndicator from './subcomponents/NextActionIndicator.jsx'
import HealthBars from './subcomponents/HealthBars.jsx'
import ActionButtons from './subcomponents/ActionButtons.jsx'
import EnemyStatusDisplay from './subcomponents/EnemyStatusDisplay/EnemyStatusDisplay.jsx'
import BattleActionsDisplay from './subcomponents/BattleActionsDisplay/BattleActionsDisplay.jsx'

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
  cooldowns, 
  enemyCooldowns, 
  nextEnemyAction, 
  displayEnemyAction, 
  battleActions, 
  showEnemyAction, 
  getActionIcon, 
  getActionText, 
  onSelectAction, 
  onRestartBattle,
  checkCooldown,
  getCooldownRemaining,
  checkEnemyCooldown,
  getEnemyCooldownRemaining,
  playerDamageIndicator,
  enemyDamageIndicator
}) => {
  return (
    <aside className="right-panel">
      <div className="monster-container">
        <div className="monster-model">{selectedMonster.icon}</div>
        <NextActionIndicator 
          nextAction={displayEnemyAction || nextAction}
          getActionIcon={getActionIcon}
          getActionText={getActionText}
          showQuestion={!showEnemyAction}
        />
      </div>
      <h2>{selectedMonster.name}</h2>
      
      {/* Nuevo componente de estado del enemigo */}
      <EnemyStatusDisplay 
        getEnemyCooldownRemaining={getEnemyCooldownRemaining}
        checkEnemyCooldown={checkEnemyCooldown}
      />
      
      {/* Componente para mostrar acciones seleccionadas */}
      <BattleActionsDisplay 
        battleActions={battleActions}
        getActionIcon={getActionIcon}
        getActionText={getActionText}
      />
      
      <HealthBars 
        playerHp={playerHp}
        enemyHp={enemyHp}
        playerMaxHp={playerMaxHp}
        enemyMaxHp={enemyMaxHp}
        playerHpPercent={playerHpPercent}
        enemyHpPercent={enemyHpPercent}
        playerDamageIndicator={playerDamageIndicator}
        enemyDamageIndicator={enemyDamageIndicator}
      />
      <p className="battle-feedback">{feedbackMessage}</p>
      <ActionButtons 
        selectedAction={selectedAction}
        isPlayerTurn={isPlayerTurn}
        isGameFinished={isGameFinished}
        onSelectAction={onSelectAction}
        onRestartBattle={onRestartBattle}
        checkCooldown={checkCooldown}
        getCooldownRemaining={getCooldownRemaining}
      />
    </aside>
  )
}

export default MonsterPanel
