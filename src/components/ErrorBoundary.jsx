import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // Optionally, navigate home or refresh
    // window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-text bg-background">
          <h1 className="text-3xl font-bold text-primary mb-2">Something went wrong</h1>
          <p className="mb-4">An unexpected error occurred. Please try again.</p>
          <button className="btn-primary" onClick={this.handleRetry}>Retry</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;