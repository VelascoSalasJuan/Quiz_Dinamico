import React from 'react';
import './SimpleButton.css';

const SimpleButton = ({ children, onClick, disabled, className }) => {
  return (
    <button
      className={`simple-button ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default SimpleButton;
