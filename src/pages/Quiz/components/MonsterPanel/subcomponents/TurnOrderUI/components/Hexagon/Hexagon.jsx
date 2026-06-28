import './Hexagon.css'

const Hexagon = ({ children }) => {
  return (
    <div className="hexagon-container">
      <img 
        src="/images/TurnOrderImagen/FrameTurn.png" 
        alt="Marco" 
        className="marco-image"
      />
      <div className="hexagon-content">
        {children}
      </div>
    </div>
  )
}

export default Hexagon
