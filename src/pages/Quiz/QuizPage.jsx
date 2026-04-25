import './QuizPage.css'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { monsters } from '../../data/monsters.js'
import { questions } from '../../data/questions.js'
import MonsterPanel from './components/MonsterPanel/MonsterPanel.jsx'
import QuestionPanel from './components/QuestionPanel/QuestionPanel.jsx'
import OptionsPanel from './components/OptionsPanel/OptionsPanel.jsx'

const PLAYER_MAX_HP = 100
const PLAYER_ATTACK_DAMAGE = 20
const PLAYER_HEAL_AMOUNT = 18
const CATEGORY_CHANGE_EVERY_TURNS = 3

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
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP)
  const [enemyHp, setEnemyHp] = useState(selectedMonster ? selectedMonster.hp : 100)
  const [turn, setTurn] = useState('player')
  const [feedbackMessage, setFeedbackMessage] = useState('Elige una accion para comenzar.')
  const [selectedAction, setSelectedAction] = useState(null)
  const [dodgeReady, setDodgeReady] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0)
  const categoryQuestions = questions.filter((question) => question.category === currentCategory)
  const currentQuestion = categoryQuestions[currentQuestionIndex]

  // Función para generar una acción aleatoria del enemigo
  const generateEnemyAction = () => {
    const actions = ['attack', 'strong', 'heal']
    const weights = [0.5, 0.3, 0.2] // Probabilidades
    const random = Math.random()
    let cumulative = 0
    
    for (let i = 0; i < actions.length; i++) {
      cumulative += weights[i]
      if (random <= cumulative) {
        return actions[i]
      }
    }
    return 'attack'
  }

  // Función para generar un turno del enemigo
  const generateEnemyTurn = () => ({
    actor: 'enemy',
    action: generateEnemyAction()
  })

  // Función para generar un turno del jugador
  const generatePlayerTurn = () => ({
    actor: 'player',
    action: null // El jugador decide su acción
  })

  // Función para inicializar la timeline
  const initializeTimeline = () => {
    const initialTimeline = []
    for (let i = 0; i < 6; i++) {
      initialTimeline.push(i % 2 === 0 ? generatePlayerTurn() : generateEnemyTurn())
    }
    return initialTimeline
  }

  // Función para obtener íconos de actor
  const getActorIcon = (actor) => {
    return actor === 'player' ? '🗡️' : '👹'
  }

  // Función para obtener íconos de acción
  const getActionIcon = (action) => {
    const icons = {
      attack: '⚔️',
      strong: '💥',
      heal: '❤️',
      null: '❓' // Para acciones del jugador (no decididas aún)
    }
    return icons[action] || '❓'
  }

  // Función para obtener texto de acción
  const getActionText = (action) => {
    const texts = {
      attack: 'Ataque',
      strong: 'Ataque Fuerte',
      heal: 'Curación',
      null: 'Tu Turno'
    }
    return texts[action] || 'Desconocido'
  }

  // Función para avanzar en la timeline
  const advanceTimeline = () => {
    const nextIndex = currentTurnIndex + 1
    
    // Si llegamos al final de la timeline, generamos más turnos
    if (nextIndex >= timeline.length) {
      const newTimeline = [...timeline]
      // Añadimos nuevos turnos manteniendo el patrón alternado
      const lastActor = timeline[timeline.length - 1].actor
      const nextActor = lastActor === 'player' ? 'enemy' : 'player'
      
      if (nextActor === 'enemy') {
        newTimeline.push(generateEnemyTurn())
      } else {
        newTimeline.push(generatePlayerTurn())
      }
      
      setTimeline(newTimeline)
    }
    
    setCurrentTurnIndex(nextIndex)
    return nextIndex
  }

  // Función para obtener la acción actual del enemigo desde la timeline
  const getCurrentEnemyAction = () => {
    const currentTurn = timeline[currentTurnIndex]
    if (currentTurn && currentTurn.actor === 'enemy') {
      return currentTurn.action
    }
    return null
  }

  // Función para obtener la próxima acción del enemigo (para anticipación)
  const getNextEnemyAction = () => {
    for (let i = currentTurnIndex; i < timeline.length; i++) {
      if (timeline[i].actor === 'enemy') {
        return timeline[i].action
      }
    }
    return 'attack' // fallback
  }

  useEffect(() => {
    setSelectedOption(null)
    setCurrentQuestionIndex(0)
    setTurnCount(0)
    setPlayerHp(PLAYER_MAX_HP)
    setEnemyHp(selectedMonster ? selectedMonster.hp : 100)
    setTurn('player')
    setSelectedAction(null)
    setDodgeReady(false)
    setFeedbackMessage('Elige una accion para comenzar.')
    setCurrentTurnIndex(0)
    setTimeline(initializeTimeline())

    if (availableCategories.length === 0) {
      setCurrentCategory('')
      return
    }

    const initialCategory =
      availableCategories[Math.floor(Math.random() * availableCategories.length)]
    setCurrentCategory(initialCategory)
    setCategoryMessage(`Categoria inicial: ${initialCategory}`)
  }, [monsterId, availableCategories, selectedMonster])

  useEffect(() => {
    if (turn !== 'enemy' || !selectedMonster) return

    const enemyTurnTimer = setTimeout(() => {
      if (dodgeReady) {
        setFeedbackMessage('Esquivaste el ataque del monstruo.')
        setDodgeReady(false)
        advanceTimeline()
        setTurn('player')
        return
      }

      const enemyAction = getCurrentEnemyAction()
      let damage = 0
      let message = ''

      switch (enemyAction) {
        case 'attack':
          damage = selectedMonster.attack
          message = `El monstruo atacó e hizo ${damage} de daño.`
          break
        case 'strong':
          damage = Math.floor(selectedMonster.attack * 1.5)
          message = `¡El monstruo usó un ataque fuerte e hizo ${damage} de daño!`
          break
        case 'heal':
          const healAmount = Math.floor(selectedMonster.hp * 0.3)
          const newEnemyHp = Math.min(selectedMonster.hp, enemyHp + healAmount)
          setEnemyHp(newEnemyHp)
          message = `El monstruo se curó y recuperó ${healAmount} de vida.`
          damage = 0
          break
        default:
          damage = selectedMonster.attack
          message = `El monstruo atacó e hizo ${damage} de daño.`
      }

      if (damage > 0) {
        const nextPlayerHp = Math.max(0, playerHp - damage)
        setPlayerHp(nextPlayerHp)

        if (nextPlayerHp <= 0) {
          setTurn('finished')
          setFeedbackMessage('Perdiste la batalla.')
          return
        }
      }

      setFeedbackMessage(message)
      advanceTimeline()
      setTurn('player')
    }, 2000)

    return () => clearTimeout(enemyTurnTimer)
  }, [turn, playerHp, dodgeReady, selectedMonster, currentTurnIndex, timeline])

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
  const isPlayerTurn = turn === 'player'
  const isGameFinished = turn === 'finished'
  const playerHpPercent = Math.max(0, (playerHp / PLAYER_MAX_HP) * 100)
  const enemyHpPercent = Math.max(0, (enemyHp / selectedMonster.hp) * 100)

  const advanceQuestionAndCategory = (nextTurn) => {
    const shouldChangeCategory = nextTurn % CATEGORY_CHANGE_EVERY_TURNS === 0

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
      return
    }

    setCurrentQuestionIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      return nextIndex >= categoryQuestions.length ? 0 : nextIndex
    })
  }

  const applyCorrectAction = (action) => {
    if (action === 'attack') {
      const nextEnemyHp = Math.max(0, enemyHp - PLAYER_ATTACK_DAMAGE)
      setEnemyHp(nextEnemyHp)
      setFeedbackMessage(`Ataque exitoso: hiciste ${PLAYER_ATTACK_DAMAGE} de dano.`)
      if (nextEnemyHp <= 0) {
        setTurn('finished')
        setFeedbackMessage('Ganaste la batalla.')
        return true
      }
    }

    if (action === 'heal') {
      setPlayerHp((prevHp) => Math.min(PLAYER_MAX_HP, prevHp + PLAYER_HEAL_AMOUNT))
      setFeedbackMessage(`Curacion exitosa: recuperaste ${PLAYER_HEAL_AMOUNT} de vida.`)
    }

    if (action === 'dodge') {
      setDodgeReady(true)
      setFeedbackMessage('Esquivar activado: evitaras el siguiente ataque.')
    }

    return false
  }

  const handleOptionClick = (option) => {
    if (isAnswered || !selectedAction || !isPlayerTurn || isGameFinished) return
    setSelectedOption(option)
    const isCorrect = option === currentQuestion.correctAnswer
    let battleEnded = false

    if (isCorrect) {
      battleEnded = applyCorrectAction(selectedAction)
    } else {
      setFeedbackMessage('Fallaste la pregunta. Tu accion no se ejecuto.')
    }

    setTimeout(() => {
      setSelectedOption(null)
      setSelectedAction(null)

      if (battleEnded) return

      const nextTurn = turnCount + 1
      setTurnCount(nextTurn)
      advanceQuestionAndCategory(nextTurn)
      advanceTimeline()
      setTurn('enemy')
    }, 1500)
  }

  const getOptionClass = (option) => {
    if (!isAnswered) return 'option-button'
    if (option === currentQuestion.correctAnswer) return 'option-button option-correct'
    if (option === selectedOption) return 'option-button option-incorrect'
    return 'option-button option-muted'
  }

  const handleActionSelect = (action) => {
    if (!isPlayerTurn || isGameFinished) return
    setSelectedOption(null)
    setSelectedAction(action)
    
    // Mostrar anticipación de la próxima acción del enemigo
    const nextEnemyAction = getNextEnemyAction()
    const actionText = getActionText(nextEnemyAction)
    setFeedbackMessage(`Responde correctamente para ejecutar la acción. El monstruo preparará: ${actionText}`)
  }

  const handleRestartBattle = () => {
    setPlayerHp(PLAYER_MAX_HP)
    setEnemyHp(selectedMonster.hp)
    setTurn('player')
    setTurnCount(0)
    setSelectedAction(null)
    setSelectedOption(null)
    setDodgeReady(false)
    setCurrentQuestionIndex(0)
    setCurrentTurnIndex(0)
    setTimeline(initializeTimeline())
    setFeedbackMessage('Batalla reiniciada. Elige una accion.')
  }

  return (
    <main className="quiz-page">
      <header className="quiz-header">
        <h1>Quiz Battle: {selectedMonster.icon} {selectedMonster.name}</h1>
        <p>
          Turno {turnCount + 1} | Categoria actual: {currentCategory} | Estado:{' '}
          {isGameFinished ? 'Finalizado' : turn === 'enemy' ? 'Turno del monstruo' : 'Tu turno'}
        </p>
        {categoryMessage && <p className="category-event">{categoryMessage}</p>}
      </header>

      <section className="quiz-layout">
        <section className="left-panel">
          <QuestionPanel 
            currentQuestion={currentQuestion}
            selectedAction={selectedAction}
          />
          <OptionsPanel 
            currentQuestion={currentQuestion}
            selectedOption={selectedOption}
            isAnswered={isAnswered}
            selectedAction={selectedAction}
            isPlayerTurn={isPlayerTurn}
            isGameFinished={isGameFinished}
            onOptionClick={handleOptionClick}
            getOptionClass={getOptionClass}
          />
        </section>

        <MonsterPanel 
          selectedMonster={selectedMonster}
          playerHp={playerHp}
          enemyHp={enemyHp}
          playerMaxHp={PLAYER_MAX_HP}
          enemyMaxHp={selectedMonster.hp}
          playerHpPercent={playerHpPercent}
          enemyHpPercent={enemyHpPercent}
          selectedAction={selectedAction}
          isPlayerTurn={isPlayerTurn}
          isGameFinished={isGameFinished}
          feedbackMessage={feedbackMessage}
          nextAction={getNextEnemyAction()}
          getActionIcon={getActionIcon}
          getActionText={getActionText}
          onSelectAction={handleActionSelect}
          onRestartBattle={handleRestartBattle}
        />
      </section>

      <Link to="/" className="back-link">Volver al menú</Link>
    </main>
  )
}

export default QuizPage
