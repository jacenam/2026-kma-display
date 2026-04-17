import { useRef, useEffect, useState } from 'react'
import SlideLayout from '../common/SlideLayout'
import { useAutoPlay } from '../../contexts/AutoPlayContext'

const CARDS = [
  {
    id: 'legal',
    color: '#8b5cf6',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    header: '일관된 기준으로 판단하는 AI 심의',
    desc: '의료법, 심의 가이드라인을 100% 참고한 법규 추론 LLM 모델이 빠르고 일관성 있게 심의합니다',
  },
  {
    id: 'human',
    color: '#f97316',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    header: 'AI + Human-in-the-Loop',
    desc: 'AI의 1차 심의에 담당자의 최종 검토가 더해지는 2중 구조로, 속도와 정확도를 동시에 확보합니다. 예외 상황에서는 담당자가 최종 판단을 내려 유연하게 대응합니다.',
  },
  {
    id: 'speed',
    color: '#14b8a6',
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    header: '심의의 양과 질, 동시에 개선합니다',
    desc: 'AI 의료광고 심의로 수기 검토 시간을 대폭 단축하고, 확보된 여력만큼 더 정밀한 최종 검토가 가능해집니다.',
  },
]

export default function Slide08_AiImpact() {
  const ref = useRef(null)
  const [isActiveSlide, setIsActiveSlide] = useState(false)
  const { isAutoPlaying } = useAutoPlay()

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.backgroundColor = '#242424'
  }, [])

  // Track activeness
  useEffect(() => {
    if (!ref.current) return
    const container = document.querySelector('.slide-container')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsActiveSlide(entry.intersectionRatio > 0.5)
        })
      },
      { root: container || null, threshold: [0, 0.5, 1.0] }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Auto-advance to slide-01 after 3s; every N loops, reload as a memory-safety net.
  const LOOPS_BEFORE_RELOAD = 10
  useEffect(() => {
    if (!isActiveSlide || !isAutoPlaying) return
    const t = setTimeout(() => {
      const count = parseInt(sessionStorage.getItem('loopCount') || '0', 10) + 1
      if (count >= LOOPS_BEFORE_RELOAD) {
        sessionStorage.setItem('loopCount', '0')
        window.location.reload()
        return
      }
      sessionStorage.setItem('loopCount', String(count))
      document.getElementById('slide-01')?.scrollIntoView({ behavior: 'auto' })
    }, 7000)
    return () => clearTimeout(t)
  }, [isActiveSlide, isAutoPlaying])

  return (
    <SlideLayout id="slide-08" ref={ref}>
      <div style={{
        display: 'flex', flexDirection: 'column',
        height: '100%', justifyContent: 'center',
        gap: '2.75rem',
      }}>
        {/* Header */}
        <div>
          <p style={{
            fontSize: '1rem', fontWeight: 700, color: '#4780f2',
            letterSpacing: '0.08em',
            marginBottom: '1rem',
          }}>
            AI IMPACT
          </p>
          <h2 style={{
            fontSize: '3rem', fontWeight: 900, color: '#ffffff',
            lineHeight: 1.1, letterSpacing: '-0.03em',
            margin: 0,
          }}>
            AI 의료광고 심의,<br />
            새로운 <span style={{ color: '#4780f2' }}>지평</span>을 엽니다.
          </h2>
        </div>

        {/* 3 impact cards */}
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          {CARDS.map((card) => (
            <div key={card.id} style={{
              flex: 1,
              position: 'relative',
              background: '#ffffff',
              borderRadius: '20px',
              padding: '2rem 1.75rem 2.75rem',
              aspectRatio: '3 / 4',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.03)',
            }}>
              <div style={{ color: card.color, marginBottom: '2rem' }}>
                {card.icon}
              </div>

              <p style={{
                fontSize: '1.4rem', fontWeight: 700, color: card.color,
                lineHeight: 1.35, letterSpacing: '-0.01em',
                margin: 0, marginBottom: '0.75rem',
                wordBreak: 'keep-all',
              }}>
                {card.header}
              </p>
              <p style={{
                fontSize: '0.9rem', color: '#64748b',
                lineHeight: 1.6, margin: 0,
                wordBreak: 'keep-all',
              }}>
                {card.desc}
              </p>

              {/* Checkmark (bottom right) — signals achieved outcome */}
              <div style={{
                position: 'absolute',
                right: '1.25rem', bottom: '1.25rem',
                width: '2rem', height: '2rem',
                borderRadius: '50%',
                background: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
