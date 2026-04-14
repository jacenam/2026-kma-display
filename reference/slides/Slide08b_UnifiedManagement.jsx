import { useRef } from 'react'
import SlideLayout from '../common/SlideLayout'
import useSlideAnimation from '../../hooks/useSlideAnimation'

const UI_SCREENS = [
  {
    src: `${import.meta.env.BASE_URL}images/doctalk-reservation-status.png`,
    label: '예약현황',
    desc: '네이버·카카오·당근 예약을 한 화면에서 확인·관리',
  },
  {
    src: `${import.meta.env.BASE_URL}images/doctalk-reservation-products.png`,
    label: '예약상품',
    desc: '시술별 예약 상품을 등록하고 노출 여부를 제어',
  },
  {
    src: `${import.meta.env.BASE_URL}images/doctalk-sameday-reservation.png`,
    label: '당일예약',
    desc: '플랫폼별 당일예약 수신 설정을 한 곳에서 관리',
  },
]

export default function Slide08b_UnifiedManagement() {
  const ref = useRef(null)

  useSlideAnimation(ref, (gsap) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 80%' },
    })

    tl.from('.s08b-header', { opacity: 0, y: 30, duration: 0.6 })
      .from('.s08b-card', { opacity: 0, y: 40, stagger: 0.15, duration: 0.7, ease: 'power2.out' }, '-=0.2')
  })

  return (
    <SlideLayout id="slide-08b" ref={ref}>
      <div className="s08b-header" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <p className="section-label">UNIFIED MANAGEMENT</p>
        <h2 className="section-title">환자 접점 채널의 다양화, 그러나 관리포인트는 일원화</h2>
        <p className="section-subtitle">
          다양한 플랫폼 예약 채널이 늘어나도, 관리 포인트는 닥톡예약 한 곳으로 모입니다
        </p>
      </div>

      {/* UI Screenshots Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        {UI_SCREENS.map(({ src, label, desc }) => (
          <div key={label} className="s08b-card" style={{
            borderRadius: '1rem', overflow: 'hidden',
            border: '1px solid #e2e8f0',
            background: 'white',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            {/* Screenshot */}
            <div style={{
              position: 'relative', overflow: 'hidden',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              height: '200px',
            }}>
              <img
                src={src}
                alt={label}
                style={{
                  width: '100%', height: '100%', display: 'block',
                  objectFit: 'cover', objectPosition: 'top left',
                }}
              />
            </div>

            {/* Label area */}
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <p style={{
                fontWeight: 800, fontSize: '1.0625rem', color: '#0f172a',
                marginBottom: '0.375rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <span style={{
                  display: 'inline-block', width: '6px', height: '6px',
                  borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0,
                }} />
                {label}
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.6 }}>
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>


    </SlideLayout>
  )
}
