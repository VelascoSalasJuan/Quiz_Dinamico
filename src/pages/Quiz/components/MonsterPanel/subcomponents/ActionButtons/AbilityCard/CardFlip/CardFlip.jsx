import React from 'react';
import './CardFlip.css';

// ACTIVAR/DESACTAR FUNCIÓN DE FLIP:
// Para activar: const ENABLE_FLIP = true;
// Para desactivar: const ENABLE_FLIP = false;
const ENABLE_FLIP = true;

const CardFlip = ({ isFlipped, children, onMouseDown, onMouseUp, onMouseLeave }) => {
  if (!ENABLE_FLIP) {
    return <div className="card-no-flip">{children}</div>;
  }

  return (
    <div
      className={`card-flip-wrapper ${isFlipped ? 'flipped' : ''}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

export default CardFlip;
