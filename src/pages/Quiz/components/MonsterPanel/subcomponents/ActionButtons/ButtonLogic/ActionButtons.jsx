import './ActionButtons.css'
import AbilitiesContainer from '../AbilitiesContainer/AbilitiesContainer.jsx'
import AbilityCard from '../AbilityCard/AbilityCard.jsx'
import CooldownIndicator from '../../CooldownIndicator/CooldownIndicator.jsx'
import { useState } from 'react'

const ActionButtons = ({
  selectedAction,
  isPlayerTurn,
  isGameFinished,
  onSelectAction,
  onRestartBattle,
  checkCooldown,
  getCooldownRemaining
}) => {
  const [flippedCard, setFlippedCard] = useState(null)

  const abilities = [
    {
      id: 'attack',
      name: 'Ataque Normal',
      description: '10 de daño',
      hasCooldown: false,
      image: '/images/attack.jpeg',
      icon: '⚔️'
    },
    {
      id: 'strong',
      name: 'Ataque Fuerte',
      description: '20 de daño',
      hasCooldown: true,
      image: '/images/strong.jpeg',
      icon: '💥'
    },
    {
      id: 'dodge',
      name: 'Esquivar',
      description: 'Evita el siguiente ataque',
      hasCooldown: true,
      image: '/images/Escudo.jpeg',
      icon: '🛡️'
    },
    {
      id: 'heal',
      name: 'Curar',
      description: 'Recupera 25 HP',
      hasCooldown: true,
      image: '/images/Curacion.jpeg',
      icon: '💚'
    }
  ]

  const handleCardClick = (abilityId) => {
    if (!isGameFinished && isPlayerTurn && !checkCooldown(abilityId)) {
      onSelectAction(abilityId)
    }
  }

  const handleCardMouseDown = (abilityId) => {
    setFlippedCard(abilityId)
  }

  const handleCardMouseUp = () => {
    setFlippedCard(null)
  }

  const handleCardMouseLeave = () => {
    setFlippedCard(null)
  }

  return (
    <div className="action-buttons">
      <AbilitiesContainer>
        {abilities.map((ability) => (
          <AbilityCard
            key={ability.id}
            ability={ability}
            isSelected={selectedAction === ability.id}
            isFlipped={flippedCard === ability.id}
            isDisabled={!isPlayerTurn || isGameFinished || checkCooldown(ability.id)}
            onClick={() => handleCardClick(ability.id)}
            onMouseDown={() => handleCardMouseDown(ability.id)}
            onMouseUp={handleCardMouseUp}
            onMouseLeave={handleCardMouseLeave}
            getCooldownRemaining={getCooldownRemaining}
          />
        ))}
      </AbilitiesContainer>
    </div>
  )
}

export default ActionButtons
