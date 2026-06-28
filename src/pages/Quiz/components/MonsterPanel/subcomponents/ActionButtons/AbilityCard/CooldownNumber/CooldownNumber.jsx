import React from 'react';
import './CooldownNumber.css';

// ACTIVAR/DESACTAR FUNCIÓN DE COOLDOWN NUMBER:
// Para activar: const ENABLE_COOLDOWN_NUMBER = true;
// Para desactivar: const ENABLE_COOLDOWN_NUMBER = false;
const ENABLE_COOLDOWN_NUMBER = true;

const CooldownNumber = ({ remaining }) => {
  if (!ENABLE_COOLDOWN_NUMBER || remaining === 0) {
    return null;
  }

  return (
    <div className="cooldown-number">
      {remaining}
    </div>
  );
};

export default CooldownNumber;
