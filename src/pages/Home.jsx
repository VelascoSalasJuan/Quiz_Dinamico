import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="home-page">
      <h1>Quiz Battle</h1>
      <p>Elige tu monstruo y comienza la batalla de preguntas</p>
      <div className="home-actions">
        <Link to="/menu" className="home-button">
          Comenzar Juego
        </Link>
      </div>
    </main>
  )
}

export default Home
