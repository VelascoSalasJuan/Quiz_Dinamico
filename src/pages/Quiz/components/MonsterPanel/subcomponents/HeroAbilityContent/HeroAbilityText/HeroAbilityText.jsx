import React from 'react';

const HeroAbilityText = ({ selectedAction, getActionText, battleActions }) => {
  return (
    <div className="ability-text hero-ability-text">
      {selectedAction ? (battleActions?.playerAttacked ? getActionText(selectedAction) : '¡LISTO!') : 'Pick your move'}
    </div>
  );
};

export default HeroAbilityText;
