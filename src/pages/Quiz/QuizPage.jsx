import './QuizPage.css'
import { Link, useParams } from 'react-router-dom'
import { categories } from '../../data/categories.js'
import { questions } from '../../data/questions.js'

function QuizPage() {
  const { categoryId } = useParams()
  const selectedCategory = categories.find((category) => category.id === categoryId)
  const categoryQuestions = questions.filter((question) => question.category === categoryId)

  if (!selectedCategory) {
    return (
      <main className="quiz-page">
        <h1>Categoría no encontrada</h1>
        <Link to="/" className="back-link">Volver al menú</Link>
      </main>
    )
  }

  return (
    <main className="quiz-page">
      <h1>{selectedCategory.icon} Quiz de {selectedCategory.name}</h1>
      <p>Total de preguntas: {categoryQuestions.length}</p>

      <section className="question-list">
        {categoryQuestions.map((question, index) => (
          <article key={question.id} className="question-item">
            <h2>Pregunta {index + 1}</h2>
            <p>{question.prompt}</p>
          </article>
        ))}
      </section>

      <Link to="/" className="back-link">Volver al menú</Link>
    </main>
  )
}

export default QuizPage
