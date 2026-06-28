// ACTIVAR/DESACTAR FUNCIÓN DE PENALIZACIÓN POR FALLAR:
// Para activar: const ENABLE_PLAYER_FAIL_PENALTY = true;
// Para desactivar: const ENABLE_PLAYER_FAIL_PENALTY = false;
const ENABLE_PLAYER_FAIL_PENALTY = false;

export function handlePlayerFailLogic(
  enemyAction,
  abilities,
  battleState,
  gameLogic
) {
  if (!ENABLE_PLAYER_FAIL_PENALTY) {
    return;
  }

  console.log(`❌ JUGADOR FALLÓ - El monstruo usará: ${enemyAction}`);

  // Mostrar mensaje de feedback
  gameLogic.setFeedbackMessage('Fallaste la pregunta. Tu acción falló.');

  setTimeout(() => {
    battleState.setBattleActions(prev => ({
      ...prev,
      enemyActionRevealed: true,
      executingActions: true
    }));

    // Ejecutar ataque del monstruo usando la función processEnemyAttack
    // Esto maneja toda la lógica del ataque (dodge, heal, strong, attack)
    const battleEnded = battleState.processEnemyAttack(enemyAction, null, gameLogic);

    // Aplicar cooldown para habilidad del enemigo
    if (enemyAction !== 'attack') {
      abilities.setCooldown(enemyAction, true);
    }

    // Apagar el brillo del monstruo después del ataque
    setTimeout(() => {
      battleState.setBattleActions(prev => ({ ...prev, enemyAttackComplete: true }));
    }, 1500);

    if (battleEnded) {
      return;
    }

    setTimeout(() => {
      // Resetear acciones de batalla
      battleState.resetTurnActions();

      // Reducir cooldowns
      abilities.reduceCooldowns(false);
      abilities.reduceCooldowns(true);

      gameLogic.advanceTimeline();
      gameLogic.setTurn('player');
      gameLogic.setSelectedOption(null);
      gameLogic.setSelectedAction(null);

      // Avanzar a la siguiente pregunta
      gameLogic.advanceQuestionAndCategory(gameLogic.turnCount + 1);

      // Separador visual para final del turno
      console.log('======================');
    }, 1500);
  }, 1500);
}
