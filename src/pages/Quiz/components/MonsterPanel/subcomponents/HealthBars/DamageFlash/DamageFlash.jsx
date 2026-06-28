import { useEffect } from 'react'
import './DamageFlash.css'

const DamageFlash = ({ hpBarRef, damageFlash, isEnemy }) => {
  useEffect(() => {
    console.log(`${isEnemy ? 'enemy' : 'player'}DamageFlash:`, damageFlash, 'hpBarRef.current:', hpBarRef.current)
    if (damageFlash && hpBarRef.current) {
      const element = hpBarRef.current
      console.log(`Activando animación de brillo en ${isEnemy ? 'enemigo' : 'jugador'}`)
      element.classList.remove('damage-flash')
      void element.offsetWidth // Forzar reflow
      element.classList.add('damage-flash')
      const handleAnimationEnd = () => {
        console.log('Animación terminada, removiendo clase')
        element.classList.remove('damage-flash')
        element.removeEventListener('animationend', handleAnimationEnd)
      }
      element.addEventListener('animationend', handleAnimationEnd)
      return () => {
        element.removeEventListener('animationend', handleAnimationEnd)
      }
    }
  }, [damageFlash, hpBarRef, isEnemy])

  return null // Este componente no renderiza nada, solo maneja el efecto
}

export default DamageFlash
