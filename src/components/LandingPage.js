import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search, ExternalLink, Mic, MicOff, X, ChevronRight,
  Heart, Activity, Bed, Users, Truck, Stethoscope, Pill,
  FlaskConical, Syringe, Thermometer, ClipboardList, Building2
} from 'lucide-react';
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
import dashboardService from '../services/dashboardService';

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

const LandingPage = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showSubcategoriesModal, setShowSubcategoriesModal] = useState(false);
  const recognitionRef = useRef(null);

  // API data state
  const [overviewData, setOverviewData] = useState(null);
  const [decisionActionsData, setDecisionActionsData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use API data or fall back to mock data
  const overallOTIF = overviewData?.overallOTIF || mockOverallOTIF;
  const overallOT = overviewData?.overallOT || 95.0;
  const overallIF = overviewData?.overallIF || 94.8;

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

  const decisionActions = decisionActionsData?.decisionActions || mockDecisionActions;
  const decisionActionSubcategories = decisionActionsData?.decisionActionSubcategories || mockDecisionActionSubcategories;
  const forecastAreas = forecastData || mockForecastAreas;

  // Fetch all dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all three APIs in parallel
        const [overviewResponse, actionsResponse, forecastResponse] = await Promise.all([
          dashboardService.getOverview().catch(err => {
            console.error('Overview API failed:', err);
            return null;
          }),
          dashboardService.getDecisionActions().catch(err => {
            console.error('Decision Actions API failed:', err);
            return null;
          }),
          dashboardService.getForecast().catch(err => {
            console.error('Forecast API failed:', err);
            return null;
          })
        ]);

        // Update state with API data if successful
        if (overviewResponse?.success) {
          setOverviewData(overviewResponse.data);
        }
        if (actionsResponse?.success) {
          setDecisionActionsData(actionsResponse.data);
        }
        if (forecastResponse?.success) {
          setForecastData(forecastResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Component will use mock data as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Generate filtered search suggestions
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const allSuggestions = [
      ...searchSuggestions.otif.map(s => ({ text: s, category: 'OTIF' })),
      ...searchSuggestions.medicines.map(s => ({ text: s, category: 'Medicine' })),
      ...searchSuggestions.actions.map(s => ({ text: s, category: 'Action' })),
      ...searchSuggestions.labels.map(s => ({ text: s, category: 'Label' }))
    ];

    return allSuggestions
      .filter(s => s.text.toLowerCase().includes(query))
      .slice(0, 8);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);

    if (suggestion.category === 'OTIF' && suggestion.text.includes('OTIF ')) {
      const deptName = suggestion.text.replace('OTIF ', '');
      const dept = otifDepartments.find(d => d.name.toLowerCase() === deptName.toLowerCase());
      if (dept && onNavigate) {
        onNavigate('otif-detail', dept);
      }
    }
  };

  // Voice search functionality
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setShowSuggestions(true);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Prominent Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={28} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search: OTIF, MEDICINE, Action, Labels (Voice or Text)"
              className="w-full pl-16 pr-20 py-6 text-xl border-2 border-blue-300 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-lg bg-white transition-all"
            />

            {/* Voice Search Button */}
            <button
              onClick={toggleVoiceSearch}
              className={`absolute right-5 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all ${isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              title={isListening ? 'Stop listening' : 'Start voice search'}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            {/* Auto-suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-80 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-5 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800 font-medium">{suggestion.text}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {suggestion.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* OTIF Section */}
        <div className="mb-16">
          {/* OTIF Header */}
          <div className="mb-8">
            <div>
              <h2 className="text-5xl font-bold text-gray-800">
                OTIF: <span className={getOTIFColorByPercentage(overallOTIF).textColor}>{overallOTIF}%</span>
              </h2>
              {/* OT and IF as subheader */}
              <p className="text-gray-600 mt-2 text-lg">
                OT: <span className={`font-semibold ${getOTIFColorByPercentage(overallOT).textColor}`}>{overallOT}%</span>
                {' '}<span className="text-gray-400">|</span>{' '}
                IF: <span className={`font-semibold ${getOTIFColorByPercentage(overallIF).textColor}`}>{overallIF}%</span>
              </p>
              <p className="text-gray-500 mt-1 text-sm">Department-wise On-Time In-Full Performance</p>
            </div>
          </div>

          {/* Chord Diagram */}
          <ChordDiagram />

          {/* OTIF Department Grid Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {otifDepartments.map((dept) => {
              // Special grey styling for Lab and Radiology
              const isGreyCard = dept.id === 'lab' || dept.id === 'radiology';

              // Get colors based on API status field
              const getColorsByStatus = (status) => {
                switch (status) {
                  case 'green':
                    return {
                      bg: 'bg-green-50',
                      border: 'border-green-400',
                      iconBg: 'bg-green-100',
                      text: 'text-green-700'
                    };
                  case 'amber':
                    return {
                      bg: 'bg-amber-50',
                      border: 'border-amber-400',
                      iconBg: 'bg-amber-100',
                      text: 'text-amber-700'
                    };
                  case 'red':
                    return {
                      bg: 'bg-red-50',
                      border: 'border-red-400',
                      iconBg: 'bg-red-100',
                      text: 'text-red-700'
                    };
                  default:
                    return getOTIFColorByPercentage(dept.otifPercentage);
                }
              };

              const colors = isGreyCard
                ? {
                  bg: 'bg-gray-100',
                  border: 'border-gray-300',
                  iconBg: 'bg-gray-200',
                  text: 'text-gray-700'
                }
                : getColorsByStatus(dept.status);

              // Get icon component from string name (API) or use directly if already a component (mock)
              const IconComponent = typeof dept.icon === 'string' ? iconMap[dept.icon] || Heart : dept.icon;
              const changeSign = dept.changePercentage >= 0 ? '+' : '';
              const trendColor = dept.changePercentage >= 0 ? 'text-green-700' : 'text-red-700';
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
                  className={`${colors.bg} ${colors.border} border-2 rounded-lg p-3 transition-all hover:shadow-lg hover:scale-105 text-left`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${colors.iconBg} p-2 rounded-md`}>
                      <IconComponent className={colors.text} size={18} />
                    </div>
                    <div className={`text-2xl font-bold ${colors.text}`}>
                      {dept.otifPercentage}%
                    </div>
                  </div>
                  <h3 className={`text-sm font-semibold ${colors.text}`}>
                    {dept.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">{dept.description}</p>

                  {/* Percentage Change Indicator */}
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-gray-600">vs Prev:</span>
                    <span className={`font-semibold ${trendColor} flex items-center gap-0.5`}>
                      {changeSign}{Math.abs(dept.changePercentage)}% {trendArrow}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Color Legend */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-600 bg-white p-4 rounded-lg shadow-sm">
            <span className="font-semibold text-gray-700">Color Coding:</span>
            <div className="flex items-center gap-2">
              <span>🟢 Green: 95-100%</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🟠 Amber: 85-95%</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔴 Red: &lt;85%</span>
            </div>
          </div>
        </div>

        {/* Decision Actions Section */}
        <div className="mb-16">
          {/* Action Header */}
          <div className="mb-8">
            <h2 className="text-5xl font-bold text-gray-800">
              Decision Actions: <span className="text-red-600">{totalPendingActions}</span>
            </h2>
            <p className="text-gray-600 mt-2">Pending actions requiring immediate attention</p>
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
                  className={`${colors.bg} ${colors.border} border-2 rounded-lg p-3 transition-all hover:shadow-lg hover:scale-105 text-left relative`}
                >
                  {/* Pending Count Badge */}
                  <div className="absolute top-2 right-2">
                    <div className={`${colors.badge} px-2 py-1 rounded-full text-sm font-bold`}>
                      {action.pendingCount}
                    </div>
                  </div>

                  <div className="pr-12">
                    <h3 className={`text-sm font-bold ${colors.text} mb-1`}>
                      {action.name}
                    </h3>
                    <p className="text-xs text-gray-700">{action.description}</p>
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

        {/* Forecast Section */}
        <div className="mb-12">
          {/* Forecast Header */}
          <div className="mb-8">
            <h2 className="text-5xl font-bold text-gray-800">
              Forecast: <span className={forecastSurge >= 0 ? 'text-green-600' : 'text-red-600'}>{forecastSurge}% {forecastSurge >= 0 ? '↑' : '↓'}</span>
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
                      {area.currentForecast}%
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">vs Prev:</span>
                      <span className={`font-semibold ${area.changePercentage >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {changeSign}{area.changePercentage}%
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

        {/* KPI Dashboard */}
        <KPIDashboard />

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
      {showSubcategoriesModal && selectedAction && (
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
      )}
    </div>
  );
};

export default LandingPage;
