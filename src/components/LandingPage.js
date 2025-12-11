import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ExternalLink, Mic, MicOff } from 'lucide-react';
import {
  overallOTIF,
  otifDepartments,
  decisionActions,
  totalPendingActions,
  forecastSurge,
  forecastAreas,
  searchSuggestions,
  getOTIFColorClass,
  getActionColorClass,
  getForecastColorClass
} from '../data/landingPageData';

const LandingPage = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

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
      .slice(0, 8); // Limit to 8 suggestions
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);

    // Navigate to command center if it's an OTIF department suggestion
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
            <div className="flex items-baseline gap-4 flex-wrap">
              <h2 className="text-5xl font-bold text-gray-800">
                OTIF: <span className="text-green-600">{overallOTIF}%</span>
              </h2>
              <div className="flex items-center gap-4 text-2xl text-gray-600">
                <span>OT (On-Time): <span className="font-semibold text-blue-600">91%</span></span>
                <span className="text-gray-300">|</span>
                <span>IF (In-Full): <span className="font-semibold text-purple-600">89%</span></span>
              </div>
            </div>
            <p className="text-gray-600 mt-2">Department-wise On-Time In-Full Performance</p>
          </div>

          {/* OTIF Department Grid Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {otifDepartments.map((dept) => {
              const colors = getOTIFColorClass(dept.status);
              const IconComponent = dept.icon;

              return (
                <button
                  key={dept.id}
                  onClick={() => onNavigate && onNavigate('otif-detail', dept)}
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
                </button>
              );
            })}
          </div>

          {/* Color Legend */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-600 bg-white p-4 rounded-lg shadow-sm">
            <span className="font-semibold text-gray-700">Color Coding:</span>
            <div className="flex items-center gap-2">
              <span>🟢 Green: 94-100%</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🟠 Amber: 85-94%</span>
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
                  onClick={() => onNavigate && onNavigate('action-detail', action)}
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
              Forecast: <span className="text-blue-600">{forecastSurge}% ↑</span>
            </h2>
            <p className="text-gray-600 mt-2">Demand forecast surge across hospital areas</p>
          </div>

          {/* Forecast Grid Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {forecastAreas.map((area) => {
              const colors = getForecastColorClass(area.trend);
              const changeSign = area.changePercentage >= 0 ? '+' : '';

              return (
                <button
                  key={area.id}
                  onClick={() => onNavigate && onNavigate('forecast-detail', area)}
                  className={`${colors.bg} ${colors.border} border-2 rounded-lg p-3 transition-all hover:shadow-lg hover:scale-105 text-left`}
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

      </div>

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
  );
};

export default LandingPage;
