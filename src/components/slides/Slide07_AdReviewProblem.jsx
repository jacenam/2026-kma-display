import { useRef, useEffect, useState } from 'react'
import SlideLayout from '../common/SlideLayout'
import useSlideAnimation from '../../hooks/useSlideAnimation'
import { useAutoPlay } from '../../contexts/AutoPlayContext'

const STEPS = [
  {
    num: 'STEP 1',
    label: '광고 소재 제작',
    desc: '병·의원이 텍스트·이미지·영상 광고 소재를 준비',
    hurdle: null,
    side: 'left',
  },
  {
    num: 'STEP 2',
    label: '심의 신청·접수',
    desc: '대한의사협회에 광고 심의를 신청',
    hurdle: '연간 45,000건 심의 요청 적체',
    side: 'right',
  },
  {
    num: 'STEP 3',
    label: '수기 검토',
    desc: '심의관이 의료법·가이드라인 기준으로 1건씩 수동 검토',
    hurdle: '100% 인력 의존, 일관성 유지 어려움',
    side: 'left',
  },
  {
    num: 'STEP 4',
    label: '심의 결과 통보',
    desc: '승인/불승인 결과 및 사유 전달',
    hurdle: '3주~3개월 소요',
    side: 'right',
  },
  {
    num: 'STEP 5',
    label: '수정·재심의',
    desc: '불승인 시 수정 후 재신청, 처음부터 다시 대기',
    hurdle: '추가 수개월, 기회 비용 극대화',
    side: 'left',
  },
]

export default function Slide07_AdReviewProblem() {
  const ref = useRef(null)
  const [isActiveSlide, setIsActiveSlide] = useState(false)
  const { isAutoPlaying } = useAutoPlay()

  // Track activeness for auto-advance
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

  // Auto-advance after 3s when active + autoplay (AD review problem slide has no video)
  useEffect(() => {
    if (!isActiveSlide || !isAutoPlaying) return
    const t = setTimeout(() => {
      document.getElementById('slide-07')?.scrollIntoView({ behavior: 'auto' })
    }, 5000)
    return () => clearTimeout(t)
  }, [isActiveSlide, isAutoPlaying])

  useSlideAnimation(ref, (gsap) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    })

    tl.from('.s07-header', { opacity: 0, x: -30, duration: 0.6 })
      .from('.s07-timeline-line', { scaleY: 0, transformOrigin: 'top center', duration: 1.2, ease: 'power2.inOut' }, '-=0.3')
      .from('.s07-dot', { opacity: 0, scale: 0, stagger: 0.15, duration: 0.3 }, '-=0.8')
      .from('.s07-dash', { scaleX: 0, stagger: 0.1, duration: 0.3 }, '-=0.6')
      .from('.s07-step', { opacity: 0, y: 15, stagger: 0.12, duration: 0.5 }, '-=0.6')
      .from('.s07-hurdle', { opacity: 0, scale: 0.9, stagger: 0.1, duration: 0.3, ease: 'back.out(1.7)' }, '-=0.4')
  })

  return (
    <SlideLayout id="slide-06" ref={ref}>
      <style>{`
        .s07-dot-danger {
          animation: s07pulse 1s ease-in-out infinite;
        }
        @keyframes s07pulse {
          0%, 100% { box-shadow: 0 0 0 2px #fecdd3, 0 0 8px 2px rgba(225,29,72,0.35); }
          50% { box-shadow: 0 0 0 2px #fecdd3, 0 0 28px 12px rgba(225,29,72,0.75); }
        }
      `}</style>
      <div style={{ display: 'flex', gap: '3rem', height: '100%', alignItems: 'center' }}>

        {/* Left: Title */}
        <div className="s07-header" style={{ flex: '0 0 28%' }}>
          <p style={{
            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--color-primary)',
            marginBottom: '1rem', whiteSpace: 'nowrap',
          }}>
            AI Medical AD Reviewer
          </p>
          <h2 style={{
            fontSize: '2.5rem', fontWeight: 900, color: '#0f172a',
            lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: '1.25rem',
            whiteSpace: 'nowrap',
          }}>
            의료광고 심의의 벽
          </h2>
          <p style={{
            fontSize: '1rem', color: '#64748b', lineHeight: 1.7, marginBottom: '3.5rem',
            whiteSpace: 'nowrap',
          }}>
            최적의 광고 전략을 세웠어도, 실행 단계에서 마주치는 행정적 병목
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[
              { value: '3주~3개월', label: '평균 심의 소요' },
              { value: '45,000+', label: '연간 심의 건수' },
              { value: '100%', label: '수기 검토' },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontSize: 'clamp(1.5rem, 2.5vh, 2.25rem)', fontWeight: 700, color: '#e11d48', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 'clamp(0.75rem, 1.2vh, 1.125rem)', color: '#9f1239', marginTop: '1rem' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Vertical zigzag timeline */}
        <div style={{
          flex: 1, position: 'relative',
          display: 'flex', justifyContent: 'center',
        }}>
          {/* Center vertical line */}
          <div className="s07-timeline-line" style={{
            position: 'absolute', left: '60%', top: 0, bottom: 0,
            width: '2px', background: '#e2e8f0',
            transform: 'translateX(-50%)',
          }} />

          <div style={{
            display: 'flex', flexDirection: 'column', gap: '1.5rem',
            width: '100%',
          }}>
            {STEPS.map((step) => (
              <div key={step.num} style={{
                display: 'flex', alignItems: 'center',
                position: 'relative',
              }}>
                {/* Dot — absolutely centered on the timeline */}
                <div style={{
                  position: 'absolute', left: '60%', top: '50%',
                  transform: 'translate(-50%, -50%)', zIndex: 2,
                }}>
                  <div className={`s07-dot${step.hurdle ? ' s07-dot-danger' : ''}`} style={{
                    width: '14px', height: '14px', borderRadius: '50%',
                    background: step.hurdle ? '#e11d48' : '#334155',
                    border: '3px solid white',
                    boxShadow: step.hurdle ? undefined : '0 0 0 2px #e2e8f0',
                  }} />
                </div>

                {/* Dash line — from dot toward content */}
                <div className="s07-dash" style={{
                  position: 'absolute', top: '50%',
                  transform: 'translateY(-50%)',
                  ...(step.side === 'left'
                    ? { right: '40%', marginRight: '7px', width: '5rem' }
                    : { left: '60%', marginLeft: '7px', width: '5rem' }
                  ),
                  height: '0px',
                  borderTop: `2px dashed ${step.hurdle ? '#fecdd3' : '#cbd5e1'}`,
                  transformOrigin: step.side === 'left' ? 'right center' : 'left center',
                }} />

                {/* Left half */}
                <div style={{
                  flex: '0 0 60%',
                  textAlign: 'right',
                  paddingRight: '7rem',
                }}>
                  {step.side === 'left' && (
                    <div className="s07-step">
                      <p style={{
                        fontSize: 'clamp(0.625rem, 1vh, 0.9375rem)', fontWeight: 700, letterSpacing: '0.12em',
                        color: step.hurdle ? '#e11d48' : '#94a3b8',
                        textTransform: 'uppercase', marginBottom: '0.25rem',
                      }}>
                        {step.num}
                      </p>
                      <p style={{
                        fontSize: 'clamp(1.125rem, 1.8vh, 1.6875rem)', fontWeight: 800, color: '#0f172a',
                        marginBottom: '0.25rem',
                      }}>
                        {step.label}
                      </p>
                      <p style={{ fontSize: 'clamp(0.75rem, 1.2vh, 1.125rem)', color: '#64748b', lineHeight: 1.5 }}>
                        {step.desc}
                      </p>
                      {step.hurdle && (
                        <div className="s07-hurdle" style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                          marginTop: '0.5rem',
                        }}>
                          <span style={{ fontSize: 'clamp(0.6875rem, 1.1vh, 1rem)', fontWeight: 700, color: '#e11d48' }}>
                            {step.hurdle}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right half */}
                <div style={{
                  flex: '0 0 40%',
                  textAlign: 'left',
                  paddingLeft: '7rem',
                }}>
                  {step.side === 'right' && (
                    <div className="s07-step">
                      <p style={{
                        fontSize: 'clamp(0.625rem, 1vh, 0.9375rem)', fontWeight: 700, letterSpacing: '0.12em',
                        color: step.hurdle ? '#e11d48' : '#94a3b8',
                        textTransform: 'uppercase', marginBottom: '0.25rem',
                      }}>
                        {step.num}
                      </p>
                      <p style={{
                        fontSize: 'clamp(1.125rem, 1.8vh, 1.6875rem)', fontWeight: 800, color: '#0f172a',
                        marginBottom: '0.25rem',
                      }}>
                        {step.label}
                      </p>
                      <p style={{ fontSize: 'clamp(0.75rem, 1.2vh, 1.125rem)', color: '#64748b', lineHeight: 1.5 }}>
                        {step.desc}
                      </p>
                      {step.hurdle && (
                        <div className="s07-hurdle" style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                          marginTop: '0.5rem',
                        }}>
                          <span style={{ fontSize: 'clamp(0.6875rem, 1.1vh, 1rem)', fontWeight: 700, color: '#e11d48' }}>
                            {step.hurdle}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
