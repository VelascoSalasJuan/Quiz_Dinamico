import { ABILITIES } from './useAbilitiesLogic.js'

export function useEnemyAI(enemyCooldowns) {
  // Generar acción aleatoria del enemigo
  const generateEnemyAction = () => {
    const randomChoice = Math.floor(Math.random() * 4) + 1 // 1, 2, 3 o 4
    console.log(`🎲 Random del enemigo: ${randomChoice}`)
    
    let action = 'attack'
    
    if (randomChoice === 1) {
      action = 'attack'
    } else if (randomChoice === 2) {
      action = 'strong'
      // Si strong está en cooldown, usar attack
      if (enemyCooldowns.strong > 0) {
        console.log(`💪 Strong en cooldown (${enemyCooldowns.strong}), usando attack`)
        action = 'attack'
      }
    } else if (randomChoice === 3) {
      action = 'dodge'
      // Si dodge está en cooldown, usar attack
      if (enemyCooldowns.dodge > 0) {
        console.log(`🛡️ Dodge en cooldown (${enemyCooldowns.dodge}), usando attack`)
        action = 'attack'
      }
    } else if (randomChoice === 4) {
      action = 'heal'
      // Si heal está en cooldown, usar attack
      if (enemyCooldowns.heal > 0) {
        console.log(`💚 Heal en cooldown (${enemyCooldowns.heal}), usando attack`)
        action = 'attack'
      }
    }
    
    console.log(`🎲 Acción final del enemigo: ${action}`)
    return action
  }

  // Obtener icono de acción
  const getActionIcon = (action) => {
    const ability = ABILITIES[action.toUpperCase()]
    return ability ? ability.icon : '❓'
  }

  // Obtener texto de acción
  const getActionText = (action) => {
    const ability = ABILITIES[action.toUpperCase()]
    return ability ? ability.name : 'Desconocido'
  }

  return {
    generateEnemyAction,
    getActionIcon,
    getActionText
  }
}
