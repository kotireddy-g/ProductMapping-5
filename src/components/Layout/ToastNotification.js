import React, { useEffect } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const ToastNotification = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const getTypeStyles = () => {
    switch (toast.type) {
      case 'critical':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
          titleColor: 'text-red-800',
          messageColor: 'text-red-600'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 border-amber-200',
          icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
          titleColor: 'text-amber-800',
          messageColor: 'text-amber-600'
        };
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          titleColor: 'text-green-800',
          messageColor: 'text-green-600'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: <Info className="w-5 h-5 text-blue-500" />,
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-600'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div 
      className={`${styles.bg} border rounded-xl p-4 shadow-lg animate-slide-in-right flex items-start gap-3 min-w-[320px]`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {styles.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`font-semibold text-sm ${styles.titleColor}`}>
          {toast.title}
        </h4>
        <p className={`text-sm mt-0.5 ${styles.messageColor}`}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 hover:bg-white/50 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  );
};

export default ToastNotification;
