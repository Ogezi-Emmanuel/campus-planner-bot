import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.png';
import studyImg from '../assets/study-planner.png';
import expenseImg from '../assets/expense-tracker.png';
import { BottomAwareFooter } from "../components/PageEndFooter";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-background to-white text-text p-4 font-roboto">
      {/* Hero banner image */}
      <section className="w-full max-w-7xl mx-auto mb-10">
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          <img
            src={heroImg}
            alt="CampusPlanner hero banner"
            className="w-full h-[45vh] md:h-[60vh] lg:h-[70vh] object-cover object-center"
            decoding="async"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/10" aria-hidden="true"></div>
        </div>
      </section>

      {/* Hero copy */}
      <h1 className="text-5xl md:text-6xl font-extrabold mt-2 mb-4 text-center leading-tight animate-fade-in-up text-primary">
        Welcome to CampusPlanner
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl font-light opacity-90 animate-fade-in-up animation-delay-200 text-text">
        Your ultimate tool for managing expenses, tracking study progress, and organizing your campus life.
      </p>

      {/* Auth CTAs first */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Link to="/auth" className="btn-primary">Login</Link>
        <Link to="/auth" className="btn-secondary">Sign Up</Link>
      </div>

      {/* Visual feature sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-24">
        {/* Study Planner section */}
        <div className="card overflow-hidden">
          <div className="relative">
            <img
              src={studyImg}
              alt="Study Planner preview"
              className="w-full h-52 md:h-64 object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold mb-3 text-primary">Study Planner</h3>
            <p className="text-text mb-4">
              Organize your academic life with a personalized study schedule. Plan tasks, set reminders, and monitor your progress to achieve your goals.
            </p>
            <Link to="/study-planner" className="btn-primary">Go to Study Planner</Link>
          </div>
        </div>

        {/* Expense Tracker section */}
        <div className="card overflow-hidden">
          <div className="relative">
            <img
              src={expenseImg}
              alt="Expense Tracker overview"
              className="w-full h-52 md:h-64 object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold mb-3 text-primary">Expense Tracker</h3>
            <p className="text-text mb-4">
              Track daily expenses, set your weekly allowance in CFA, and visualize your spending habits to stay on top of your finances.
            </p>
            <Link to="/expenses" className="btn-secondary">Open Expense Tracker</Link>
          </div>
        </div>
      </div>
      {/* Bottom-aware footer only when scrolled to end */}
      <BottomAwareFooter />
    </div>
  );
};

export default HomePage;