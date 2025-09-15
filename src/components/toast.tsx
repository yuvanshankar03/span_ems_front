import React, { useEffect, useState } from 'react';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircleOutlined className="text-white" />;
      case 'error': return <ExclamationCircleOutlined className="text-white" />;
      default: return null;
    }
  };

  return (
    <div className={`
      fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-lg text-white 
      transition-all duration-300 transform
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      ${getBackgroundColor()}
    `}>
      <div className="flex items-center space-x-2">
        {getIcon()}
        <span>{message}</span>
      </div>
    </div>
  );
};