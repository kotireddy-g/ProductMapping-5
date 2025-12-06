import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { labelCategories, getSeverityColor } from '../../data/labelData';

const GlobalSearch = ({ selectedLabel, onLabelChange, searchQuery, onSearchChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    onSearchChange(query);
    
    if (query.length > 1) {
      const filtered = labelCategories.filter(label => 
        label.name.toLowerCase().includes(query.toLowerCase()) ||
        label.description.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (label) => {
    onLabelChange(label);
    onSearchChange('');
    setSuggestions([]);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by label, product, category, or vendor..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => {
              onSearchChange('');
              setSuggestions([]);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}

        {isFocused && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {suggestions.map((label) => {
              const colors = getSeverityColor(label.severity);
              return (
                <button
                  key={label.id}
                  onClick={() => handleSuggestionClick(label)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 border-b border-slate-100 last:border-0"
                >
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors.badge} ${colors.text}`}>
                    {label.name}
                  </span>
                  <span className="text-sm text-slate-600">{label.description}</span>
                  <span className="ml-auto text-xs text-slate-400">{label.affectedProducts} products</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {labelCategories.map((label) => {
          const isSelected = selectedLabel?.id === label.id;
          const colors = getSeverityColor(label.severity);
          
          return (
            <button
              key={label.id}
              onClick={() => onLabelChange(label)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                  : `${colors.badge} ${colors.text} hover:ring-2 hover:ring-slate-300`
                }`}
            >
              {label.name}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                isSelected ? 'bg-blue-500' : 'bg-white/50'
              }`}>
                {label.affectedProducts}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GlobalSearch;