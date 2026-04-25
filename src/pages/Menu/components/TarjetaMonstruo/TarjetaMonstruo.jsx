import './TarjetaMonstruo.css'
import { useNavigate } from 'react-router-dom'

function TarjetaMonstruo({ id, name, icon, color, hp, attack }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/quiz/${id}`)
  }

  return (
    <button
      type="button"
      className="monster-card"
      onClick={handleClick}
      style={{ borderColor: color }}
    >
      <div className="monster-image-slot">
        <span className="monster-icon">{icon}</span>
        <span className="image-slot-label">Espacio para imagen</span>
      </div>
      <span className="monster-name">{name}</span>
      <span className="monster-stats">HP: {hp} | ATK: {attack}</span>
    </button>
  )
}

export default TarjetaMonstruo
