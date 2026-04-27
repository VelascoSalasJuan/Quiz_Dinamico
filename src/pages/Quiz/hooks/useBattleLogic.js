import { useAbilitiesLogic } from './useAbilitiesLogic.js'
import { useEnemyAI } from './useEnemyAI.js'
import { useBattleState } from './useBattleState.js'

export function useBattleLogic(selectedMonster, gameLogic) {
  // Hooks especializados
  const abilities = useAbilitiesLogic()
  const enemyAI = useEnemyAI(abilities.enemyCooldowns)
  const battleState = useBattleState(selectedMonster)
  
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
        //setEnemyCooldowns(prev => ({
        //  ...prev,
        //  strong: STRONG_COOLDOWN
        //}))
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
        console.log(`⚔️ Jugador ataca: -${enemyDamage} HP (Enemigo: ${newEnemyHp}/${enemyMaxHp})`)
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
      const newEnemyHp = Math.min(100, enemyHpBeforeDamage + HEAL_AMOUNT)
      setEnemyHp(newEnemyHp)
      console.log(`💚 Enemigo se cura: +${HEAL_AMOUNT} HP (Enemigo: ${newEnemyHp}/100)`)
      gameLogic.setFeedbackMessage(`El monstruo se curó ${HEAL_AMOUNT} puntos de vida.`)
    }
    
    return battleEnded
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
