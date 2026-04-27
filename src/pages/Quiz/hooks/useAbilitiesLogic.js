import { useState } from 'react'

// Constantes de habilidades
export const ABILITIES = {
  ATTACK: { damage: 10, cooldown: 0, name: 'Attack', icon: '⚔️' },
  STRONG: { damage: 20, cooldown: 2, name: 'Strong', icon: '💥' },
  DODGE: { damage: 0, cooldown: 3, name: 'Dodge', icon: '🛡️' },
  HEAL: { damage: -25, cooldown: 4, name: 'Heal', icon: '💚' }
}

export function useAbilitiesLogic() {
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

  // Verificar si una habilidad está en cooldown
  const isOnCooldown = (ability, isEnemy = false) => {
    const cooldownsList = isEnemy ? enemyCooldowns : cooldowns
    return cooldownsList[ability] > 0
  }

  // Obtener cooldown restante
  const getCooldownRemaining = (ability, isEnemy = false) => {
    const cooldownsList = isEnemy ? enemyCooldowns : cooldowns
    return cooldownsList[ability] || 0
  }

  // Establecer cooldown
  const setCooldown = (ability, isEnemy = false) => {
    const cooldownValue = ABILITIES[ability.toUpperCase()].cooldown
    const setCooldownsFn = isEnemy ? setEnemyCooldowns : setCooldowns
    
    setCooldownsFn(prev => ({
      ...prev,
      [ability]: cooldownValue
    }))
  }

  // Reducir todos los cooldowns en 1
  const reduceCooldowns = (isEnemy = false) => {
    const setCooldownsFn = isEnemy ? setEnemyCooldowns : setCooldowns
    
    setCooldownsFn(prev => ({
      strong: Math.max(0, prev.strong - 1),
      dodge: Math.max(0, prev.dodge - 1),
      heal: Math.max(0, prev.heal - 1)
    }))
  }

  // Validar si se puede usar una habilidad
  const canUseAbility = (ability, isEnemy = false) => {
    // Validar que la habilidad exista
    if (!ABILITIES[ability.toUpperCase()]) {
      return { canUse: false, message: '❌ Esta habilidad no está implementada aún.' }
    }

    // Validar cooldown
    if (isOnCooldown(ability, isEnemy)) {
      const remaining = getCooldownRemaining(ability, isEnemy)
      return { canUse: false, message: `⏱️ ${ABILITIES[ability.toUpperCase()].name} en cooldown: ${remaining} turnos restantes.` }
    }

    return { canUse: true, message: '' }
  }

  // Obtener mensaje de cooldown
  const getCooldownMessage = (ability, isEnemy = false) => {
    if (!isOnCooldown(ability, isEnemy)) return ''
    
    const remaining = getCooldownRemaining(ability, isEnemy)
    const abilityName = ABILITIES[ability.toUpperCase()].name
    return `⏱️ ${abilityName} en cooldown: ${remaining} turnos restantes.`
  }

  // Resetear cooldowns
  const resetCooldowns = (isEnemy = false) => {
    const setCooldownsFn = isEnemy ? setEnemyCooldowns : setCooldowns
    setCooldownsFn({ strong: 0, dodge: 0, heal: 0 })
  }

  return {
    // Estado
    cooldowns,
    enemyCooldowns,
    
    // Funciones
    isOnCooldown,
    getCooldownRemaining,
    setCooldown,
    reduceCooldowns,
    canUseAbility,
    getCooldownMessage,
    resetCooldowns,
    
    // Constantes
    ABILITIES
  }
}
