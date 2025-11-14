import React, { useEffect, useState } from 'react';
import logo from '../assets/react.svg';

const PageEndFooter = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
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
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">CampusPlanner</h3>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
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

  useEffect(() => {
    let rAF = null;

    const checkAtBottom = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - threshold;
      setShowFooter(atBottom);
    };

    const onScroll = () => {
      setHasInteracted(true);
      if (rAF) return;
      rAF = window.requestAnimationFrame(() => {
        rAF = null;
        checkAtBottom();
      });
    };

    // We intentionally avoid showing immediately; require user scroll interaction
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('wheel', onScroll, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', onScroll);
      window.removeEventListener('touchmove', onScroll);
      if (rAF) window.cancelAnimationFrame(rAF);
    };
  }, [threshold]);

  if (!showFooter || !hasInteracted) return null;
  return <PageEndFooter />;
};

export default PageEndFooter;