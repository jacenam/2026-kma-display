import { useRef } from 'react'
import { Partnership, CheckmarkFilled, Calendar } from '@carbon/icons-react'
import SlideLayout from '../common/SlideLayout'
import useSlideAnimation from '../../hooks/useSlideAnimation'

const BASE = import.meta.env.BASE_URL

export default function Slide14b_KmaPartnership() {
  const ref = useRef(null)

  useSlideAnimation(ref, (gsap) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    })

    tl.from('.s14b-left', { opacity: 0, x: -30, duration: 0.7 })
      .from('.s14b-badge', { opacity: 0, scale: 0.9, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.3')
      .from('.s14b-card', { opacity: 0, y: 20, stagger: 0.15, duration: 0.5 }, '-=0.2')
      .from('.s14b-video', { opacity: 0, x: 30, duration: 0.8 }, '-=0.6')
  })

  return (
    <SlideLayout id="slide-14b" ref={ref}>
      <div style={{
        display: 'flex', gap: '5rem', height: '100%', alignItems: 'center',
      }}>
        {/* Left: Text content */}
        <div className="s14b-left" style={{ flex: '0 0 42%' }}>
          {/* Badge */}
          <div className="s14b-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1.25rem', borderRadius: '3rem',
            background: 'rgba(18,94,173,0.08)', border: '1px solid rgba(18,94,173,0.2)',
            marginBottom: '1.5rem',
          }}>
            <Partnership size={18} style={{ color: '#125ead' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#125ead' }}>
              공식 공급사 선정
            </span>
            <CheckmarkFilled size={16} style={{ color: '#125ead' }} />
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.3,
            color: '#0f172a', marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: '#125ead' }}>대한의사협회</span> 공식
            <br />
            AI 의료광고 자동심의 공급사
          </h2>

          {/* Subtitle */}
          <p style={{
            fontSize: '1rem', color: '#64748b', lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}>
            닥프렌즈는 대한의사협회 의료광고심의위원회의 공식 공급사로 선정되어,<br />
            닥톡AI 기반의 의료광고 자동심의 서비스를 제공합니다.
          </p>

          {/* Info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="s14b-card" style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1.25rem 1.5rem', background: '#f8fafc', borderRadius: '1rem',
              border: '1px solid #e2e8f0',
            }}>
              <Partnership size={24} style={{ color: '#125ead', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1e293b', marginBottom: '0.125rem' }}>대한의사협회</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>의료광고심의위원회</p>
              </div>
            </div>

            <div className="s14b-card" style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1.25rem 1.5rem', background: '#f8fafc', borderRadius: '1rem',
              border: '1px solid #e2e8f0',
            }}>
              <Calendar size={24} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1e293b', marginBottom: '0.125rem' }}>2026년 3분기</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>공식 서비스 런칭 예정</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Demo video */}
        <div className="s14b-video" style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <video
            src={`${BASE}videos/ad-review-demo.mp4`}
            autoPlay
            loop
            muted
            playsInline
            style={{
              maxHeight: '80vh',
              maxWidth: '100%',
              width: 'auto', height: 'auto',
              borderRadius: '1rem',
              boxShadow: '0 16px 48px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)',
            }}
          />
        </div>

      </div>
    </SlideLayout>
  )
}
