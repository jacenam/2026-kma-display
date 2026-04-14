import { forwardRef } from 'react'

const SlideLayout = forwardRef(function SlideLayout({ id, dark = false, children }, ref) {
  return (
    <section
      id={id}
      ref={ref}
      className={`slide ${dark ? 'slide--dark' : ''}`}
    >
      <div className="slide-content">
        {children}
      </div>
    </section>
  )
})

export default SlideLayout
