import { useRef } from 'react'
import useScrollSnap from './hooks/useScrollSnap'
import { AutoPlayProvider } from './contexts/AutoPlayContext'
import Slide01_Title from './components/slides/Slide01_Title'
import Slide02_GeneralAI from './components/slides/Slide02_GeneralAI'
import Slide04_GeneralAI from './components/slides/Slide04_GeneralAI'
import Slide08_GeneralAI from './components/slides/Slide08_GeneralAI'
import Slide05_GeneralAI from './components/slides/Slide05_GeneralAI'

function App() {
  const containerRef = useRef(null)
  const totalSlides = 5
  useScrollSnap(containerRef, totalSlides)

  return (
    <AutoPlayProvider>
      <div ref={containerRef} className="slide-container">
        <Slide01_Title />
        <Slide02_GeneralAI />
        <Slide04_GeneralAI />
        <Slide08_GeneralAI />
        <Slide05_GeneralAI />
      </div>
    </AutoPlayProvider>
  )
}

export default App
