import React, { useState, useEffect, useRef } from 'react';
import './i18n'; // Initialize i18n
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Sidebar from './components/Layout/Sidebar';
import GlobalSearchBar from './components/Layout/GlobalSearchBar';
import NotificationPanel from './components/Layout/NotificationPanel';
import UploadModal from './components/Layout/UploadModal';
import ToastNotification from './components/Layout/ToastNotification';
import TemplateSelectorModal from './components/TemplateSelector/TemplateSelectorModal';
import LandingPage from './components/LandingPage';
import ProductJourneyScreen from './components/Dashboard/ProductJourneyScreen';
import RCARecommendationsPage from './components/RCA/RCARecommendationsPage';
import SupplierForecastReport from './components/SupplierReport/SupplierForecastReport';
import ForecastReviewPage from './components/ForecastReview/ForecastReviewPage';
import CommandCenterDashboard from './components/CommandCenter/CommandCenterDashboard';
import DecisionActionsScreen from './components/DecisionActions/DecisionActionsScreen';
import ForecastInternalDetailsScreen from './components/Forecast/ForecastInternalDetailsScreen';
import KPIDetailScreen from './components/KPI/KPIDetailScreen';
import SourceConnectionPage from './components/Connectors/SourceConnectionPage';
import SourceListPage from './components/Connectors/SourceListPage';
import WorkPulseDashboard from './components/WorkPulse/WorkPulseDashboard';
import ITSMSplashScreen from './components/ITSM/ITSMSplashScreen';
import ITSMSearchPage from './components/ITSM/ITSMSearchPage';
import CEOKPIDetailPage from './components/ITSM/CEOKPIDetailPage';
import ConnectMorePage from './components/ITSM/ConnectMorePage';

import notificationsService from './services/notificationsService';
import authService from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  // Derived role helpers
  const isITSM = ['itsm', 'itsm-admin', 'itsm-ceo'].includes(currentUser?.role);
  const isITSMAdmin = currentUser?.role === 'itsm-admin';
  const isITSMCEO = currentUser?.role === 'itsm-ceo';

  // ITSM-specific screen state: 'splash' | 'login' | 'itsm-search' | 'ceo-kpi' | 'connect-more'
  const [itsmScreen, setItsmScreen] = useState('splash'); // start on splash
  const [selectedCEOAction, setSelectedCEOAction] = useState(null);
  const [appFlow, setAppFlow] = useState('source-connection');
  const [connectedSources, setConnectedSources] = useState(
    () => JSON.parse(localStorage.getItem('connectedSources') || '[]')
  );

  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [rcaData, setRcaData] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedForecastData, setSelectedForecastData] = useState(null);
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [selectedModule, setSelectedModule] = useState('otif'); // Module state
  // Must be derived AFTER selectedModule is declared (avoids temporal dead zone ReferenceError)
  const effectiveModule = isITSM ? 'dtif' : selectedModule;

  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(
    localStorage.getItem('dashboardTemplate') || 'executive'
  );

  const [toasts, setToasts] = useState([]);
  const [selectedActionForModal, setSelectedActionForModal] = useState(null);
  const landingPageRef = useRef(null);
  const contentAreaRef = useRef(null); // Ref for scrollable content area
  const [activeSection, setActiveSection] = useState('top'); // Track active sidebar section

  // Check authentication on mount
  useEffect(() => {
    const token = authService.getToken();
    const user = authService.getUser();

    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      // Restore ITSM users to the search page (skip splash on refresh)
      if (user.role === 'itsm-admin' || user.role === 'itsm-ceo') {
        setAppFlow('itsm');
        setItsmScreen('itsm-search');
      }
    }
  }, []);

  // Fetch notifications on login (isAuthenticated → true) or module switch (selectedModule changes).
  // The effect itself is the trigger — toasts shown on every genuine context change.
  // Background 30-second refresh runs inside the interval with showToasts=false.
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchNotifications = async (showToasts) => {
      try {
        const response = await notificationsService.getNotifications(selectedModule, isITSM);
        if (response && response.success && response.data) {
          const normalized = Array.isArray(response.data.notifications)
            ? response.data.notifications
            : [];
          setNotifications(normalized);

          if (showToasts && normalized.length > 0) {
            // Clear existing toasts then stagger unread ones into view
            setToasts([]);
            const unread = normalized.filter(n => !n.read).slice(0, 5);
            unread.forEach((notification, index) => {
              setTimeout(() => {
                setToasts(prev => [...prev, {
                  id: `${selectedModule}-${Date.now()}-${index}`,
                  type: notification.type || notification.severity || 'info',
                  title: notification.title,
                  message: notification.message,
                  duration: 5000 + (index * 1000)
                }]);
              }, index * 800);
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    // Fetch with toasts when this effect fires (login or module switch)
    fetchNotifications(true);

    // Background refresh every 30 seconds — silent, no toasts
    const interval = setInterval(() => fetchNotifications(false), 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, selectedModule]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset scroll position when navigating to different screens
  useEffect(() => {
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTop = 0;
    }
  }, [currentScreen]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    const role = user.role;
    if (role === 'itsm-admin' || role === 'itsm-ceo') {
      // ITSM users → go to the ITSM search page
      setItsmScreen('itsm-search');
      setAppFlow('itsm');
    } else if (role === 'itsm') {
      // Legacy itsm role — keep old behaviour
      setAppFlow('main');
    } else {
      setAppFlow('source-connection');
    }
  };

  const handleSignup = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setAppFlow('source-connection');
    // isAuthenticated changing to true triggers the notification useEffect above
  };

  const handleSourcesContinue = (sources) => {
    setConnectedSources(sources);
    localStorage.setItem('connectedSources', JSON.stringify(sources));
    setAppFlow('main');
  };

  const handleLogout = () => {
    authService.logout(); // Clear tokens from localStorage
    setCurrentUser(null);
    setIsAuthenticated(false);
    setAuthView('login');
    setCurrentScreen('dashboard');
    setAppFlow('source-connection');
    setItsmScreen('splash'); // reset splash for next ITSM login
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
    setSelectedKPI(null);
  };

  const handleNavigateToKPIDetail = (kpiData) => {
    setSelectedKPI(kpiData);
    setCurrentScreen('kpi-detail');
  };

  const handleNavigateToCommandCenter = (departmentData) => {
    setSelectedDepartment(departmentData);
    setCurrentScreen('command-center');
  };

  const handleNavigation = (screen, data = null) => {
    // Special screens handled outside the main layout
    if (screen === 'workpulse-dashboard' || screen === 'connectors') {
      setCurrentScreen(screen);
      return;
    }
    setCurrentScreen(screen);

    // Handle different navigation types
    if (screen === 'product-journey') {
      setSelectedCategory(data);
    } else if (screen === 'rca') {
      setRcaData(data);
    } else if (screen === 'command-center') {
      setSelectedDepartment(data);
    } else if (screen === 'decision-actions') {
      setSelectedAction(data);
    } else if (screen === 'forecast-details') {
      setSelectedForecastData(data);
    } else if (screen === 'kpi-detail') {
      setSelectedKPI(data); // data now includes { id, name, data }
    }
  };

  const handleLandingPageNavigate = (type, data) => {
    // If user is on a detail page and using search, navigate to landing page first
    if (currentScreen !== 'dashboard') {
      setCurrentScreen('dashboard');
      // Wait for landing page to render, then navigate
      setTimeout(() => {
        performNavigation(type, data);
      }, 100);
    } else {
      performNavigation(type, data);
    }
  };

  const performNavigation = (type, data) => {
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
      case 'kpi-detail':
        handleNavigateToKPIDetail(data);
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

  const handleModuleChange = (moduleId) => {
    if (moduleId === selectedModule) return; // no-op if same module tapped
    // Clear stale data immediately so old module notifications don't flash
    setNotifications([]);
    setToasts([]);
    if (currentScreen !== 'dashboard') {
      setCurrentScreen('dashboard');
    }
    setSelectedModule(moduleId);
    // selectedModule changing triggers the notification useEffect above
  };

  const handleScrollToSection = (sectionId) => {
    // Update active section
    setActiveSection(sectionId);

    // If scrolling to top, scroll the content area to the very top
    if (sectionId === 'top') {
      if (contentAreaRef.current) {
        contentAreaRef.current.scrollTop = 0;
      }
      // If on a detail page, also navigate back to landing page
      if (currentScreen !== 'dashboard') {
        setCurrentScreen('dashboard');
      }
      return;
    }

    // For other sections, navigate to landing page if needed, then scroll
    if (currentScreen !== 'dashboard') {
      setCurrentScreen('dashboard');
      // Wait for landing page to render, then scroll
      setTimeout(() => {
        if (landingPageRef.current && landingPageRef.current.scrollToSection) {
          landingPageRef.current.scrollToSection(sectionId);
        }
      }, 100);
    } else {
      // Already on landing page, just scroll
      if (landingPageRef.current && landingPageRef.current.scrollToSection) {
        landingPageRef.current.scrollToSection(sectionId);
      }
    }
  };

  const handleTemplateChange = (templateId) => {
    setCurrentTemplate(templateId);
    localStorage.setItem('dashboardTemplate', templateId);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('templateChange', { detail: { template: templateId } }));
  };

  const handleActionSelect = (action) => {
    setSelectedActionForModal(action);
  };

  // ── ITSM Splash Screen (no session yet) ─────────────────────────────────────
  if (!isAuthenticated && itsmScreen === 'splash') {
    return <ITSMSplashScreen onLogin={() => setItsmScreen('login')} />;
  }

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

  // ── ITSM Flow (itsm-admin & itsm-ceo) ───────────────────────────────────────
  if (isAuthenticated && appFlow === 'itsm') {
    // Connect More
    if (itsmScreen === 'connect-more') {
      return (
        <ConnectMorePage
          connectedSources={connectedSources}
          onComplete={(sources) => {
            setConnectedSources(sources);
            localStorage.setItem('connectedSources', JSON.stringify(sources));
            setItsmScreen('itsm-search');
          }}
          onBack={() => setItsmScreen('itsm-search')}
        />
      );
    }


    // ITSM Search Page (default for both users)
    return (
      <ITSMSearchPage
        currentUser={currentUser}
        connectedSources={connectedSources}
        onSearch={(query) => {
          // Admin: DTIF search → existing dashboard
          if (isITSMAdmin) {
            setAppFlow('main');
          }
          // CEO: search goes to dashboard too (optional)
          if (isITSMCEO) {
            setAppFlow('main');
          }
        }}
        onActionClick={(actionId, actionLabel) => {
          if (isITSMCEO) {
            // CEO: render KPI detail inside the main app layout (with sidebar)
            setSelectedCEOAction(actionId);
            setAppFlow('main');
            setCurrentScreen('ceo-kpi');
          } else {
            // Admin clicks action → go to existing DTIF dashboard
            setAppFlow('main');
          }
        }}
        onConnectMore={() => setItsmScreen('connect-more')}
        onLogout={handleLogout}
      />
    );
  }

  // ── Post-login: Source Connection Flow ──────────────────────────────────────
  if (isAuthenticated && appFlow === 'source-connection') {
    if (connectedSources.length > 0) {
      return (
        <SourceConnectionPage
          connectedSources={connectedSources}
          onConnectMore={() => {
            // Go straight to SourceListPage, with existing connections pre-filled
            setAppFlow('source-list');
          }}
          onContinue={() => setAppFlow('main')}
        />
      );
    }
    return (
      <SourceConnectionPage
        connectedSources={[]}
        onConnectSource={() => setAppFlow('source-list')}
        onContinue={() => setAppFlow('main')}
      />
    );
  }

  if (isAuthenticated && appFlow === 'source-list') {
    return (
      <SourceListPage
        initialConnected={connectedSources}
        onBack={() => setAppFlow('source-connection')}
        onContinue={handleSourcesContinue}
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
          sourceTab={isITSM ? 'dtif' : 'otif'}
          selectedData={rcaData}
          onBack={handleBackToDashboard}
          isITSM={isITSM}
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





  // ── WorkPulse Dashboard (full-screen, replaces entire app layout) ───────────
  if (currentScreen === 'workpulse-dashboard') {
    return (
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <WorkPulseDashboard onBack={() => setCurrentScreen('dashboard')} />
        <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        selectedModule={effectiveModule}
        onModuleChange={handleModuleChange}
        currentScreen={currentScreen}
        onNavigate={handleNavigation}
        onScrollToSection={handleScrollToSection}
        onNotificationClick={() => setIsNotificationOpen(true)}
        onTemplateClick={() => setShowTemplateSelector(true)}
        unreadNotificationCount={Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0}
        activeSection={activeSection}
        isITSM={isITSM}
        onLogoClick={isITSM ? () => {
          // ITSM users: logo click → back to the ITSM search page
          setAppFlow('itsm');
          setItsmScreen('itsm-search');
        } : undefined}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Global Search Bar - Fixed at top for all users */}
        <GlobalSearchBar
          onNavigate={handleLandingPageNavigate}
          onNavigateToWorkPulse={() => setCurrentScreen('workpulse-dashboard')}
          dashboardData={{
            departments: [],
            forecastAreas: [],
            decisionActions: []
          }}
          onActionSelect={handleActionSelect}
          onLogout={handleLogout}
          currentUser={currentUser}
          isITSM={isITSM}
        />

        <div className="flex-1 overflow-y-auto" ref={contentAreaRef}>
          {/* Render different screens based on currentScreen */}
          {currentScreen === 'dashboard' && (
            <LandingPage
              ref={landingPageRef}
              currentUser={currentUser}
              onNavigate={handleLandingPageNavigate}
              selectedModule={effectiveModule}
              onActionSelect={setSelectedActionForModal}
              isITSM={isITSM}
            />
          )}

          {currentScreen === 'command-center' && (
            <CommandCenterDashboard
              departmentId={selectedDepartment?.id}
              onBack={handleBackToDashboard}
              selectedModule={effectiveModule}
              isITSM={isITSM}
            />
          )}

          {currentScreen === 'kpi-detail' && (
            <KPIDetailScreen
              selectedKPI={selectedKPI}
              onBack={handleBackToDashboard}
              selectedModule={effectiveModule}
              isITSM={isITSM}
            />
          )}

          {currentScreen === 'decision-actions' && (
            <DecisionActionsScreen
              actionType={selectedAction}
              mainAction={selectedAction?.mainAction}
              subAction={selectedAction?.subAction}
              selectedModule={effectiveModule}
              onBack={handleBackToDashboard}
              isITSM={isITSM}
            />
          )}

          {currentScreen === 'forecast-internal-details' && (
            <ForecastInternalDetailsScreen
              forecastData={selectedForecastData}
              selectedForecastArea={selectedForecastData?.areaName || 'ICU'}
              onBack={handleBackToDashboard}
              selectedModule={effectiveModule}
              isITSM={isITSM}
            />
          )}

          {/* CEO KPI Detail – rendered inside the main layout (sidebar + header) */}
          {currentScreen === 'ceo-kpi' && isITSMCEO && (
            <CEOKPIDetailPage
              action={selectedCEOAction}
              onBack={() => {
                // Back → main ITSM dashboard
                setCurrentScreen('dashboard');
              }}
            />
          )}

          {/* Connectors page inside the main layout */}
          {currentScreen === 'connectors' && (
            <SourceListPage
              initialConnected={connectedSources}
              onBack={() => setCurrentScreen('dashboard')}
              onContinue={(sources) => {
                setConnectedSources(sources);
                localStorage.setItem('connectedSources', JSON.stringify(sources));
                setCurrentScreen('dashboard');
              }}
            />
          )}
        </div>
      </div>

      <NotificationPanel
        isOpen={isNotificationOpen}
        notifications={notifications}
        onClose={() => setIsNotificationOpen(false)}
        onMarkAsRead={handleMarkAsRead}
        isITSM={isITSM}
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

      <TemplateSelectorModal
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        currentTemplate={currentTemplate}
        onTemplateChange={handleTemplateChange}
      />

      <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

export default App;
