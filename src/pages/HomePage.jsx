import { Link } from 'react-router-dom';
import { useState } from 'react';
import heroImg from '../assets/hero.png';
import studyImg from '../assets/study-planner.png';
import expenseImg from '../assets/expense-tracker.png';
import { BottomAwareFooter } from "../components/PageEndFooter";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('study');
  const tabs = ['study', 'expenses'];
  const handleTabKeyDown = (e) => {
    const currentIndex = tabs.indexOf(activeTab);
    if (e.key === 'ArrowRight') {
      setActiveTab(tabs[(currentIndex + 1) % tabs.length]);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      setActiveTab(tabs[(currentIndex - 1 + tabs.length) % tabs.length]);
      e.preventDefault();
    } else if (e.key === 'Home') {
      setActiveTab(tabs[0]);
      e.preventDefault();
    } else if (e.key === 'End') {
      setActiveTab(tabs[tabs.length - 1]);
      e.preventDefault();
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-background text-text p-4 font-roboto">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto mb-16">
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          <img
            src={heroImg}
            alt="CampusPlanner hero banner showcasing a modern student dashboard"
            className="w-full h-[45vh] md:h-[60vh] lg:h-[70vh] object-cover object-center"
            decoding="async"
            loading="eager"
          />
          <div className="absolute inset-0 hero-gradient-overlay" aria-hidden="true"></div>
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white animate-fade-in-up">Plan smarter, study better</h1>
            <p className="mt-3 md:mt-4 text-lg md:text-xl max-w-2xl text-lightText animate-fade-in-up animation-delay-200">
              CampusPlanner helps you manage expenses, track study progress, and organize campus life — all in one clean interface.
            </p>
            <div className="mt-6 flex gap-3 animate-fade-in-up animation-delay-400">
              <Link to="/auth" className="btn-primary">Get Started</Link>
              <a href="#demo" className="btn-secondary" aria-label="View interactive demo">View Demo</a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Product Demo / Feature Showcase */}
      <section id="demo" className="w-full max-w-6xl mx-auto mb-16">
        <div className="border border-border rounded-xl p-4 md:p-6 bg-background">
          <div role="tablist" aria-label="Feature showcase" aria-orientation="horizontal" className="flex flex-wrap gap-2 mb-4 animate-fade-in-up animation-delay-100" onKeyDown={handleTabKeyDown}>
            <button
              id="tab-study"
              type="button"
              role="tab"
              aria-selected={activeTab === 'study'}
              aria-controls="panel-study"
              tabIndex={activeTab === 'study' ? 0 : -1}
              className={`btn-secondary ${activeTab === 'study' ? 'bg-background' : ''} transition-transform duration-200 hover:scale-[1.02]`}
              onClick={() => setActiveTab('study')}
            >
              Study Planner
            </button>
            <button
              id="tab-expenses"
              type="button"
              role="tab"
              aria-selected={activeTab === 'expenses'}
              aria-controls="panel-expenses"
              tabIndex={activeTab === 'expenses' ? 0 : -1}
              className={`btn-secondary ${activeTab === 'expenses' ? 'bg-background' : ''} transition-transform duration-200 hover:scale-[1.02]`}
              onClick={() => setActiveTab('expenses')}
            >
              Expense Tracker
            </button>
          </div>
          <div>
            {activeTab === 'study' && (
              <div id="panel-study" role="tabpanel" aria-labelledby="tab-study" className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center animate-fade-in-up animation-delay-200">
                <div className="order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-3 text-primary">Plan your success</h3>
                  <ul className="list-disc list-inside space-y-2 text-text">
                    <li>Create tasks, set reminders, and track progress</li>
                    <li>Visual timelines and weekly goals</li>
                    <li>Accessible controls with keyboard navigation</li>
                  </ul>
                  <div className="mt-4">
                    <Link to="/study-planner" className="btn-primary">Open Study Planner</Link>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <img src={studyImg} alt="Preview of the Study Planner interface" className="w-full h-56 md:h-72 object-cover rounded-lg border border-border will-change-transform transition-transform duration-300 hover:scale-[1.01]" loading="lazy" decoding="async" />
                </div>
              </div>
            )}
            {activeTab === 'expenses' && (
              <div id="panel-expenses" role="tabpanel" aria-labelledby="tab-expenses" className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center animate-fade-in-up animation-delay-200">
                <div className="order-2 md:order-1">
                  <h3 className="text-2xl font-bold mb-3 text-primary">Master your money</h3>
                  <ul className="list-disc list-inside space-y-2 text-text">
                    <li>Track daily expenses and weekly allowance in CFA</li>
                    <li>Charts to visualize spending habits</li>
                    <li>Private by design with secure authentication</li>
                  </ul>
                  <div className="mt-4">
                    <Link to="/expenses" className="btn-primary">Open Expense Tracker</Link>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <img src={expenseImg} alt="Overview of the Expense Tracker dashboard" className="w-full h-56 md:h-72 object-cover rounded-lg border border-border will-change-transform transition-transform duration-300 hover:scale-[1.01]" loading="lazy" decoding="async" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="w-full max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold text-primary mb-6 text-center animate-fade-in-up">Why CampusPlanner</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Fast & Lightweight', desc: 'Optimized for performance and fast loading times.', icon: '⚡' },
            { title: 'Accessible', desc: 'Built with inclusive, keyboard-friendly controls.', icon: '♿' },
            { title: 'Secure', desc: 'Authentication and data privacy by design.', icon: '🔒' },
            { title: 'Responsive', desc: 'Beautiful on phones, tablets, and desktops.', icon: '📱' },
            { title: 'Intuitive', desc: 'Clean layout and smooth interactions.', icon: '✨' },
            { title: 'Customizable', desc: 'Tailor features to your study and budget needs.', icon: '🎛️' },
          ].map((f, idx) => {
            const delayClasses = ['animation-delay-100','animation-delay-200','animation-delay-300','animation-delay-400','animation-delay-600','animation-delay-100'];
            return (
              <div
                key={idx}
                tabIndex={0}
                className={`section hover:shadow-md transition-shadow will-change-transform transition-transform duration-300 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none animate-fade-in-up ${delayClasses[idx]}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span aria-hidden className="text-2xl">{f.icon}</span>
                  <h3 className="text-xl font-bold text-primary">{f.title}</h3>
                </div>
                <p className="text-text">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials / Case Studies */}
      <section className="w-full max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-semibold text-primary mb-6 text-center animate-fade-in-up">Students love it</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: 'CampusPlanner helped me stay on top of deadlines and keep my budget in check.', author: 'Amina, Computer Science' },
            { quote: 'The interface is clean and the features are exactly what I need for campus life.', author: 'Daniel, Economics' },
            { quote: 'I finally have one place to plan studies and track expenses — so convenient!', author: 'Clara, Business' },
          ].map((t, idx) => {
            const delayClasses = ['animation-delay-100','animation-delay-200','animation-delay-300'];
            return (
              <figure
                key={idx}
                tabIndex={0}
                className={`card will-change-transform transition-transform duration-300 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none animate-fade-in-up ${delayClasses[idx]}`}
              >
                <blockquote className="text-text">“{t.quote}”</blockquote>
                <figcaption className="mt-3 text-lightText">— {t.author}</figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* Site Footer within content */}
      <section className="w-full bg-background border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div>
            <h4 className="text-lg font-semibold text-primary mb-2">Contact</h4>
            <p className="text-text">Email: support@campusplanner.app</p>
            <p className="text-text">Phone: +1 (555) 123-4567</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-primary mb-2">Follow</h4>
            <div className="flex gap-3">
              <a href="#" className="nav-link" aria-label="Visit Twitter">Twitter</a>
              <a href="#" className="nav-link" aria-label="Visit GitHub">GitHub</a>
              <a href="#" className="nav-link" aria-label="Visit LinkedIn">LinkedIn</a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-primary mb-2">Explore</h4>
            <div className="flex flex-wrap gap-3">
              <Link to="/study-planner" className="nav-link">Study Planner</Link>
              <Link to="/expenses" className="nav-link">Expense Tracker</Link>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/auth" className="nav-link">Login</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom-aware overlay footer only when scrolled to end */}
      <BottomAwareFooter />
    </div>
  );
};

export default HomePage;