import './ScoreSummary.css'

function ScoreSummary({ score, total }) {
  return (
    <section className="score-summary">
      <p>Score: {score} / {total}</p>
    </section>
  )
}

export default ScoreSummary
