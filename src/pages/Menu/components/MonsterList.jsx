import MonsterCard from './MonsterCard.jsx'
import { monsters } from '../../../data/monsters.js'

function MonsterList() {
  const selectableMonsters = monsters.slice(0, 2)

  return (
    <section className="monster-grid">
      {selectableMonsters.map((monster) => (
        <MonsterCard
          key={monster.id}
          id={monster.id}
          name={monster.name}
          icon={monster.icon}
          color={monster.color}
          hp={monster.hp}
          attack={monster.attack}
        />
      ))}
    </section>
  )
}

export default MonsterList
