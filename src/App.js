import React, { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Header from './components/Layout/Header';
import NotificationPanel from './components/Layout/NotificationPanel';
import UploadModal from './components/Layout/UploadModal';
import ToastNotification from './components/Layout/ToastNotification';
import LandingPage from './components/LandingPage';
import ProductJourneyScreen from './components/Dashboard/ProductJourneyScreen';
import RCARecommendationsPage from './components/RCA/RCARecommendationsPage';
import SupplierForecastReport from './components/SupplierReport/SupplierForecastReport';
import ForecastReviewPage from './components/ForecastReview/ForecastReviewPage';
import CommandCenterDashboard from './components/CommandCenter/CommandCenterDashboard';
import DecisionActionsScreen from './components/DecisionActions/DecisionActionsScreen';
import ForecastInternalDetailsScreen from './components/Forecast/ForecastInternalDetailsScreen';
import { notifications as initialNotifications } from './data/unifiedPharmaData';
import notificationsService from './services/notificationsService';
import authService from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [rcaData, setRcaData] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedForecastData, setSelectedForecastData] = useState(null);

  const [notifications, setNotifications] = useState(initialNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [toasts, setToasts] = useState([]);

  // Check authentication on mount
  useEffect(() => {
    const token = authService.getToken();
    const user = authService.getUser();

    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
  }, []);

  // Fetch notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          const response = await notificationsService.getNotifications();
          if (response.success && response.data) {
            setNotifications(response.data.notifications);
          }
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
          // Keep using mock notifications as fallback
        }
      };

      fetchNotifications();

      // Optional: Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loginToasts = [
    { id: 1, type: 'critical', title: 'Critical Stockout Alert', message: '35 products are currently stocked out', duration: 5000 },
    { id: 2, type: 'warning', title: 'Low Stock Warning', message: '48 products below reorder point', duration: 6000 },
    { id: 3, type: 'warning', title: 'Expiry Alert', message: '12 products expiring within 30 days', duration: 7000 },
    { id: 4, type: 'info', title: 'OTIF Update', message: 'OTIF score improved to 92.4%', duration: 8000 },
    { id: 5, type: 'success', title: 'Forecast Synced', message: 'Latest forecast data synchronized', duration: 9000 }
  ];

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);

    loginToasts.forEach((toast, index) => {
      setTimeout(() => {
        setToasts(prev => [...prev, { ...toast, id: Date.now() + index }]);
      }, index * 800);
    });
  };

  const handleSignup = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout(); // Clear tokens from localStorage
    setCurrentUser(null);
    setIsAuthenticated(false);
    setAuthView('login');
    setCurrentScreen('dashboard');
    setToasts([]);
  };

  const handleNavigateToRCA = (data) => {
    setRcaData(data);
    setCurrentScreen('rca');
  };

  const handleNavigateToProductJourney = (category) => {
    setSelectedCategory(category);
    setCurrentScreen('product-journey');
  };

  const handleNavigateToSupplierReport = () => {
    setCurrentScreen('supplier-report');
  };

  const handleNavigateToForecastReview = (category) => {
    setSelectedCategory(category);
    setCurrentScreen('forecast-review');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
    setSelectedCategory(null);
    setRcaData(null);
    setSelectedDepartment(null);
    setSelectedAction(null);
    setSelectedForecastData(null);
  };

  const handleNavigateToCommandCenter = (departmentData) => {
    setSelectedDepartment(departmentData);
    setCurrentScreen('command-center');
  };

  const handleLandingPageNavigate = (type, data) => {
    switch (type) {
      case 'otif-detail':
        // Navigate to Command Center for OTIF department drill-down
        handleNavigateToCommandCenter(data);
        break;
      case 'action-detail':
        setSelectedAction(data);
        setCurrentScreen('decision-actions');
        break;
      case 'forecast-detail':
        setSelectedForecastData(data);
        setCurrentScreen('forecast-internal-details');
        break;
      default:
        break;
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleUploadComplete = () => {
    const newNotification = {
      id: Date.now(),
      type: 'forecast',
      title: 'Forecast Updated',
      message: 'New forecast data has been uploaded successfully',
      severity: 'info',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleDismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToSignup={() => setAuthView('signup')}
        />
      );
    }
    return (
      <Signup
        onSignup={handleSignup}
        onSwitchToLogin={() => setAuthView('login')}
      />
    );
  }

  if (currentScreen === 'product-journey') {
    return (
      <>
        <ProductJourneyScreen
          category={selectedCategory}
          onBack={handleBackToDashboard}
        />
        <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  if (currentScreen === 'rca') {
    return (
      <>
        <RCARecommendationsPage
          sourceTab="otif"
          selectedData={rcaData}
          onBack={handleBackToDashboard}
        />
        <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  if (currentScreen === 'supplier-report') {
    return (
      <>
        <SupplierForecastReport
          onBack={handleBackToDashboard}
        />
        <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  if (currentScreen === 'forecast-review') {
    return (
      <>
        <ForecastReviewPage
          selectedNode={selectedCategory}
          onBack={handleBackToDashboard}
          onNavigateToProductJourney={handleNavigateToProductJourney}
        />
        <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  if (currentScreen === 'command-center') {
    return (
      <>
        <CommandCenterDashboard
          departmentId={selectedDepartment?.id}
          onBack={handleBackToDashboard}
        />
        <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  if (currentScreen === 'decision-actions') {
    return (
      <>
        <DecisionActionsScreen
          actionType={selectedAction}
          onBack={handleBackToDashboard}
        />
        <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  if (currentScreen === 'forecast-internal-details') {
    return (
      <>
        <ForecastInternalDetailsScreen
          forecastData={selectedForecastData}
          onBack={handleBackToDashboard}
        />
        <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        currentUser={currentUser}
        notifications={notifications}
        onUploadClick={() => setIsUploadOpen(true)}
        onNotificationClick={() => setIsNotificationOpen(true)}
        onSupplierReportClick={handleNavigateToSupplierReport}
        onLogout={handleLogout}
      />

      <LandingPage
        onNavigate={handleLandingPageNavigate}
      />

      <NotificationPanel
        isOpen={isNotificationOpen}
        notifications={notifications}
        onClose={() => setIsNotificationOpen(false)}
        onMarkAsRead={handleMarkAsRead}
        onNavigate={(notification) => {
          setIsNotificationOpen(false);
          if (notification.type === 'stockout' || notification.type === 'low_stock') {
            handleNavigateToProductJourney({ name: 'All Categories' });
          }
        }}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

export default App;
