import React from 'react';
import MonsterAbilityCircle from './MonsterAbilityCircle/MonsterAbilityCircle.jsx';
import MonsterAbilityText from './MonsterAbilityText/MonsterAbilityText.jsx';
import MonsterAbilityGlow from './MonsterAbilityGlow/MonsterAbilityGlow.jsx';

const MonsterAbilityContent = ({ battleActions, monsterAbilityImages, getActionText, enableCircleGlow = true }) => {
  const isAttacking = battleActions?.enemyActionRevealed && !battleActions?.enemyAttackComplete;

  return (
    <>
      {<MonsterAbilityGlow isAttacking={isAttacking}>
        <div className="ability-content monster-ability-content">
          <MonsterAbilityText battleActions={battleActions} getActionText={getActionText} />
          <MonsterAbilityCircle battleActions={battleActions} monsterAbilityImages={monsterAbilityImages} getActionText={getActionText} enableCircleGlow={enableCircleGlow} />
        </div>
      </MonsterAbilityGlow>}
    </>
  );
};

export default MonsterAbilityContent;
