import CategoryItem from './CategoryItem.jsx'

const categories = [
  { name: 'Historia', icon: '🏛️', color: '#8B4513' },
  { name: 'Matemática', icon: '🔢', color: '#FF6347' },
  { name: 'Deporte', icon: '⚽', color: '#32CD32' },
  { name: 'Arte', icon: '🎨', color: '#9370DB' },
  { name: 'Música', icon: '🎵', color: '#FFD700' }
]

function CategoryList() {
  return (
    <section className="category-grid">
      {categories.map((category) => (
        <CategoryItem 
          key={category.name} 
          name={category.name} 
          icon={category.icon} 
          color={category.color} 
        />
      ))}
    </section>
  )
}

export default CategoryList
