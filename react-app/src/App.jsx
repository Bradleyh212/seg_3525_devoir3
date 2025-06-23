import { useState } from 'react'
import './App.css'
import Game from './Game'

function App() {
  const [started, setStarted] = useState(false)

  if (!started) {
    return (
      <div className="home">
        <div className="home_header">
        <h1 className="home_logo">Flip Frenzy</h1>
    </div> 
        <h1 className="home__title">Memory game</h1>
        <p className="home__subtitle">Find the pairs!</p>
        <button
          className="home__start-button"
          onClick={() => setStarted(true)}
        >
          Start
        </button>
      </div>
    )
  }

  
  return started ? (
    <Game />
  ) : (
    <div className="home">
      <h1>Memory game</h1>
      <p>Find the pairs!</p>
      <button onClick={() => setStarted(true)}>Start</button>
    </div>
  );
}

export default App

