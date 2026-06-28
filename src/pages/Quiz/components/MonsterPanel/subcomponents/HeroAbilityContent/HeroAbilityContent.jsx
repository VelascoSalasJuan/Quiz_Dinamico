import React from 'react';
import HeroAbilityCircle from './HeroAbilityCircle/HeroAbilityCircle.jsx';
import HeroAbilityText from './HeroAbilityText/HeroAbilityText.jsx';
import HeroAbilityGlow from './HeroAbilityGlow/HeroAbilityGlow.jsx';

const HeroAbilityContent = ({ selectedAction, heroAbilityImages, getActionText, battleActions, enableCircleGlow = false }) => {
  const isAttacking = battleActions?.playerAttacked && !battleActions?.playerAttackComplete;

  return (
    <>
      {  <HeroAbilityGlow isAttacking={isAttacking}>
        <div className="ability-content hero-ability-content">
          <HeroAbilityCircle selectedAction={selectedAction} heroAbilityImages={heroAbilityImages} getActionText={getActionText} battleActions={battleActions} enableCircleGlow={enableCircleGlow} />
          <HeroAbilityText selectedAction={selectedAction} getActionText={getActionText} battleActions={battleActions} />
        </div>
      </HeroAbilityGlow>}
    </>
  );
};

export default HeroAbilityContent;
