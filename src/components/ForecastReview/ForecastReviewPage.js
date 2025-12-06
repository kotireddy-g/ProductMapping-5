import React, { useState, useCallback } from 'react';
import { ArrowLeft, Filter, Download, RefreshCw, GitBranch } from 'lucide-react';
import { medicineCategories } from '../../data/unifiedPharmaData';
import ForecastAdjustmentDrawer from './ForecastAdjustmentDrawer';
import ProductJourneyModal from './ProductJourneyModal';

const ForecastReviewPage = ({ onBack, selectedNode, onNavigateToProductJourney }) => {
  const [filters, setFilters] = useState({
    location: 'All',
    timeBucket: 'Week',
    priority: 'All',
    status: 'All'
  });
  const [adjustmentDrawerOpen, setAdjustmentDrawerOpen] = useState(false);
  const [productJourneyOpen, setProductJourneyOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  const getLocationForMedicine = (category) => {
    const locations = {
      'emergency': 'Emergency & Critical Care – Hospital A',
      'ot': 'Operating Theatre – Hospital A',
      'ward': 'Inpatient Ward 3 – Hospital A',
      'daycare': 'Oncology Day-care – Hospital A',
      'general': 'OPD Pharmacy – Hospital A',
      'implant': 'Cardiac Cath Lab – Hospital A'
    };
    return locations[category] || 'General Ward – Hospital A';
  };

  const getUnitForMedicine = (medicineName) => {
    if (medicineName.includes('Tab.')) return 'tablets';
    if (medicineName.includes('Inj.')) return 'vials';
    if (medicineName.includes('Syrup')) return 'bottles';
    if (medicineName.includes('Stent') || medicineName.includes('Prosthesis') || medicineName.includes('Pacemaker')) return 'units';
    return 'units';
  };

  const getDeltaMessage = (otif) => {
    if (otif >= 95) return 'Excellent performance';
    if (otif >= 90) return 'Good performance, stable';
    if (otif >= 85) return 'Performance declining';
    if (otif >= 80) return 'Needs attention';
    return 'Critical - immediate action required';
  };

  // Get medicines from the selected category with consistent data
  const getMedicinesForCategory = useCallback((categoryName) => {
    const category = medicineCategories.find(cat => cat.name === categoryName);
    if (!category) return [];

    // Generate medicines based on the category's itemCount to match the displayed count
    const medicines = [];
    const baseNames = {
      'Emergency Medicines': [
        'Inj. Adrenaline 1mg', 'Inj. Atropine 0.6mg', 'Inj. Dopamine 200mg',
        'Inj. Noradrenaline 4mg', 'Inj. Hydrocortisone 100mg', 'Inj. Furosemide 20mg',
        'Inj. Diazepam 10mg', 'Inj. Midazolam 5mg'
      ],
      'OT Medicines': [
        'Inj. Propofol 200mg', 'Inj. Sevoflurane 250ml', 'Inj. Rocuronium 50mg',
        'Inj. Vecuronium 10mg', 'Inj. Fentanyl 100mcg', 'Inj. Morphine 10mg'
      ],
      'Ward Medicines': [
        'Tab. Paracetamol 500mg', 'Tab. Ibuprofen 400mg', 'Inj. Ceftriaxone 1g',
        'Tab. Omeprazole 20mg', 'Inj. Pantoprazole 40mg', 'Tab. Metformin 500mg'
      ],
      'Daycare Medicines': [
        'Inj. Rituximab 500mg', 'Inj. Trastuzumab 440mg', 'Inj. Bevacizumab 400mg',
        'Inj. Carboplatin 450mg', 'Inj. Paclitaxel 300mg'
      ],
      'General Medicines': [
        'Tab. Aspirin 75mg', 'Tab. Atorvastatin 20mg', 'Tab. Amlodipine 5mg',
        'Tab. Metoprolol 50mg', 'Tab. Lisinopril 10mg'
      ],
      'Implant Medicines': [
        'Cardiac Stent Drug Eluting', 'Hip Joint Prosthesis', 'Knee Joint Prosthesis',
        'Pacemaker Dual Chamber', 'ICD Device'
      ]
    };

    const names = baseNames[categoryName] || ['Medicine Item'];

    for (let i = 0; i < category.itemCount; i++) {
      const baseName = names[i % names.length];
      const medicineName = i >= names.length ? `${baseName} (${Math.floor(i / names.length) + 1})` : baseName;
      const quantity = 100 + Math.floor(Math.random() * 400);
      const otif = 75 + Math.random() * 25; // Random OTIF between 75-100%

      medicines.push({
        id: i + 1,
        sku: medicineName,
        code: `${category.id.toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
        location: getLocationForMedicine(category.id),
        forecast: `${quantity} ${getUnitForMedicine(medicineName)}`,
        currentPlan: `${Math.floor(quantity * 0.9)} ${getUnitForMedicine(medicineName)}`,
        keyKpis: {
          otif: otif >= 90 ? 'High' : otif >= 80 ? 'Medium' : 'Low',
          expiry: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'
        },
        delta: getDeltaMessage(otif),
        status: otif >= 90 ? 'low' : otif >= 80 ? 'medium' : 'critical',
        priority: otif >= 90 ? 'LOW' : otif >= 80 ? 'MEDIUM' : 'CRITICAL',
        action: 'Review / Override',
        actualOtif: otif,
        tag: ['Must have', 'Patient Related', 'Regular Supply'][Math.floor(Math.random() * 3)]
      });
    }

    return medicines;
  }, []);

  React.useEffect(() => {
    const initialData = selectedNode ?
      getMedicinesForCategory(selectedNode.name) :
      getMedicinesForCategory('Emergency Medicines');
    setForecastData(initialData);
  }, [selectedNode, getMedicinesForCategory]);

  // Handle forecast adjustment
  const handleForecastAdjustment = (adjustment) => {
    setForecastData(prev => prev.map(item =>
      item.id === adjustment.item.id
        ? {
            ...item,
            delta: `Adjusted: ${adjustment.adjustmentType}`,
            currentPlan: `${adjustment.newQuantity} ${item.currentPlan.split(' ')[1]}`,
            status: 'updated'
          }
        : item
    ));
  };

  // Handle Review/Override button click
  const handleReviewOverride = (item) => {
    setSelectedItem(item);
    setAdjustmentDrawerOpen(true);
  };

  // Handle Flow button click
  const handleFlowClick = (item) => {
    setSelectedItem(item);
    setProductJourneyOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'low': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'MEDIUM': return 'bg-orange-500 text-white';
      case 'LOW': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getKpiColor = (level) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-orange-100 text-orange-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Forecast Review & Actions</h1>
              <p className="text-sm text-gray-500 mt-1">
                Review AI forecasts and apply overrides to improve model accuracy
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
            <select
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>ICU Pharmacy</option>
              <option>Ward 3</option>
              <option>OPD Pharmacy</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Time Bucket</label>
            <select
              value={filters.timeBucket}
              onChange={(e) => setFilters({...filters, timeBucket: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Week</option>
              <option>Month</option>
              <option>Quarter</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>CRITICAL</option>
              <option>MEDIUM</option>
              <option>LOW</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Critical</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU / Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flow
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tag
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Forecast
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key KPIs
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delta / Alert
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {forecastData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{item.sku}</div>
                        <div className="text-sm text-gray-500">{item.code}</div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleFlowClick(item)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        <GitBranch className="w-4 h-4" />
                        Flow
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={item.tag || 'Must have'}
                      >
                        <option value="Must have">Must have</option>
                        <option value="Patient Related">Patient Related</option>
                        <option value="Regular Supply">Regular Supply</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{item.location}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{item.forecast}</div>
                      <div className="text-xs text-red-500">↗ +40 vials</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{item.currentPlan}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">OTIF:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getKpiColor(item.keyKpis.otif)}`}>
                            {item.keyKpis.otif}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Expiry:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getKpiColor(item.keyKpis.expiry)}`}>
                            {item.keyKpis.expiry}
                          </span>
                        </div>
                        <div className="text-xs text-blue-600 mt-1">7d inv</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(item.status)}`}>
                        <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                        {item.delta}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button 
                        onClick={() => handleReviewOverride(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {item.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Forecast Adjustment Drawer */}
      <ForecastAdjustmentDrawer
        isOpen={adjustmentDrawerOpen}
        onClose={() => {
          setAdjustmentDrawerOpen(false);
          setSelectedItem(null);
        }}
        selectedItem={selectedItem}
        onApply={handleForecastAdjustment}
      />

      {/* Product Journey Modal */}
      <ProductJourneyModal
        isOpen={productJourneyOpen}
        onClose={() => {
          setProductJourneyOpen(false);
          setSelectedItem(null);
        }}
        selectedItem={selectedItem}
      />
    </div>
  );
};

export default ForecastReviewPage;
