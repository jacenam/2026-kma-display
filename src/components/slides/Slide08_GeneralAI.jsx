import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import SlideLayout from '../common/SlideLayout'
import { useAutoPlay } from '../../contexts/AutoPlayContext'
import displayMockup from '../../../assets/mockups/Apple Pro Display XDR.png'
import clipImage from '../../../assets/images/slide04-clip-image-03.png'
import clipVideo from '../../../assets/videos/slide04-clip03.mp4'

export default function Slide08_GeneralAI() {
  const ref = useRef(null)
  const videoRef = useRef(null)
  const mockupInnerRef = useRef(null)
  const leftRef = useRef(null)
  const [stage, setStage] = useState(0) // 0=normal, 1=expanding, 2=video
  const [darkTheme, setDarkTheme] = useState(false)
  const [isActiveSlide, setIsActiveSlide] = useState(false)
  const { isAutoPlaying } = useAutoPlay()
  const darkThemeTimerRef = useRef(null)
  const isAnimatingRef = useRef(false)
  const lastWheelTimeRef = useRef(0)
  const lastKeyTimeRef = useRef(0)
  const becameActiveAtRef = useRef(Number.MAX_SAFE_INTEGER)

  const isActive = () => {
    if (!ref.current) return false
    const rect = ref.current.getBoundingClientRect()
    return Math.abs(rect.top) < window.innerHeight * 0.5
  }

  // Stage 1 -> animate expansion, then enter stage 2 (video)
  useEffect(() => {
    if (stage !== 1) return
    if (!mockupInnerRef.current || !leftRef.current) return

    const rect = mockupInnerRef.current.getBoundingClientRect()
    const maxTargetWidth = window.innerWidth * 0.88
    const maxTargetHeight = window.innerHeight * 0.96
    const scale = Math.min(maxTargetWidth / rect.width, maxTargetHeight / rect.height)
    const currentCenterX = rect.left + rect.width / 2
    const currentCenterY = rect.top + rect.height / 2
    const dx = window.innerWidth / 2 - currentCenterX
    const dy = window.innerHeight / 2 - currentCenterY

    isAnimatingRef.current = true
    const tl = gsap.timeline({
      onComplete: () => { isAnimatingRef.current = false },
    })
    tl.to(leftRef.current, {
      opacity: 0,
      x: -40,
      duration: 0.5,
      ease: 'power2.in',
    })
      .to(
        mockupInnerRef.current,
        {
          x: dx,
          y: dy,
          scale,
          duration: 1.0,
          ease: 'power2.inOut',
          transformOrigin: 'center center',
          onComplete: () => setStage(2),
        },
        '<0.1'
      )
  }, [stage])

  // Stage 2 -> start video + schedule dark-theme switch 1s later
  useEffect(() => {
    if (stage === 2 && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
      if (darkThemeTimerRef.current) clearTimeout(darkThemeTimerRef.current)
      darkThemeTimerRef.current = setTimeout(() => setDarkTheme(true), 1000)
    }
    return () => {
      if (darkThemeTimerRef.current) {
        clearTimeout(darkThemeTimerRef.current)
        darkThemeTimerRef.current = null
      }
    }
  }, [stage])

  // Apply background color to the slide section with a smooth transition.
  useEffect(() => {
    if (!ref.current) return
    ref.current.style.transition = 'background-color 0.4s ease-in-out'
    ref.current.style.backgroundColor = darkTheme ? '#242424' : '#ffffff'
  }, [darkTheme])

  // Reverse animation: scale/position back to stage 0, fade text in, swap video -> image
  const reverseToStage0 = () => {
    if (!mockupInnerRef.current || !leftRef.current) return
    gsap.killTweensOf(mockupInnerRef.current)
    gsap.killTweensOf(leftRef.current)

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }

    isAnimatingRef.current = true
    setStage(0)
    if (darkThemeTimerRef.current) {
      clearTimeout(darkThemeTimerRef.current)
      darkThemeTimerRef.current = null
    }
    setDarkTheme(false)

    const tl = gsap.timeline({
      onComplete: () => { isAnimatingRef.current = false },
    })
    tl.to(mockupInnerRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: 'power2.inOut',
    })
      .to(
        leftRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.45'
      )
  }

  // Force clean stage-0 state every time slide-08 (re)enters the viewport.
  useEffect(() => {
    if (!ref.current) return
    const container = document.querySelector('.slide-container')
    let wasIntersecting = false

    const forceReset = () => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
      gsap.killTweensOf(mockupInnerRef.current)
      gsap.killTweensOf(leftRef.current)
      if (mockupInnerRef.current) {
        gsap.set(mockupInnerRef.current, { clearProps: 'transform' })
      }
      if (leftRef.current) {
        gsap.set(leftRef.current, { clearProps: 'opacity,transform' })
      }
      if (darkThemeTimerRef.current) {
        clearTimeout(darkThemeTimerRef.current)
        darkThemeTimerRef.current = null
      }
      isAnimatingRef.current = false
      setStage(0)
      setDarkTheme(false)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const nowIntersecting = entry.intersectionRatio > 0.5
          setIsActiveSlide(nowIntersecting)
          if (nowIntersecting && !wasIntersecting) {
            becameActiveAtRef.current = Date.now()
            forceReset()
          } else if (!nowIntersecting && wasIntersecting) {
            forceReset()
          }
          wasIntersecting = nowIntersecting
        })
      },
      { root: container || null, threshold: [0, 0.5, 1.0] }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isActiveSlide || !isAutoPlaying) return
    if (stage === 0) {
      const t = setTimeout(() => setStage(1), 3000)
      return () => clearTimeout(t)
    }
    if (stage === 2 && videoRef.current?.ended) {
      document.getElementById('slide-05')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isActiveSlide, isAutoPlaying, stage])

  // Intercept keyboard / wheel input while slide-08 is active.
  useEffect(() => {
    const SETTLE_MS = 1000
    const INTENT_GAP = 200

    const hasSettled = () => Date.now() - becameActiveAtRef.current > SETTLE_MS

    const handleKeydown = (e) => {
      const now = Date.now()
      const gap = now - lastKeyTimeRef.current
      lastKeyTimeRef.current = now

      if (!isActive()) return
      const isForward = e.code === 'Space' || e.code === 'ArrowDown' || e.code === 'ArrowRight'
      const isBack = e.code === 'ArrowUp' || e.code === 'ArrowLeft'
      if (!isForward && !isBack) return

      if (isAnimatingRef.current) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      if (isForward && stage === 0) {
        if (!hasSettled() || gap < INTENT_GAP) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        e.preventDefault()
        e.stopPropagation()
        setStage(1)
      } else if (isBack && stage > 0) {
        e.preventDefault()
        e.stopPropagation()
        if (gap > INTENT_GAP) reverseToStage0()
      }
    }

    const handleWheel = (e) => {
      const now = Date.now()
      const gap = now - lastWheelTimeRef.current
      lastWheelTimeRef.current = now

      if (!isActive()) return

      if (isAnimatingRef.current) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      if (e.deltaY > 0 && stage === 0) {
        if (!hasSettled() || gap < INTENT_GAP) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        e.preventDefault()
        e.stopPropagation()
        setStage(1)
      } else if (e.deltaY < 0 && stage > 0) {
        e.preventDefault()
        e.stopPropagation()
        if (gap > INTENT_GAP) reverseToStage0()
      }
    }

    window.addEventListener('keydown', handleKeydown, true)
    window.addEventListener('wheel', handleWheel, { capture: true, passive: false })
    return () => {
      window.removeEventListener('keydown', handleKeydown, true)
      window.removeEventListener('wheel', handleWheel, true)
    }
  }, [stage])

  return (
    <SlideLayout id="slide-04" ref={ref}>
      <style>{`
        .s08-privacy-title {
          animation: s08Glow 1s ease-in-out infinite;
        }
        @keyframes s08Glow {
          0%, 100% { text-shadow: 0 0 0 rgba(17,95,173,0); }
          50% { text-shadow: 0 0 12px rgba(17,95,173,0.4), 0 0 24px rgba(17,95,173,0.2); }
        }
      `}</style>
      <div style={{
        display: 'flex', gap: '5rem', height: '100%', alignItems: 'center',
      }}>
        {/* Left: Text content */}
        <div ref={leftRef} className="s08-left" style={{ flex: '0 0 auto', maxWidth: '60%' }}>
          <p style={{
            fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)',
            letterSpacing: '0.08em',
            marginBottom: '1.5rem',
          }}>
            DARK MODE & MULTI-TURN
          </p>

          <h2 style={{
            fontSize: '2.75rem', fontWeight: 900, color: '#0f172a',
            lineHeight: 1.35, letterSpacing: '-0.02em', marginBottom: '1.5rem',
            whiteSpace: 'nowrap',
          }}>
            눈이 편안한 디자인과<br />
            흐름이 끊기지 않는 대화 경험
          </h2>

          <p style={{
            fontSize: '1rem', color: '#334155', lineHeight: 1.8,
          }}>
            세련된 라이트모드와 다크모드를 지원하며,<br />
            과거 대화 맥락을 기억하는 멀티턴 기술로 자연스러운 소통이 가능합니다.
          </p>

          <p className="s08-privacy-title" style={{
            fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)',
            marginTop: '2.5rem', marginBottom: '0.5rem',
          }}>
            다크모드 & 지능형 이어가기
          </p>
          <p style={{
            fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.7,
          }}>
            이전 질문을 다시 설명할 필요 없는 지능형 이어가기 기능으로<br />
            상담의 연속성을 높이고 시각적 피로도를 최소화했습니다.
          </p>

          <p style={{
            fontSize: '0.6875rem', color: '#94a3b8', marginTop: '1.5rem',
          }}>
            ※ AI는 명확하지 않은 정보를 줄 수 있으니 한번 더 확인하세요
          </p>
        </div>

        {/* Right: Display mockup */}
        <div className="s08-ui" style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div ref={mockupInnerRef} style={{
            position: 'relative',
            width: '36rem',
            marginTop: '3rem',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}>
            <img
              src={displayMockup}
              alt="Apple Pro Display XDR"
              style={{
                width: '100%', height: 'auto',
                objectFit: 'contain',
                display: 'block',
                position: 'relative',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />
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
                document.getElementById('slide-05')?.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{
                position: 'absolute',
                top: 'calc(1.2% + 2px)',
                left: '2.25%',
                width: '95.5%',
                height: '73.6%',
                objectFit: 'contain',
                background: '#000',
                zIndex: 1,
                opacity: stage === 2 ? 1 : 0,
                pointerEvents: stage === 2 ? 'auto' : 'none',
              }}
            />
            {stage < 2 && (
              <img
                src={clipImage}
                alt=""
                style={{
                  position: 'absolute',
                  top: 'calc(-1.7% + 2px)',
                  left: '2.25%',
                  width: '95.5%',
                  height: '79.4%',
                  objectFit: 'contain',
                  zIndex: 1,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
