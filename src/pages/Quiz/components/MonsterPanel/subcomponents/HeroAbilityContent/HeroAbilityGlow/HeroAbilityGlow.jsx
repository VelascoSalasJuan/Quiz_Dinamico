import React from 'react';
import './HeroAbilityGlow.css';

const HeroAbilityGlow = ({ isAttacking, children }) => {
  return (
    <div className={`hero-ability-glow ${isAttacking ? 'attacking' : ''}`}>
      {children}
    </div>
  );
};

export default HeroAbilityGlow;
