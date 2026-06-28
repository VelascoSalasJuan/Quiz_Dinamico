import './QuizPage.css'
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { monsters } from '../../data/monsters.js'
import { useGameLogic } from './hooks/useGameLogic.js'
import { useBattleLogic } from './hooks/useBattleLogic.js'
import { useQuestionLogic } from './hooks/useQuestionLogic.js'
import MonsterPanel from './components/MonsterPanel/MonsterPanel.jsx'
import QuestionPanel from './components/QuestionPanel/QuestionPanel.jsx'
import OptionsPanel from './components/OptionsPanel/OptionsPanel.jsx'

// Constante para activar/desactivar el overlay de resultado del juego
const ENABLE_GAME_RESULT_OVERLAY = false

// Constante para activar/desactivar el botón de testeo para quitar toda la vida al monstruo
const ENABLE_KILL_ENEMY_BUTTON = true

// Constante para activar/desactivar el overlay básico de testeo con span y botones
const ENABLE_BASIC_RESULT_OVERLAY = true

function QuizPage() {
  const { monsterId } = useParams()
  const selectedMonster = monsters.find((monster) => monster.id === monsterId)
  
  // Hooks personalizados para separar la lógica
  const gameLogic = useGameLogic(selectedMonster)
  const battleLogic = useBattleLogic(selectedMonster, gameLogic)
  const questionLogic = useQuestionLogic(gameLogic)

  // Estado para el resultado del juego
  const [gameResult, setGameResult] = useState(null)

  // Detectar victoria o derrota cuando HP llega a 0
  useEffect(() => {
    if (battleLogic.playerHp <= 0 && battleLogic.enemyHp > 0) {
      setGameResult('defeat')
    } else if (battleLogic.enemyHp <= 0 && battleLogic.playerHp > 0) {
      setGameResult('victory')
    } else if (battleLogic.playerHp <= 0 && battleLogic.enemyHp <= 0) {
      setGameResult('draw')
    } else {
      setGameResult(null)
    }
  }, [battleLogic.playerHp, battleLogic.enemyHp])

  
  return (
    <main className="quiz-page">
      <header className="quiz-header">
        <div className="header-content">
          <div className="header-info">
            <h1>Quiz Battle: {selectedMonster.icon} {selectedMonster.name}</h1>
            <p>
              Turno {gameLogic.turnCount + 1} | Categoria actual: {gameLogic.currentCategory} | Estado:{' '}
              {gameLogic.isGameFinished ? 'Finalizado' : gameLogic.turn === 'enemy' ? 'Turno del monstruo' : 'Tu turno'}
            </p>
            {gameLogic.categoryMessage && <p className="category-event">{gameLogic.categoryMessage}</p>}
          </div>
          {/* Botón temporal para testeo: quitar toda la vida al monstruo */}
          {ENABLE_KILL_ENEMY_BUTTON && (
            <button
              type="button"
              onClick={() => {
                battleLogic.setEnemyHp(0)
              }}
              disabled={gameLogic.isGameFinished}
              className="test-kill-enemy-btn"
              title="Testeo: Quitar toda la vida al monstruo"
            >
              💀 Kill Enemy
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              gameLogic.setFeedbackMessage('Te has rendido. El monstruo gana la batalla.')
              gameLogic.setTurn('finished')
              setTimeout(() => {
                battleLogic.handleRestartBattle()
              }, 2000)
            }}
            disabled={gameLogic.isGameFinished}
            className="surrender-button-header"
            title="Rendirse y reiniciar"
          >
            🏳️ Rendirse
          </button>
          <button
            type="button"
            onClick={() => {
              // Botón temporal para probar TurnOrderUI
              if (window.advanceTurnOrder) {
                window.advanceTurnOrder()
              }
            }}
            className="temp-test-button"
            title="Avanzar enemigo (temporal)"
          >
            ▼
          </button>
        </div>
      </header>

      <section className="quiz-layout">
        <section className="left-panel">
          <QuestionPanel 
            currentQuestion={gameLogic.currentQuestion}
            selectedAction={gameLogic.selectedAction}
          />
          <OptionsPanel 
            currentQuestion={gameLogic.currentQuestion}
            selectedOption={gameLogic.selectedOption}
            isAnswered={questionLogic.isAnswered}
            selectedAction={gameLogic.selectedAction}
            isPlayerTurn={gameLogic.isPlayerTurn}
            isGameFinished={gameLogic.isGameFinished}
            onOptionClick={battleLogic.handleOptionClick}
            getOptionClass={battleLogic.getOptionClass}
          />
        </section>

        <MonsterPanel 
          selectedMonster={selectedMonster}
          playerHp={battleLogic.playerHp}
          enemyHp={battleLogic.enemyHp}
          playerMaxHp={battleLogic.playerMaxHp}
          enemyMaxHp={battleLogic.enemyMaxHp}
          playerHpPercent={battleLogic.playerHpPercent}
          enemyHpPercent={battleLogic.enemyHpPercent}
          selectedAction={gameLogic.selectedAction}
          isPlayerTurn={gameLogic.isPlayerTurn}
          isGameFinished={gameLogic.isGameFinished}
          feedbackMessage={gameLogic.feedbackMessage}
          onSelectAction={gameLogic.setSelectedAction}
          onRestartBattle={battleLogic.handleRestartBattle}
          cooldowns={battleLogic.cooldowns}
          enemyCooldowns={battleLogic.enemyCooldowns}
          nextEnemyAction={battleLogic.nextEnemyAction}
          displayEnemyAction={battleLogic.displayEnemyAction}
          battleActions={battleLogic.battleActions}
          showEnemyAction={battleLogic.showEnemyAction}
          getActionIcon={gameLogic.getActionIcon}
          getActionText={gameLogic.getActionText}
          checkCooldown={battleLogic.checkCooldown}
          getCooldownRemaining={battleLogic.getCooldownRemaining}
          checkEnemyCooldown={battleLogic.checkEnemyCooldown}
          getEnemyCooldownRemaining={battleLogic.getEnemyCooldownRemaining}
          playerDamageIndicator={battleLogic.playerDamageIndicator}
          enemyDamageIndicator={battleLogic.enemyDamageIndicator}
          playerDamageFlash={battleLogic.playerDamageFlash}
          enemyDamageFlash={battleLogic.enemyDamageFlash}
        />
      </section>

      {/* Overlay de resultado del juego que cubre toda la página */}
      {/* COMENTAR LA SIGUIENTE LÍNEA PARA DESACTIVAR EL OVERLAY DE RESULTADO */}
      {ENABLE_GAME_RESULT_OVERLAY && gameResult && (
        <div className={`game-result-overlay ${gameResult}`}>
          <div className="game-result-content">
            <div className="game-result-text">
              {gameResult === 'victory' && '¡VICTORIA!'}
              {gameResult === 'defeat' && '¡DERROTA!'}
              {gameResult === 'draw' && '¡EMPATE!'}
            </div>
            <div className="game-result-buttons">
              <button className="game-result-btn repeat-btn" onClick={battleLogic.handleRestartBattle}>
                Repetir
              </button>
              <button className="game-result-btn exit-btn" onClick={() => window.location.href = '/'}>
                Salir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay básico de testeo con span y botones */}
      {ENABLE_BASIC_RESULT_OVERLAY && gameResult && (
        <div style={{ position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#333', padding: '10px', zIndex: '9999' }}>
          <span style={{ color: '#fff', marginRight: '10px' }}>
            {gameResult === 'victory' && 'ganaste'}
            {gameResult === 'defeat' && 'perdiste'}
            {gameResult === 'draw' && 'empate'}
          </span>
          <button onClick={battleLogic.handleRestartBattle} style={{ marginRight: '5px' }}>Repetir</button>
          <button onClick={() => window.location.href = '/'}>Salir</button>
        </div>
      )}

      <Link to="/" className="back-link">Volver al menú</Link>
    </main>
  )
}

export default QuizPage
