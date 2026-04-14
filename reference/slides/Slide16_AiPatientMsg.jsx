import { useRef } from 'react'
import SlideLayout from '../common/SlideLayout'
import useSlideAnimation from '../../hooks/useSlideAnimation'

const BASE = import.meta.env.BASE_URL

export default function Slide16_AiPatientMsg() {
  const ref = useRef(null)

  useSlideAnimation(ref, (gsap) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    })

    tl.from('.s16-left', { opacity: 0, x: -30, duration: 0.7 })
      .from('.s16-ui', { opacity: 0, x: 30, duration: 0.8 }, '-=0.5')
  })

  return (
    <SlideLayout id="slide-16" ref={ref}>
      <div style={{
        display: 'flex', gap: '5rem', height: '100%', alignItems: 'center',
      }}>
        {/* Left: Text content */}
        <div className="s16-left" style={{ flex: '0 0 38%' }}>
          <p style={{
            fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)',
            marginBottom: '1.5rem',
          }}>
            AI PATIENT MESSAGE
          </p>

          <h2 style={{
            fontSize: '2.75rem', fontWeight: 900, color: '#0f172a',
            lineHeight: 1.35, letterSpacing: '-0.02em', marginBottom: '1.5rem',
          }}>
            진료 후 스태프의<br />
            수동 문자 발송 업무를<br />
            AI가 대체합니다
          </h2>

          <p style={{
            fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary)',
            marginBottom: '2.5rem',
          }}>
            "나를 기억해 주는 세심한 주치의"
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.8 }}>
              비식별 진료·처방 데이터를 바탕으로 대상 자동 선별.
              <br />
              각 의사의 진료 패턴에 맞춘 개인화 메시지 생성.
              <br />
              예약 확인, 문진, 재방문 유도 등 환자 상황별 자동 발송.
            </p>
          </div>
        </div>

        {/* Right: UI Screenshot */}
        <div className="s16-ui" style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            borderRadius: '1rem', overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
          }}>
            <img
              src={`${BASE}images/doctalk-ai-patient-msg-ui.png`}
              alt="닥톡AI 환자메세지 UI"
              style={{
                width: '100%', maxHeight: '75vh',
                objectFit: 'cover', objectPosition: 'top left',
                display: 'block',
              }}
            />
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
