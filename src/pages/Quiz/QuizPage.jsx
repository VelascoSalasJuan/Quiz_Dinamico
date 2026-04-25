import './QuizPage.css'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { monsters } from '../../data/monsters.js'
import { questions } from '../../data/questions.js'

function QuizPage() {
  const { monsterId } = useParams()
  const selectedMonster = monsters.find((monster) => monster.id === monsterId)
  const availableCategories = useMemo(
    () => [...new Set(questions.map((question) => question.category))],
    [],
  )
  const [currentCategory, setCurrentCategory] = useState('')
  const [categoryMessage, setCategoryMessage] = useState('')
  const [turnCount, setTurnCount] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const categoryQuestions = questions.filter((question) => question.category === currentCategory)
  const currentQuestion = categoryQuestions[currentQuestionIndex]

  useEffect(() => {
    setSelectedOption(null)
    setCurrentQuestionIndex(0)
    setTurnCount(0)

    if (availableCategories.length === 0) {
      setCurrentCategory('')
      return
    }

    const initialCategory =
      availableCategories[Math.floor(Math.random() * availableCategories.length)]
    setCurrentCategory(initialCategory)
    setCategoryMessage(`Categoria inicial: ${initialCategory}`)
  }, [monsterId, availableCategories])

  if (!selectedMonster) {
    return (
      <main className="quiz-page">
        <h1>Monstruo no encontrado</h1>
        <Link to="/" className="back-link">Volver al menú</Link>
      </main>
    )
  }

  if (!currentQuestion) {
    return (
      <main className="quiz-page">
        <h1>{selectedMonster.icon} Batalla contra {selectedMonster.name}</h1>
        <p>No hay preguntas disponibles en esta categoría.</p>
        <Link to="/" className="back-link">Volver al menú</Link>
      </main>
    )
  }

  const isAnswered = selectedOption !== null

  const handleOptionClick = (option) => {
    if (isAnswered) return
    setSelectedOption(option)

    setTimeout(() => {
      const nextTurn = turnCount + 1
      const shouldChangeCategory = nextTurn % 3 === 0

      if (shouldChangeCategory && availableCategories.length > 0) {
        const otherCategories = availableCategories.filter(
          (category) => category !== currentCategory,
        )
        const fallbackCategories = otherCategories.length > 0 ? otherCategories : availableCategories
        const newCategory =
          fallbackCategories[Math.floor(Math.random() * fallbackCategories.length)]
        setCurrentCategory(newCategory)
        setCategoryMessage(`Evento: nueva categoria -> ${newCategory}`)
        setCurrentQuestionIndex(0)
      } else {
        setCurrentQuestionIndex((prevIndex) => {
          const nextIndex = prevIndex + 1
          return nextIndex >= categoryQuestions.length ? 0 : nextIndex
        })
      }
      setSelectedOption(null)
      setTurnCount(nextTurn)
    }, 900)
  }

  const getOptionClass = (option) => {
    if (!isAnswered) return 'option-button'
    if (option === currentQuestion.correctAnswer) return 'option-button option-correct'
    if (option === selectedOption) return 'option-button option-incorrect'
    return 'option-button option-muted'
  }

  return (
    <main className="quiz-page">
      <header className="quiz-header">
        <h1>Quiz Battle: {selectedMonster.icon} {selectedMonster.name}</h1>
        <p>Turno {turnCount + 1} | Categoria actual: {currentCategory}</p>
        {categoryMessage && <p className="category-event">{categoryMessage}</p>}
      </header>

      <section className="quiz-layout">
        <section className="left-panel">
          <article className="question-panel">
            <p>{currentQuestion.prompt}</p>
          </article>

          <section className="options-panel">
            <h2>Opciones</h2>
            <div className="options-grid">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={getOptionClass(option)}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {isAnswered && (
              <p className="answer-feedback">
                Respuesta correcta: <strong>{currentQuestion.correctAnswer}</strong>
              </p>
            )}
          </section>
        </section>

        <aside className="right-panel">
          <div className="monster-model">{selectedMonster.icon}</div>
          <h2>{selectedMonster.name}</h2>
          <div className="status-box">
            <p>HP jugador: 100 / 100</p>
            <div className="hp-bar"><span className="hp-fill player-hp" /></div>
            <p>HP enemigo: {selectedMonster.hp} / {selectedMonster.hp}</p>
            <div className="hp-bar"><span className="hp-fill enemy-hp" /></div>
          </div>
          <div className="action-buttons">
            <button type="button">Atacar</button>
            <button type="button">Curar</button>
            <button type="button">Esquivar</button>
          </div>
        </aside>
      </section>

      <Link to="/" className="back-link">Volver al menú</Link>
    </main>
  )
}

export default QuizPage
