import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationToast = ({ notification, onDismiss, autoHide = true, duration = 8000 }) => {
  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        onDismiss(notification.id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [notification.id, onDismiss, autoHide, duration]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200 shadow-red-100';
      case 'warning':
        return 'bg-orange-50 border-orange-200 shadow-orange-100';
      case 'success':
        return 'bg-green-50 border-green-200 shadow-green-100';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 shadow-blue-100';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`w-80 p-4 rounded-lg border shadow-lg ${getNotificationStyles(notification.type)} animate-slide-in-right`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">
                {notification.title}
              </p>
              <p className="text-sm text-slate-600 mt-1">
                {notification.message}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-full">
                  {notification.category}
                </span>
                <span className="text-xs text-slate-500">
                  {formatTimeAgo(notification.timestamp)}
                </span>
              </div>
            </div>
            <button
              onClick={() => onDismiss(notification.id)}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
