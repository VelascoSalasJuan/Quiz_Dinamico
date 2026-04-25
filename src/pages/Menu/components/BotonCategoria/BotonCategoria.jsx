import './BotonCategoria.css'
import { useNavigate } from 'react-router-dom'

function BotonCategoria({ id, name, icon, color }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/quiz/${id}`)
  }

  return (
    <button
      type="button"
      className="category-button"
      onClick={handleClick}
      style={{ borderColor: color, color: color }}
    >
      <span className="category-icon">{icon}</span>
      <span className="category-name">{name}</span>
    </button>
  )
}

export default BotonCategoria
