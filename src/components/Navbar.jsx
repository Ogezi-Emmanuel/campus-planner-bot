import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import logo from '../assets/react.svg';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/70 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <NavLink to="/" className="flex items-center gap-2">
              <img src={logo} alt="CampusPlanner" className="h-6 w-6" />
              <span className="text-xl font-bold text-primary tracking-tight">CampusPlanner</span>
            </NavLink>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-3">
              {user ? (
                <>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'nav-link-active' : ''}`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/expenses"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'nav-link-active' : ''}`
                    }
                  >
                    Expenses
                  </NavLink>
                  <NavLink
                    to="/study-planner"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'nav-link-active' : ''}`
                    }
                  >
                    Study Planner
                  </NavLink>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'nav-link-active' : ''}`
                    }
                  >
                    About
                  </NavLink>
                  <button
                    onClick={handleSignOut}
                    className="btn-primary ml-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/auth" className="btn-primary px-5 py-2">Sign In</NavLink>
                  <NavLink to="/auth" className="btn-secondary px-5 py-2">Sign Up</NavLink>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'nav-link-active' : ''}`
                    }
                  >
                    About
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-lightText hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                // Icon: Hamburger
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                // Icon: Close
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden pb-3">
            <div className="space-y-2">
              {user ? (
                <>
                  <NavLink to="/dashboard" className={({ isActive }) => `block rounded-md ${isActive ? 'nav-link nav-link-active' : 'nav-link'}`}>Dashboard</NavLink>
                  <NavLink to="/expenses" className={({ isActive }) => `block rounded-md ${isActive ? 'nav-link nav-link-active' : 'nav-link'}`}>Expenses</NavLink>
                  <NavLink to="/study-planner" className={({ isActive }) => `block rounded-md ${isActive ? 'nav-link nav-link-active' : 'nav-link'}`}>Study Planner</NavLink>
                  <NavLink to="/about" className={({ isActive }) => `block rounded-md ${isActive ? 'nav-link nav-link-active' : 'nav-link'}`}>About</NavLink>
                  <button onClick={handleSignOut} className="btn-primary w-full text-center">Sign Out</button>
                </>
              ) : (
                <>
                  <NavLink to="/auth" className="btn-primary w-full text-center">Sign In</NavLink>
                  <NavLink to="/auth" className="btn-secondary w-full text-center">Sign Up</NavLink>
                  <NavLink to="/about" className={({ isActive }) => `block rounded-md ${isActive ? 'nav-link nav-link-active' : 'nav-link'}`}>About</NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;