import { useRef, useState, useEffect } from 'react'
import SlideLayout from '../common/SlideLayout'
import { useAutoPlay } from '../../contexts/AutoPlayContext'
import clipVideo from '../../../assets/videos/slide05-clip04.mp4'

export default function Slide05_GeneralAI() {
  const ref = useRef(null)
  const videoRef = useRef(null)
  const [isActiveSlide, setIsActiveSlide] = useState(false)
  const { isAutoPlaying } = useAutoPlay()

  // Slide-05 bg is permanently dark.
  useEffect(() => {
    if (!ref.current) return
    ref.current.style.backgroundColor = '#242424'
  }, [])

  // Advance to slide-06 when video ends.
  const advanceToNext = () => {
    document.getElementById('slide-06')?.scrollIntoView({ behavior: 'auto' })
  }

  // Track activeness + reset/play video on enter/exit.
  useEffect(() => {
    if (!ref.current) return
    const container = document.querySelector('.slide-container')
    let wasIntersecting = false

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const nowIntersecting = entry.intersectionRatio > 0.5
          setIsActiveSlide(nowIntersecting)
          if (nowIntersecting && !wasIntersecting) {
            // Entering: reset + play
            if (videoRef.current) {
              videoRef.current.currentTime = 0
              videoRef.current.play().catch(() => {})
            }
          } else if (!nowIntersecting && wasIntersecting) {
            // Leaving: pause + rewind
            if (videoRef.current) {
              videoRef.current.pause()
              videoRef.current.currentTime = 0
            }
          }
          wasIntersecting = nowIntersecting
        })
      },
      { root: container || null, threshold: [0, 0.5, 1.0] }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // If autoplay resumes while video already ended on this slide, advance.
  useEffect(() => {
    if (!isActiveSlide || !isAutoPlaying) return
    if (videoRef.current?.ended) advanceToNext()
  }, [isActiveSlide, isAutoPlaying])

  return (
    <SlideLayout id="slide-05" ref={ref}>
      <style>{`
        .s05-privacy-title {
          animation: s05Glow 1s ease-in-out infinite;
        }
        @keyframes s05Glow {
          0%, 100% { text-shadow: 0 0 0 rgba(17,95,173,0); }
          50% { text-shadow: 0 0 12px rgba(17,95,173,0.4), 0 0 24px rgba(17,95,173,0.2); }
        }
      `}</style>
      <div style={{
        display: 'flex', gap: '5rem', height: '100%', alignItems: 'center',
      }}>
        {/* Left: Text content */}
        <div className="s05-left" style={{ flex: '0 0 auto', maxWidth: '60%' }}>
          <p style={{
            fontSize: '1rem', fontWeight: 700, color: '#4880f2',
            letterSpacing: '0.08em',
            marginBottom: '1.5rem',
          }}>
            Responsive Mobile
          </p>

          <h2 style={{
            fontSize: '2.75rem', fontWeight: 900, color: '#f5f5f5',
            lineHeight: 1.35, letterSpacing: '-0.02em', marginBottom: '1.5rem',
            whiteSpace: 'nowrap',
          }}>
            시공간의 제약 없이<br />
            언제 어디서나 연결되는 협회 AI
          </h2>

          <p style={{
            fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.8,
          }}>
            PC, 스마트폰 등 기기에 상관없이<br />
            협회의 모든 지식을 실시간으로 활용할 수 있습니다.
          </p>

          <p className="s05-privacy-title" style={{
            fontSize: '0.875rem', fontWeight: 700, color: '#4880f2',
            marginTop: '2.5rem', marginBottom: '0.5rem',
          }}>
            기기 제약 없이 언제 어디서나
          </p>
          <p style={{
            fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.7,
          }}>
            바쁜 진료 중에도, 외부 활동 중에도 협회 정보 접근에 불편함이 없어야 합니다.<br />
            어떤 디바이스에서도 최적화된 화면으로, 필요한 순간 언제 어디서나<br />
            즉각 연결되는 유연한 디지털 환경을 제공합니다.
          </p>

          <p style={{
            fontSize: '0.6875rem', color: '#6b7280', marginTop: '1.5rem',
          }}>
            ※ AI는 명확하지 않은 정보를 줄 수 있으니 한번 더 확인하세요
          </p>
        </div>

        {/* Right: video (plays immediately on slide enter) */}
        <div className="s05-ui" style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            position: 'relative',
            width: '24rem',
          }}>
            <video
              ref={videoRef}
              src={clipVideo}
              muted
              playsInline
              preload="auto"
              onEnded={() => {
                if (!ref.current) return
                const rect = ref.current.getBoundingClientRect()
                if (Math.abs(rect.top) >= window.innerHeight * 0.5) return
                if (!isAutoPlaying) return
                advanceToNext()
              }}
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                background: '#000',
              }}
            />
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
