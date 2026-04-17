import { useRef, useEffect, useState } from 'react'
import useSlideAnimation from '../../hooks/useSlideAnimation'
import { useAutoPlay } from '../../contexts/AutoPlayContext'

export default function Slide01_Title() {
  const ref = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const { isAutoPlaying } = useAutoPlay()

  useSlideAnimation(ref, (gsap) => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from('.s01-bg', { opacity: 0, duration: 1.5 })
      .from('.s01-label', { opacity: 0, y: 20, duration: 0.6 }, '-=0.8')
      .from('.s01-title', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4')
  })

  // Track when slide-01 is the active slide via IntersectionObserver
  useEffect(() => {
    if (!ref.current) return
    const container = document.querySelector('.slide-container')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsActive(entry.intersectionRatio > 0.5)
        })
      },
      { root: container || null, threshold: [0, 0.5, 1.0] }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Auto-advance to slide-02 after 3s when active + auto-playing
  useEffect(() => {
    if (!isActive || !isAutoPlaying) return
    const t = setTimeout(() => {
      document.getElementById('slide-02')?.scrollIntoView({ behavior: 'smooth' })
    }, 5000)
    return () => clearTimeout(t)
  }, [isActive, isAutoPlaying])

  return (
    <section id="slide-01" ref={ref} className="slide" style={{
      position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 25% 20%, #f2f7fc 0%, #dde8f4 35%, #c2d4e7 70%, #a8bfd8 100%)',
    }}>
      <style>{`
        .s01-kma {
          background: linear-gradient(
            90deg,
            var(--color-primary) 0%,
            var(--color-primary) 40%,
            #7fb4ff 50%,
            var(--color-primary) 60%,
            var(--color-primary) 100%
          );
          background-size: 250% auto;
          background-repeat: no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: s01KmaShimmer 2s linear infinite;
        }
        @keyframes s01KmaShimmer {
          0% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
      `}</style>
      <div className="s01-bg" style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        height: '100%',
        maxWidth: '1440px', width: '100%', margin: '0 auto',
        padding: '0 4rem',
      }}>
        <p className="s01-label" style={{
          fontSize: '1rem', fontWeight: 700, letterSpacing: '0.08em',
          color: 'var(--color-primary)',
          marginBottom: '1.25rem',
        }}>
          2026 KMA 정기 대의원 총회
        </p>

        <h1 className="s01-title s01-kma" style={{
          fontSize: '3.75rem', fontWeight: 900, lineHeight: 1.25,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
        }}>
          대한의사협회 통합정보시스템 리뉴얼 소개
        </h1>
      </div>
    </section>
  )
}
