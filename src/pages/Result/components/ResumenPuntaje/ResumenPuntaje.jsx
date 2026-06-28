import './ResumenPuntaje.css'

function ResumenPuntaje({ score, total }) {
  return (
    <section className="score-summary">
      <p>Score: {score} / {total}</p>
    </section>
  )
}

export default ResumenPuntaje
