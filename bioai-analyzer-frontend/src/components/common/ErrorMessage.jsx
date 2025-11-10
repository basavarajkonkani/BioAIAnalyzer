import React from 'react';

const ErrorMessage = ({ message, onDismiss, type = 'error' }) => {
  if (!message) return null;

  const typeStyles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-800',
      icon: '❌',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-800',
      icon: '⚠️',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-800',
      icon: 'ℹ️',
    },
  };

  const style = typeStyles[type] || typeStyles.error;

  return (
    <div
      className={`${style.bg} ${style.border} ${style.text} border-l-4 p-4 mb-4 rounded-r`}
      role="alert"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <span className="mr-2 text-lg">{style.icon}</span>
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`ml-4 ${style.text} hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2`}
            aria-label="Dismiss"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
