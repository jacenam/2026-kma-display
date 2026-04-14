import { useRef } from 'react'
import SlideLayout from '../common/SlideLayout'
import useSlideAnimation from '../../hooks/useSlideAnimation'

export default function Slide01_Title() {
  const ref = useRef(null)

  useSlideAnimation(ref, (gsap) => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from('.s01-bg', { opacity: 0, duration: 1.5 })
      .from('.s01-label', { opacity: 0, y: 20, duration: 0.6 }, '-=0.8')
      .from('.s01-title', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4')
      .from('.s01-subtitle', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
      .from('.s01-footer', { opacity: 0, duration: 0.5 }, '-=0.3')
  })

  return (
    <section id="slide-01" ref={ref} className="slide" style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #edf1f7 40%, #e4ecf5 100%)',
    }}>
      {/* Background image — right-aligned */}
      <div className="s01-bg" style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
      }}>
        <img
          src={`${import.meta.env.BASE_URL}images/hero-3d.png`}
          alt=""
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Cover the star in the bottom-right corner */}
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: '120px', height: '120px',
          background: 'radial-gradient(circle at bottom right, #dde4ed 60%, transparent 100%)',
        }} />
      </div>

      {/* Text content — left-aligned */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        height: '100%',
        maxWidth: '1440px', width: '100%', margin: '0 auto',
        padding: '0 4rem',
      }}>
        <p className="s01-label" style={{
          fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.15em',
          color: 'var(--color-primary)',
          marginBottom: '1.25rem',
        }}>
          2026 KIMES SEMINAR
        </p>

        <h1 className="s01-title" style={{
          fontSize: '3.75rem', fontWeight: 900, lineHeight: 1.25,
          letterSpacing: '-0.02em', color: '#1a1a1a',
          marginBottom: '1.5rem', maxWidth: '520px',
        }}>
          2026년
          <br />
          병원 경영의 <span style={{ color: 'var(--color-primary)' }}>뉴노멀</span>
        </h1>

        <p className="s01-subtitle" style={{
          fontSize: '1.125rem', fontWeight: 500, color: '#5a6370',
          maxWidth: '700px', lineHeight: 1.7, whiteSpace: 'nowrap',
        }}>
          내원 환자를 늘리는 플랫폼 예약과 광고비 실시간 추적 시스템 활용하기
        </p>
      </div>

      {/* Footer — pinned at bottom */}
      <div className="s01-footer" style={{
        position: 'absolute', bottom: '10rem', left: 0, right: 0,
        zIndex: 2,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: '1440px', width: '100%', margin: '0 auto',
        padding: '0 4rem',
      }}>
        <div>
          <p style={{ fontWeight: 800, fontSize: '1.0625rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Docfriends</p>
          <p style={{ fontSize: '0.9375rem', color: '#1a1a1a' }}>
            <span style={{ fontWeight: 700 }}>남주형</span>
            <span style={{ fontWeight: 700, marginLeft: '0.75rem' }}>비지니스·프로덕트 총괄</span>
          </p>
        </div>
      </div>
    </section>
  )
}
