import { useState, useEffect } from 'react'

const PLAYER_MAX_HP = 100
const PLAYER_ATTACK_DAMAGE = 20
const PLAYER_HEAL_AMOUNT = 18

export function useBattleLogic(selectedMonster, gameLogic) {
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP)
  const [enemyHp, setEnemyHp] = useState(selectedMonster ? selectedMonster.hp : 100)
  const [nextEnemyAction, setNextEnemyAction] = useState('attack')
  
  // Estado de cooldowns para las habilidades
  const [cooldowns, setCooldowns] = useState({
    strong: 0,    // Ataque fuerte: 2 turnos
    dodge: 0,     // Esquivar: 3 turnos
    heal: 0       // Curar: 3 turnos
  })

  const playerHpPercent = (playerHp / PLAYER_MAX_HP) * 100
  const enemyHpPercent = (enemyHp / (selectedMonster?.hp || 100)) * 100

  // Función para predecir la próxima acción del enemigo (solo una vez)
  const predictNextEnemyAction = () => {
    // Solo generar nueva acción si no hay una ya predicha
    if (nextEnemyAction) {
      return nextEnemyAction
    }
    
    const actions = ['attack', 'strong', 'heal']
    const weights = [0.6, 0.3, 0.1]
    const random = Math.random()
    let predictedAction = 'attack'
    let cumulative = 0
    
    for (let i = 0; i < actions.length; i++) {
      cumulative += weights[i]
      if (random <= cumulative) {
        predictedAction = actions[i]
        break
      }
    }
    
    setNextEnemyAction(predictedAction)
    return predictedAction
  }

  // Función para limpiar la predicción (usar después de ejecutar)
  const clearEnemyActionPrediction = () => {
    setNextEnemyAction(null)
  }

  // Función para verificar si una habilidad está en cooldown
  const checkCooldown = (action) => {
    return cooldowns[action] > 0
  }

  // Función para obtener el cooldown restante de una habilidad
  const getCooldownRemaining = (action) => {
    return cooldowns[action] || 0
  }

  // Función para reducir todos los cooldowns en 1
  const reduceCooldowns = () => {
    setCooldowns(prev => ({
      strong: Math.max(0, prev.strong - 1),
      dodge: Math.max(0, prev.dodge - 1),
      heal: Math.max(0, prev.heal - 1)
    }))
  }

  // Función para establecer cooldown a una habilidad
  const setCooldown = (action, turns) => {
    setCooldowns(prev => ({
      ...prev,
      [action]: turns
    }))
  }

  // Configuración de cooldowns por habilidad
  const COOLDOWN_CONFIG = {
    strong: 2,  // Ataque fuerte: 2 turnos
    dodge: 3,   // Esquivar: 3 turnos
    heal: 3     // Curar: 3 turnos
  }

  // Función para aplicar acción correcta del jugador
  const applyCorrectAction = (action) => {
    let battleEnded = false

    switch (action) {
      case 'attack':
        // Ataque normal: sin cooldown, daño estándar
        const damage = PLAYER_ATTACK_DAMAGE
        const nextEnemyHp = Math.max(0, enemyHp - damage)
        setEnemyHp(nextEnemyHp)
        if (nextEnemyHp <= 0) {
          gameLogic.setTurn('finished')
          gameLogic.setFeedbackMessage('¡Ganaste la batalla!')
          battleEnded = true
        } else {
          gameLogic.setFeedbackMessage(`Atacaste e hiciste ${damage} de daño.`)
        }
        break

      case 'strong':
        // Ataque fuerte: con cooldown, más daño
        if (!checkCooldown('strong')) {
          const strongDamage = PLAYER_ATTACK_DAMAGE * 1.5
          const strongNextEnemyHp = Math.max(0, enemyHp - strongDamage)
          setEnemyHp(strongNextEnemyHp)
          setCooldown('strong', COOLDOWN_CONFIG.strong)
          if (strongNextEnemyHp <= 0) {
            gameLogic.setTurn('finished')
            gameLogic.setFeedbackMessage('¡Ganaste la batalla con un ataque fuerte!')
            battleEnded = true
          } else {
            gameLogic.setFeedbackMessage(`Usaste ataque fuerte e hiciste ${strongDamage} de daño.`)
          }
        }
        break

      case 'heal':
        // Curar: con cooldown, recupera vida
        if (!checkCooldown('heal')) {
          const healAmount = PLAYER_HEAL_AMOUNT
          const newPlayerHp = Math.min(PLAYER_MAX_HP, playerHp + healAmount)
          setPlayerHp(newPlayerHp)
          setCooldown('heal', COOLDOWN_CONFIG.heal)
          gameLogic.setFeedbackMessage(`Te curaste y recuperaste ${healAmount} de vida.`)
        }
        break

      case 'dodge':
        // Esquivar: con cooldown, prepara esquiva
        if (!checkCooldown('dodge')) {
          gameLogic.setDodgeReady(true)
          setCooldown('dodge', COOLDOWN_CONFIG.dodge)
          gameLogic.setFeedbackMessage('Te preparas para esquivar el próximo ataque.')
        }
        break

      default:
        gameLogic.setFeedbackMessage('Acción no reconocida.')
    }

    return battleEnded
  }

  // Función para manejar el clic en una opción
  const handleOptionClick = (option) => {
    console.log('🔍 handleOptionClick llamado', { option, selectedAction: gameLogic.selectedAction, isPlayerTurn: gameLogic.isPlayerTurn })
    
    if (gameLogic.selectedOption || !gameLogic.selectedAction || !gameLogic.isPlayerTurn || gameLogic.isGameFinished) {
      console.log('❌ handleOptionClick bloqueado', { 
        selectedOption: gameLogic.selectedOption, 
        selectedAction: gameLogic.selectedAction, 
        isPlayerTurn: gameLogic.isPlayerTurn, 
        isGameFinished: gameLogic.isGameFinished 
      })
      return
    }
    
    gameLogic.setSelectedOption(option)
    const isCorrect = option === gameLogic.currentQuestion?.correctAnswer
    console.log('✅ Respuesta evaluada', { option, isCorrect, correctAnswer: gameLogic.currentQuestion?.correctAnswer })
    
    let battleEnded = false

    if (isCorrect) {
      battleEnded = applyCorrectAction(gameLogic.selectedAction)
    } else {
      gameLogic.setFeedbackMessage('Fallaste la pregunta. Tu accion no se ejecuto.')
    }

    setTimeout(() => {
      console.log('⏰ Timeout ejecutándose', { battleEnded })
      gameLogic.setSelectedOption(null)
      gameLogic.setSelectedAction(null)

      if (battleEnded) return

      // Reducir cooldowns al final del turno del jugador
      reduceCooldowns()
      console.log('🔄 Cooldowns reducidos', cooldowns)

      const nextTurn = gameLogic.turnCount + 1
      gameLogic.setTurnCount(nextTurn)
      gameLogic.advanceQuestionAndCategory(nextTurn)
      gameLogic.advanceTimeline()
      
      // Predecir la próxima acción del enemigo ANTES de cambiar el turno
      const predictedAction = predictNextEnemyAction()
      const actionText = gameLogic.getActionText(predictedAction)
      gameLogic.setFeedbackMessage(`El monstruo preparará: ${actionText}`)
      
      console.log('🔄 Cambiando a turno del enemigo', { predictedAction })
      gameLogic.setTurn('enemy')
    }, 1500)
  }

  // Función para obtener clase de opción
  const getOptionClass = (option) => {
    if (!gameLogic.selectedOption) return ''

    if (gameLogic.selectedOption === option) {
      return option === gameLogic.currentQuestion?.correctAnswer ? 'correct' : 'incorrect'
    }

    if (option === gameLogic.currentQuestion?.correctAnswer) {
      return 'correct'
    }

    return 'incorrect'
  }

  // Efecto para el turno del enemigo
  useEffect(() => {
    console.log('🎯 useEffect del enemigo ejecutándose', { 
      turn: gameLogic.turn, 
      selectedMonster: !!selectedMonster,
      playerHp 
    })
    
    if (gameLogic.turn !== 'enemy' || !selectedMonster) {
      console.log('❌ useEffect del enemigo no ejecuta', { 
        turn: gameLogic.turn, 
        hasMonster: !!selectedMonster 
      })
      return
    }

    console.log('⚔️ Iniciando turno del enemigo')
    const enemyTurnTimer = setTimeout(() => {
      console.log('💥 Timer del enemigo ejecutándose')
      
      if (gameLogic.dodgeReady) {
        gameLogic.setFeedbackMessage('Esquivaste el ataque del monstruo.')
        gameLogic.setDodgeReady(false)
        gameLogic.advanceTimeline()
        gameLogic.setTurn('player')
        return
      }

      // Usar la acción predicha para consistencia
      const enemyAction = nextEnemyAction
      console.log('🎲 Acción del enemigo ejecutada (predicha)', { enemyAction })
      
      let damage = 0
      let message = ''

      switch (enemyAction) {
        case 'attack':
          damage = selectedMonster.attack
          message = `El monstruo atacó e hizo ${damage} de daño.`
          break
        case 'strong':
          damage = Math.floor(selectedMonster.attack * 1.5)
          message = `¡El monstruo usó un ataque fuerte e hizo ${damage} de daño!`
          break
        case 'heal':
          const healAmount = Math.floor(selectedMonster.hp * 0.3)
          const newEnemyHp = Math.min(selectedMonster.hp, enemyHp + healAmount)
          setEnemyHp(newEnemyHp)
          message = `El monstruo se curó y recuperó ${healAmount} de vida.`
          damage = 0
          break
        default:
          damage = selectedMonster.attack
          message = `El monstruo atacó e hizo ${damage} de daño.`
      }

      const nextPlayerHp = Math.max(0, playerHp - damage)
      setPlayerHp(nextPlayerHp)

      console.log('💔 Daño aplicado', { damage, nextPlayerHp })

      if (nextPlayerHp <= 0) {
        gameLogic.setTurn('finished')
        gameLogic.setFeedbackMessage('Perdiste la batalla.')
        return
      }

      gameLogic.setFeedbackMessage(message)
      gameLogic.advanceTimeline()
      
      // Limpiar la predicción después de ejecutar
      clearEnemyActionPrediction()
      
      console.log('🔄 Volviendo al turno del jugador')
      gameLogic.setTurn('player')
    }, 2000)

    return () => {
      console.log('🧹 Limpiando timer del enemigo')
      clearTimeout(enemyTurnTimer)
    }
  }, [gameLogic.turn, playerHp, gameLogic.dodgeReady, selectedMonster])

  // Función para reiniciar batalla
  const handleRestartBattle = () => {
    setPlayerHp(PLAYER_MAX_HP)
    setEnemyHp(selectedMonster?.hp || 100)
    gameLogic.setTurn('player')
    gameLogic.resetBattle()
  }

  return {
    // Estado de batalla
    playerHp,
    enemyHp,
    playerMaxHp: PLAYER_MAX_HP,
    enemyMaxHp: selectedMonster?.hp || 100,
    playerHpPercent,
    enemyHpPercent,
    nextEnemyAction,
    cooldowns,
    
    // Funciones de batalla
    handleOptionClick,
    getOptionClass,
    handleRestartBattle,
    predictNextEnemyAction,
    clearEnemyActionPrediction,
    
    // Funciones de cooldowns
    checkCooldown,
    getCooldownRemaining,
    COOLDOWN_CONFIG,
  }
}
