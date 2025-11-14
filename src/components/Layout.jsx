import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer" aria-label="Site Footer">
      <div className="footer-inner">
        <div className="footer-section" aria-label="Essential navigation">
          <a href="/about" className="nav-link">About</a>
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/study-planner" className="nav-link">Study Planner</a>
        </div>

        <div className="footer-section" aria-label="Contact">
          <a href="mailto:support@campusplanner.app" className="nav-link">support@campusplanner.app</a>
          <a href="tel:+1234567890" className="nav-link">+1 (234) 567-890</a>
          <span className="nav-link">123 University Ave, City, Country</span>
        </div>

        <div className="footer-section footer-social" aria-label="Social media">
          <a href="#" aria-label="Twitter" title="Twitter">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.28 4.28 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.27 4.27 0 0 0-7.27 3.89A12.11 12.11 0 0 1 3.15 4.6a4.27 4.27 0 0 0 1.32 5.69 4.23 4.23 0 0 1-1.93-.53v.05c0 2.06 1.47 3.78 3.42 4.18-.36.1-.75.15-1.14.15-.28 0-.55-.03-.82-.08a4.28 4.28 0 0 0 3.99 2.97A8.57 8.57 0 0 1 2 19.54 12.1 12.1 0 0 0 8.56 21c7.3 0 11.3-6.05 11.3-11.29v-.52A8.1 8.1 0 0 0 22.46 6z" /></svg>
          </a>
          <a href="#" aria-label="LinkedIn" title="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zm7.5 0h3.8v2h.1c.5-1 1.9-2 3.9-2 4.2 0 5 2.8 5 6.4V23h-4v-6.4c0-1.5 0-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V23h-4V8.5z"/></svg>
          </a>
          <a href="#" aria-label="GitHub" title="GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.2-1.1-1.6-1.1-1.6-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.3 1.1 2.9.8.1-.7.3-1.1.6-1.4-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 3 .1 3.3.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.6-5.5 5.9.4.3.7.9.7 1.8v2.7c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>
          </a>
        </div>

        <div className="footer-bottom" aria-label="Copyright">
          <span>&copy; {year} CampusPlanner. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const shouldShowFooter = location.pathname === '/' || !user;
  return (
    <div className="min-h-screen flex flex-col bg-color-background text-color-text">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl" style={{ paddingBottom: 'var(--footer-height)' }}>
        <Outlet />
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default Layout;