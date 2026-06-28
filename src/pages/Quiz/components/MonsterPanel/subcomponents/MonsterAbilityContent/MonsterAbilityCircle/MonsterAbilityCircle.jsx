import React from 'react';
import MonsterAbilityCircleGlow from './MonsterAbilityCircleGlow/MonsterAbilityCircleGlow.jsx';

const MonsterAbilityCircle = ({ battleActions, monsterAbilityImages, getActionText, enableCircleGlow = true }) => {
  const isAttacking = battleActions?.enemyActionRevealed && !battleActions?.enemyAttackComplete;

  return (
    <div className="ability-circle monster-ability">
      {enableCircleGlow ? (
        <MonsterAbilityCircleGlow isAttacking={isAttacking}>
          <div className="ability-circle-placeholder">
            {battleActions?.enemyActionRevealed && battleActions?.enemyAction && (
              <img
                src={monsterAbilityImages[battleActions.enemyAction]}
                alt={getActionText(battleActions.enemyAction)}
                className="ability-icon-image"
              />
            )}
            <div className="ability-inner-circle monster-inner-circle">
              {!battleActions?.playerAnswered && <div className="loading-spinner"></div>}
              {battleActions?.playerAnswered && !battleActions?.enemyActionRevealed && <div className="question-mark">?</div>}
            </div>
          </div>
        </MonsterAbilityCircleGlow>
      ) : (
        <div className="ability-circle-placeholder">
          {battleActions?.enemyActionRevealed && battleActions?.enemyAction && (
            <img
              src={monsterAbilityImages[battleActions.enemyAction]}
              alt={getActionText(battleActions.enemyAction)}
              className="ability-icon-image"
            />
          )}
          <div className="ability-inner-circle monster-inner-circle">
            {!battleActions?.playerAnswered && <div className="loading-spinner"></div>}
            {battleActions?.playerAnswered && !battleActions?.enemyActionRevealed && <div className="question-mark">?</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonsterAbilityCircle;
