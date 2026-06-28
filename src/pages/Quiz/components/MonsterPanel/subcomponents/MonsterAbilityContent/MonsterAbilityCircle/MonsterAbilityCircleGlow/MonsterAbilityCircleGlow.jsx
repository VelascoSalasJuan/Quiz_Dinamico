import React from 'react';
import './MonsterAbilityCircleGlow.css';

const MonsterAbilityCircleGlow = ({ isAttacking, children }) => {
  return (
    <div className={`monster-ability-circle-glow ${isAttacking ? 'attacking' : ''}`}>
      {children}
    </div>
  );
};

export default MonsterAbilityCircleGlow;
