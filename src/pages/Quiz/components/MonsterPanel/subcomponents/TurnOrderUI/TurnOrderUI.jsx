import './TurnOrderUI.css'
import { useState, useEffect } from 'react'
import Hexagon from './components/Hexagon/Hexagon'
import MinionSkull from './components/MinionSkull/MinionSkull'
import BossSkull from './components/BossSkull/BossSkull'
import Estandarte from './components/Estandarte/Estandarte'

const TurnOrderUI = ({ enemies, currentEnemyIndex, enemiesDefeated }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayCurrentIndex, setDisplayCurrentIndex] = useState(0)
  
  // Datos temporales para pruebas (simulando esbirros)
  const [tempEnemies, setTempEnemies] = useState([
    { id: 'minion1', isBoss: false, isDefeated: false },
    { id: 'minion2', isBoss: false, isDefeated: false },
    { id: 'boss', isBoss: true, isDefeated: false }
  ])

  // Función temporal para avanzar al siguiente enemigo manualmente
  const advanceToNext = () => {
    if (displayCurrentIndex < tempEnemies.length - 1) {
      // Marcar el enemigo actual como derrotado
      const updatedEnemies = [...tempEnemies]
      updatedEnemies[displayCurrentIndex] = {
        ...updatedEnemies[displayCurrentIndex],
        isDefeated: true
      }
      setTempEnemies(updatedEnemies)
      
      setIsAnimating(true)
      
      setTimeout(() => {
        setDisplayCurrentIndex(prev => prev + 1)
        setIsAnimating(false)
      }, 500)
    }
  }

  // Exponer función temporalmente para pruebas
  useEffect(() => {
    window.advanceTurnOrder = advanceToNext
    return () => {
      delete window.advanceTurnOrder
    }
  }, [displayCurrentIndex])

  // Usar datos temporales si no hay datos reales
  const displayEnemies = enemies && enemies.length > 0 ? enemies : tempEnemies
  const currentIndex = enemies && enemies.length > 0 ? currentEnemyIndex : displayCurrentIndex

  return (
    <div className="turn-order-ui">
      {/* Estandarte de fondo */}
      <Estandarte />
      
      {/* Contenedor rectangular principal */}
      <div className="turn-order-container">
        {/* Marco arriba */}
        <div className="marco-section">
          <Hexagon>
            {/* El enemigo actual se mostrará dentro del marco */}
            {displayEnemies[currentIndex]?.isBoss ? (
              <BossSkull isDefeated={displayEnemies[currentIndex]?.isDefeated} />
            ) : (
              <MinionSkull isDefeated={displayEnemies[currentIndex]?.isDefeated} />
            )}
          </Hexagon>
        </div>

        {/* Cadena de calaveras que suben */}
        <div className={`skulls-chain ${isAnimating ? 'sliding-up' : ''}`}>
          {displayEnemies.map((enemy, index) => {
            if (index === currentIndex) return null // El actual ya está en el marco
            if (enemy.isDefeated) return null // Los derrotados no se muestran en la cola
            
            return (
              <div key={enemy.id} className="chain-item">
                {enemy.isBoss ? (
                  <BossSkull isDefeated={enemy.isDefeated} />
                ) : (
                  <MinionSkull isDefeated={enemy.isDefeated} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TurnOrderUI
