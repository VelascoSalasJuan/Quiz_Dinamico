import './CooldownIndicator.css'

const CooldownIndicator = ({ remaining }) => {
  if (remaining <= 0) return null

  return (
    <span className="cooldown-indicator">
      {remaining}
    </span>
  )
}

export default CooldownIndicator
