import { useState, useEffect, useCallback } from 'react'

export default function useScrollSnap(containerRef, totalSlides = 1) {
  const [activeSlide, setActiveSlide] = useState(0)

  const scrollToSlide = useCallback((index) => {
    const container = containerRef.current
    if (!container) return
    const clamped = Math.max(0, Math.min(index, totalSlides - 1))
    container.scrollTo({
      top: window.innerHeight * clamped,
      behavior: 'smooth',
    })
  }, [containerRef, totalSlides])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollPos = container.scrollTop
      const slideHeight = window.innerHeight
      const index = Math.round(scrollPos / slideHeight)
      setActiveSlide(index)
    }

    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowDown' || e.code === 'ArrowRight') {
        e.preventDefault()
        setActiveSlide((prev) => {
          const next = Math.min(prev + 1, totalSlides - 1)
          scrollToSlide(next)
          return next
        })
      } else if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') {
        e.preventDefault()
        setActiveSlide((prev) => {
          const next = Math.max(prev - 1, 0)
          scrollToSlide(next)
          return next
        })
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [containerRef, totalSlides, scrollToSlide])

  return { activeSlide, scrollToSlide }
}
