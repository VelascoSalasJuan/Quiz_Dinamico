import './MonsterPanel.css'
import { useState, useEffect, useRef } from 'react'
import HealthBars from './subcomponents/HealthBars.jsx'
import ActionButtons from './subcomponents/ActionButtons/ButtonLogic/ActionButtons.jsx'
import EnemyStatusDisplay from './subcomponents/EnemyStatusDisplay/EnemyStatusDisplay.jsx'
import DamageFlash from './subcomponents/HealthBars/DamageFlash/DamageFlash.jsx'
import HeroAbilityContent from './subcomponents/HeroAbilityContent/HeroAbilityContent.jsx'
import MonsterAbilityContent from './subcomponents/MonsterAbilityContent/MonsterAbilityContent.jsx'
import TurnOrderUI from './subcomponents/TurnOrderUI/TurnOrderUI'

const MonsterPanel = ({ 
  selectedMonster, 
  playerHp, 
  enemyHp, 
  playerMaxHp, 
  enemyMaxHp, 
  playerHpPercent, 
  enemyHpPercent, 
  selectedAction, 
  isPlayerTurn, 
  isGameFinished, 
  feedbackMessage, 
  nextAction, 
  cooldowns, 
  enemyCooldowns, 
  nextEnemyAction, 
  displayEnemyAction, 
  battleActions, 
  showEnemyAction, 
  getActionIcon, 
  getActionText, 
  onSelectAction, 
  onRestartBattle,
  checkCooldown,
  getCooldownRemaining,
  checkEnemyCooldown,
  getEnemyCooldownRemaining,
  playerDamageIndicator,
  enemyDamageIndicator,
  playerDamageFlash,
  enemyDamageFlash
}) => {
  const [gameResult, setGameResult] = useState(null)
  const playerHpBarRef = useRef(null)
  const enemyHpBarRef = useRef(null)

  // Mapeo de acciones a imágenes de habilidades del héroe
  const heroAbilityImages = {
    attack: '/images/Habilidades/Heroe/espada2.jpeg',
    strong: '/images/Habilidades/Heroe/arco2.jpeg',
    dodge: '/images/Habilidades/Heroe/Escudo2.jpeg',
    heal: '/images/Habilidades/Heroe/Curacion2.jpeg'
  }

  // Mapeo de acciones a imágenes de habilidades del monstruo (usando las mismas por ahora)
  const monsterAbilityImages = {
    attack: '/images/Habilidades/Heroe/espada2.jpeg',
    strong: '/images/Habilidades/Heroe/arco2.jpeg',
    dodge: '/images/Habilidades/Heroe/Escudo2.jpeg',
    heal: '/images/Habilidades/Heroe/Curacion2.jpeg'
  }

  // Detectar victoria o derrota cuando HP llega a 0
  useEffect(() => {
    if (playerHp <= 0 && enemyHp > 0) {
      setGameResult('defeat')
    } else if (enemyHp <= 0 && playerHp > 0) {
      setGameResult('victory')
    } else if (playerHp <= 0 && enemyHp <= 0) {
      setGameResult('draw')
    } else {
      setGameResult(null)
    }
  }, [playerHp, enemyHp])

  return (


    <aside className="right-panel">
      {/* Componentes de efecto de brillo al recibir daño - COMENTADO PARA PRESENTACIÓN EN CLASE - BORRAR ESTE COMENTARIO PARA ACTIVAR */}

      <DamageFlash hpBarRef={playerHpBarRef} damageFlash={playerDamageFlash} isEnemy={false} />
      <DamageFlash hpBarRef={enemyHpBarRef} damageFlash={enemyDamageFlash} isEnemy={true} /> 



      {/* Sección de barras de salud con fotos de perfil */}
      <div className="health-bar-section">
        {/* Sección del héroe (izquierda) */}
        <div className="hero-side">
          {/* Barra de salud del héroe - Copia exacta del código proporcionado */}
          <div className="hp-bar-wrap" ref={playerHpBarRef}>
            {/* Icono círculo dorado para foto de perfil */}
            <div className="hp-icon">
              {/* Overlay para foto de perfil */}
              <div className="hp-icon-overlay">
                {false ? ( // Placeholder para imagen futura
                  <img src="/images/hero-profile.png" alt="Héroe" className="hp-icon-image" />
                ) : null}
              </div>
            </div>

            {/* Barra */}
            <div className="hp-bar-outer">
              <div className="hp-bar-inner-frame"></div>
              <div className="hp-bar-bg"></div>
              <div className="hp-bar-fill" id="hpFillHero" style={{width: `${playerHpPercent}%`}}></div>
            </div>
          </div>
        </div>
        
        {/* Separador central */}
        <div className="center-divider"></div>
        
        {/* Sección del monstruo (derecha) */}
        <div className="monster-side">
          {/* Barra de salud del monstruo - Copia exacta del código proporcionado */}
          <div className="hp-bar-wrap" ref={enemyHpBarRef}>
            {/* Barra */}
            <div className="hp-bar-outer">
              <div className="hp-bar-inner-frame"></div>
              <div className="hp-bar-bg"></div>
              <div className="hp-bar-fill" id="hpFillMonster" style={{width: `${enemyHpPercent}%`}}></div>
            </div>

            {/* Icono círculo dorado para foto de perfil */}
            <div className="hp-icon">
              {/* Overlay para foto de perfil */}
              <div className="hp-icon-overlay">
                {selectedMonster.monsterImage ? (
                  <img 
                    src={selectedMonster.monsterImage} 
                    alt=""
                    className="hp-icon-image"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de fondo/escenario del monstruo (fondo principal) */}
      <div
        className="scenario-section"
        style={{
          backgroundImage: selectedMonster.backgroundImage
            ? `url(${selectedMonster.backgroundImage})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Imagen del héroe superpuesta al fondo - parte inferior izquierda */}
        <img
          src="/images/Heroe/output.png"
          alt="OUTPUT - IMAGEN DEL HÉROE"
          className="hero-overlay-image"
          onError={(e) => {
            console.error('Error cargando imagen del héroe:', e)
            e.target.style.display = 'none'
          }}
        />

        {/* Imagen del dragón superpuesta al fondo - parte superior derecha */}
        <img
          src="/images/monsters/Dragon_Jefe.png"
          alt="DRAGON JEFE - IMAGEN DEL MONSTRUO"
          className="monster-overlay-image"
          onError={(e) => {
            console.error('Error cargando imagen del dragón:', e)
            e.target.style.display = 'none'
          }}
        />

        {/* TurnOrderUI - Orden de batalla en esquina inferior derecha */}
        <TurnOrderUI 
          enemies={[]}
          currentEnemyIndex={0}
          enemiesDefeated={[]}
        />

        {/* Sección de habilidades seleccionadas (círculos) - sobre el fondo */}
        <div className="selected-abilities-section">
          {/* Contenedor rectangular del héroe */}
          <div className="ability-container hero-ability-container">
            <HeroAbilityContent selectedAction={selectedAction} heroAbilityImages={heroAbilityImages} getActionText={getActionText} battleActions={battleActions} enableCircleGlow={false} />
          </div>

          {/* Contenedor rectangular del monstruo */}
          <div className="ability-container monster-ability-container">
            <MonsterAbilityContent battleActions={battleActions} monsterAbilityImages={monsterAbilityImages} getActionText={getActionText} enableCircleGlow={false} />
          </div>
        </div>
      </div>
      
      {/* Contenedor de cartas (habilidades) */}
      <ActionButtons 
        selectedAction={selectedAction}
        isPlayerTurn={isPlayerTurn}
        isGameFinished={isGameFinished}
        onSelectAction={onSelectAction}
        onRestartBattle={onRestartBattle}
        checkCooldown={checkCooldown}
        getCooldownRemaining={getCooldownRemaining}
      />
    </aside>
  )
}

export default MonsterPanel
