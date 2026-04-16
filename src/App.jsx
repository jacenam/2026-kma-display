import { useRef } from 'react'
import useScrollSnap from './hooks/useScrollSnap'
import { AutoPlayProvider } from './contexts/AutoPlayContext'
import Slide01_Title from './components/slides/Slide01_Title'
import Slide02_GeneralAI from './components/slides/Slide02_GeneralAI'
import Slide04_GeneralAI from './components/slides/Slide04_GeneralAI'
import Slide08_GeneralAI from './components/slides/Slide08_GeneralAI'
import Slide05_GeneralAI from './components/slides/Slide05_GeneralAI'
import Slide06_GeneralAI from './components/slides/Slide06_GeneralAI'
import Slide07_AdReviewProblem from './components/slides/Slide07_AdReviewProblem'
import Slide08_AiImpact from './components/slides/Slide08_AiImpact'

function App() {
  const containerRef = useRef(null)
  const totalSlides = 8
  useScrollSnap(containerRef, totalSlides)

  return (
    <AutoPlayProvider>
      <div ref={containerRef} className="slide-container">
        <Slide01_Title />
        <Slide02_GeneralAI />
        <Slide04_GeneralAI />
        <Slide08_GeneralAI />
        <Slide05_GeneralAI />
        <Slide07_AdReviewProblem />
        <Slide06_GeneralAI />
        <Slide08_AiImpact />
      </div>
    </AutoPlayProvider>
  )
}

export default App
