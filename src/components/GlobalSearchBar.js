import React, { useState } from 'react';
import { Search } from 'lucide-react';

const GlobalSearchBar = ({ 
  currentOtif, 
  onSearchChange, 
  searchQuery = '', 
  placeholder = "Search by KPIs (OTIF), Categories (ICU, OT), or Labels...",
  showSuggestions = false,
  filteredSuggestions = [],
  onSuggestionSelect,
  onSearchFocus,
  onSearchBlur
}) => {
  // Get OTIF color based on percentage
  const getOtifColorClasses = (otifValue) => {
    if (otifValue < 60) {
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500'
      };
    } else if (otifValue >= 60 && otifValue < 85) {
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        dot: 'bg-orange-500'
      };
    } else if (otifValue >= 85 && otifValue < 95) {
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        dot: 'bg-yellow-500'
      };
    } else {
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        dot: 'bg-green-500'
      };
    }
  };

  const otifColors = getOtifColorClasses(currentOtif);

  return (
    <div className="bg-white border-b border-slate-200 py-3">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between gap-6">
          {/* Search Bar Section */}
          <div className="flex-1 max-w-2xl relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e)}
                onFocus={onSearchFocus}
                onBlur={onSearchBlur}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700 placeholder-slate-400"
                placeholder={placeholder}
              />
            </div>

            {/* Search Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => onSuggestionSelect && onSuggestionSelect(suggestion)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{suggestion.name}</div>
                      <div className="text-sm text-slate-500">{suggestion.description}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      suggestion.type === 'kpi' 
                        ? 'bg-blue-100 text-blue-700'
                        : suggestion.type === 'category'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {suggestion.type.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* OTIF Display */}
          <div className={`flex items-center gap-3 px-4 py-3 ${otifColors.bg} border ${otifColors.border} rounded-xl`}>
            <div className={`w-3 h-3 ${otifColors.dot} rounded-full animate-pulse`}></div>
            <div className="text-center">
              <div className="text-xs text-slate-500 font-medium">OTIF</div>
              <div className={`text-2xl font-bold ${otifColors.text}`}>
                {currentOtif.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchBar;
