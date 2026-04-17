import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import SlideLayout from '../common/SlideLayout'
import { useAutoPlay } from '../../contexts/AutoPlayContext'
import displayMockup from '../../../assets/mockups/Apple Pro Display XDR.png'
import clipVideoA from '../../../assets/videos/slide07-clip05-card-a.mp4'
import clipVideoB from '../../../assets/videos/slide07-clip06-card-b.mp4'

export default function Slide06_GeneralAI() {
  const ref = useRef(null)
  const headerRef = useRef(null)
  const cardABgRef = useRef(null)
  const cardBBgRef = useRef(null)
  const cardACaptionRef = useRef(null)
  const cardBCaptionRef = useRef(null)
  const mockupARef = useRef(null)
  const mockupBRef = useRef(null)
  const videoARef = useRef(null)
  const videoBRef = useRef(null)

  const [phase, setPhase] = useState('idle')
  // 'idle'               — initial (back → slide-06 via browser)
  // 'a-expanding' | 'a-playing'
  // 'a-reversing'        — forward flow (→ waiting → B)
  // 'a-reversing-back'   — back from a-playing (→ navigate to slide-06)
  // 'waiting'            — 3s between A and B
  // 'b-expanding' | 'b-playing'
  // 'b-reversing-back'   — back from b-playing (→ idle-post-b)
  // 'idle-post-b'        — intermediate: back → a-expanding, forward → slide-08
  const [isActiveSlide, setIsActiveSlide] = useState(false)
  const { isAutoPlaying } = useAutoPlay()
  const isAnimatingRef = useRef(false)
  const lastWheelTimeRef = useRef(0)
  const lastKeyTimeRef = useRef(0)
  const becameActiveAtRef = useRef(Number.MAX_SAFE_INTEGER)
  const bTriggerTimerRef = useRef(null)

  const isActive = () => {
    if (!ref.current) return false
    const rect = ref.current.getBoundingClientRect()
    return Math.abs(rect.top) < window.innerHeight * 0.5
  }

  // All non-mockup elements that fade during expansion, plus the OTHER card's mockup
  // (everything except the one scaling mockup)
  const fadingEls = (activeMockupRef) => [
    headerRef.current,
    cardABgRef.current,
    cardACaptionRef.current,
    cardBBgRef.current,
    cardBCaptionRef.current,
    activeMockupRef === mockupARef ? mockupBRef.current : mockupARef.current,
  ].filter(Boolean)

  const expandToCenter = (mockupRef, onDone) => {
    if (!mockupRef.current) return
    const rect = mockupRef.current.getBoundingClientRect()
    const maxTargetWidth = window.innerWidth * 0.88
    const maxTargetHeight = window.innerHeight * 0.96
    const scale = Math.min(maxTargetWidth / rect.width, maxTargetHeight / rect.height)
    const currentCenterX = rect.left + rect.width / 2
    const currentCenterY = rect.top + rect.height / 2
    const dx = window.innerWidth / 2 - currentCenterX
    const dy = window.innerHeight / 2 - currentCenterY

    isAnimatingRef.current = true
    mockupRef.current.style.zIndex = '100'

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false
        onDone?.()
      },
    })
    tl.to(fadingEls(mockupRef), {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    })
      .to(
        mockupRef.current,
        {
          x: dx,
          y: dy,
          scale,
          duration: 1.0,
          ease: 'power2.inOut',
          transformOrigin: 'center center',
        },
        '<0.1'
      )
  }

  const reverseToIdle = (mockupRef, onDone) => {
    if (!mockupRef.current) return
    isAnimatingRef.current = true
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false
        if (mockupRef.current) mockupRef.current.style.zIndex = ''
        onDone?.()
      },
    })
    tl.to(mockupRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: 'power2.inOut',
    }).to(
      fadingEls(mockupRef),
      {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      },
      '-=0.45'
    )
  }

  // Phase transitions
  useEffect(() => {
    if (phase === 'a-expanding') {
      expandToCenter(mockupARef, () => setPhase('a-playing'))
    } else if (phase === 'a-playing') {
      if (videoARef.current) {
        videoARef.current.currentTime = 0
        videoARef.current.play().catch(() => {})
      }
    } else if (phase === 'a-reversing') {
      if (videoARef.current) {
        videoARef.current.pause()
        videoARef.current.currentTime = 0
      }
      reverseToIdle(mockupARef, () => setPhase('waiting'))
    } else if (phase === 'a-reversing-back') {
      if (videoARef.current) {
        videoARef.current.pause()
        videoARef.current.currentTime = 0
      }
      reverseToIdle(mockupARef, () => {
        document.getElementById('slide-06')?.scrollIntoView({ behavior: 'auto' })
      })
    } else if (phase === 'waiting') {
      bTriggerTimerRef.current = setTimeout(() => setPhase('b-expanding'), 3000)
    } else if (phase === 'b-expanding') {
      expandToCenter(mockupBRef, () => setPhase('b-playing'))
    } else if (phase === 'b-playing') {
      if (videoBRef.current) {
        videoBRef.current.currentTime = 0
        videoBRef.current.play().catch(() => {})
      }
    } else if (phase === 'b-reversing-back') {
      if (videoBRef.current) {
        videoBRef.current.pause()
        videoBRef.current.currentTime = 0
      }
      reverseToIdle(mockupBRef, () => setPhase('idle-post-b'))
    }

    return () => {
      if (bTriggerTimerRef.current) {
        clearTimeout(bTriggerTimerRef.current)
        bTriggerTimerRef.current = null
      }
    }
  }, [phase])

  // Force clean idle state on slide enter/exit
  useEffect(() => {
    if (!ref.current) return
    const container = document.querySelector('.slide-container')
    let wasIntersecting = false

    const forceReset = () => {
      if (bTriggerTimerRef.current) {
        clearTimeout(bTriggerTimerRef.current)
        bTriggerTimerRef.current = null
      }
      if (videoARef.current) {
        videoARef.current.pause()
        videoARef.current.currentTime = 0
      }
      if (videoBRef.current) {
        videoBRef.current.pause()
        videoBRef.current.currentTime = 0
      }
      ;[mockupARef, mockupBRef, headerRef, cardABgRef, cardBBgRef, cardACaptionRef, cardBCaptionRef].forEach((r) => {
        if (r.current) gsap.killTweensOf(r.current)
      })
      ;[mockupARef, mockupBRef].forEach((r) => {
        if (r.current) {
          gsap.set(r.current, { clearProps: 'transform,opacity' })
          r.current.style.zIndex = ''
        }
      })
      ;[headerRef, cardABgRef, cardBBgRef, cardACaptionRef, cardBCaptionRef].forEach((r) => {
        if (r.current) gsap.set(r.current, { clearProps: 'opacity' })
      })
      isAnimatingRef.current = false
      setPhase('idle')
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

  // Auto-play: trigger phase A after 3s when active + autoplay.
  // Also: if autoplay resumes while B's video already ended, navigate out.
  useEffect(() => {
    if (!isActiveSlide || !isAutoPlaying) return
    if (phase === 'idle') {
      const t = setTimeout(() => setPhase('a-expanding'), 3000)
      return () => clearTimeout(t)
    }
    if (phase === 'b-playing' && videoBRef.current?.ended) {
      document.getElementById('slide-08')?.scrollIntoView({ behavior: 'auto' })
    }
  }, [isActiveSlide, isAutoPlaying, phase])

  // Keyboard / wheel input while slide-07 is active
  useEffect(() => {
    const SETTLE_MS = 1000
    const INTENT_GAP = 200
    const hasSettled = () => Date.now() - becameActiveAtRef.current > SETTLE_MS

    const cancelBTimer = () => {
      if (bTriggerTimerRef.current) {
        clearTimeout(bTriggerTimerRef.current)
        bTriggerTimerRef.current = null
      }
    }

    const doForward = () => {
      if (phase === 'idle') {
        setPhase('a-expanding')
      } else if (phase === 'a-playing') {
        setPhase('a-reversing')
      } else if (phase === 'waiting') {
        cancelBTimer()
        setPhase('b-expanding')
      } else if (phase === 'b-playing') {
        if (videoBRef.current) {
          videoBRef.current.pause()
          videoBRef.current.currentTime = 0
        }
        document.getElementById('slide-08')?.scrollIntoView({ behavior: 'auto' })
      } else if (phase === 'idle-post-b') {
        // After backing out from B, forward continues to slide-01
        document.getElementById('slide-08')?.scrollIntoView({ behavior: 'auto' })
      }
    }

    const doBack = () => {
      if (phase === 'a-playing') {
        setPhase('a-reversing-back')
      } else if (phase === 'waiting') {
        cancelBTimer()
        setPhase('a-expanding')
      } else if (phase === 'b-playing') {
        setPhase('b-reversing-back')
      } else if (phase === 'idle-post-b') {
        setPhase('a-expanding')
      }
    }

    // Should we intercept this input? (If not, let browser/scroll-snap handle it, e.g. go to prev/next slide)
    const shouldHandle = (isForward, isBack) => {
      if (isForward) {
        return phase === 'idle' || phase === 'a-playing' || phase === 'waiting' || phase === 'b-playing' || phase === 'idle-post-b'
      }
      if (isBack) {
        return phase === 'a-playing' || phase === 'waiting' || phase === 'b-playing' || phase === 'idle-post-b'
      }
      return false
    }

    const handleKeydown = (e) => {
      if (!isActive()) return
      const isForward = e.code === 'Space' || e.code === 'ArrowDown' || e.code === 'ArrowRight'
      const isBack = e.code === 'ArrowUp' || e.code === 'ArrowLeft'
      if (!isForward && !isBack) return

      if (isAnimatingRef.current) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      const now = Date.now()
      const gap = now - lastKeyTimeRef.current
      lastKeyTimeRef.current = now

      if (!shouldHandle(isForward, isBack)) return

      if (phase === 'idle' && (!hasSettled() || gap < INTENT_GAP)) {
        // Ignore trailing events from the scroll that brought us here
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (gap < INTENT_GAP) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      e.preventDefault()
      e.stopPropagation()
      if (isForward) doForward()
      else doBack()
    }

    const handleWheel = (e) => {
      if (!isActive()) return
      const isForward = e.deltaY > 0
      const isBack = e.deltaY < 0
      if (!isForward && !isBack) return

      if (isAnimatingRef.current) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      const now = Date.now()
      const gap = now - lastWheelTimeRef.current
      lastWheelTimeRef.current = now

      if (!shouldHandle(isForward, isBack)) return

      if (phase === 'idle' && (!hasSettled() || gap < INTENT_GAP)) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (gap < INTENT_GAP) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      e.preventDefault()
      e.stopPropagation()
      if (isForward) doForward()
      else doBack()
    }

    window.addEventListener('keydown', handleKeydown, true)
    window.addEventListener('wheel', handleWheel, { capture: true, passive: false })
    return () => {
      window.removeEventListener('keydown', handleKeydown, true)
      window.removeEventListener('wheel', handleWheel, true)
    }
  }, [phase])

  const onVideoAEnded = () => {
    if (!isActive()) return
    setPhase('a-reversing')
  }

  const onVideoBEnded = () => {
    if (!isActive()) return
    if (!isAutoPlaying) return
    document.getElementById('slide-08')?.scrollIntoView({ behavior: 'auto' })
  }

  // Outer card wrapper: layout only (no background — that lives on a separate inner div so it can fade independently of the mockup)
  const cardBoxStyle = {
    position: 'relative',
    borderRadius: '20px',
    padding: '2.5rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: '16 / 11',
    isolation: 'isolate',
  }
  const cardBgStyle = {
    position: 'absolute',
    inset: 0,
    background: '#1e1e1e',
    borderRadius: '20px',
    zIndex: 0,
  }
  const mockupInnerStyle = {
    position: 'relative',
    zIndex: 1,
    width: '85%',
    willChange: 'transform',
    backfaceVisibility: 'hidden',
  }

  return (
    <SlideLayout id="slide-07" ref={ref}>
      <div style={{
        display: 'flex', flexDirection: 'column',
        height: '100%', justifyContent: 'center',
        gap: '2.5rem',
      }}>
        {/* Header */}
        <div ref={headerRef}>
          <p style={{
            fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)',
            letterSpacing: '0.08em',
            marginBottom: '1rem',
          }}>
            AI MEDICAL AD REVIEW
          </p>
          <h2 style={{
            fontSize: '3rem', fontWeight: 900, color: '#0f172a',
            lineHeight: 1.1, letterSpacing: '-0.03em',
            margin: 0,
          }}>
            AI 의료광고 심의로<br />
            <span style={{ color: 'var(--color-primary)' }}>더</span> 빠르고, <span style={{ color: 'var(--color-primary)' }}>더</span> 정확하게.
          </h2>
        </div>

        {/* Two cards */}
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          {/* Card A */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={cardBoxStyle}>
              <div ref={cardABgRef} style={cardBgStyle} />
              <div ref={mockupARef} style={mockupInnerStyle}>
                <img
                  src={displayMockup}
                  alt="Apple Pro Display XDR"
                  style={{
                    width: '100%', height: 'auto',
                    display: 'block',
                    position: 'relative',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                />
                <video
                  ref={videoARef}
                  src={clipVideoA}
                  muted
                  playsInline
                  preload="auto"
                  onEnded={onVideoAEnded}
                  style={{
                    position: 'absolute',
                    top: 'calc(1.2% + 2px)',
                    left: '2.25%',
                    width: '95.5%',
                    height: '73.6%',
                    objectFit: 'contain',
                    background: '#000',
                    zIndex: 1,
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    pointerEvents: phase === 'a-playing' ? 'auto' : 'none',
                  }}
                />
              </div>
            </div>
            <div ref={cardACaptionRef}>
              <p style={{
                fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)',
                margin: 0, marginBottom: '0.5rem',
              }}>
                실시간 AI 심의 솔루션
              </p>
              <p style={{
                fontSize: '1rem', lineHeight: 1.55, color: '#0f172a', margin: 0,
                wordBreak: 'keep-all',
              }}>
                신청과 동시에 AI가 가이드라인 위반 가능성을 사전 검토합니다.
                신청자는 접수 단계에서 통과 가능성을 확인하고,
                담당자는 AI 1차 검토 결과를 기반으로 쟁점 있는 건에 집중할 수 있어
                심의 통과 시간이 압도적으로 단축됩니다.
              </p>
              <p style={{
                fontSize: '0.6875rem', color: '#94a3b8',
                marginTop: '2rem', marginBottom: 0,
              }}>
                ※ AI는 명확하지 않은 정보를 줄 수 있으니 한번 더 확인하세요
              </p>
            </div>
          </div>

          {/* Card B */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={cardBoxStyle}>
              <div ref={cardBBgRef} style={cardBgStyle} />
              <div ref={mockupBRef} style={mockupInnerStyle}>
                <img
                  src={displayMockup}
                  alt="Apple Pro Display XDR"
                  style={{
                    width: '100%', height: 'auto',
                    display: 'block',
                    position: 'relative',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                />
                <video
                  ref={videoBRef}
                  src={clipVideoB}
                  muted
                  playsInline
                  preload="auto"
                  onEnded={onVideoBEnded}
                  style={{
                    position: 'absolute',
                    top: 'calc(1.2% + 2px)',
                    left: '2.25%',
                    width: '95.5%',
                    height: '73.6%',
                    objectFit: 'contain',
                    background: '#000',
                    zIndex: 1,
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    pointerEvents: phase === 'b-playing' ? 'auto' : 'none',
                  }}
                />
              </div>
            </div>
            <div ref={cardBCaptionRef}>
              <p style={{
                fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)',
                margin: 0, marginBottom: '0.5rem',
              }}>
                가이드라인 맞춤형 'AI 빨간펜'
              </p>
              <p style={{
                fontSize: '1rem', lineHeight: 1.55, color: '#0f172a', margin: 0,
                wordBreak: 'keep-all',
              }}>
                최신 의료광고 심의 가이드라인을 근거로 문제 지점을 정확히 표시합니다.
                어떤 문구에 문제가 있는지 직관적으로 확인할 수 있어,
                심의 신청 전에 가이드라인을 학습하지 않아도
                피드백에 따라 손쉽게 수정할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
