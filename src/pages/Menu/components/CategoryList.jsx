import CategoryButton from './CategoryButton.jsx'
import { categories } from '../../../data/categories.js'

function CategoryList() {
  return (
    <section className="category-grid">
      {categories.map((category) => (
        <CategoryButton
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

export default CategoryList
