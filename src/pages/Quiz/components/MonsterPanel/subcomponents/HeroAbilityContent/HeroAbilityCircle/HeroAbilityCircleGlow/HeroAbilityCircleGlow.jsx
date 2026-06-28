import React from 'react';
import './HeroAbilityCircleGlow.css';

const HeroAbilityCircleGlow = ({ isAttacking, children }) => {
  return (
    <div className={`hero-ability-circle-glow ${isAttacking ? 'attacking' : ''}`}>
      {children}
    </div>
  );
};

export default HeroAbilityCircleGlow;
