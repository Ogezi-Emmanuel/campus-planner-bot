import React, { useEffect, useState, useRef } from 'react';
import logo from '../assets/react.svg';

const PageEndFooter = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Left image */}
          <img
            src={logo}
            alt="CampusPlanner"
            className="w-16 h-16 md:w-24 md:h-24 object-contain"
            decoding="async"
            loading="lazy"
          />

          {/* Right text content */}
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1 md:mb-2">CampusPlanner</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Plan smarter, study better, and manage your expenses with ease. CampusPlanner brings your campus life together in a clean, intuitive interface.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const BottomAwareFooter = ({ threshold = 0 }) => {
  const [showFooter, setShowFooter] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const evaluateVisibility = () => {
      const rect = sentinel.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      setShowFooter(inView && hasInteracted);
    };

    // IntersectionObserver to detect when bottom sentinel enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFooter(entry.isIntersecting && hasInteracted);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: `0px 0px -${threshold}px 0px`,
      }
    );
    observer.observe(sentinel);

    // Interaction listeners to mark that the user has scrolled/interacted
    const onScrollOrInteract = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
      // Evaluate immediately after interaction for short pages
      evaluateVisibility();
    };
    window.addEventListener('scroll', onScrollOrInteract, { passive: true });
    window.addEventListener('wheel', onScrollOrInteract, { passive: true });
    window.addEventListener('touchmove', onScrollOrInteract, { passive: true });
    window.addEventListener('resize', onScrollOrInteract);

    // Initial evaluation (will keep hidden until interaction)
    evaluateVisibility();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScrollOrInteract);
      window.removeEventListener('wheel', onScrollOrInteract);
      window.removeEventListener('touchmove', onScrollOrInteract);
      window.removeEventListener('resize', onScrollOrInteract);
    };
  }, [threshold, hasInteracted]);

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
        <PageEndFooter />
      </div>
    </>
  );
};

export default PageEndFooter;