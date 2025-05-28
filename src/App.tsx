import { useEffect, useRef } from 'react'
import './App.css'
import { Game } from './game/Game'

function App() {
  const gameRef = useRef<Game | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('App mounting, container:', containerRef.current)
    if (containerRef.current && !gameRef.current) {
      console.log('Creating new Game instance')
      gameRef.current = new Game(containerRef.current)
    }

    return () => {
      if (gameRef.current) {
        console.log('Destroying Game instance')
        gameRef.current.destroy()
        gameRef.current = null
      }
    }
  }, [])

  return (
    <div className="App">
      <div ref={containerRef} id="game-container"></div>
    </div>
  )
}

export default App
