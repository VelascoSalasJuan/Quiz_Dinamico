import CategoryItem from './CategoryItem.jsx'

const categories = ['Historia', 'Matemática', 'Deporte', 'Arte', 'Música']

function CategoryList() {
  return (
    <section>
      {categories.map((category) => (
        <CategoryItem key={category} name={category} />
      ))}
    </section>
  )
}

export default CategoryList
