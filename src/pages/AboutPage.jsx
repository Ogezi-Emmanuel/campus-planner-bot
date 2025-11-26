import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BottomAwareFooter } from "../components/PageEndFooter";

const AboutPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Removed useEffect that redirects authenticated users to dashboard

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center p-4">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Removed conditional rendering that returns null if user is logged in

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl card text-center">
        <h1 className="text-4xl font-extrabold text-primary mb-6">About CampusPlanner</h1>
        <p className="text-lg text-text leading-relaxed mb-4">
          CampusPlanner is your ultimate companion for managing student life.
          From tracking your expenses to organizing your study schedule,
          we provide intuitive tools to help you stay on top of your academic and personal commitments.
        </p>
        <p className="text-lg text-text leading-relaxed mb-4">
          Our mission is to simplify the complexities of student life,
          allowing you to focus on what truly matters: learning and growing.
          With a sleek, modern design and powerful features, CampusPlanner is designed to make your life easier.
        </p>
        <p className="text-lg text-text leading-relaxed">
          Developed with ❤️ by your dedicated team.
        </p>
      </div>
      {/* Bottom-aware footer only when scrolled to end */}
      <BottomAwareFooter />
    </div>
  );
};

export default AboutPage;