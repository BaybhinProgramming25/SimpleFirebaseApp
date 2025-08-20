import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '../../public/vite.svg'
import '../styling/App.css'

function App() {
  const [count, setCount] = useState(0)

    const send_to_backend = async () => {
      const countString = count.toString()
      console.log(countString)
      try {
        const response = await fetch("http://localhost:3000/count", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: countString})
        });

        const result = await response.json()
        console.log("Backend Response:", result);
      }
      catch (error) {
        console.error("Error sending data", error);
      }
    }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <button onClick={send_to_backend}></button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
