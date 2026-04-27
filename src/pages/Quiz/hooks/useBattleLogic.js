import { useAbilitiesLogic } from './useAbilitiesLogic.js'
import { useEnemyAI } from './useEnemyAI.js'
import { useBattleState } from './useBattleState.js'

export function useBattleLogic(selectedMonster, gameLogic) {
  // Hooks especializados
  const abilities = useAbilitiesLogic()
  const enemyAI = useEnemyAI(abilities.enemyCooldowns)
  const battleState = useBattleState(selectedMonster)
  
    
  
  
    
  // Función principal para manejar clic en opción
  const handleOptionClick = (option) => {
    console.log(`🎯 Respuesta seleccionada: ${option}`)
    
    // Validaciones básicas
    if (!gameLogic.isPlayerTurn || gameLogic.isGameFinished) {
      return
    }
    
    if (!gameLogic.selectedAction) {
      return
    }
    
    // Validar habilidad usando el hook especializado
    const abilityCheck = abilities.canUseAbility(gameLogic.selectedAction)
    if (!abilityCheck.canUse) {
      gameLogic.setFeedbackMessage(abilityCheck.message)
      return
    }
    
    // Evaluar respuesta
    gameLogic.setSelectedOption(option)
    const isCorrect = option === gameLogic.currentQuestion?.correctAnswer
    
    // Generar acción del enemigo SOLO si respuesta es correcta
    let enemyAction
    if (isCorrect) {
      enemyAction = enemyAI.generateEnemyAction()
    } else {
      enemyAction = 'attack' // Siempre attack como castigo
    }
    
    // Mostrar acciones seleccionadas
    battleState.setBattleActions({
      playerAction: gameLogic.selectedAction,
      enemyAction: enemyAction,
      showActions: true,
      executingActions: false,
      playerFailed: !isCorrect
    })
    
    console.log(`⚔️ BATALLA: Jugador ${gameLogic.selectedAction} vs Enemigo ${enemyAction}`)
    console.log(`📝 Respuesta: ${isCorrect ? '✅ CORRECTA' : '❌ INCORRECTA'}`)
    
    if (isCorrect) {
      // Respuesta correcta: procesar batalla con nueva lógica
      let battleEnded = false
      
      // Después de 1s, procesar ambas acciones simultáneamente
      setTimeout(() => {
        battleState.setBattleActions(prev => ({ ...prev, executingActions: true }))
        
        // Procesar batalla: compara acciones y aplica efectos
        battleEnded = battleState.processBattle(gameLogic.selectedAction, enemyAction, abilities.cooldowns, abilities.enemyCooldowns, gameLogic)
        
        // Aplicar cooldowns para habilidades usadas
        if (gameLogic.selectedAction !== 'attack' && gameLogic.selectedAction !== 'dodge') {
          abilities.setCooldown(gameLogic.selectedAction, false)
        }
        if (enemyAction !== 'attack' && enemyAction !== 'dodge') {
          abilities.setCooldown(enemyAction, true)
        }
        // Aplicar cooldown para dodge del enemigo
        if (enemyAction === 'dodge') {
          abilities.setCooldown('dodge', true)
        }
        
        // Resetear para siguiente turno después de procesar
        setTimeout(() => {
          battleState.resetTurnActions()
          
          // Reducir cooldowns
          abilities.reduceCooldowns(false)
          abilities.reduceCooldowns(true)
          
          gameLogic.advanceTimeline()
          gameLogic.setTurn('player')
          gameLogic.setSelectedOption(null)
          gameLogic.setSelectedAction(null)
          
          // Avanzar a la siguiente pregunta
          gameLogic.advanceQuestionAndCategory(gameLogic.turnCount + 1)
          
          // Separador visual para final del turno
          console.log('======================')
        }, 1500)
      }, 1000)
    } else {
      // Respuesta incorrecta: solo ataque normal del enemigo (castigo)
      gameLogic.setFeedbackMessage('Fallaste la pregunta. Tu acción falló.')
      
      setTimeout(() => {
        battleState.setBattleActions(prev => ({ ...prev, executingActions: true }))
        
        // Ejecutar ataque normal del enemigo (castigo)
        const playerDamage = abilities.ABILITIES.ATTACK.damage
        const newPlayerHp = Math.max(0, battleState.playerHp - playerDamage)
        
        // Mostrar indicador de daño al jugador
        battleState.setPlayerDamageIndicator(-playerDamage)
        setTimeout(() => battleState.setPlayerDamageIndicator(null), 2000)
        
        battleState.setPlayerHp(newPlayerHp)
        gameLogic.setFeedbackMessage(`El monstruo atacó e hizo ${playerDamage} de daño.`)
        
        if (newPlayerHp <= 0) {
          gameLogic.setTurn('finished')
          gameLogic.setFeedbackMessage('Perdiste la batalla.')
          return
        }
        
        setTimeout(() => {
          // Resetear acciones de batalla
          battleState.resetTurnActions()
          
          // Reducir cooldowns
          abilities.reduceCooldowns(false)
          abilities.reduceCooldowns(true)
          
          gameLogic.advanceTimeline()
          gameLogic.setTurn('player')
          gameLogic.setSelectedOption(null)
          gameLogic.setSelectedAction(null)
          
          // Avanzar a la siguiente pregunta
          gameLogic.advanceQuestionAndCategory(gameLogic.turnCount + 1)
          
          // Separador visual para final del turno
          console.log('======================')
        }, 1500)
      }, 1500)
    }
  }
  
  // Funciones auxiliares (placeholder por ahora)
  const getOptionClass = (option) => {
    if (!gameLogic.selectedOption) return ''
    if (gameLogic.selectedOption === option) {
      return option === gameLogic.currentQuestion?.correctAnswer ? 'correct' : 'incorrect'
    }
    return option === gameLogic.currentQuestion?.correctAnswer ? 'correct' : 'incorrect'
  }
  
  const handleRestartBattle = () => {
    battleState.resetBattleState()
    abilities.resetCooldowns(false)
    abilities.resetCooldowns(true)
    gameLogic.setDodgeReady(false)
    gameLogic.setTurn('player')
    gameLogic.resetBattle()
  }
  
  // Funciones delegadas a los hooks especializados
  const predictNextEnemyAction = () => 'attack'
  const clearEnemyActionPrediction = () => {}
  const checkEnemyCooldown = (action) => abilities.isOnCooldown(action, true)
  const getEnemyCooldownRemaining = (action) => abilities.getCooldownRemaining(action, true)
  const checkCooldown = (action) => abilities.isOnCooldown(action, false)
  const getCooldownRemaining = (action) => abilities.getCooldownRemaining(action, false)
  
  return {
    // Estado de batalla
    playerHp: battleState.playerHp,
    enemyHp: battleState.enemyHp,
    playerMaxHp: battleState.playerMaxHp,
    enemyMaxHp: battleState.enemyMaxHp,
    playerHpPercent: battleState.playerHpPercent,
    enemyHpPercent: battleState.enemyHpPercent,
    nextEnemyAction: null,
    displayEnemyAction: null,
    cooldowns: abilities.cooldowns,
    enemyCooldowns: abilities.enemyCooldowns,
    battleActions: battleState.battleActions,
    showEnemyAction: false,
    
    // Indicadores visuales
    playerDamageIndicator: battleState.playerDamageIndicator,
    enemyDamageIndicator: battleState.enemyDamageIndicator,
    
    // Funciones placeholder
    handleOptionClick,
    getOptionClass,
    handleRestartBattle,
    predictNextEnemyAction,
    clearEnemyActionPrediction,
    checkCooldown,
    getCooldownRemaining,
    checkEnemyCooldown,
    getEnemyCooldownRemaining,
    COOLDOWN_CONFIG: { strong: 2, dodge: 3, heal: 3 },
  }
}
