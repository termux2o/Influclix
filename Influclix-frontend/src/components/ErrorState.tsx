// src/components/ErrorState.tsx

import React from "react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Something went wrong.",
  onRetry,
}) => {
  return (
    <div className="app-error-state">
      <div className="app-error-icon">⚠️</div>
      <h3 className="app-error-title">Oops!</h3>
      <p className="app-error-message">{message}</p>
      {onRetry && (
        <button className="app-error-retry" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;