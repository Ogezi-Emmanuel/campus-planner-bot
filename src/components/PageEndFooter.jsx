import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import logo from '../assets/react.svg'

/**
 * Unified Footer with bottom awareness and minimal CPU overhead.
 * - Appears when the user scrolls near the bottom of the page.
 * - Hides when scrolling up.
 * - Renders via portal to document.body to avoid stacking context conflicts.
 * - Consistent styling across pages with Tailwind semantic tokens.
 */
export const PageEndFooter = ({ onDismiss, compact = false }) => {
  return (
    <footer
      className="w-full bg-background border-t border-border shadow-lg text-text"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className={`relative mx-auto max-w-7xl px-4 ${compact ? 'py-2' : 'py-6 md:py-8'}`}>
        <button
          type="button"
          aria-label="Dismiss footer"
          title="Close"
          onClick={onDismiss}
          className="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 rounded-full border border-border text-text hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          ×
        </button>
        <div className={`flex ${compact ? 'flex-row items-center justify-between' : 'flex-col md:flex-row items-center md:items-start'} gap-3 md:gap-8`}>
          <img
            src={logo}
            alt="CampusPlanner"
            className={`${compact ? 'w-8 h-8' : 'w-16 h-16 md:w-24 md:h-24'} object-contain`}
            decoding="async"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <h3 className={`${compact ? 'text-base font-semibold' : 'text-xl md:text-2xl font-semibold'} text-text mb-0 md:mb-2 truncate`}>CampusPlanner</h3>
            {!compact && (
              <p className="text-sm md:text-base text-lightText leading-relaxed">
                Plan smarter, study better, and manage your expenses with ease. CampusPlanner brings your campus life together in a clean, intuitive interface.
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

export const BottomAwareFooter = ({ threshold = 100 }) => {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const sentinelRef = useRef(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const evaluate = () => {
      const rect = sentinel.getBoundingClientRect()
      const inView = rect.top <= (window.innerHeight - threshold) && rect.bottom > 0
      setVisible(!dismissed && inView)
    }

    const observer = new IntersectionObserver(() => evaluate(), {
      root: null,
      threshold: 0,
      rootMargin: `0px 0px -${threshold}px 0px`,
    })
    observer.observe(sentinel)

    const onScrollResize = () => evaluate()
    window.addEventListener('scroll', onScrollResize, { passive: true })
    window.addEventListener('wheel', onScrollResize, { passive: true })
    window.addEventListener('touchmove', onScrollResize, { passive: true })
    window.addEventListener('resize', onScrollResize)

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDismissed(true)
        setVisible(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)

    evaluate()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScrollResize)
      window.removeEventListener('wheel', onScrollResize)
      window.removeEventListener('touchmove', onScrollResize)
      window.removeEventListener('resize', onScrollResize)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [threshold, dismissed])

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="w-px h-px"></div>
      {createPortal(
        <div
          className={
            `fixed bottom-0 left-0 right-0 z-50 transform transition-all duration-300 ` +
            `${visible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'}`
          }
          aria-hidden={!visible}
        >
          <PageEndFooter onDismiss={() => setDismissed(true)} compact={false} />
        </div>,
        document.body
      )}
    </>
  )
}

export default PageEndFooter