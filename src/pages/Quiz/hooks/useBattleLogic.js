import { useAbilitiesLogic } from './useAbilitiesLogic.js'
import { useEnemyAI } from './useEnemyAI.js'
import { useBattleState } from './useBattleState.js'
import { handlePlayerFailLogic } from './PlayerFailLogic/PlayerFailLogic.js'

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
    
    // Generar acción del enemigo (siempre genera su habilidad normal)
    let enemyAction = enemyAI.generateEnemyAction()
    
    // Mostrar acciones seleccionadas
    battleState.setBattleActions({
      playerAction: gameLogic.selectedAction,
      enemyAction: enemyAction,
      showActions: true,
      executingActions: false,
      playerFailed: !isCorrect,
      playerAnswered: true
    })
    
    console.log(`⚔️ BATALLA: Jugador ${gameLogic.selectedAction} vs Enemigo ${enemyAction}`)
    console.log(`📝 Respuesta: ${isCorrect ? '✅ CORRECTA' : '❌ INCORRECTA'}`)

    // CONDICIONAL: Si responde correctamente -> pasa al turno del jugador
    // Si falla -> se salta al turno del rival (monstruo ataca directamente)
    if (isCorrect) {
      // Respuesta correcta: procesar batalla con nueva lógica secuencial
      let battleEnded = false

      // Después de 1s, procesar ataque del jugador primero
      setTimeout(() => {
        battleState.setBattleActions(prev => ({ ...prev, playerAttacked: true }))

        // Procesar ataque del jugador
        battleEnded = battleState.processPlayerAttack(gameLogic.selectedAction, gameLogic)

        // Aplicar cooldown para habilidad del jugador
        if (gameLogic.selectedAction !== 'attack') {
          abilities.setCooldown(gameLogic.selectedAction, false)
        }

        // Después de 1.5s, apagar el brillo del héroe
        setTimeout(() => {
          battleState.setBattleActions(prev => ({ ...prev, playerAttackComplete: true }))
        }, 1500)

        if (!battleEnded) {
          // Después de 1.5s, revelar acción del enemigo
          setTimeout(() => {
            battleState.setBattleActions(prev => ({ ...prev, enemyActionRevealed: true }))

            // Después de 1s, procesar ataque del enemigo
            setTimeout(() => {
              battleState.setBattleActions(prev => ({ ...prev, executingActions: true }))

              // Procesar ataque del enemigo
              battleEnded = battleState.processEnemyAttack(enemyAction, gameLogic.selectedAction, gameLogic)

              // Aplicar cooldowns para habilidades del enemigo
              if (enemyAction !== 'attack') {
                abilities.setCooldown(enemyAction, true)
              }

              // Después de 1.5s, apagar el brillo del monstruo
              setTimeout(() => {
                battleState.setBattleActions(prev => ({ ...prev, enemyAttackComplete: true }))
              }, 1500)

              if (!battleEnded) {
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
              }
            }, 1000)
          }, 1500)
        }
      }, 1000)
    } else {
      // Respuesta incorrecta: usar componente específico para manejar la lógica
      handlePlayerFailLogic(enemyAction, abilities, battleState, gameLogic)
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
    playerDamageFlash: battleState.playerDamageFlash,
    enemyDamageFlash: battleState.enemyDamageFlash,

    // Funciones
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
