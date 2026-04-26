export function useQuestionLogic(gameLogic) {
  // La lógica de preguntas ya está manejada principalmente en useGameLogic
  // Este hook puede contener cualquier lógica adicional específica de preguntas si es necesario
  
  const isAnswered = gameLogic.selectedOption !== null
  
  return {
    isAnswered,
    // Aquí podríamos añadir más lógica específica de preguntas si es necesario
  }
}
