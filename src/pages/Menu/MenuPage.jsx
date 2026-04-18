import './MenuPage.css'
import CategoryList from './components/CategoryList.jsx'

function MenuPage() {
  return (
    <main className="menu-page">
      <h1>Selecciona una temática</h1>
      <CategoryList />
    </main>
  )
}

export default MenuPage
