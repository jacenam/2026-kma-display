import { useRef } from 'react'
import SlideLayout from '../common/SlideLayout'
import useSlideAnimation from '../../hooks/useSlideAnimation'

const STEPS = [
  {
    num: 'STEP 1',
    label: '광고 소재 제출',
    desc: '텍스트·이미지·영상 등 광고 소재를 시스템에 업로드',
    solution: null,
    side: 'left',
  },
  {
    num: 'STEP 2',
    label: 'AI 즉시 분석',
    desc: '수 초 내 의료법·가이드라인 위반 여부 전수 스캐닝',
    solution: '수기 검토 → AI 자동 분석으로 전환',
    side: 'right',
  },
  {
    num: 'STEP 3',
    label: '위반 사항 리포트',
    desc: '불승인 사유, 법적 근거, 수정 가이드를 즉시 제시',
    solution: '불명확한 사유 → 구체적 근거와 수정안 제공',
    side: 'left',
  },
  {
    num: 'STEP 4',
    label: '심의관 최종 확정',
    desc: 'AI 리포트 기반으로 대한의사협회 담당자가 최종 판단',
    solution: '100% 인력 의존 → AI가 1차 필터링 완료',
    side: 'right',
  },
  {
    num: 'STEP 5',
    label: '광고 집행 개시',
    desc: '1~3일 내 심의 완료, 즉시 플랫폼 광고 집행 가능',
    solution: '1~3일로 단축',
    solutionPrefix: '3주~3개월 →',
    highlight: true,
    side: 'left',
  },
]

export default function Slide14_AiReviewSolution() {
  const ref = useRef(null)

  useSlideAnimation(ref, (gsap) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    })

    tl.from('.s14-header', { opacity: 0, x: -30, duration: 0.6 })
      .from('.s14-timeline-line', { scaleY: 0, transformOrigin: 'top center', duration: 1.2, ease: 'power2.inOut' }, '-=0.3')
      .from('.s14-dot', { opacity: 0, scale: 0, stagger: 0.15, duration: 0.3 }, '-=0.8')
      .from('.s14-dash', { scaleX: 0, stagger: 0.1, duration: 0.3 }, '-=0.6')
      .from('.s14-step', { opacity: 0, y: 15, stagger: 0.12, duration: 0.5 }, '-=0.6')
      .from('.s14-solution', { opacity: 0, scale: 0.9, stagger: 0.1, duration: 0.3, ease: 'back.out(1.7)' }, '-=0.4')
  })

  return (
    <SlideLayout id="slide-14" ref={ref}>
      <style>{`
        .s14-dot-success {
          animation: s14pulse 1s ease-in-out infinite;
        }
        @keyframes s14pulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(47,208,150,0.3), 0 0 0 4px rgba(47,208,150,0); }
          50% { box-shadow: 0 0 0 2px rgba(47,208,150,0.3), 0 0 12px 6px rgba(47,208,150,0.2); }
        }
        .s14-highlight-badge {
          animation: s14badgeGlow 1s ease-in-out infinite;
        }
        @keyframes s14badgeGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(47,208,150,0.4); }
          50% { box-shadow: 0 0 16px 4px rgba(47,208,150,0.3); }
        }
      `}</style>

      <div style={{ display: 'flex', gap: '3rem', height: '100%', alignItems: 'center' }}>

        {/* Left: Title */}
        <div className="s14-header" style={{ flex: '0 0 28%' }}>
          <p className="section-label">AI SOLUTION</p>
          <h2 style={{
            fontSize: '2.5rem', fontWeight: 900, color: '#0f172a',
            lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: '1.25rem',
            whiteSpace: 'nowrap',
          }}>
            닥톡AI 의료광고 자동심의
          </h2>
          <p style={{
            fontSize: '1rem', color: '#64748b', lineHeight: 1.7, marginBottom: '3.5rem',
            whiteSpace: 'nowrap',
          }}>
            AI 기반의 1차 심의 필터링, 최종 판단만 심의담당자가 결정합니다
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[
              { value: '법규 추론 모델', label: '의료법·의료광고 심의가이드라인 학습' },
              { value: 'AI + Human-in-the-Loop', label: '신뢰도와 전문성' },
              { value: '1~3일', label: '심의 완료 기간 축소' },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontSize: 'clamp(1.5rem, 2.5vh, 2.25rem)', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 'clamp(0.75rem, 1.2vh, 1.125rem)', color: 'var(--color-primary)', marginTop: '1rem' }}>{s.label}</p>
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
          <div className="s14-timeline-line" style={{
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
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: '60%', top: '50%',
                  transform: 'translate(-50%, -50%)', zIndex: 2,
                }}>
                  <div className={`s14-dot${step.solution ? ' s14-dot-success' : ''}`} style={{
                    width: '14px', height: '14px', borderRadius: '50%',
                    background: step.solution ? 'var(--color-primary)' : '#334155',
                    border: '3px solid white',
                    boxShadow: step.solution ? undefined : '0 0 0 2px #e2e8f0',
                  }} />
                </div>

                {/* Dash line */}
                <div className="s14-dash" style={{
                  position: 'absolute', top: '50%',
                  transform: 'translateY(-50%)',
                  ...(step.side === 'left'
                    ? { right: '40%', marginRight: '7px', width: '6.5rem' }
                    : { left: '60%', marginLeft: '7px', width: '6.5rem' }
                  ),
                  height: '0px',
                  borderTop: `2px dashed ${step.solution ? 'rgba(47,208,150,0.4)' : '#cbd5e1'}`,
                  transformOrigin: step.side === 'left' ? 'right center' : 'left center',
                }} />

                {/* Left half */}
                <div style={{
                  flex: '0 0 60%',
                  textAlign: 'right',
                  paddingRight: '7rem',
                }}>
                  {step.side === 'left' && (
                    <div className="s14-step">
                      <p style={{
                        fontSize: 'clamp(0.625rem, 1vh, 0.9375rem)', fontWeight: 700, letterSpacing: '0.12em',
                        color: step.solution ? 'var(--color-primary)' : '#94a3b8',
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
                      <p style={{ fontSize: 'clamp(0.75rem, 1.2vh, 1.125rem)', color: '#64748b', lineHeight: 1.5, whiteSpace: 'nowrap' }}>
                        {step.desc}
                      </p>
                      {step.solution && (
                        step.highlight ? (
                          <div className="s14-solution" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            marginTop: '0.75rem', flexWrap: 'nowrap',
                          }}>
                            <span style={{ fontSize: 'clamp(0.75rem, 1.1vh, 1rem)', fontWeight: 600, color: 'var(--color-primary)' }}>
                              {step.solutionPrefix}
                            </span>
                            <span className="s14-highlight-badge" style={{
                              fontSize: 'clamp(0.75rem, 1.1vh, 1rem)', fontWeight: 800, color: 'white',
                              background: 'var(--color-primary)',
                              padding: '0.3rem 0.875rem', borderRadius: '2rem',
                              border: '2px solid var(--color-primary)',
                            }}>
                              {step.solution}
                            </span>
                          </div>
                        ) : (
                          <div className="s14-solution" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                            marginTop: '0.5rem',
                          }}>
                            <span style={{ fontSize: 'clamp(0.6875rem, 1.1vh, 1rem)', fontWeight: 700, color: 'var(--color-primary)' }}>
                              ✓ {step.solution}
                            </span>
                          </div>
                        )
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
                    <div className="s14-step">
                      <p style={{
                        fontSize: 'clamp(0.625rem, 1vh, 0.9375rem)', fontWeight: 700, letterSpacing: '0.12em',
                        color: step.solution ? 'var(--color-primary)' : '#94a3b8',
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
                      <p style={{ fontSize: 'clamp(0.75rem, 1.2vh, 1.125rem)', color: '#64748b', lineHeight: 1.5, whiteSpace: 'nowrap' }}>
                        {step.desc}
                      </p>
                      {step.solution && (
                        step.highlight ? (
                          <div className="s14-solution" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            marginTop: '0.75rem', flexWrap: 'nowrap',
                          }}>
                            <span style={{ fontSize: 'clamp(0.75rem, 1.1vh, 1rem)', fontWeight: 600, color: 'var(--color-primary)' }}>
                              {step.solutionPrefix}
                            </span>
                            <span className="s14-highlight-badge" style={{
                              fontSize: 'clamp(0.75rem, 1.1vh, 1rem)', fontWeight: 800, color: 'white',
                              background: 'var(--color-primary)',
                              padding: '0.3rem 0.875rem', borderRadius: '2rem',
                              border: '2px solid var(--color-primary)',
                            }}>
                              {step.solution}
                            </span>
                          </div>
                        ) : (
                          <div className="s14-solution" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                            marginTop: '0.5rem',
                          }}>
                            <span style={{ fontSize: 'clamp(0.6875rem, 1.1vh, 1rem)', fontWeight: 700, color: 'var(--color-primary)' }}>
                              ✓ {step.solution}
                            </span>
                          </div>
                        )
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
