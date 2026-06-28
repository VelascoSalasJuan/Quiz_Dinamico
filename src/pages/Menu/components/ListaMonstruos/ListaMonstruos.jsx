import TarjetaMonstruo from '../TarjetaMonstruo/TarjetaMonstruo.jsx'
import { monsters } from '../../../../data/monsters.js'

function ListaMonstruos() {
  const selectableMonsters = monsters.slice(0, 2)

  return (
    <section className="monster-grid">
      {selectableMonsters.map((monster) => (
        <TarjetaMonstruo
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

export default ListaMonstruos
