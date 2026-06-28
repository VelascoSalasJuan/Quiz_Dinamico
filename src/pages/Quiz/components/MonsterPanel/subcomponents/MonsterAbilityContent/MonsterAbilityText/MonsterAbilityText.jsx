import React from 'react';

const MonsterAbilityText = ({ battleActions, getActionText }) => {
  return (
    <div className="ability-text monster-ability-text">
      {battleActions?.enemyActionRevealed && battleActions?.enemyAction ? getActionText(battleActions.enemyAction) : battleActions?.playerAnswered ? '¡LISTO!' : 'Thinking'}
    </div>
  );
};

export default MonsterAbilityText;
