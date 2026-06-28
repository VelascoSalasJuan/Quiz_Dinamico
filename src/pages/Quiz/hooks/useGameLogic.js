import { useState, useEffect, useMemo } from 'react'
import { questions } from '../../../data/questions.js'

const CATEGORY_CHANGE_EVERY_TURNS = 3

export function useGameLogic(selectedMonster) {
  const [turnCount, setTurnCount] = useState(0)
  const [currentCategory, setCurrentCategory] = useState('')
  const [categoryMessage, setCategoryMessage] = useState('')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [turn, setTurn] = useState('player')
  const [feedbackMessage, setFeedbackMessage] = useState('Elige una accion para comenzar.')
  const [selectedAction, setSelectedAction] = useState(null)
  const [dodgeReady, setDodgeReady] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0)

  const availableCategories = useMemo(
    () => [...new Set(questions.map((question) => question.category))],
    [],
  )

  const categoryQuestions = questions.filter((question) => question.category === currentCategory)
  const currentQuestion = categoryQuestions[currentQuestionIndex]

  // Función para generar una acción aleatoria del enemigo
  const generateEnemyAction = () => {
    const actions = ['attack', 'strong', 'heal']
    const weights = [0.5, 0.3, 0.2]
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
    action: null
  })

  // Función para inicializar la timeline
  const initializeTimeline = () => {
    const initialTimeline = []
    for (let i = 0; i < 6; i++) {
      initialTimeline.push(i % 2 === 0 ? generatePlayerTurn() : generateEnemyTurn())
    }
    return initialTimeline
  }

  // Función para avanzar en la timeline
  const advanceTimeline = () => {
    const nextIndex = currentTurnIndex + 1
    
    if (nextIndex >= timeline.length) {
      const newTimeline = [...timeline]
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
    return 'attack'
  }

  // Función para obtener íconos de acción
  const getActionIcon = (action) => {
    const icons = {
      attack: '⚔️',
      strong: '💥',
      heal: '❤️',
      null: '❓'
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

  // Función para avanzar pregunta y categoría
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
      setCategoryMessage(`Categoria inicial: ${newCategory}`)
      setCurrentQuestionIndex(0)
      return
    }

    setCurrentQuestionIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      return nextIndex >= categoryQuestions.length ? 0 : nextIndex
    })
  }

  // Función para reiniciar batalla
  const resetBattle = () => {
    setTurnCount(0)
    setSelectedAction(null)
    setSelectedOption(null)
    setDodgeReady(false)
    setCurrentQuestionIndex(0)
    setCurrentTurnIndex(0)
    setTimeline(initializeTimeline())
    setFeedbackMessage('Batalla reiniciada. Elige una accion.')
  }

  // Función para seleccionar acción
  const selectAction = (action) => {
    setSelectedOption(null)
    setSelectedAction(action)
    setFeedbackMessage('Responde correctamente para ejecutar la accion.')
  }

  // Inicialización del juego
  useEffect(() => {
    if (!selectedMonster) return
    
    setSelectedOption(null)
    setCurrentQuestionIndex(0)
    setTurnCount(0)
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
  }, [selectedMonster?.id])

  return {
    // Estado
    turnCount,
    currentCategory,
    categoryMessage,
    currentQuestionIndex,
    turn,
    feedbackMessage,
    selectedAction,
    dodgeReady,
    selectedOption,
    currentQuestion,
    availableCategories,
    isPlayerTurn: turn === 'player',
    isGameFinished: turn === 'finished',
    
    // Funciones
    setTurnCount,
    setTurn,
    setFeedbackMessage,
    setSelectedOption,
    setSelectedAction,
    setDodgeReady,
    advanceTimeline,
    getCurrentEnemyAction,
    getNextEnemyAction,
    getActionIcon,
    getActionText,
    advanceQuestionAndCategory,
    resetBattle,
    selectAction,
  }
}
