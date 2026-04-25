import BotonCategoria from '../BotonCategoria/BotonCategoria.jsx'
import { categories } from '../../../../data/categories.js'

function ListaCategorias() {
  return (
    <section className="category-grid">
      {categories.map((category) => (
        <BotonCategoria
          key={category.id}
          id={category.id}
          name={category.name}
          icon={category.icon}
          color={category.color}
        />
      ))}
    </section>
  )
}

export default ListaCategorias
