import React from 'react';
import HeroAbilityCircleGlow from './HeroAbilityCircleGlow/HeroAbilityCircleGlow.jsx';

const HeroAbilityCircle = ({ selectedAction, heroAbilityImages, getActionText, battleActions, enableCircleGlow = true }) => {
  const isAttacking = battleActions?.playerAttacked && !battleActions?.playerAttackComplete;

  return (
    <div className="ability-circle hero-ability">
      {enableCircleGlow ? (
        <HeroAbilityCircleGlow isAttacking={isAttacking}>
          <div className="ability-circle-placeholder">
            {selectedAction && (
              <img
                src={heroAbilityImages[selectedAction]}
                alt={getActionText(selectedAction)}
                className="ability-icon-image"
              />
            )}
            <div className="ability-inner-circle hero-inner-circle"></div>
          </div>
        </HeroAbilityCircleGlow>
      ) : (
        <div className="ability-circle-placeholder">
          {selectedAction && (
            <img
              src={heroAbilityImages[selectedAction]}
              alt={getActionText(selectedAction)}
              className="ability-icon-image"
            />
          )}
          <div className="ability-inner-circle hero-inner-circle"></div>
        </div>
      )}
    </div>
  );
};

export default HeroAbilityCircle;
