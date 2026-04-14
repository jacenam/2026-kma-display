import { useRef } from 'react'
import SlideLayout from '../common/SlideLayout'
import useSlideAnimation from '../../hooks/useSlideAnimation'

const BASE = import.meta.env.BASE_URL

export default function Slide16b_AiConsultation() {
  const ref = useRef(null)

  useSlideAnimation(ref, (gsap) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    })

    tl.from('.s16b-left', { opacity: 0, x: -30, duration: 0.7 })
      .from('.s16b-phone', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' }, '-=0.5')
  })

  return (
    <SlideLayout id="slide-16b" ref={ref}>
      <style>{`
        .s16b-privacy-title {
          animation: s16bGlow 1s ease-in-out infinite;
        }
        @keyframes s16bGlow {
          0%, 100% { text-shadow: 0 0 0 rgba(225,29,72,0); }
          50% { text-shadow: 0 0 12px rgba(225,29,72,0.4), 0 0 24px rgba(225,29,72,0.2); }
        }
      `}</style>
      <div style={{
        display: 'flex', gap: '5rem', height: '100%', alignItems: 'center',
      }}>
        {/* Left: Text content — clean, no cards */}
        <div className="s16b-left" style={{ flex: '0 0 42%' }}>
          <p style={{
            fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)',
            marginBottom: '1.5rem',
          }}>
            AI CONSULTATION
          </p>

          <h2 style={{
            fontSize: '2.75rem', fontWeight: 900, color: '#0f172a',
            lineHeight: 1.35, letterSpacing: '-0.02em', marginBottom: '1.5rem',
          }}>
            환자가 메시지 링크를 통해<br />
            24시간 AI 비서와의 의료상담
          </h2>

          <p style={{
            fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary)',
            marginBottom: '2.5rem',
          }}>
            "나를 기억해 주는 세심한 주치의"
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.8 }}>
              진료 이력과 처방 데이터를 바탕으로 정확한 의료 상담 제공.
              <br />
              각 의사의 진료 패턴에 맞춘 개인화 메시지 생성.
              <br />
              예약 확인, 문진, 재방문 유도 등 환자 상황별 자동 발송.
            </p>
          </div>

          <p className="s16b-privacy-title" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#e11d48', marginBottom: '0.5rem' }}>
            독립적 AI 학습 구조
          </p>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.7 }}>
            특정 원장님의 진료 데이터는 다른 의사의 AI 학습에 활용되지 않습니다.<br />
            오직 해당 병원만의 독립적인 데이터로 관리됩니다.
          </p>

          <p style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '1.5rem' }}>
            ※ 의료법 가이드라인을 철저히 준수하며, 원격 진단·처방은 포함되지 않습니다
          </p>
        </div>

        {/* Right: iPhone mockup with video */}
        <div className="s16b-phone" style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            position: 'relative',
            width: 'clamp(280px, 25vw, 400px)',
          }}>
            <img
              src={`${BASE}images/iphone16-mockup.png`}
              alt="iPhone 목업"
              style={{
                width: '100%', height: 'auto', display: 'block',
                position: 'relative', zIndex: 2,
                pointerEvents: 'none',
              }}
            />
            <video
              src={`${BASE}videos/ai-consultation-demo.mp4`}
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                top: '2.8%', left: '5.5%',
                width: '89%', height: '94.5%',
                objectFit: 'cover',
                borderRadius: '2rem',
                zIndex: 1,
              }}
            />
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
