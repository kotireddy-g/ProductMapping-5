import React, { useState, useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, ExternalLink, Mic, MicOff, X, ChevronRight, Info,
  Heart, Activity, Bed, Users, Truck, Stethoscope, Pill,
  FlaskConical, Syringe, Thermometer, ClipboardList, Building2, TrendingUp,
  ArrowDown, ArrowUp, AlertCircle, AlertTriangle, BarChart3, PieChart
} from 'lucide-react';
import { dashboardTemplates } from '../config/dashboardTemplates';
import {
  overallOTIF as mockOverallOTIF,
  otifDepartments as mockOtifDepartments,
  decisionActions as mockDecisionActions,
  totalPendingActions,
  forecastSurge,
  forecastAreas as mockForecastAreas,
  searchSuggestions,
  getOTIFColorByPercentage,
  getActionColorClass,
  getForecastColorClass
} from '../data/landingPageData';
import { decisionActionSubcategories as mockDecisionActionSubcategories } from '../data/decisionActionSubcategories';
import ChordDiagram from './ChordDiagram';
import KPIDashboard from './KPIDashboard';
import ITSMInsightsPanel from './ITSM/ITSMInsightsPanel';
import OTIFBreakdownDrawer from './OTIF/OTIFBreakdownDrawer';
import HospitalPerformanceDrawer from './CommandCenter/HospitalPerformanceDrawer';
import RootCausesModal from './Landing/RootCausesModal';
import dashboardService from '../services/dashboardService';
import itsmDashboardService from '../services/itsmDashboardService';
import { parseSearchQuery } from '../utils/searchParser';
import { getTranslatedActionName } from '../utils/translationHelpers';
import { getUserRole, USER_ROLES } from '../utils/userRoles';
import { DASHBOARD_TEMPLATES } from '../config/dashboardTemplates';


// Icon mapping for department cards (API returns string names)
const iconMap = {
  'Heart': Heart,
  'Activity': Activity,
  'Bed': Bed,
  'Users': Users,
  'Truck': Truck,
  'Stethoscope': Stethoscope,
  'Pill': Pill,
  'FlaskConical': FlaskConical,
  'Syringe': Syringe,
  'Thermometer': Thermometer,
  'ClipboardList': ClipboardList,
  'Building2': Building2
};

const LandingPage = forwardRef(({
  currentUser,
  onNavigate,
  selectedModule = 'otif',
  onActionSelect,
  scrollToSection,
  isITSM = false
}, ref) => {
  const { t } = useTranslation();

  // State for current template - reactive to changes
  const [currentTemplate, setCurrentTemplate] = useState(
    localStorage.getItem('dashboardTemplate') || 'executive'
  );
  const templateConfig = DASHBOARD_TEMPLATES[currentTemplate] || DASHBOARD_TEMPLATES.executive;

  // ITSM: track which Sankey node is selected to drive InsightsPanel
  const [selectedSupplyParent, setSelectedSupplyParent] = useState(null);
  const [selectedDemandParent, setSelectedDemandParent] = useState(null);
  const [itsmTimePeriod] = useState('next_7_days');

  // Listen for template changes from localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'dashboardTemplate' && e.newValue) {
        setCurrentTemplate(e.newValue);
      }
    };

    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event for same-tab updates
    const handleTemplateChange = (e) => {
      setCurrentTemplate(e.detail.template);
    };
    window.addEventListener('templateChanged', handleTemplateChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('templateChanged', handleTemplateChange);
    };
  }, []);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showSubcategoriesModal, setShowSubcategoriesModal] = useState(false);
  const [showOTIFDrawer, setShowOTIFDrawer] = useState(false);
  const [showPerformanceDrawer, setShowPerformanceDrawer] = useState(false);
  const [showRootCauses, setShowRootCauses] = useState(null); // 'performance' or 'otif'
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(
    () => localStorage.getItem('dashboardTemplate') || 'default'
  );
  const [activeSection, setActiveSection] = useState('performance');

  // Refs for sections
  const performanceRef = useRef(null);
  const supplyDemandRef = useRef(null);
  const departmentsRef = useRef(null);
  const decisionsRef = useRef(null);
  const forecastRef = useRef(null);
  const kpisRef = useRef(null);

  // Get user role
  const userRole = getUserRole(currentUser?.email);

  // Extract data from API or use mock
  const overviewData = apiData?.overview;
  const overallOTIF = overviewData?.overallOTIF || mockOverallOTIF;
  const overallOT = overviewData?.overallOT || 95.0;
  const overallIF = overviewData?.overallIF || 95.0;

  // Module mapping - same as Sidebar.js
  const moduleMap = {
    'otif': 'OTIF',
    'dtif': 'DTIF',
    'staff-allocation': 'Staff Allocation',
    'customer-satisfaction': 'Customer Satisfaction',
    'resource-utilization': 'Resource Utilization',
    'order-management': 'Order Management',
    'bed-management': 'Bed Management'
  };

  // Function to get display name from module ID
  const getModuleDisplayName = (moduleId) => {
    return moduleMap[moduleId] || (isITSM ? 'DTIF' : 'OTIF');
  };

  // Module-specific metrics
  // If API returns module ID in displayName, map it to proper display name
  const apiDisplayName = overviewData?.displayName || (isITSM ? 'DTIF' : 'OTIF');
  const moduleDisplayName = getModuleDisplayName(apiDisplayName.toLowerCase());
  const moduleCurrentValue = overviewData?.currentValue || overallOTIF;
  const isOTIFModule = selectedModule === 'otif'; // dtif is NOT otif — ITSM card won't show OTIF sub-items

  // Reorder departments: Lab and Radiology last
  const rawDepartments = overviewData?.departments || mockOtifDepartments;
  const otifDepartments = useMemo(() => {
    const labIndex = rawDepartments.findIndex(d => d.id === 'lab');
    const radiologyIndex = rawDepartments.findIndex(d => d.id === 'radiology');
    const otherDepts = rawDepartments.filter(d => d.id !== 'lab' && d.id !== 'radiology');
    const labDept = labIndex !== -1 ? rawDepartments[labIndex] : null;
    const radiologyDept = radiologyIndex !== -1 ? rawDepartments[radiologyIndex] : null;

    const reordered = [...otherDepts];
    if (labDept) reordered.push(labDept);
    if (radiologyDept) reordered.push(radiologyDept);

    return reordered;
  }, [rawDepartments]);

  const decisionActions = apiData?.decisionActions?.decisionActions || mockDecisionActions;
  const decisionActionSubcategories = apiData?.decisionActions?.decisionActionSubcategories || mockDecisionActionSubcategories;
  const forecastAreas = apiData?.forecast || mockForecastAreas;

  // Fetch all dashboard data on mount and when module / isITSM changes
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Pick the right service: ITSM uses itsmDashboardService (same paths, different base URL + module=itsm)
        const svc = isITSM ? itsmDashboardService : dashboardService;
        // Pharma passes the module param; ITSM service hardcodes module=itsm internally
        const moduleParam = (!isITSM && selectedModule !== 'otif') ? selectedModule : null;

        const [overviewResponse, actionsResponse, forecastResponse] = await Promise.all([
          svc.getOverview(moduleParam).catch(err => {
            console.error('Overview API failed:', err);
            return null;
          }),
          svc.getDecisionActions(moduleParam).catch(err => {
            console.error('Decision Actions API failed:', err);
            return null;
          }),
          svc.getForecast(moduleParam).catch(err => {
            console.error('Forecast API failed:', err);
            return null;
          }),
        ]);

        const newApiData = {};
        if (overviewResponse?.success) newApiData.overview = overviewResponse.data;
        if (actionsResponse?.success) newApiData.decisionActions = actionsResponse.data;
        if (forecastResponse?.success) newApiData.forecast = forecastResponse.data;
        setApiData(newApiData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedModule, isITSM]);

  // Scroll to section handler
  const handleScrollToSection = (sectionId) => {
    // Handle scroll to top
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('performance');
      return;
    }

    const sectionRefs = {
      performance: performanceRef,
      supplyDemand: supplyDemandRef,
      departments: departmentsRef,
      decisions: decisionsRef,
      forecast: forecastRef,
      kpis: kpisRef
    };

    const ref = sectionRefs[sectionId];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  // Expose scrollToSection method to parent via ref
  useImperativeHandle(ref, () => ({
    scrollToSection: handleScrollToSection
  }));

  // Create component mapping for template-based rendering
  const componentMapping = useMemo(() => {
    return {
      performanceOtif: 'performanceOtif',
      supplyDemand: 'supplyDemand',
      departments: 'departments',
      decisions: 'decisions',
      forecast: 'forecast',
      kpis: 'kpis'
    };
  }, []);

  // Helper function to render component by key
  const renderComponent = (componentKey) => {
    const key = `section-${componentKey}`;

    switch (componentKey) {
      case 'performanceOtif':
        // Performance/OTIF Section (originally at line 397-518)
        return (
          <div key={key} className="mb-6" ref={performanceRef}>
            {/* Performance Metrics Cards - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
              {/* Performance Index Card - White Background */}
              <div
                onClick={() => setShowPerformanceDrawer(true)}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  {/* Left Side - Content */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      Performance Index
                    </h3>
                    <p className="text-xs text-green-600">
                      If Achieved: <span className="font-semibold">79.32</span> | If Missed: <span className="font-semibold">77.71</span>
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowRootCauses('performance');
                      }}
                      className="text-[#3B82F6] hover:text-blue-700 text-xs mt-1 flex items-center gap-1 w-fit"
                    >
                      <AlertCircle size={12} />
                      <span>3 Root Causes</span>
                    </button>
                  </div>

                  {/* Right Side - Score and Badge */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-start gap-2">
                      <span className="text-4xl font-bold text-[#10B981]">
                        {overviewData?.forecastInsights?.hospitalPerformanceIndex?.currentScore?.toFixed(2) || '77.71'}
                      </span>
                      <Info size={18} className="text-gray-400 mt-1" />
                    </div>
                    <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
                      Down: 18% ↓
                    </span>
                  </div>
                </div>
              </div>

              {/* Module Card - White Background (Dynamic based on selected module) */}
              <div
                onClick={isOTIFModule ? () => setShowOTIFDrawer(true) : undefined}
                className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 ${isOTIFModule ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
                  } transition-all`}
              >
                <div className="flex items-start justify-between">
                  {/* Left Side - Content */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {moduleDisplayName}
                    </h3>
                    {isOTIFModule && (
                      <p className="text-xs text-green-600">
                        OT: <span className="font-semibold">{overallOT}%</span> | IF: <span className="font-semibold">{overallIF}%</span>
                      </p>
                    )}
                    {isOTIFModule && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRootCauses('otif');
                        }}
                        className="text-[#F97316] hover:text-orange-700 text-xs mt-1 flex items-center gap-1 w-fit"
                      >
                        <AlertCircle size={12} />
                        <span>3 Root Causes</span>
                      </button>
                    )}
                  </div>

                  {/* Right Side - Score and Badge */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-start gap-2">
                      <span className="text-4xl font-bold text-[#F97316]">
                        {moduleCurrentValue}%
                      </span>
                      {isOTIFModule && <Info size={18} className="text-orange-400 mt-1" />}
                    </div>
                    <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
                      16% lower goal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'supplyDemand':
        // Supply & Demand / DTIF Flow — same ChordDiagram for both pharma and ITSM
        // (Backend returns same shape for both; ITSM uses module=itsm via itsmSupplyDemandService inside ChordDiagram)
        return (
          <div key={key} className="mb-8" ref={supplyDemandRef}>
            <ChordDiagram
              selectedModule={selectedModule}
              isITSM={isITSM}
              onNodeSelect={isITSM ? (sp, dp) => {
                setSelectedSupplyParent(sp);
                setSelectedDemandParent(dp);
              } : undefined}
            />
          </div>
        );

      case 'departments':
        // For ITSM: show AI Insights panel (synced to Sankey node selection)
        // For Pharma: show department OTIF cards as before
        if (isITSM) {
          return (
            <div key={key} className="mb-16" ref={departmentsRef}>
              <ITSMInsightsPanel
                supplyParent={selectedSupplyParent}
                demandParent={selectedDemandParent}
                timePeriod={itsmTimePeriod}
              />
            </div>
          );
        }
        // Department Cards Section (Pharma)
        return (
          <div key={key} className="mb-16" ref={departmentsRef}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {otifDepartments.map((dept) => {
                // Special grey styling for Lab and Radiology
                const isGreyCard = dept.id === 'lab' || dept.id === 'radiology';

                // Helper function to get percentage color based on performance
                const getPercentageColor = (percentage) => {
                  if (percentage >= 94) return 'text-green-600';
                  if (percentage >= 85) return 'text-orange-500';
                  return 'text-gray-600';
                };

                // Get icon component from string name (API) or use directly if already a component (mock)
                const IconComponent = typeof dept.icon === 'string' ? iconMap[dept.icon] || Heart : dept.icon;
                const changeSign = dept.changePercentage >= 0 ? '+' : '';
                const trendColor = dept.changePercentage >= 0 ? 'text-green-600' : 'text-red-600';
                const trendArrow = dept.changePercentage >= 0 ? '↑' : '↓';

                return (
                  <button
                    key={dept.id}
                    onClick={() => {
                      if (isGreyCard) {
                        alert(`${dept.name} is currently disabled and will be enabled after integration.`);
                      } else {
                        onNavigate && onNavigate('otif-detail', dept);
                      }
                    }}
                    className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm transition-all hover:shadow-lg hover:scale-105 text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <IconComponent className="text-gray-400" size={20} />
                      </div>
                      <div className={`text-2xl font-bold ${getPercentageColor(dept.otifPercentage)}`}>
                        {Number(dept.otifPercentage).toFixed(2)}%
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">{dept.description}</p>

                    {/* Percentage Change Indicator */}
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-gray-600">vs prev:</span>
                      <span className={`font-semibold ${trendColor} flex items-center gap-0.5`}>
                        {changeSign}{Math.abs(dept.changePercentage).toFixed(2)}% {trendArrow}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'decisions':
        // Decision Actions Section
        return (
          <div key={key} className="mb-16" ref={decisionsRef}>
            {/* Action Header */}
            <div className="mb-8">
              <h2 className="text-5xl font-bold text-gray-800">
                {t('decisionActions.title')}: <span className="text-red-600">{apiData?.decisionActions?.totalDecisionActionsCount || totalPendingActions}</span>
              </h2>
              <p className="text-gray-600 mt-2">{t('decisionActions.pending')} actions requiring immediate attention</p>
            </div>

            {/* Action Grid Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
              {decisionActions.map((action) => {
                const colors = getActionColorClass(action.severity);

                return (
                  <button
                    key={action.id}
                    onClick={() => {
                      setSelectedAction(action);
                      setShowSubcategoriesModal(true);
                    }}
                    className="bg-white border border-gray-200 rounded-lg p-4 transition-all hover:shadow-lg hover:scale-105 text-left flex items-center gap-3 shadow-sm"
                  >
                    {/* Left Side - Circular Badge with Radial Background */}
                    <div className="flex-shrink-0">
                      {/* Outer Radial Circle (Light Background) */}
                      <div className={`${colors.radialBg} w-16 h-16 rounded-full flex items-center justify-center`}>
                        {/* Inner Badge Circle */}
                        <div className={`${colors.badge} w-12 h-12 rounded-full flex items-center justify-center text-base font-bold`}>
                          {action.pendingCount}
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Text Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">
                        {getTranslatedActionName(action.name, t)}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{action.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Note Point */}
            <div className="mt-4 flex items-start gap-2 text-sm text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <span className="font-semibold">Note:</span>
              <span>All actionable insights are based on demand and supply, stock availability</span>
            </div>
          </div>
        );

      case 'forecast':
        // Forecast Section
        return (
          <div key={key} className="mb-12" ref={forecastRef}>
            {/* Forecast Header */}
            <div className="mb-8">
              <h2 className="text-5xl font-bold text-gray-800">
                Forecast: <span className={forecastSurge >= 0 ? 'text-green-600' : 'text-red-600'}>{Number(forecastSurge).toFixed(2)}% {forecastSurge >= 0 ? '↑' : '↓'}</span>
              </h2>
              <p className="text-gray-600 mt-2">Demand forecast surge across hospital areas</p>
            </div>

            {/* Forecast Grid Cards - WITH WHITE BACKGROUNDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {forecastAreas.map((area) => {
                const colors = getForecastColorClass(area.trend);
                const changeSign = area.changePercentage >= 0 ? '+' : '';

                return (
                  <button
                    key={area.id}
                    onClick={() => onNavigate && onNavigate('forecast-detail', area)}
                    className={`bg-white ${colors.border} border-2 rounded-lg p-3 transition-all hover:shadow-lg hover:scale-105 text-left`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-base font-bold ${colors.text}`}>
                        {area.areaName}
                      </h3>
                      <div className={`${colors.badge} px-1.5 py-0.5 rounded-full text-xs font-bold`}>
                        {colors.arrow}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className={`text-xl font-bold ${colors.text}`}>
                        {Number(area.currentForecast).toFixed(2)}%
                      </p>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">vs Prev:</span>
                        <span className={`font-semibold ${area.changePercentage >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                          {changeSign}{Number(area.changePercentage).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Note Point */}
            <div className="mt-4 flex items-start gap-2 text-sm text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
              <span className="font-semibold">Note:</span>
              <span>All data is measured compared with previous week</span>
            </div>
          </div>
        );
      case 'kpis':
        // KPI Dashboard (originally at line 715)
        return (
          <div key={key} ref={kpisRef}>
            <KPIDashboard onNavigate={onNavigate} selectedModule={selectedModule} isITSM={isITSM} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Render components in template-specified order */}
        {templateConfig.componentOrder.map((componentKey) => renderComponent(componentKey))}

        {/* Footer with Links */}
        <div className="bg-white border-t border-gray-200 shadow-sm mt-12">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                © 2024 Experienceflow Software Technologies Private Limited. All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-sm">
                <a
                  href="https://experienceflow.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
                >
                  Privacy Policy
                  <ExternalLink size={14} />
                </a>
                <a
                  href="https://experienceflow.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
                >
                  Terms & Conditions
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Action Subcategories Modal */}
      {
        showSubcategoriesModal && selectedAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className={`${getActionColorClass(selectedAction.severity).bg} ${getActionColorClass(selectedAction.severity).border} border-b-2 p-6 flex items-center justify-between`}>
                <div>
                  <h3 className={`text-2xl font-bold ${getActionColorClass(selectedAction.severity).text}`}>
                    {selectedAction.name}
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">{selectedAction.description}</p>
                  <p className="text-xs text-gray-600 mt-2">Select a subcategory to view detailed actions</p>
                </div>
                <button
                  onClick={() => {
                    setShowSubcategoriesModal(false);
                    setSelectedAction(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {decisionActionSubcategories[selectedAction.id]?.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => {
                        setShowSubcategoriesModal(false);
                        onNavigate && onNavigate('action-detail', {
                          ...selectedAction,
                          subcategory,
                          mainAction: selectedAction.id,
                          subAction: subcategory.id
                        });
                      }}
                      className="bg-white border-2 border-gray-200 hover:border-blue-500 rounded-lg p-4 transition-all hover:shadow-lg text-left group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {subcategory.name}
                        </h4>
                        <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                          {subcategory.count}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{subcategory.description}</p>
                      <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>View Details</span>
                        <ChevronRight size={14} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* OTIF Breakdown Drawer */}
      <OTIFBreakdownDrawer
        isOpen={showOTIFDrawer}
        onClose={() => setShowOTIFDrawer(false)}
        breakdownData={overviewData?.overallBreakdown}
      />

      {/* Hospital Performance Index Drawer */}
      <HospitalPerformanceDrawer
        isOpen={showPerformanceDrawer}
        onClose={() => setShowPerformanceDrawer(false)}
        selectedModule={selectedModule}
        isITSM={isITSM}
        performanceData={overviewData?.forecastInsights?.hospitalPerformanceIndex || {
          currentScore: 77.71,
          ifAchievedScore: 79.32,
          ifMissedScore: 77.71,
          formula: "0.30 × OTIF_norm + 0.25 × Revenue_norm + 0.20 × Cost_efficiency_norm + 0.15 × Patient_Sat_norm + 0.10 × Clinical_Risk_norm",
          inputs: {
            components: {
              OTIF_norm: 92.36,
              Revenue_norm: 0,
              Cost_efficiency_norm: 0,
              Patient_Sat_norm: 96.18,
              Clinical_Risk_norm: 100
            },
            currentOtifPct: 92.36,
            forecastVendorOtifPct: 97.69,
            vendorCoveragePct: 30,
            totalForecastQty: 6100
          },
          medicineImpact: {
            deltaOtifPct: 5.37,
            protectedUnitsIfAchieved: 652.47,
            riskUnitsIfMissed: 0,
            protectedValueIfAchieved: 0,
            riskValueIfMissed: 0
          },
          explanation: {
            about: "Hospital Performance Index blends five normalised components — OTIF (30%), revenue coverage (25%), cost efficiency via forecast accuracy (20%), patient satisfaction proxy (15%), and clinical risk (10%) — to describe how resilient the hospital pharmacy is for the selected time period.",
            current: "Current Performance Index is 77.71 based on present OTIF 92.36%, forecast accuracy 0.0% and RM 0.00 of revenue already protected.",
            ifAchieved: "If we meet the forecast OTIF of 97.69%, the index would rise to 79.32 with revenue protection improving to RM 0.00.",
            ifMissed: "If OTIF slips to 87.03%, the index will fall to 77.71 and revenue protection may drop to RM 0.00."
          }
        }}
      />

      {/* Root Causes Modal */}
      <RootCausesModal
        isOpen={showRootCauses !== null}
        onClose={() => setShowRootCauses(null)}
        metricType={showRootCauses}
      />
    </div >
  );
});

export default LandingPage;
