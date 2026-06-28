import './BossSkull.css'

const BossSkull = ({ isDefeated }) => {
  return (
    <div className={`boss-skull ${isDefeated ? 'defeated' : ''}`}>
      <img 
        src={isDefeated ? "/images/TurnOrderImagen/SkullBossDead.png" : "/images/TurnOrderImagen/SkullBoss.png"} 
        alt="Calavera de jefe" 
        className="skull-image"
      />
    </div>
  )
}

export default BossSkull
