import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ChordDiagram from './ChordDiagram';
import KpiCards from './KpiCards';
import RelatedKPIsDrawer from './RelatedKPIsDrawer';
import KpiDetailDrawer from './KpiDetailDrawer';
import ForecastReviewPage from '../ForecastReview/ForecastReviewPage';
import { coreLabels, getPriorityColor } from '../../data/coreLabelsData';
import { labelFilters, periodicOptions, otifKpiCards } from '../../data/secondScreenData';
import { validateDataConsistency } from '../../data/consistentSyntheticData';

const SecondScreenDashboard = ({ 
  selectedItem, 
  onBack, 
  currentDataSet = 1 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [showForecastReview, setShowForecastReview] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedForecastNode, setSelectedForecastNode] = useState(null);
  const [relatedKPIsDrawerOpen, setRelatedKPIsDrawerOpen] = useState(false);
  const [kpiDetailDrawerOpen, setKpiDetailDrawerOpen] = useState(false);
  const [selectedKpiForDetail, setSelectedKpiForDetail] = useState(null);

  // Validate data consistency on component mount
  React.useEffect(() => {
    const validation = validateDataConsistency();
    if (!validation.isBalanced) {
      console.warn('Data consistency issue detected:', validation);
    }
  }, []);

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
  const impactMetrics = (coreLabels || []).map(label => ({
    ...label,
    ...(label[`dataSet${currentDataSet}`] || {})
  }));

  // Get KPI data based on current data set
  const currentKpiData = otifKpiCards[`dataSet${currentDataSet}`] || [];

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

  // Handle left node click for forecast review
  const handleForecastClick = (node) => {
    setSelectedForecastNode(node);
    setShowForecastReview(true);
  };

  // Handle right node click for drill-down
  const handleRightNodeClick = (node) => {
    console.log('Right node clicked for drill-down:', node);
  };

  // Handle KPI card click
  const handleKpiClick = (kpi) => {
    setSelectedKpiForDetail(kpi);
    setKpiDetailDrawerOpen(true);
  };

  // Handle Related KPIs click
  const handleRelatedKPIsClick = () => {
    setRelatedKPIsDrawerOpen(true);
  };

  if (showForecastReview) {
    return (
      <ForecastReviewPage 
        onBack={() => {
          setShowForecastReview(false);
          setSelectedForecastNode(null);
        }}
        selectedNode={selectedForecastNode}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Title Section with Periodic Bar */}
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
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-900">
                  {selectionType === 'kpi' && 'OTIF KPI Analysis'}
                  {selectionType === 'category' && `${selectedItem?.name || 'Category'} Analysis`}
                  {selectionType === 'label' && `${selectedItem?.name || 'Label'} Analysis`}
                </h1>
                {selectionType === 'kpi' && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-lg font-bold text-yellow-700">
                      88.9%
                    </span>
                  </div>
                )}
              </div>
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

      {/* 2. Filter Section (for Labels only) */}
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
        </div>
      )}

      {/* 3. Chord Diagram */}
      <ChordDiagram
        onLeftNodeClick={handleForecastClick}
        onRightNodeClick={handleRightNodeClick}
        currentDataSet={currentDataSet}
        selectedPeriod={selectedPeriod}
        selectedFilters={selectedFilters}
        selectionType={selectionType}
        selectedItem={selectedItem}
      />

      {/* 4. Impact Metrics / Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">
            {selectionType === 'kpi' ? 'Impact Metrics - Core Labels' : 'Related KPIs'}
          </h3>
          {selectionType !== 'kpi' && (
            <button
              onClick={handleRelatedKPIsClick}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              View Details →
            </button>
          )}
        </div>
        
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

      {/* 5. KPI Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          {selectionType === 'kpi' ? 'OTIF Related KPIs' : `${selectedItem?.name || 'Selected'} Performance Metrics`}
        </h3>
        <KpiCards 
          kpiData={currentKpiData} 
          onKpiClick={handleKpiClick}
        />
      </div>

      {/* Related KPIs Drawer */}
      <RelatedKPIsDrawer
        isOpen={relatedKPIsDrawerOpen}
        onClose={() => setRelatedKPIsDrawerOpen(false)}
      />

      {/* KPI Detail Drawer */}
      <KpiDetailDrawer
        isOpen={kpiDetailDrawerOpen}
        onClose={() => {
          setKpiDetailDrawerOpen(false);
          setSelectedKpiForDetail(null);
        }}
        selectedKpi={selectedKpiForDetail}
      />
    </div>
  );
};

export default SecondScreenDashboard;