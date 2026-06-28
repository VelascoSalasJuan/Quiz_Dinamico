# 📚 Documentación del Proyecto Quiz Dinámico

## 🎯 **Descripción General del Proyecto**

**Quiz Dinámico** es una aplicación web interactiva de preguntas y respuestas con sistema de combate por turnos. Los jugadores responden preguntas de diferentes categorías y, según sus respuestas, ejecutan acciones de combate contra monstruos con habilidades especiales, sistema de cooldowns y efectos visuales.

---

## 📁 **Estructura del Proyecto**

### **🔧 Archivos de Configuración (Raíz)**

| Archivo | Propósito | Contenido |
|---------|-----------|-----------|
| `package.json` | Configuración del proyecto | Dependencias (React, Router), scripts (dev, build, lint) |
| `vite.config.js` | Configuración de Vite | Configuración del bundler y servidor de desarrollo |
| `eslint.config.js` | Configuración de ESLint | Reglas de linting para mantener código limpio |
| `index.html` | Plantilla HTML | Punto de entrada de la aplicación |
| `.gitignore` | Ignorar archivos | Archivos y carpetas que Git debe ignorar |
| `README.md` | Documentación básica | Información general del proyecto |

---

## 📂 **Estructura de Carpetas Principales**

### **📁 `/src` - Código Fuente Principal**

Carpeta principal que contiene todo el código fuente de la aplicación.

#### **📁 `/src/assets` - Recursos Estáticos**
- **Propósito:** Imágenes, iconos y otros recursos estáticos
- **Contenido:** Assets visuales del juego

#### **📁 `/src/components` - Componentes Globales**
- **Propósito:** Componentes reutilizables en toda la aplicación
- **Contenido:** Componentes UI comunes

#### **📁 `/src/data` - Datos del Juego**
- **Propósito:** Datos estáticos del juego (monstruos, preguntas)
- **Contenido:** 
  - `monsters.js` - Definición de monstruos con sus características
  - `questions.js` - Base de datos de preguntas por categorías

#### **📁 `/src/hooks` - Hooks Personalizados Globales**
- **Propósito:** Hooks reutilizables en toda la aplicación
- **Contenido:** Lógica de estado y efectos compartidos

#### **📁 `/src/pages` - Páginas de la Aplicación**
- **Propósito:** Componentes de página principales
- **Contenido:** Home, Menu, Quiz, Result, global

#### **📁 `/src/styles` - Estilos Globales**
- **Propósito:** CSS global y variables de estilo
- **Contenido:** Estilos compartidos entre componentes

#### **📁 `/src/utils` - Utilidades**
- **Propósito:** Funciones helper y utilidades
- **Contenido:** Funciones reutilizables

---

## 🎮 **Sistema de Juego - `/src/pages/Quiz`**

### **📄 Página Principal**
- **`QuizPage.jsx`** - Componente principal del juego
- **`QuizPage.css`** - Estilos de la página de juego

### **🧩 Componentes del Juego (`/components`)**

#### **🎯 `MonsterPanel` - Panel del Enemigo**
- **Propósito:** Muestra información del monstruo y estado de combate
- **Componentes principales:**
  - `MonsterPanel.jsx` - Contenedor principal del panel
  - `MonsterPanel.css` - Estilos del panel

#### **🔧 Subcomponentes de MonsterPanel (`/subcomponents`)**

| Componente | Propósito | Funcionalidad |
|-------------|-----------|---------------|
| `HealthBars.jsx/.css` | Barras de vida | Muestra HP de jugador y enemigo con indicadores visuales |
| `ActionButtons.jsx/.css` | Botones de acción | Botones de ataque, strong, dodge, heal con cooldowns |
| `NextActionIndicator.jsx/.css` | Indicador de acción | Muestra próxima acción del enemigo |
| `BattleActionsDisplay.jsx/.css` | Display de batalla | Muestra acciones seleccionadas en tiempo real |
| `CooldownIndicator.jsx/.css` | Indicador de cooldown | Muestra tiempo restante de habilidades |
| `EnemyStatusDisplay.jsx/.css` | Estado del enemigo | Muestra cooldowns del enemigo |

#### **📝 Otros Componentes**
- **`QuestionPanel`** - Panel de preguntas
- **`OptionsPanel`** - Panel de opciones de respuesta
- **`AnswerOptions`** - Componente de opciones de respuesta
- **`QuestionCard`** - Tarjeta de pregunta
- **`QuizFooter`** - Pie de página del quiz

### **🎯 Hooks Personalizados del Juego (`/hooks`)**

#### **🧠 `useGameLogic.js` - Lógica Principal del Juego**
- **Propósito:** Maneja el flujo principal del juego
- **Funcionalidades:**
  - Gestión de turnos
  - Control de preguntas y categorías
  - Estado del juego (finished, player turn, enemy turn)
  - Feedback y mensajes
  - Avance de timeline

#### **⚔️ `useBattleLogic.js` - Coordinador de Batalla**
- **Propósito:** Orquesta el sistema de combate
- **Funcionalidades:**
  - Coordina todos los hooks de batalla
  - Maneja clic en opciones de respuesta
  - Procesa resultados de batalla
  - Gestiona reinicio de batallas

#### **🎯 `useBattleState.js` - Estado de Batalla**
- **Propósito:** Gestiona el estado del combate
- **Funcionalidades:**
  - HP de jugador y enemigo (base 100)
  - Indicadores visuales de daño/curación
  - Acciones seleccionadas
  - Procesamiento de batalla
  - Reset de estados

#### **⚡ `useAbilitiesLogic.js` - Sistema de Habilidades**
- **Propósito:** Maneja habilidades y cooldowns
- **Funcionalidades:**
  - Definición de habilidades (Attack, Strong, Dodge, Heal)
  - Sistema de cooldowns para jugador y enemigo
  - Validación de uso de habilidades
  - Gestión de tiempos de espera

#### **🤖 `useEnemyAI.js` - Inteligencia del Enemigo**
- **Propósito:** Controla las decisiones del enemigo
- **Funcionalidades:**
  - Generación de acciones del enemigo
  - Lógica de decisión basada en cooldowns
  - Selección aleatoria de habilidades disponibles

#### **❓ `useQuestionLogic.js` - Lógica de Preguntas**
- **Propósito:** Maneja el estado de las preguntas
- **Funcionalidades:**
  - Estado de respuestas
  - Validación de opciones seleccionadas

---

## 🎮 **Mecánicas del Juego**

### **⚔️ Sistema de Combate**

#### **Habilidades Disponibles:**
- **Attack** - 10 de daño, sin cooldown
- **Strong** - 20 de daño, 2 turnos de cooldown
- **Dodge** - Esquiva siguiente ataque, 3 turnos de cooldown
- **Heal** - +25 HP, 4 turnos de cooldown

#### **Flujo de Combate:**
1. Jugador selecciona habilidad
2. Se presenta pregunta
3. Si responde correctamente → Se ejecuta batalla completa
4. Si responde incorrectamente → Solo ataque del enemigo (castigo)
5. Se aplican efectos visuales y cooldowns
6. Avanza al siguiente turno

### **📊 Sistema de HP y Visualización**
- **HP Base:** 100 para jugador y enemigos
- **Barras de vida:** Visuales con porcentajes
- **Indicadores de daño:** -10 (rojo), +25 (verde)
- **Texto dinámico:** "HP jugador: 90 / 100"

### **🔄 Sistema de Cooldowns**
- **Cooldowns individuales** por habilidad
- **Reducción automática** cada turno
- **Indicadores visuales** de tiempo restante
- **Validación de uso** de habilidades

---

## 🛠️ **Tecnologías Utilizadas**

### **Frontend:**
- **React 19.2.4** - Biblioteca principal de UI
- **React Router DOM 7.14.2** - Navegación entre páginas
- **Vite 8.0.4** - Herramienta de desarrollo y build

### **Desarrollo:**
- **ESLint** - Linting y calidad de código
- **JavaScript ES6+** - Lenguaje de programación
- **CSS3** - Estilos y animaciones

---

## 🎯 **Características Especiales**

### **✨ Interfaz Visual**
- **Indicadores de daño/curación** animados
- **Barras de vida** dinámicas
- **Cooldowns** visuales con contadores
- **Transiciones suaves** entre turnos

### **🧠 Arquitectura Modular**
- **Hooks especializados** para cada funcionalidad
- **Separación de responsabilidades**
- **Código reutilizable** y mantenible
- **Estado centralizado** y predecible

### **🎮 Experiencia de Usuario**
- **Feedback inmediato** en cada acción
- **Mensajes descriptivos** de estado
- **Sistema de turnos** claro
- **Controles intuitivos**

---

## 📋 **Resumen de Funcionalidades**

### **✅ Implementado:**
- [x] Sistema de preguntas por categorías
- [x] Sistema de combate por turnos
- [x] 4 habilidades con cooldowns
- [x] IA del enemigo con decisiones inteligentes
- [x] Indicadores visuales de daño/curación
- [x] Barras de vida dinámicas
- [x] Sistema de cooldowns visual
- [x] Arquitectura modular con hooks
- [x] Navegación entre páginas
- [x] Sistema de resultados

### **🚀 Estado del Proyecto:**
- **Versión:** 0.0.0
- **Estado:** Completo y funcional
- **Listo para:** Presentación y producción

---

## 🎯 **Cómo Ejecutar el Proyecto**

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar linting
npm run lint

# Previsualizar build
npm run preview
```

---

## 📞 **Información de Contacto**

**Proyecto desarrollado por:** Juan Velasco Salas  
**Tecnología:** React + Vite  
**Año:** 2025  

---

*Esta documentación cubre toda la estructura y funcionalidad del proyecto Quiz Dinámico.*
