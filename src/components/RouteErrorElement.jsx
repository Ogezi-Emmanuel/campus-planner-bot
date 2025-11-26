import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

const RouteErrorElement = () => {
  const error = useRouteError();
  console.error('Route error:', error);

  let title = 'Unexpected Application Error';
  let message = 'Something went wrong while navigating.';
  let details = null;

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    try {
      const dataMessage = typeof error.data === 'string' ? error.data : error.data?.message;
      message = dataMessage || message;
    } catch (_) {}
  } else if (error instanceof Error) {
    message = error.message || message;
    details = error.stack;
  } else if (typeof error === 'string') {
    message = error;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="card max-w-xl w-full">
        <h1 className="text-2xl font-bold text-primary mb-2">{title}</h1>
        <p className="text-text mb-4">{message}</p>
        {details && (
          <pre className="text-xs bg-background p-3 rounded overflow-auto">
            {details}
          </pre>
        )}
        <div className="mt-4 flex gap-2">
          <a className="btn-secondary" href="/">Go Home</a>
          <button className="btn-primary" onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorElement;