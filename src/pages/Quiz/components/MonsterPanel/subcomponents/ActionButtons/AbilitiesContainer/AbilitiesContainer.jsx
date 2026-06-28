import React from 'react';
import './AbilitiesContainer.css';

const AbilitiesContainer = ({ children }) => {
  return (
    <div className="abilities-container">
      {children}
    </div>
  );
};

export default AbilitiesContainer;
