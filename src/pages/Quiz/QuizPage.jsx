import './QuizPage.css'
import { useParams, Link } from 'react-router-dom'
import { monsters } from '../../data/monsters.js'
import { useGameLogic } from './hooks/useGameLogic.js'
import { useBattleLogic } from './hooks/useBattleLogic.js'
import { useQuestionLogic } from './hooks/useQuestionLogic.js'
import MonsterPanel from './components/MonsterPanel/MonsterPanel.jsx'
import QuestionPanel from './components/QuestionPanel/QuestionPanel.jsx'
import OptionsPanel from './components/OptionsPanel/OptionsPanel.jsx'

function QuizPage() {
  const { monsterId } = useParams()
  const selectedMonster = monsters.find((monster) => monster.id === monsterId)
  
  // Hooks personalizados para separar la lógica
  const gameLogic = useGameLogic(selectedMonster)
  const battleLogic = useBattleLogic(selectedMonster, gameLogic)
  const questionLogic = useQuestionLogic(gameLogic)

  
  return (
    <main className="quiz-page">
      <header className="quiz-header">
        <h1>Quiz Battle: {selectedMonster.icon} {selectedMonster.name}</h1>
        <p>
          Turno {gameLogic.turnCount + 1} | Categoria actual: {gameLogic.currentCategory} | Estado:{' '}
          {gameLogic.isGameFinished ? 'Finalizado' : gameLogic.turn === 'enemy' ? 'Turno del monstruo' : 'Tu turno'}
        </p>
        {gameLogic.categoryMessage && <p className="category-event">{gameLogic.categoryMessage}</p>}
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
          nextAction={battleLogic.nextEnemyAction}
          getActionIcon={gameLogic.getActionIcon}
          getActionText={gameLogic.getActionText}
          onSelectAction={gameLogic.selectAction}
          onRestartBattle={battleLogic.handleRestartBattle}
          checkCooldown={battleLogic.checkCooldown}
          getCooldownRemaining={battleLogic.getCooldownRemaining}
          checkEnemyCooldown={battleLogic.checkEnemyCooldown}
          getEnemyCooldownRemaining={battleLogic.getEnemyCooldownRemaining}
          battleActions={battleLogic.battleActions}
          showEnemyAction={battleLogic.showEnemyAction}
        />
      </section>

      <Link to="/" className="back-link">Volver al menú</Link>
    </main>
  )
}

export default QuizPage
