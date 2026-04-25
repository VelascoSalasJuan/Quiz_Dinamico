import { Navigate, Route, Routes } from 'react-router-dom'
import MenuPage from './pages/Menu/MenuPage.jsx'
import QuizPage from './pages/Quiz/QuizPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/quiz/:categoryId" element={<QuizPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
