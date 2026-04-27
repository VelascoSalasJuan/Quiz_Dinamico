import { useState } from 'react'
import { ABILITIES } from './useAbilitiesLogic.js'

export function useBattleState(selectedMonster) {
  // Estados básicos de batalla
  const [playerHp, setPlayerHp] = useState(100)
  const [enemyHp, setEnemyHp] = useState(100) // Todos los monstruos ahora tienen 100 HP
  
  // Estado para mostrar acciones seleccionadas
  const [battleActions, setBattleActions] = useState({
    playerAction: null,
    enemyAction: null,
    showActions: false,
    executingActions: false,
    playerFailed: false
  })

  // Estado de dodge del enemigo
  const [enemyDodgeReady, setEnemyDodgeReady] = useState(false)
  
  // Estados para indicadores visuales de daño/curación
  const [playerDamageIndicator, setPlayerDamageIndicator] = useState(null)
  const [enemyDamageIndicator, setEnemyDamageIndicator] = useState(null)

  // Calcular porcentajes de vida
  const playerHpPercent = (playerHp / 100) * 100
  const enemyHpPercent = (enemyHp / 100) * 100 // Ambos tienen 100 HP base

  // Procesar batalla (compara acciones y aplica efectos simultáneamente)
  const processBattle = (playerAction, enemyAction, cooldowns, enemyCooldowns, gameLogic) => {
    console.log(`[COMPARACIÓN DE ACCIONES]`)
    console.log(`- Jugador: ${playerAction}`)
    console.log(`- Enemigo: ${enemyAction}`)
    console.log(``)
    
    let playerDamage = 0
    let enemyDamage = 0
    let battleEnded = false

    // Procesar acción del jugador
    if (playerAction === 'attack') {
      enemyDamage = ABILITIES.ATTACK.damage
      console.log(`⚔️ Jugador ataca: -${enemyDamage} HP`)
    } else if (playerAction === 'strong') {
      enemyDamage = ABILITIES.STRONG.damage
      console.log(`⏱️ Strong en cooldown por ${ABILITIES.STRONG.cooldown} turnos`)
      console.log(`💥 Jugador usa ataque fuerte: -${enemyDamage} HP`)
    } else if (playerAction === 'dodge') {
      console.log(`🛡️ Jugador usa dodge: Activo para este turno`)
      console.log(`⏱️ Dodge en cooldown por ${ABILITIES.DODGE.cooldown} turnos`)
      gameLogic.setFeedbackMessage(`Te preparas para esquivar el próximo ataque.`)
    } else if (playerAction === 'heal') {
      console.log(`💚 Jugador usa heal: Activo para este turno`)
      console.log(`⏱️ Heal en cooldown por ${ABILITIES.HEAL.cooldown} turnos`)
      gameLogic.setFeedbackMessage(`Te curas ${Math.abs(ABILITIES.HEAL.damage)} puntos de vida.`)
    }

    // Procesar acción del enemigo
    if (enemyAction === 'attack') {
      playerDamage = ABILITIES.ATTACK.damage
      console.log(`👹 Enemigo ataca: -${playerDamage} HP (Jugador: ${Math.max(0, playerHp - playerDamage)}/100)`)
      gameLogic.setFeedbackMessage(`El monstruo atacó e hizo ${playerDamage} de daño.`)
    } else if (enemyAction === 'strong') {
      playerDamage = ABILITIES.STRONG.damage
      console.log(`👹 Enemigo usa ataque fuerte: -${playerDamage} HP (Jugador: ${Math.max(0, playerHp - playerDamage)}/100)`)
      gameLogic.setFeedbackMessage(`¡El monstruo usó ataque fuerte e hizo ${playerDamage} de daño!`)
    } else if (enemyAction === 'dodge') {
      console.log(`🛡️ Enemigo usa dodge: Activo para este turno`)
      console.log(`⏱️ Dodge enemigo en cooldown por ${ABILITIES.DODGE.cooldown} turnos`)
      gameLogic.setFeedbackMessage(`El monstruo se prepara para esquivar.`)
    } else if (enemyAction === 'heal') {
      console.log(`💚 Enemigo usa heal: Activo para este turno`)
      console.log(`⏱️ Heal enemigo en cooldown por ${ABILITIES.HEAL.cooldown} turnos`)
      gameLogic.setFeedbackMessage(`El monstruo se curó ${Math.abs(ABILITIES.HEAL.damage)} puntos de vida.`)
    }

    console.log(``)
    console.log(`[APLICAR EFECTOS]`)

    // Aplicar daño al enemigo (si no esquiva)
    if (enemyAction !== 'dodge' && enemyDamage > 0) {
      const newEnemyHp = Math.max(0, enemyHp - enemyDamage)
      setEnemyHp(newEnemyHp)
      
      // Mostrar indicador de daño al enemigo
      setEnemyDamageIndicator(-enemyDamage)
      setTimeout(() => setEnemyDamageIndicator(null), 2000)
      
      console.log(`💥 Jugador usa ataque: -${enemyDamage} HP (Enemigo: ${newEnemyHp}/100)`)
      
      if (newEnemyHp <= 0) {
        gameLogic.setTurn('finished')
        gameLogic.setFeedbackMessage('¡Ganaste la batalla!')
        battleEnded = true
      }
    }

    // Aplicar daño al jugador (si no esquiva)
    if (playerAction !== 'dodge' && playerDamage > 0) {
      const newPlayerHp = Math.max(0, playerHp - playerDamage)
      setPlayerHp(newPlayerHp)
      
      // Mostrar indicador de daño al jugador
      setPlayerDamageIndicator(-playerDamage)
      setTimeout(() => setPlayerDamageIndicator(null), 2000)
      
      if (newPlayerHp <= 0) {
        gameLogic.setTurn('finished')
        gameLogic.setFeedbackMessage('Perdiste la batalla.')
        battleEnded = true
      }
    }

    // Aplicar curación al jugador
    if (playerAction === 'heal' && !battleEnded) {
      const healAmount = Math.abs(ABILITIES.HEAL.damage)
      const newPlayerHp = Math.min(100, playerHp + healAmount)
      setPlayerHp(newPlayerHp)
      
      // Mostrar indicador de curación al jugador
      setPlayerDamageIndicator(healAmount)
      setTimeout(() => setPlayerDamageIndicator(null), 2000)
      
      console.log(`💚 Jugador se cura: +${healAmount} HP (Jugador: ${newPlayerHp}/100)`)
      gameLogic.setFeedbackMessage(`Te curaste ${healAmount} puntos de vida.`)
    }

    // Aplicar curación al enemigo
    if (enemyAction === 'heal' && !battleEnded) {
      const healAmount = Math.abs(ABILITIES.HEAL.damage)
      // Calcular curación basada en el HP ANTES del daño
      const enemyHpBeforeDamage = enemyHp - enemyDamage
      const newEnemyHp = Math.min(100, enemyHpBeforeDamage + healAmount)
      setEnemyHp(newEnemyHp)
      
      // Mostrar indicador de curación al enemigo
      setEnemyDamageIndicator(healAmount)
      setTimeout(() => setEnemyDamageIndicator(null), 2000)
      
      console.log(`💚 Enemigo se cura: +${healAmount} HP (Enemigo: ${newEnemyHp}/100)`)
      gameLogic.setFeedbackMessage(`El monstruo se curó ${healAmount} puntos de vida.`)
    }

    return battleEnded
  }

  // Resetear estado de batalla
  const resetBattleState = () => {
    setPlayerHp(100)
    setEnemyHp(100) // Todos los monstruos tienen 100 HP
    setBattleActions({
      playerAction: null,
      enemyAction: null,
      showActions: false,
      executingActions: false,
      playerFailed: false
    })
    setEnemyDodgeReady(false)
    setPlayerDamageIndicator(null)
    setEnemyDamageIndicator(null)
  }

  // Resetear acciones de turno
  const resetTurnActions = () => {
    setBattleActions({
      playerAction: null,
      enemyAction: null,
      showActions: false,
      executingActions: false,
      playerFailed: false
    })
  }

  return {
    // Estado
    playerHp,
    enemyHp,
    playerHpPercent,
    enemyHpPercent,
    battleActions,
    enemyDodgeReady,
    
    // Funciones
    setPlayerHp,
    setEnemyHp,
    setBattleActions,
    setEnemyDodgeReady,
    processBattle,
    resetBattleState,
    resetTurnActions,
    
    // Constantes
    playerMaxHp: 100,
    enemyMaxHp: 100, // Todos los monstruos tienen 100 HP
    
    // Indicadores visuales
    playerDamageIndicator,
    enemyDamageIndicator
  }
}
