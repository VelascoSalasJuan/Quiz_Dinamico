import './QuizPage.css'
import { Link, useParams } from 'react-router-dom'
import { categories } from '../../data/categories.js'
import { questions } from '../../data/questions.js'

function QuizPage() {
  const { categoryId } = useParams()
  const selectedCategory = categories.find((category) => category.id === categoryId)
  const categoryQuestions = questions.filter((question) => question.category === categoryId)
  const currentQuestion = categoryQuestions[0]

  if (!selectedCategory) {
    return (
      <main className="quiz-page">
        <h1>Categoría no encontrada</h1>
        <Link to="/" className="back-link">Volver al menú</Link>
      </main>
    )
  }

  if (!currentQuestion) {
    return (
      <main className="quiz-page">
        <h1>{selectedCategory.icon} Quiz de {selectedCategory.name}</h1>
        <p>No hay preguntas disponibles en esta categoría.</p>
        <Link to="/" className="back-link">Volver al menú</Link>
      </main>
    )
  }

  return (
    <main className="quiz-page">
      <header className="quiz-header">
        <h1>{selectedCategory.icon} Quiz de {selectedCategory.name}</h1>
        <p>Pregunta 1 de {categoryQuestions.length}</p>
      </header>

      <section className="quiz-layout">
        <article className="question-panel">
          <p>{currentQuestion.prompt}</p>
        </article>

        <section className="options-panel">
          <h2>Opciones</h2>
          <div className="options-grid">
            {currentQuestion.options.map((option) => (
              <button key={option} type="button" className="option-button">
                {option}
              </button>
            ))}
          </div>
        </section>
      </section>

      <Link to="/" className="back-link">Volver al menú</Link>
    </main>
  )
}

export default QuizPage
