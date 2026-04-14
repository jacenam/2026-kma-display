import { createContext, useContext, useEffect, useRef, useState } from 'react'

const AutoPlayContext = createContext({ isAutoPlaying: true })

const IDLE_MS = 5000 // 5s of no input → resume auto-play

export function AutoPlayProvider({ children }) {
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const idleTimerRef = useRef(null)

  useEffect(() => {
    const resumeAfterIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        setIsAutoPlaying(true)
      }, IDLE_MS)
    }

    const onActivity = () => {
      setIsAutoPlaying(false)
      resumeAfterIdle()
    }

    const onKeydown = (e) => {
      // Only arrow keys and space count as pause-triggering input.
      if (
        e.code === 'Space' ||
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown' ||
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight'
      ) {
        onActivity()
      }
    }

    window.addEventListener('keydown', onKeydown)
    window.addEventListener('wheel', onActivity, { passive: true })

    return () => {
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('wheel', onActivity)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  return (
    <AutoPlayContext.Provider value={{ isAutoPlaying }}>
      {children}
    </AutoPlayContext.Provider>
  )
}

export const useAutoPlay = () => useContext(AutoPlayContext)
