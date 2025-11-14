import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import RouteErrorElement from './components/RouteErrorElement';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ExpenseTrackerPage from './pages/ExpenseTrackerPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import AboutPage from './pages/AboutPage';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteErrorElement />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'auth', element: <AuthPage /> },
      { path: 'about', element: <AboutPage /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'expenses',
        element: (
          <ProtectedRoute>
            <ExpenseTrackerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'study-planner',
        element: (
          <ProtectedRoute>
            <StudyPlannerPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);