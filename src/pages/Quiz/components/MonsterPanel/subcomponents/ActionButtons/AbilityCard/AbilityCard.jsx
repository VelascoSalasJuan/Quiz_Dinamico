import React from 'react';
import './AbilityCard.css';
import SimpleButton from '../SimpleButton/SimpleButton.jsx';
import CooldownIndicator from '../../CooldownIndicator/CooldownIndicator.jsx';
import CardFlip from './CardFlip/CardFlip.jsx';
import CooldownNumber from './CooldownNumber/CooldownNumber.jsx';

// Función para obtener el efecto específico de cada habilidad
const getAbilityEffect = (ability) => {
  switch (ability.id) {
    case 'attack':
      return '10 de dmg';
    case 'strong':
      return '20 de dmg';
    case 'dodge':
      return 'Bloquea el siguiente dmg';
    case 'heal':
      return '+25 HP';
    default:
      return ability.description;
  }
};

const AbilityCard = ({ ability, isSelected, isFlipped, isDisabled, onClick, onMouseDown, onMouseUp, onMouseLeave, getCooldownRemaining }) => {
  const abilityEffect = getAbilityEffect(ability);

  return (
    <div
      className={`ability-card ${isSelected ? 'card-active' : ''}`}
      style={{
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer'
      }}
    >
      <CardFlip
        isFlipped={isFlipped}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div className="card-inner">
          {/* Frente de la carta - SimpleButton con imagen */}
          <div className="card-front">
            <SimpleButton onClick={onClick} disabled={isDisabled} className="card-button">
              {ability.image ? (
                <img src={ability.image} alt={ability.name} className="card-full-image" />
              ) : (
                <div className="card-image-placeholder-full">
                  <span className="placeholder-icon">{ability.icon}</span>
                </div>
              )}
            </SimpleButton>
            {ability.hasCooldown && (
              <CooldownNumber remaining={getCooldownRemaining(ability.id)} />
            )}
          </div>

          {/* Reverso de la carta - Detalles específicos de cada habilidad */}
          <div className="card-back">
            <h3 className="card-name">{ability.name}</h3>
            <p className="card-effect">{abilityEffect}</p>
            {ability.hasCooldown && (
              <div className="card-cooldown">
                <CooldownIndicator remaining={getCooldownRemaining(ability.id)} />
              </div>
            )}
          </div>
        </div>
      </CardFlip>
    </div>
  );
};

export default AbilityCard;
