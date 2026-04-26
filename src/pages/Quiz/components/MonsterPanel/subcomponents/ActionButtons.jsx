import './ActionButtons.css'
import CooldownIndicator from './CooldownIndicator/CooldownIndicator.jsx'

const ActionButtons = ({ 
  selectedAction, 
  isPlayerTurn, 
  isGameFinished, 
  onSelectAction, 
  onRestartBattle,
  checkCooldown,
  getCooldownRemaining
}) => {
  return (
    <div className="action-buttons">
      {/* Ataque normal - sin cooldown */}
      <button
        type="button"
        onClick={() => onSelectAction('attack')}
        disabled={!isPlayerTurn || isGameFinished}
        className={selectedAction === 'attack' ? 'action-active' : ''}
      >
        Atacar
      </button>
      
      {/* Ataque fuerte - con cooldown */}
      <button
        type="button"
        onClick={() => onSelectAction('strong')}
        disabled={!isPlayerTurn || isGameFinished || checkCooldown('strong')}
        className={selectedAction === 'strong' ? 'action-active' : ''}
      >
        Ataque Fuerte
        <CooldownIndicator remaining={getCooldownRemaining('strong')} />
      </button>
      
      {/* Esquivar - con cooldown */}
      <button
        type="button"
        onClick={() => onSelectAction('dodge')}
        disabled={!isPlayerTurn || isGameFinished || checkCooldown('dodge')}
        className={selectedAction === 'dodge' ? 'action-active' : ''}
      >
        Esquivar
        <CooldownIndicator remaining={getCooldownRemaining('dodge')} />
      </button>
      
      {/* Curar - con cooldown */}
      <button
        type="button"
        onClick={() => onSelectAction('heal')}
        disabled={!isPlayerTurn || isGameFinished || checkCooldown('heal')}
        className={selectedAction === 'heal' ? 'action-active' : ''}
      >
        Curar
        <CooldownIndicator remaining={getCooldownRemaining('heal')} />
      </button>
      
      {isGameFinished && (
        <button
          type="button"
          onClick={onRestartBattle}
        >
          Reiniciar batalla
        </button>
      )}
    </div>
  )
}

export default ActionButtons
