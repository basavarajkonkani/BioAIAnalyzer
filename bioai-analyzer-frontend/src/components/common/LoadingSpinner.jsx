import React, { useState, useEffect } from 'react';

const LoadingSpinner = ({ size = 'md', minDuration = 300 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Ensure minimum display duration of 300ms
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (!isVisible) return null;

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;
