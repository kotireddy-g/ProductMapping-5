import React from 'react';
import { X, AlertTriangle, Package, Clock, TrendingUp, Bell, Info, AlertCircle, CheckCircle } from 'lucide-react';

const NotificationPanel = ({ isOpen, notifications, onClose, onMarkAsRead, onNavigate, isITSM = false }) => {
  if (!isOpen) return null;

  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  // ─── Icon by type ────────────────────────────────────────────────────────────
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'stockout': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'low_stock': return <Package className="w-5 h-5 text-yellow-500" />;
      case 'expiry': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'otif': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'forecast': return <TrendingUp className="w-5 h-5 text-purple-500" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info':
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  // ─── Left-border accent by type ──────────────────────────────────────────────
  const getNotificationBg = (type, read) => {
    if (read) return 'bg-slate-50';
    switch (type) {
      case 'stockout':
      case 'critical': return 'bg-red-50    border-l-2 border-red-500';
      case 'low_stock': return 'bg-yellow-50 border-l-2 border-yellow-500';
      case 'expiry': return 'bg-orange-50 border-l-2 border-orange-500';
      case 'otif': return 'bg-blue-50   border-l-2 border-blue-500';
      case 'forecast': return 'bg-purple-50 border-l-2 border-purple-500';
      case 'warning': return 'bg-amber-50  border-l-2 border-amber-500';
      case 'success': return 'bg-green-50  border-l-2 border-green-500';
      case 'info':
      default: return 'bg-blue-50   border-l-2 border-blue-400';
    }
  };

  // ─── Human-readable label for a type ─────────────────────────────────────────
  const getTypeLabel = (type) => {
    const pharmaLabels = {
      stockout: 'Stockouts',
      low_stock: 'Low Stock',
      expiry: 'Expiry Alerts',
      otif: 'OTIF Issues',
      forecast: 'Forecast Deviations',
      critical: 'Critical Alerts',
      warning: 'Warnings',
      info: 'Information',
      success: 'Updates',
    };
    const itsmLabels = {
      stockout: 'Backlog Alerts',
      low_stock: 'Capacity Alerts',
      expiry: 'SLA Breach Alerts',
      otif: 'DTIF Issues',
      forecast: 'Sprint Deviations',
      critical: 'Critical Alerts',
      warning: 'Warnings',
      info: 'Information',
      success: 'Updates',
    };
    const labels = isITSM ? itsmLabels : pharmaLabels;
    return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  // ─── Group notifications by type (preserving order of first appearance) ───────
  const groupOrder = [];
  const groups = {};
  safeNotifications.forEach((n) => {
    const t = n.type || 'info';
    if (!groups[t]) {
      groups[t] = [];
      groupOrder.push(t);
    }
    groups[t].push(n);
  });

  const unreadCount = safeNotifications.filter(n => !n.read).length;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-slate-200 z-50 overflow-hidden flex flex-col shadow-xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          {safeNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
              <Bell className="w-10 h-10 opacity-40" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            groupOrder.map((type) => {
              const notifs = groups[type];
              return (
                <div key={type} className="border-b border-slate-200">
                  <div className="px-4 py-2 bg-slate-100">
                    <span className="text-sm font-medium text-slate-600">
                      {getTypeLabel(type)}
                    </span>
                  </div>

                  {notifs.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-100 cursor-pointer transition-colors ${getNotificationBg(notification.type, notification.read)}`}
                      onClick={() => {
                        if (onMarkAsRead) onMarkAsRead(notification.id);
                        if (onNavigate) onNavigate(notification);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type || 'info')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-800 font-medium text-sm">{notification.title}</p>
                          <p className="text-slate-600 text-sm mt-1">{notification.message}</p>
                          {notification.timestamp && (
                            <p className="text-slate-400 text-xs mt-2">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer ── */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button className="w-full py-2 text-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
