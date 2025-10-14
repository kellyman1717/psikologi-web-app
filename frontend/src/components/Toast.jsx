import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onHide }) => {
  useEffect(() => {
    // Automatically hide the toast after 3 seconds
    const timer = setTimeout(() => {
      onHide();
    }, 3000);

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [onHide]);

  const bgColor = type === 'success' 
    ? 'bg-green-500' 
    : 'bg-red-500';

  return (
    <div 
      className={`fixed bottom-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out ${bgColor}`}
    >
      {message}
    </div>
  );
};

export default Toast;