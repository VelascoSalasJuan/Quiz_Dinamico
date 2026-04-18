import './QuestionCard.css'

function QuestionCard({ prompt }) {
  return (
    <article className="question-card">
      <h2>{prompt}</h2>
    </article>
  )
}

export default QuestionCard
