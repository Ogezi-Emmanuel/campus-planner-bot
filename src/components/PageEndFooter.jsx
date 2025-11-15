import React, { useEffect, useState, useRef } from 'react'
import logo from '../assets/react.svg'

const PageEndFooter = ({ onDismiss, compact = false }) => {
  return (
    <footer
      className="w-full bg-white border-t border-gray-200 shadow-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className={`relative mx-auto max-w-7xl px-4 ${compact ? 'py-2' : 'py-6 md:py-8'}`}>
        <button
          type="button"
          aria-label="Dismiss footer"
          title="Close"
          onClick={onDismiss}
          className="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          ×
        </button>
        <div className={`flex ${compact ? 'flex-row items-center justify-between' : 'flex-col md:flex-row items-center md:items-start'} gap-3 md:gap-8`}>
          {/* Left image */}
          <img
            src={logo}
            alt="CampusPlanner"
            className={`${compact ? 'w-8 h-8' : 'w-16 h-16 md:w-24 md:h-24'} object-contain`}
            decoding="async"
            loading="lazy"
          />

          {/* Right text content */}
          <div className="flex-1 min-w-0">
            <h3 className={`${compact ? 'text-base font-semibold' : 'text-xl md:text-2xl font-semibold'} text-gray-900 mb-0 md:mb-2 truncate`}>CampusPlanner</h3>
            {/* Hide long description in compact mode to save vertical space */}
            {!compact && (
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
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
  const [showFooter, setShowFooter] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const sentinelRef = useRef(null)

  useEffect(() => {
    // Detect small screens
    const mq = window.matchMedia('(max-width: 639px)')
    const setFromMQ = () => setIsSmallScreen(mq.matches)
    setFromMQ()
    mq.addEventListener ? mq.addEventListener('change', setFromMQ) : mq.addListener(setFromMQ)

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const evaluateVisibility = () => {
      const rect = sentinel.getBoundingClientRect()
      const inViewWithThreshold = rect.top <= (window.innerHeight - threshold) && rect.bottom > 0
      // Expanded when near bottom and user interacted
      const isExpanded = inViewWithThreshold && hasInteracted
      setExpanded(!dismissed && isExpanded)
      // On small screens, keep visible compact bar at all times (no scroll required)
      const shouldShow = !dismissed && (isSmallScreen || isExpanded)
      setShowFooter(shouldShow)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // entry.isIntersecting reflects 0px threshold; emulate threshold via manual check for precision
        evaluateVisibility()
      },
      {
        root: null,
        threshold: 0,
        rootMargin: `0px 0px -${threshold}px 0px`,
      }
    )
    observer.observe(sentinel)

    const onScrollOrInteract = () => {
      if (!hasInteracted) {
        setHasInteracted(true)
      }
      evaluateVisibility()
    }
    window.addEventListener('scroll', onScrollOrInteract, { passive: true })
    window.addEventListener('wheel', onScrollOrInteract, { passive: true })
    window.addEventListener('touchmove', onScrollOrInteract, { passive: true })
    window.addEventListener('resize', onScrollOrInteract)

    // Close on ESC key
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDismissed(true)
        setShowFooter(false)
        setExpanded(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)

    // Initial evaluation
    evaluateVisibility()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScrollOrInteract)
      window.removeEventListener('wheel', onScrollOrInteract)
      window.removeEventListener('touchmove', onScrollOrInteract)
      window.removeEventListener('resize', onScrollOrInteract)
      window.removeEventListener('keydown', onKeyDown)
      mq.removeEventListener ? mq.removeEventListener('change', setFromMQ) : mq.removeListener(setFromMQ)
    }
  }, [threshold, hasInteracted, dismissed, isSmallScreen])

  // Always render a minimal sentinel at the end so we can observe bottom reach
  // The visible footer is a fixed overlay that does not occupy space when hidden
  return (
    <>
      <div ref={sentinelRef} aria-hidden className="w-px h-px"></div>
      <div
        className={
          `fixed bottom-0 left-0 right-0 z-40 transform transition-all duration-300 ` +
          `${showFooter ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'}`
        }
        aria-hidden={!showFooter}
      >
        <PageEndFooter onDismiss={() => setDismissed(true)} compact={showFooter && !expanded} />
      </div>
    </>
  );
};

export default PageEndFooter;