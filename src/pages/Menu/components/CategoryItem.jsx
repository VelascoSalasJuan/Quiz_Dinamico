import './CategoryItem.css'

function CategoryItem({ name, icon, color }) {
  return (
    <button 
      type="button" 
      className="category-item" 
      style={{ borderColor: color, color: color }}
    >
      <span className="category-icon">{icon}</span>
      <span className="category-name">{name}</span>
    </button>
  )
}

export default CategoryItem
