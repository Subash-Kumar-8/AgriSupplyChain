import { useState } from 'react'
import {createRoot} from 'react-dom/client'
import FarmHome from './Pages/farmHome'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FarmHome />
    </>
  )
}

export default App
