import './MenuPage.css'
import MonsterList from './components/MonsterList.jsx'

function MenuPage() {
  return (
    <main className="menu-page">
      <h1>Elige al monstruo que quieres enfrentar</h1>
      <MonsterList />
    </main>
  )
}

export default MenuPage
