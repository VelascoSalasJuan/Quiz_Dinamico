import { useState, useEffect } from 'react'

// ========================================
// CÓDIGO ANTIGUO COMENTADO (RESPALDO)
// ========================================

/*
const PLAYER_MAX_HP = 100
const PLAYER_ATTACK_DAMAGE = 20
const PLAYER_HEAL_AMOUNT = 18

export function useBattleLogic(selectedMonster, gameLogic) {
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP)
  const [enemyHp, setEnemyHp] = useState(selectedMonster ? selectedMonster.hp : 100)
  const [nextEnemyAction, setNextEnemyAction] = useState(null)
  const [displayEnemyAction, setDisplayEnemyAction] = useState(null)
  
  // Estado de cooldowns para las habilidades
  const [cooldowns, setCooldowns] = useState({
    strong: 0,    // Ataque fuerte: 2 turnos
    dodge: 0,     // Esquivar: 3 turnos
    heal: 0       // Curar: 3 turnos
  })

  // Estado de cooldowns del enemigo
  const [enemyCooldowns, setEnemyCooldowns] = useState({
    strong: 0,    // Ataque fuerte: 2 turnos
    dodge: 0,     // Esquivar: 3 turnos
    heal: 0       // Curar: 3 turnos
  })

  // Estado para mostrar acciones seleccionadas en combate
  const [battleActions, setBattleActions] = useState({
    playerAction: null,
    enemyAction: null,
    showActions: false,
    executingActions: false,
    playerFailed: false
  })

  // Estado para controlar cuándo mostrar la acción del enemigo
  const [showEnemyAction, setShowEnemyAction] = useState(false)

  const playerHpPercent = (playerHp / PLAYER_MAX_HP) * 100
  const enemyHpPercent = (enemyHp / (selectedMonster?.hp || 100)) * 100

  // Función para predecir la próxima acción del enemigo (solo una vez)
  const predictNextEnemyAction = () => {
    // Solo generar nueva acción si no hay una ya predicha
    if (nextEnemyAction) {
      return nextEnemyAction
    }
    
    console.log('🔍 Debug - Cooldowns del enemigo:', enemyCooldowns)
    
    // Filtrar acciones disponibles (sin cooldown)
    const availableActions = ['attack', 'strong', 'heal'].filter(action => {
      if (action === 'attack') return true // ataque normal sin cooldown
      const isOnCooldown = checkEnemyCooldown(action)
      console.log(`🔍 Debug - Acción ${action}: cooldown=${isOnCooldown}`)
      return !isOnCooldown
    })
    
    console.log('🔍 Debug - Acciones disponibles:', availableActions)
    
    // Si solo está disponible attack, usar attack
    if (availableActions.length === 1 && availableActions[0] === 'attack') {
      console.log('🔍 Debug - Solo attack disponible')
      setNextEnemyAction('attack')
      return 'attack'
    }
    
    // Sistema simple: random 1-4
    const randomChoice = Math.floor(Math.random() * 4) + 1 // 1, 2, 3, o 4
    let predictedAction = 'attack' // por defecto
    
    console.log('🔍 Debug - Random 1-4:', randomChoice)
    
    if (randomChoice === 1) {
      predictedAction = 'attack'
    } else if (randomChoice === 2) {
      predictedAction = 'strong'
    } else if (randomChoice === 3) {
      predictedAction = 'heal'
    } else if (randomChoice === 4) {
      predictedAction = 'attack' // 4 = attack también
    }
    
    // Si la acción elegida está en cooldown, usar attack
    if (predictedAction !== 'attack' && checkEnemyCooldown(predictedAction)) {
      console.log('🔍 Debug - Acción en cooldown, usando attack')
      predictedAction = 'attack'
    }
    
    console.log('🔍 Debug - Acción predicha:', predictedAction)
    setNextEnemyAction(predictedAction)
    return predictedAction
  }

  // Función para generar acción aleatoria del enemigo (usada cada turno)
  const generateRandomEnemyAction = () => {
    const randomChoice = Math.floor(Math.random() * 4) + 1 // 1, 2, 3, o 4
    let action = 'attack'
    
    console.log('🎲 Random 1-4 (turno enemigo):', randomChoice)
    
    if (randomChoice === 1) {
      action = 'attack'
    } else if (randomChoice === 2) {
      action = 'strong'
    } else if (randomChoice === 3) {
      action = 'heal'
    } else if (randomChoice === 4) {
      action = 'dodge'
    }
    
    // Si la acción está en cooldown, usar attack
    if (action !== 'attack' && checkEnemyCooldown(action)) {
      console.log(`🎲 Acción ${action} en cooldown, usando attack`)
      action = 'attack'
    }
    
    console.log('🎲 Acción final del enemigo:', action)
    return action
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

  // Funciones para cooldowns del enemigo
  const checkEnemyCooldown = (action) => {
    return enemyCooldowns[action] > 0
  }

  const getEnemyCooldownRemaining = (action) => {
    return enemyCooldowns[action] || 0
  }

  const reduceEnemyCooldowns = () => {
    setEnemyCooldowns(prev => ({
      strong: Math.max(0, prev.strong - 1),
      dodge: Math.max(0, prev.dodge - 1),
      heal: Math.max(0, prev.heal - 1)
    }))
  }

  const setEnemyCooldown = (action, turns) => {
    setEnemyCooldowns(prev => ({
      ...prev,
      [action]: turns
    }))
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
        // Esquivar: con cooldown, prepara esquiva por 1 turno
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

  // Función para manejar el clic en una opción - Sistema simple de turnos
  const handleOptionClick = (option) => {
    console.log('🔍 handleOptionClick llamado', { option, selectedAction: gameLogic.selectedAction, isPlayerTurn: gameLogic.isPlayerTurn })
    
    if (!gameLogic.isPlayerTurn || gameLogic.isGameFinished) {
      console.log('❌ No es turno del jugador o juego terminado')
      return
    }
    
    if (!gameLogic.selectedAction) {
      console.log('❌ No hay acción seleccionada')
      return
    }
    
    gameLogic.setSelectedOption(option)
    const isCorrect = option === gameLogic.currentQuestion?.correctAnswer
    console.log('✅ Respuesta evaluada', { option, isCorrect, correctAnswer: gameLogic.currentQuestion?.correctAnswer })
    
    // Sistema simple: Turno del jugador
    if (isCorrect) {
      // Respuesta correcta: mostrar acciones y ejecutar acción del jugador
      const enemyAction = generateRandomEnemyAction()
      setBattleActions({
        playerAction: gameLogic.selectedAction,
        enemyAction: enemyAction,
        showActions: true,
        executingActions: false,
        playerFailed: false
      })
      
      executePlayerAction(gameLogic.selectedAction)
      
      // Turno del enemigo
      setTimeout(() => {
        setBattleActions(prev => ({ ...prev, executingActions: true }))
        executeEnemyTurn()
      }, 1500)
    } else {
      // Respuesta incorrecta: mostrar acciones y ejecutar castigo
      // Cuando fallas, el enemigo solo puede usar attack (golpe normal)
      const enemyAction = 'attack'
      setBattleActions({
        playerAction: gameLogic.selectedAction,
        enemyAction: enemyAction,
        showActions: true,
        executingActions: false,
        playerFailed: true
      })
      
      gameLogic.setFeedbackMessage('Fallaste la pregunta. Tu accion fallo.')
      
      // Turno del enemigo (castigo - solo attack)
      setTimeout(() => {
        setBattleActions(prev => ({ ...prev, executingActions: true }))
        executeEnemyPunishment()
      }, 1500)
    }
  }

  // Función para ejecutar acción del jugador - Sistema simple
  const executePlayerAction = (action) => {
    console.log('🎯 Ejecutando acción del jugador:', action)
    
    let battleEnded = false
    
    switch (action) {
      case 'attack':
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
        if (!checkCooldown('heal')) {
          const healAmount = PLAYER_HEAL_AMOUNT
          const newPlayerHp = Math.min(PLAYER_MAX_HP, playerHp + healAmount)
          setPlayerHp(newPlayerHp)
          setCooldown('heal', COOLDOWN_CONFIG.heal)
          gameLogic.setFeedbackMessage(`Te curaste y recuperaste ${healAmount} de vida.`)
        }
        break
        
      case 'dodge':
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

  // Función para ejecutar turno del enemigo - Sistema simple
  const executeEnemyTurn = () => {
    console.log('👹 Ejecutando turno del enemigo')
    
    // Generar acción aleatoria
    const enemyAction = generateRandomEnemyAction()
    console.log('🎲 Acción del enemigo:', enemyAction)
    
    // Verificar si el jugador está esquivando
    if (gameLogic.dodgeReady && (enemyAction === 'attack' || enemyAction === 'strong')) {
      console.log('🛡️ Jugador esquivó el ataque del enemigo')
      gameLogic.setFeedbackMessage('Esquivaste el ataque del monstruo.')
      gameLogic.setDodgeReady(false)
      
      // Pasar al siguiente turno
      proceedToNextTurn()
      return
    }
    
    // Ejecutar acción del enemigo
    let battleEnded = false
    
    switch (enemyAction) {
      case 'attack':
        const damage = selectedMonster.attack
        const nextPlayerHp = Math.max(0, playerHp - damage)
        setPlayerHp(nextPlayerHp)
        gameLogic.setFeedbackMessage(`El monstruo atacó e hizo ${damage} de daño.`)
        if (nextPlayerHp <= 0) {
          gameLogic.setTurn('finished')
          gameLogic.setFeedbackMessage('Perdiste la batalla.')
          battleEnded = true
        }
        break
        
      case 'strong':
        if (!checkEnemyCooldown('strong')) {
          const strongDamage = Math.floor(selectedMonster.attack * 1.5)
          const strongNextPlayerHp = Math.max(0, playerHp - strongDamage)
          setPlayerHp(strongNextPlayerHp)
          setEnemyCooldown('strong', COOLDOWN_CONFIG.strong)
          gameLogic.setFeedbackMessage(`¡El monstruo usó ataque fuerte e hizo ${strongDamage} de daño!`)
          if (strongNextPlayerHp <= 0) {
            gameLogic.setTurn('finished')
            gameLogic.setFeedbackMessage('Perdiste la batalla.')
            battleEnded = true
          }
        }
        break
        
      case 'heal':
        if (!checkEnemyCooldown('heal')) {
          const healAmount = Math.floor(selectedMonster.hp * 0.3)
          const newEnemyHp = Math.min(selectedMonster.hp, enemyHp + healAmount)
          setEnemyHp(newEnemyHp)
          setEnemyCooldown('heal', COOLDOWN_CONFIG.heal)
          gameLogic.setFeedbackMessage(`El monstruo se curó y recuperó ${healAmount} de vida.`)
        }
        break
        
      case 'dodge':
        if (!checkEnemyCooldown('dodge')) {
          gameLogic.setDodgeReady(true)
          setEnemyCooldown('dodge', COOLDOWN_CONFIG.dodge)
          gameLogic.setFeedbackMessage('El monstruo se prepara para esquivar.')
        }
        break
    }
    
    // Pasar al siguiente turno
    if (!battleEnded) {
      setTimeout(() => {
        proceedToNextTurn()
      }, 1500)
    }
  }

  // Función para ejecutar castigo del enemigo - Solo ataque normal
  const executeEnemyPunishment = () => {
    console.log('👹 Ejecutando castigo del enemigo (solo attack)')
    
    // Verificar si el jugador está esquivando
    if (gameLogic.dodgeReady) {
      console.log('🛡️ Jugador esquivó el ataque del enemigo')
      gameLogic.setFeedbackMessage('Esquivaste el ataque del monstruo.')
      gameLogic.setDodgeReady(false)
      
      // Pasar al siguiente turno
      proceedToNextTurn()
      return
    }
    
    // Ejecutar ataque normal del enemigo
    const damage = selectedMonster.attack
    const nextPlayerHp = Math.max(0, playerHp - damage)
    setPlayerHp(nextPlayerHp)
    gameLogic.setFeedbackMessage(`El monstruo atacó e hizo ${damage} de daño.`)
    
    if (nextPlayerHp <= 0) {
      gameLogic.setTurn('finished')
      gameLogic.setFeedbackMessage('Perdiste la batalla.')
    } else {
      // Pasar al siguiente turno
      setTimeout(() => {
        proceedToNextTurn()
      }, 1500)
    }
  }

  // Función para ejecutar acciones de castigo (jugador falla, enemigo ataca)
  const executePunishmentActions = (playerAction, enemyAction) => {
    console.log('💀 Ejecutando castigo', { playerAction, enemyAction })
    
    setBattleActions(prev => ({ ...prev, executingActions: true }))
    gameLogic.setFeedbackMessage('💀 Tu accion fallo...')
    
    // Jugador falla - no hace nada
    gameLogic.setFeedbackMessage('Tu accion fallo completamente.')
    
    // Enemigo ataca después
    setTimeout(() => {
      gameLogic.setFeedbackMessage('El enemigo te ataca mientras estas vulnerable.')
      const battleEnded = applyEnemyAction(enemyAction)
      
      if (battleEnded) {
        setTimeout(() => {
          resetBattleState()
        }, 1500)
      } else {
        setTimeout(() => {
          proceedToNextTurn()
        }, 1500)
      }
    }, 1000)
  }

  // Función para aplicar acción del enemigo
  const applyEnemyAction = (action) => {
    let battleEnded = false
    
    console.log('🎲 applyEnemyAction usando acción:', action)
    
    // Nueva lógica de dodge: verificar si el jugador está esquivando
    if (gameLogic.dodgeReady) {
      console.log('🛡️ Jugador esquivó el ataque del enemigo')
      gameLogic.setFeedbackMessage('Esquivaste el ataque del monstruo.')
      gameLogic.setDodgeReady(false)
      return battleEnded // No ejecutar la acción del enemigo
    }
    
    switch (action) {
      case 'attack':
        const damage = selectedMonster.attack
        const nextPlayerHp = Math.max(0, playerHp - damage)
        setPlayerHp(nextPlayerHp)
        gameLogic.setFeedbackMessage(`El monstruo atacó e hizo ${damage} de daño.`)
        if (nextPlayerHp <= 0) {
          gameLogic.setTurn('finished')
          gameLogic.setFeedbackMessage('Perdiste la batalla.')
          battleEnded = true
        }
        break
        
      case 'strong':
        if (!checkEnemyCooldown('strong')) {
          const strongDamage = Math.floor(selectedMonster.attack * 1.5)
          const strongNextPlayerHp = Math.max(0, playerHp - strongDamage)
          setPlayerHp(strongNextPlayerHp)
          setEnemyCooldown('strong', COOLDOWN_CONFIG.strong)
          gameLogic.setFeedbackMessage(`¡El monstruo usó ataque fuerte e hizo ${strongDamage} de daño!`)
          if (strongNextPlayerHp <= 0) {
            gameLogic.setTurn('finished')
            gameLogic.setFeedbackMessage('Perdiste la batalla.')
            battleEnded = true
          }
        }
        break
        
      case 'heal':
        if (!checkEnemyCooldown('heal')) {
          const healAmount = Math.floor(selectedMonster.hp * 0.3)
          const newEnemyHp = Math.min(selectedMonster.hp, enemyHp + healAmount)
          setEnemyHp(newEnemyHp)
          setEnemyCooldown('heal', COOLDOWN_CONFIG.heal)
          gameLogic.setFeedbackMessage(`El monstruo se curó y recuperó ${healAmount} de vida.`)
        }
        break
        
      case 'dodge':
        if (!checkEnemyCooldown('dodge')) {
          gameLogic.setDodgeReady(true)
          setEnemyCooldown('dodge', COOLDOWN_CONFIG.dodge)
          gameLogic.setFeedbackMessage('El monstruo se prepara para esquivar.')
        }
        break
    }
    
    return battleEnded
  }

  // Función para resetear el estado de batalla
  const resetBattleState = () => {
    setBattleActions({
      playerAction: null,
      enemyAction: null,
      showActions: false,
      executingActions: false,
      playerFailed: false
    })
    setShowEnemyAction(false)
    setDisplayEnemyAction(null)
    gameLogic.setSelectedOption(null)
    gameLogic.setSelectedAction(null)
  }

  // Función para proceder al siguiente turno
  const proceedToNextTurn = () => {
    // Reducir cooldowns
    reduceCooldowns()
    reduceEnemyCooldowns()
    console.log('🔄 Cooldowns reducidos', { player: cooldowns, enemy: enemyCooldowns })
    
    // Resetear dodgeReady si no se usó en este turno
    if (gameLogic.dodgeReady) {
      console.log('🛡️ DodgeReady no se usó, reseteando')
      gameLogic.setDodgeReady(false)
    }
    
    // Resetear estado de batalla
    resetBattleState()
    
    // Cambiar turno
    gameLogic.advanceTimeline()
    gameLogic.setTurn('player')
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

      // Generar nueva acción aleatoria para este turno
      const enemyAction = generateRandomEnemyAction()
      console.log('🎲 Acción del enemigo ejecutada (nueva)', { enemyAction })
      
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
      
      // Reducir cooldowns del enemigo al final de su turno
      reduceEnemyCooldowns()
      console.log('🔄 Cooldowns del enemigo reducidos', enemyCooldowns)

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
    displayEnemyAction,
    cooldowns,
    enemyCooldowns,
    battleActions,
    showEnemyAction,
    
    // Funciones de batalla
    handleOptionClick,
    getOptionClass,
    handleRestartBattle,
    predictNextEnemyAction,
    clearEnemyActionPrediction,
    
    // Funciones de cooldowns
    checkCooldown,
    getCooldownRemaining,
    checkEnemyCooldown,
    getEnemyCooldownRemaining,
    COOLDOWN_CONFIG,
  }
*/

// ========================================
// ESPACIO PARA NUEVA IMPLEMENTACIÓN
// ========================================

// Aquí crearemos la nueva lógica paso a paso
// Empezaremos desde lo más básico

export function useBattleLogic(selectedMonster, gameLogic) {
  // Estados básicos
  const [playerHp, setPlayerHp] = useState(100)
  const [enemyHp, setEnemyHp] = useState(selectedMonster ? selectedMonster.hp : 100)
  
  // Estado para mostrar acciones seleccionadas
  const [battleActions, setBattleActions] = useState({
    playerAction: null,
    enemyAction: null,
    showActions: false,
    executingActions: false,
    playerFailed: false
  })
  
  // Estado de cooldowns del jugador
  const [cooldowns, setCooldowns] = useState({
    strong: 0,
    dodge: 0,
    heal: 0
  })
  
  // Estado de cooldowns del enemigo
  const [enemyCooldowns, setEnemyCooldowns] = useState({
    strong: 0,
    dodge: 0,
    heal: 0
  })
  
  // Constantes de daño
  const ATTACK_DAMAGE = 10
  const STRONG_DAMAGE = 20
  const STRONG_COOLDOWN = 2
  const DODGE_COOLDOWN = 3
  const HEAL_AMOUNT = 25
  const HEAL_COOLDOWN = 4
  
  // Estado de dodge del enemigo
  const [enemyDodgeReady, setEnemyDodgeReady] = useState(false)
  
  // Función para procesar batalla (compara acciones y aplica efectos simultáneamente)
  const processBattle = (playerAction, enemyAction) => {
    console.log(`[COMPARACIÓN DE ACCIONES]`)
    console.log(`- Jugador: ${playerAction}`)
    console.log(`- Enemigo: ${enemyAction}`)
    console.log(``)
    
    let battleEnded = false
    let playerDamage = 0
    let enemyDamage = 0
    
    // Procesar acción del jugador
    if (playerAction === 'attack') {
      // Verificar si el enemigo está esquivando (dodge usado este turno)
      if (enemyAction === 'dodge') {
        console.log(`🛡️ Enemigo esquivó tu ataque`)
        gameLogic.setFeedbackMessage('El monstruo esquivó tu ataque.')
      } else {
        enemyDamage = ATTACK_DAMAGE
      }
    } else if (playerAction === 'strong') {
      // Verificar si el enemigo está esquivando (dodge usado este turno)
      if (enemyAction === 'dodge') {
        console.log(`🛡️ Enemigo esquivó tu ataque fuerte`)
        gameLogic.setFeedbackMessage('El monstruo esquivó tu ataque fuerte.')
        
        // El jugador igual pone su cooldown aunque no haga daño
        setCooldowns(prev => ({
          ...prev,
          strong: STRONG_COOLDOWN
        }))
        console.log(`⏱️ Strong en cooldown por ${STRONG_COOLDOWN} turnos`)
      } else {
        enemyDamage = STRONG_DAMAGE
        // Aplicar cooldown de strong
        setCooldowns(prev => ({
          ...prev,
          strong: STRONG_COOLDOWN
        }))
        console.log(`⏱️ Strong en cooldown por ${STRONG_COOLDOWN} turnos`)
      }
    } else if (playerAction === 'dodge') {
      // Dodge del jugador es activo inmediatamente para este turno
      setCooldowns(prev => ({
        ...prev,
        dodge: DODGE_COOLDOWN
      }))
      console.log(`🛡️ Jugador usa dodge: Activo para este turno`)
      console.log(`⏱️ Dodge en cooldown por ${DODGE_COOLDOWN} turnos`)
      gameLogic.setFeedbackMessage(`Te preparas para esquivar el ataque del enemigo.`)
    } else if (playerAction === 'heal') {
      // Heal del jugador
      setCooldowns(prev => ({
        ...prev,
        heal: HEAL_COOLDOWN
      }))
      console.log(`💚 Jugador usa heal: Activo para este turno`)
      console.log(`⏱️ Heal en cooldown por ${HEAL_COOLDOWN} turnos`)
      gameLogic.setFeedbackMessage(`Te curas ${HEAL_AMOUNT} puntos de vida.`)
    }
    
    // Procesar acción del enemigo
    if (enemyAction === 'attack') {
      // Verificar si el jugador está esquivando (dodge usado este turno)
      if (playerAction === 'dodge') {
        console.log(`🛡️ Jugador esquivó el ataque del enemigo`)
        gameLogic.setFeedbackMessage('Esquivaste el ataque del monstruo.')
      } else {
        playerDamage = ATTACK_DAMAGE
      }
    } else if (enemyAction === 'strong') {
      // Verificar si el jugador está esquivando (dodge usado este turno)
      if (playerAction === 'dodge') {
        console.log(`🛡️ Jugador esquivó el ataque fuerte del enemigo`)
        gameLogic.setFeedbackMessage('Esquivaste el ataque fuerte del monstruo.')
        
        // El enemigo igual pone su cooldown aunque no haga daño
        setEnemyCooldowns(prev => ({
          ...prev,
          strong: STRONG_COOLDOWN
        }))
        console.log(`⏱️ Strong enemigo en cooldown por ${STRONG_COOLDOWN} turnos`)
      } else {
        playerDamage = STRONG_DAMAGE
        // Aplicar cooldown de strong del enemigo
        setEnemyCooldowns(prev => ({
          ...prev,
          strong: STRONG_COOLDOWN
        }))
        console.log(`⏱️ Strong enemigo en cooldown por ${STRONG_COOLDOWN} turnos`)
      }
    } else if (enemyAction === 'dodge') {
      // Dodge del enemigo es activo inmediatamente para este turno
      setEnemyCooldowns(prev => ({
        ...prev,
        dodge: DODGE_COOLDOWN
      }))
      console.log(`🛡️ Enemigo usa dodge: Activo para este turno`)
      console.log(`⏱️ Dodge enemigo en cooldown por ${DODGE_COOLDOWN} turnos`)
      gameLogic.setFeedbackMessage(`El monstruo se prepara para esquivar tu ataque.`)
    } else if (enemyAction === 'heal') {
      // Heal del enemigo
      setEnemyCooldowns(prev => ({
        ...prev,
        heal: HEAL_COOLDOWN
      }))
      console.log(`💚 Enemigo usa heal: Activo para este turno`)
      console.log(`⏱️ Heal enemigo en cooldown por ${HEAL_COOLDOWN} turnos`)
      gameLogic.setFeedbackMessage(`El monstruo se cura ${HEAL_AMOUNT} puntos de vida.`)
    }
    
    // Aplicar daño a ambos simultáneamente
    console.log(`[APLICAR EFECTOS]`)
    
    // Aplicar efectos al enemigo
    if (enemyDamage > 0) {
      const newEnemyHp = Math.max(0, enemyHp - enemyDamage)
      setEnemyHp(newEnemyHp)
      
      if (playerAction === 'attack') {
        console.log(`⚔️ Jugador ataca: -${enemyDamage} HP (Enemigo: ${newEnemyHp}/100)`)
        gameLogic.setFeedbackMessage(`Atacaste e hiciste ${enemyDamage} de daño.`)
      } else if (playerAction === 'strong') {
        console.log(`💥 Jugador usa ataque fuerte: -${enemyDamage} HP (Enemigo: ${newEnemyHp}/100)`)
        gameLogic.setFeedbackMessage(`Usaste ataque fuerte e hiciste ${enemyDamage} de daño.`)
      }
      
      if (newEnemyHp <= 0) {
        gameLogic.setTurn('finished')
        gameLogic.setFeedbackMessage('¡Ganaste la batalla!')
        battleEnded = true
      }
    }
    
    // Aplicar efectos al jugador
    if (playerDamage > 0 && !battleEnded) {
      const newPlayerHp = Math.max(0, playerHp - playerDamage)
      setPlayerHp(newPlayerHp)
      
      if (enemyAction === 'attack') {
        console.log(`👹 Enemigo ataca: -${playerDamage} HP (Jugador: ${newPlayerHp}/100)`)
        gameLogic.setFeedbackMessage(`El monstruo atacó e hizo ${playerDamage} de daño.`)
      } else if (enemyAction === 'strong') {
        console.log(`👹 Enemigo usa ataque fuerte: -${playerDamage} HP (Jugador: ${newPlayerHp}/100)`)
        gameLogic.setFeedbackMessage(`¡El monstruo usó ataque fuerte e hizo ${playerDamage} de daño!`)
      }
      
      if (newPlayerHp <= 0) {
        gameLogic.setTurn('finished')
        gameLogic.setFeedbackMessage('Perdiste la batalla.')
        battleEnded = true
      }
    }
    
    // Aplicar curación al jugador
    if (playerAction === 'heal' && !battleEnded) {
      const newPlayerHp = Math.min(100, playerHp + HEAL_AMOUNT)
      setPlayerHp(newPlayerHp)
      console.log(`💚 Jugador se cura: +${HEAL_AMOUNT} HP (Jugador: ${newPlayerHp}/100)`)
      gameLogic.setFeedbackMessage(`Te curaste ${HEAL_AMOUNT} puntos de vida.`)
    }
    
    // Aplicar curación al enemigo
    if (enemyAction === 'heal' && !battleEnded) {
      // Calcular curación basada en el HP ANTES del daño
      const enemyHpBeforeDamage = enemyHp - enemyDamage
      const newEnemyHp = Math.min(selectedMonster?.hp || 100, enemyHpBeforeDamage + HEAL_AMOUNT)
      setEnemyHp(newEnemyHp)
      console.log(`💚 Enemigo se cura: +${HEAL_AMOUNT} HP (Enemigo: ${newEnemyHp}/${selectedMonster?.hp || 100})`)
      gameLogic.setFeedbackMessage(`El monstruo se curó ${HEAL_AMOUNT} puntos de vida.`)
    }
    
    return battleEnded
  }
  
  // Función para ejecutar ataque fuerte del jugador
  const executePlayerStrong = () => {
    const newEnemyHp = Math.max(0, enemyHp - STRONG_DAMAGE)
    setEnemyHp(newEnemyHp)
    
    // Establecer cooldown
    setCooldowns(prev => ({
      ...prev,
      strong: STRONG_COOLDOWN
    }))
    
    console.log(`💥 Jugador usa ataque fuerte: -${STRONG_DAMAGE} HP (Enemigo: ${newEnemyHp}/100)`)
    console.log(`⏱️ Strong en cooldown por ${STRONG_COOLDOWN} turnos`)
    gameLogic.setFeedbackMessage(`Usaste ataque fuerte e hiciste ${STRONG_DAMAGE} de daño.`)
    
    if (newEnemyHp <= 0) {
      gameLogic.setTurn('finished')
      gameLogic.setFeedbackMessage('¡Ganaste la batalla con un ataque fuerte!')
      return true // Batalla terminada
    }
    
    return false // Batalla continúa
  }
  
    
  // Función para ejecutar ataque básico del enemigo
  const executeEnemyAttack = () => {
    const newPlayerHp = Math.max(0, playerHp - ATTACK_DAMAGE)
    setPlayerHp(newPlayerHp)
    
    console.log(`👹 Enemigo ataca: -${ATTACK_DAMAGE} HP (Jugador: ${newPlayerHp}/100)`)
    gameLogic.setFeedbackMessage(`El monstruo atacó e hizo ${ATTACK_DAMAGE} de daño.`)
    
    if (newPlayerHp <= 0) {
      gameLogic.setTurn('finished')
      gameLogic.setFeedbackMessage('Perdiste la batalla.')
      return true // Batalla terminada
    }
    
    return false // Batalla continúa
  }
  
  // Función para ejecutar ataque fuerte del enemigo
  const executeEnemyStrong = () => {
    const newPlayerHp = Math.max(0, playerHp - STRONG_DAMAGE)
    setPlayerHp(newPlayerHp)
    
    // Establecer cooldown del enemigo
    setEnemyCooldowns(prev => ({
      ...prev,
      strong: STRONG_COOLDOWN
    }))
    
    console.log(`👹 Enemigo usa ataque fuerte: -${STRONG_DAMAGE} HP (Jugador: ${newPlayerHp}/100)`)
    console.log(`⏱️ Strong enemigo en cooldown por ${STRONG_COOLDOWN} turnos`)
    gameLogic.setFeedbackMessage(`¡El monstruo usó ataque fuerte e hizo ${STRONG_DAMAGE} de daño!`)
    
    if (newPlayerHp <= 0) {
      gameLogic.setTurn('finished')
      gameLogic.setFeedbackMessage('Perdiste la batalla.')
      return true // Batalla terminada
    }
    
    return false // Batalla continúa
  }
  
  // Función para generar acción aleatoria del enemigo
  const generateEnemyAction = () => {
    const randomChoice = Math.floor(Math.random() * 4) + 1 // 1, 2, 3 o 4
    console.log(`🎲 Random del enemigo: ${randomChoice}`)
    
    if (randomChoice === 1) {
      return 'attack'
    } else if (randomChoice === 2) {
      // Si strong está en cooldown, usar attack
      if (enemyCooldowns.strong > 0) {
        console.log(`💪 Strong en cooldown (${enemyCooldowns.strong}), usando attack`)
        return 'attack'
      }
      return 'strong'
    } else if (randomChoice === 3) {
      // Si dodge está en cooldown, usar attack
      if (enemyCooldowns.dodge > 0) {
        console.log(`🛡️ Dodge en cooldown (${enemyCooldowns.dodge}), usando attack`)
        return 'attack'
      }
      return 'dodge'
    } else if (randomChoice === 4) {
      // Si heal está en cooldown, usar attack
      if (enemyCooldowns.heal > 0) {
        console.log(`💚 Heal en cooldown (${enemyCooldowns.heal}), usando attack`)
        return 'attack'
      }
      return 'heal'
    }
    
    return 'attack' // fallback
  }
  
    
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
    
    // PERMITIR ATAQUE BÁSICO, FUERTE, DODGE Y HEAL
    if (gameLogic.selectedAction !== 'attack' && gameLogic.selectedAction !== 'strong' && gameLogic.selectedAction !== 'dodge' && gameLogic.selectedAction !== 'heal') {
      gameLogic.setFeedbackMessage('❌ Esta habilidad no está implementada aún. Usa ⚔️ Attack, 💥 Strong, 🛡️ Dodge o 💚 Heal.')
      return
    }
    
    // Verificar cooldown de strong
    if (gameLogic.selectedAction === 'strong' && cooldowns.strong > 0) {
      gameLogic.setFeedbackMessage(`⏱️ Ataque fuerte en cooldown: ${cooldowns.strong} turnos restantes.`)
      return
    }
    
    // Verificar cooldown de dodge
    if (gameLogic.selectedAction === 'dodge' && cooldowns.dodge > 0) {
      gameLogic.setFeedbackMessage(`⏱️ Dodge en cooldown: ${cooldowns.dodge} turnos restantes.`)
      return
    }
    
    // Verificar cooldown de heal
    if (gameLogic.selectedAction === 'heal' && cooldowns.heal > 0) {
      gameLogic.setFeedbackMessage(`⏱️ Heal en cooldown: ${cooldowns.heal} turnos restantes.`)
      return
    }
    
    // Evaluar respuesta
    gameLogic.setSelectedOption(option)
    const isCorrect = option === gameLogic.currentQuestion?.correctAnswer
    
    // Generar acción del enemigo SOLO si respuesta es correcta
    let enemyAction
    if (isCorrect) {
      enemyAction = generateEnemyAction()
    } else {
      enemyAction = 'attack' // Siempre attack como castigo
    }
    
    // Mostrar acciones seleccionadas
    setBattleActions({
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
        setBattleActions(prev => ({ ...prev, executingActions: true }))
        
        // Procesar batalla: compara acciones y aplica efectos
        battleEnded = processBattle(gameLogic.selectedAction, enemyAction)
        
        // Resetear para siguiente turno después de procesar
        setTimeout(() => {
          setBattleActions({
            playerAction: null,
            enemyAction: null,
            showActions: false,
            executingActions: false,
            playerFailed: false
          })
          
          // Reducir cooldowns
          setCooldowns(prev => ({
            strong: Math.max(0, prev.strong - 1),
            dodge: Math.max(0, prev.dodge - 1),
            heal: Math.max(0, prev.heal - 1)
          }))
          
          setEnemyCooldowns(prev => ({
            strong: Math.max(0, prev.strong - 1),
            dodge: Math.max(0, prev.dodge - 1),
            heal: Math.max(0, prev.heal - 1)
          }))
          
          gameLogic.advanceTimeline()
          gameLogic.setTurn('player')
          gameLogic.setSelectedOption(null)
          gameLogic.setSelectedAction(null)
          
          // Separador visual para final del turno
          console.log('======================')
        }, 1500)
      }, 1000)
    } else {
      // Respuesta incorrecta: solo ataque normal del enemigo (castigo)
      gameLogic.setFeedbackMessage('Fallaste la pregunta. Tu acción falló.')
      
      setTimeout(() => {
        setBattleActions(prev => ({ ...prev, executingActions: true }))
        executeEnemyAttack() // Siempre ataque normal
        
        // Resetear para siguiente turno
        setTimeout(() => {
          setBattleActions({
            playerAction: null,
            enemyAction: null,
            showActions: false,
            executingActions: false,
            playerFailed: false
          })
          
          // Reducir cooldowns
          setCooldowns(prev => ({
            strong: Math.max(0, prev.strong - 1),
            dodge: Math.max(0, prev.dodge - 1),
            heal: Math.max(0, prev.heal - 1)
          }))
          
          setEnemyCooldowns(prev => ({
            strong: Math.max(0, prev.strong - 1),
            dodge: Math.max(0, prev.dodge - 1),
            heal: Math.max(0, prev.heal - 1)
          }))
          
          gameLogic.advanceTimeline()
          gameLogic.setTurn('player')
          gameLogic.setSelectedOption(null)
          gameLogic.setSelectedAction(null)
          
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
    setPlayerHp(100)
    setEnemyHp(selectedMonster?.hp || 100)
    setBattleActions({
      playerAction: null,
      enemyAction: null,
      showActions: false,
      executingActions: false,
      playerFailed: false
    })
    setCooldowns({ strong: 0, dodge: 0, heal: 0 })
    setEnemyCooldowns({ strong: 0, dodge: 0, heal: 0 })
    setEnemyDodgeReady(false)
    gameLogic.setDodgeReady(false)
    gameLogic.setTurn('player')
    gameLogic.resetBattle()
  }
  
  const predictNextEnemyAction = () => 'attack'
  const clearEnemyActionPrediction = () => {}
  const checkEnemyCooldown = () => false
  const getEnemyCooldownRemaining = () => 0
  
  // Funciones de cooldown del jugador
  const checkCooldown = (action) => cooldowns[action] > 0
  const getCooldownRemaining = (action) => cooldowns[action] || 0
  
  return {
    // Estado básico
    playerHp,
    enemyHp,
    playerMaxHp: 100,
    enemyMaxHp: selectedMonster?.hp || 100,
    playerHpPercent: (playerHp / 100) * 100,
    enemyHpPercent: (enemyHp / (selectedMonster?.hp || 100)) * 100,
    nextEnemyAction: null,
    displayEnemyAction: null,
    cooldowns: cooldowns,
    enemyCooldowns: { strong: 0, dodge: 0, heal: 0 },
    battleActions: {
      playerAction: null,
      enemyAction: null,
      showActions: false,
      executingActions: false,
      playerFailed: false
    },
    showEnemyAction: false,
    
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
