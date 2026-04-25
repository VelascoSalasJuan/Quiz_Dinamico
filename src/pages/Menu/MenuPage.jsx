import './MenuPage.css'
import ListaMonstruos from './components/ListaMonstruos/ListaMonstruos.jsx'

function MenuPage() {
  return (
    <main className="menu-page">
      <h1>Elige al monstruo que quieres enfrentar</h1>
      <ListaMonstruos />
    </main>
  )
}

export default MenuPage
