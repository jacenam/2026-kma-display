import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let scrollerConfigured = false

export default function useSlideAnimation(ref, animationCallback, deps = []) {
  useEffect(() => {
    if (!ref.current) return

    if (!scrollerConfigured) {
      const container = document.querySelector('.slide-container')
      if (container) {
        ScrollTrigger.defaults({ scroller: container })
        ScrollTrigger.scrollerProxy(container, {
          scrollTop(value) {
            if (arguments.length) {
              container.scrollTop = value
            }
            return container.scrollTop
          },
          getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
          },
        })
        scrollerConfigured = true
      }
    }

    const ctx = gsap.context(() => {
      animationCallback(gsap, ScrollTrigger)
    }, ref)

    return () => ctx.revert()
  }, [ref, ...deps])
}
