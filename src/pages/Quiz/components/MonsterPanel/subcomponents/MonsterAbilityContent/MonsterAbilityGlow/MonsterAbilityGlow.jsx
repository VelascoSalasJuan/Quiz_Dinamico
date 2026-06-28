import React from 'react';
import './MonsterAbilityGlow.css';

const MonsterAbilityGlow = ({ isAttacking, children }) => {
  return (
    <div className={`monster-ability-glow ${isAttacking ? 'attacking' : ''}`}>
      {children}
    </div>
  );
};

export default MonsterAbilityGlow;
