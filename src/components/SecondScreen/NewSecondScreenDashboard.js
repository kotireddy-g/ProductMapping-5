import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import EnhancedSankeyDiagram from './EnhancedSankeyDiagram';
import KpiCards from './KpiCards';
import ForecastReviewPage from '../ForecastReview/ForecastReviewPage';
import { coreLabels, getPriorityColor } from '../../data/coreLabelsData';
import { labelFilters, periodicOptions, otifKpiCards } from '../../data/secondScreenData';

const NewSecondScreenDashboard = ({ 
  selectedItem, 
  onBack, 
  currentDataSet = 1 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [showForecastReview, setShowForecastReview] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Determine the type of selection (KPI, Category, or Label)
  const getSelectionType = () => {
    if (!selectedItem) return 'kpi';
    if (selectedItem.type === 'kpi') return 'kpi';
    if (selectedItem.type === 'category') return 'category';
    if (selectedItem.type === 'label') return 'label';
    return 'label'; // Default for direct label selection
  };

  const selectionType = getSelectionType();

  // Get current data for impact metrics (7 core labels)
  const impactMetrics = coreLabels.map(label => ({
    ...label,
    ...label[`dataSet${currentDataSet}`]
  }));

  // Get KPI data based on current data set
  const currentKpiData = otifKpiCards[`dataSet${currentDataSet}`];

  // Handle periodic selection with Live alert
  const handlePeriodicSelect = (period) => {
    if (period.id === 'live' && !period.enabled) {
      alert('Live data is not enabled yet. Please select another time period.');
      return;
    }
    setSelectedPeriod(period.id);
  };

  // Handle filter selection for labels
  const handleFilterToggle = (filterId) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  // Get filters for current label type
  const getCurrentFilters = () => {
    if (selectionType !== 'label' || !selectedItem) return [];
    const labelId = selectedItem.id || selectedItem.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return labelFilters[labelId] || [];
  };

  // Handle Sankey node click for forecast review
  const handleForecastClick = (node) => {
    setShowForecastReview(true);
  };

  if (showForecastReview) {
    return (
      <ForecastReviewPage 
        onBack={() => setShowForecastReview(false)}
        selectedNode={null}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and Periodic Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          {/* Left: Back button and Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {selectionType === 'kpi' && 'OTIF KPI Analysis'}
                {selectionType === 'category' && `${selectedItem?.name || 'Category'} Analysis`}
                {selectionType === 'label' && `${selectedItem?.name || 'Label'} Analysis`}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {selectionType === 'kpi' && 'On-Time In-Full delivery performance metrics'}
                {selectionType === 'category' && `Analysis for ${selectedItem?.name || 'selected category'}`}
                {selectionType === 'label' && `Analysis for ${selectedItem?.name || 'selected label'}`}
              </p>
            </div>
          </div>

          {/* Right: Periodic Bar */}
          <div className="flex items-center gap-2">
            {periodicOptions.map((period) => (
              <button
                key={period.id}
                onClick={() => handlePeriodicSelect(period)}
                disabled={!period.enabled}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPeriod === period.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : period.enabled
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                }`}
              >
                {period.name}
                {!period.enabled && period.id === 'live' && (
                  <span className="ml-1 text-xs">🚫</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Buttons for Labels */}
      {selectionType === 'label' && getCurrentFilters().length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Filter by {selectedItem?.name || 'Label'} Types
          </h3>
          <div className="flex flex-wrap gap-3">
            {getCurrentFilters().map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterToggle(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  selectedFilters.includes(filter.id)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
          {selectedFilters.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Selected Filters:</h4>
              <div className="space-y-2">
                {selectedFilters.map(filterId => {
                  const filter = getCurrentFilters().find(f => f.id === filterId);
                  return filter ? (
                    <div key={filterId} className="text-sm">
                      <span className="font-medium text-blue-800">{filter.name}:</span>
                      <span className="text-blue-700 ml-2">{filter.description}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sankey Diagram */}
      <EnhancedSankeyDiagram
        selectedType={selectionType}
        onNodeClick={() => {}}
        onForecastClick={handleForecastClick}
        currentDataSet={currentDataSet}
      />

      {/* Impact Metrics - 7 Core Labels (for KPI) or Related KPIs (for Labels/Categories) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          {selectionType === 'kpi' ? 'Impact Metrics - Core Labels' : 'Related KPIs'}
        </h3>
        
        {selectionType === 'kpi' ? (
          // Show 7 core labels for KPI
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {impactMetrics.map((label) => {
              const priorityColors = getPriorityColor(label.priority);
              
              return (
                <div
                  key={label.id}
                  className={`${priorityColors.bg} ${priorityColors.border} border rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-medium ${priorityColors.text}`}>
                      {label.name}
                    </h4>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${priorityColors.badge}`}>
                      {label.priority}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">OTIF:</span>
                      <span className={`font-bold ${priorityColors.text}`}>
                        {label.otifPercentage.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Products:</span>
                      <span className="font-medium text-slate-700">
                        {label.affectedProducts}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Value:</span>
                      <span className="font-medium text-slate-700">
                        ₹{(label.totalValue / 100000).toFixed(1)}L
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Show related KPIs for labels/categories
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Inventory Turnover', 'Service Level', 'Cost Efficiency', 'Stock Accuracy'].map((kpi, index) => (
              <div key={kpi} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">{kpi}</h4>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {[4.2, 94.5, 76.3, 98.1][index]}
                  {['x', '%', '%', '%'][index]}
                </div>
                <div className="text-sm text-slate-500">
                  Target: {[6.0, 98.0, 85.0, 99.0][index]}{['x', '%', '%', '%'][index]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* KPI Cards with Charts */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          {selectionType === 'kpi' ? 'OTIF Related KPIs' : `${selectedItem?.name || 'Selected'} Performance Metrics`}
        </h3>
        <KpiCards kpiData={currentKpiData} />
      </div>
    </div>
  );
};

export default NewSecondScreenDashboard;
