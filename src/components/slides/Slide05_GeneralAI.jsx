import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import SlideLayout from '../common/SlideLayout'
import { useAutoPlay } from '../../contexts/AutoPlayContext'
import clipVideo from '../../../assets/videos/slide05-clip04.mp4'

export default function Slide05_GeneralAI() {
  const ref = useRef(null)
  const videoRef = useRef(null)
  const mockupInnerRef = useRef(null)
  const leftRef = useRef(null)
  const [stage, setStage] = useState(0) // 0=normal, 1=expanding, 2=video
  const [mountKey, setMountKey] = useState(0) // bump to force-remount mockup subtree
  const [isActiveSlide, setIsActiveSlide] = useState(false)
  const { isAutoPlaying } = useAutoPlay()
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
    const maxTargetWidth = window.innerWidth * 0.55
    const maxTargetHeight = window.innerHeight * 0.78
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

  // Stage 2 -> start video
  useEffect(() => {
    if (stage === 2 && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }, [stage])

  // Slide-05 bg is permanently dark.
  useEffect(() => {
    if (!ref.current) return
    ref.current.style.backgroundColor = '#242424'
  }, [])

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

  // Force clean stage-0 state every time slide-05 (re)enters the viewport.
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
      isAnimatingRef.current = false
      setStage(0)
      setMountKey((k) => k + 1)
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
      document.getElementById('slide-01')?.scrollIntoView({ behavior: 'auto' })
    }
  }, [isActiveSlide, isAutoPlaying, stage])

  // Intercept keyboard / wheel input while slide-05 is active.
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
      <div key={mountKey} style={{
        display: 'flex', gap: '5rem', height: '100%', alignItems: 'center',
      }}>
        {/* Left: Text content */}
        <div ref={leftRef} className="s05-left" style={{ flex: '0 0 auto', maxWidth: '60%' }}>
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
            언제 어디서나 내 손안의<br />
            똑똑한 업무 환경
          </h2>

          <p style={{
            fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.8,
          }}>
            모바일 기기에 최적화된 반응형 인터페이스를 통해<br />
            PC와 동일한 수준의 사용자 경험을 제공합니다.
          </p>

          <p className="s05-privacy-title" style={{
            fontSize: '0.875rem', fontWeight: 700, color: '#4880f2',
            marginTop: '2.5rem', marginBottom: '0.5rem',
          }}>
            모바일도 대응된 휴대성
          </p>
          <p style={{
            fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.7,
          }}>
            장소에 구애받지 않고 이동 중에도 신속하게 업무 자료를 확인하고<br />
            질문할 수 있는 극강의 휴대성을 제공합니다.
          </p>

          <p style={{
            fontSize: '0.6875rem', color: '#6b7280', marginTop: '1.5rem',
          }}>
            ※ AI는 명확하지 않은 정보를 줄 수 있으니 한번 더 확인하세요
          </p>
        </div>

        {/* Right: video only (no mockup frame) */}
        <div className="s05-ui" style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div ref={mockupInnerRef} style={{
            position: 'relative',
            width: '22rem',
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
                // Loop back to slide-01 immediately (no smooth-scroll delay).
                document.getElementById('slide-01')?.scrollIntoView({ behavior: 'auto' })
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
