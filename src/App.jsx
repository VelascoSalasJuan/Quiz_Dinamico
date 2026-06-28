import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import MenuPage from './pages/Menu/MenuPage.jsx'
import QuizPage from './pages/Quiz/QuizPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/quiz/:monsterId" element={<QuizPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
