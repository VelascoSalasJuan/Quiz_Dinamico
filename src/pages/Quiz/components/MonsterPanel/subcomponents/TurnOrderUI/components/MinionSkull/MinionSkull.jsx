import './MinionSkull.css'

const MinionSkull = ({ isDefeated }) => {
  return (
    <div className={`minion-skull ${isDefeated ? 'defeated' : ''}`}>
      <img 
        src={isDefeated ? "/images/TurnOrderImagen/SkullDead.png" : "/images/TurnOrderImagen/Skull.png"} 
        alt="Calavera de esbirro" 
        className="skull-image"
      />
    </div>
  )
}

export default MinionSkull
