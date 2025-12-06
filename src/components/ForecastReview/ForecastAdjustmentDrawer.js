import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const ForecastAdjustmentDrawer = ({ isOpen, onClose, selectedItem, onApply }) => {
  const [adjustmentType, setAdjustmentType] = useState('');
  const [newQuantity, setNewQuantity] = useState(selectedItem?.forecast?.split(' ')[0] || '');
  const [reasons, setReasons] = useState([]);
  const [applyScope, setApplyScope] = useState('current');
  const [customReason, setCustomReason] = useState('');

  // Generate historical data based on selected item
  const generateHistoricalData = () => {
    if (!selectedItem) {
      return [
        { period: '340', value: 340 },
        { period: '360', value: 360 },
        { period: '380', value: 380 },
        { period: '450', value: 420 }
      ];
    }

    const currentForecast = parseInt(selectedItem.forecast?.split(' ')[0]) || 420;
    const baseValue = Math.floor(currentForecast * 0.8);

    return [
      { period: 'Week 1', value: baseValue + Math.floor(Math.random() * 40) },
      { period: 'Week 2', value: baseValue + Math.floor(Math.random() * 50) },
      { period: 'Week 3', value: baseValue + Math.floor(Math.random() * 60) },
      { period: 'Week 4', value: currentForecast }
    ];
  };

  const historicalData = generateHistoricalData();

  const adjustmentOptions = [
    'Increase forecast – small (≤5-10%)',
    'Increase forecast – medium (≤10-30%)',
    'Increase forecast – large / surge',
    'Decrease forecast – small',
    'Decrease forecast – medium / large',
    'Keep forecast as is (confirm)',
    'Pull demand forward (earlier period)',
    'Push demand out (later period)',
    'Reallocate demand between wards/sites',
    'Increase safety stock – critical drug',
    'Increase safety stock – non-critical',
    'Decrease safety stock',
    'Enable substitution',
    'Disable substitution'
  ];

  const reasonOptions = [
    'Seasonal disease / outbreak',
    'Planned campaign / health camp',
    'New protocol / guideline',
    'Doctor / department preference',
    'New service / unit opened',
    'Regulatory / formulary change',
    'Supplier reliability issue',
    'Data error / cleansing',
    'One-off event (festival, disaster, strike)',
    'Other (free text)'
  ];

  const handleReasonChange = (reason) => {
    setReasons(prev =>
      prev.includes(reason)
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleApply = () => {
    const adjustment = {
      item: selectedItem,
      adjustmentType,
      newQuantity: parseInt(newQuantity),
      reasons: reasons.concat(customReason ? [customReason] : []),
      applyScope,
      timestamp: new Date().toISOString()
    };

    onApply(adjustment);
    onClose();
  };

  const getOtifRisk = () => {
    if (selectedItem?.actualOtif >= 90) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (selectedItem?.actualOtif >= 80) return { level: 'Medium', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getExpiryRisk = () => {
    const risks = ['Low', 'Medium', 'High'];
    const risk = risks[Math.floor(Math.random() * risks.length)];
    const colors = {
      'Low': { color: 'text-green-600', bg: 'bg-green-100' },
      'Medium': { color: 'text-orange-600', bg: 'bg-orange-100' },
      'High': { color: 'text-red-600', bg: 'bg-red-100' }
    };
    return { level: risk, ...colors[risk] };
  };

  const otifRisk = getOtifRisk();
  const expiryRisk = getExpiryRisk();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Adjust Forecast</h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedItem?.sku} | {selectedItem?.location} – Next Week
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Risk Indicators */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">OTIF Risk:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${otifRisk.bg} ${otifRisk.color}`}>
                <AlertCircle className="w-3 h-3 inline mr-1" />
                {otifRisk.level}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Expiry Risk:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${expiryRisk.bg} ${expiryRisk.color}`}>
                <CheckCircle className="w-3 h-3 inline mr-1" />
                {expiryRisk.level}
              </span>
            </div>
          </div>

          {/* Historical Chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-gray-600">System Forecast</div>
                <div className="text-xl font-semibold text-gray-900">{selectedItem?.forecast || '420 vials'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Your Current Plan</div>
                <div className="text-xl font-semibold text-gray-900">{selectedItem?.currentPlan || '380 vials'}</div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 mb-2">Historical Use (last 4 weeks)</div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* What are you doing? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What are you doing?
            </label>
            <select
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an action...</option>
              {adjustmentOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* How much are you changing? */}
          {adjustmentType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How much are you changing?
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New forecast quantity"
                />
                <span className="text-sm text-gray-500">vials</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                System forecast: 420 → Your new forecast: {newQuantity || '420'}
              </div>
            </div>
          )}

          {/* Why are you changing this? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Why are you changing this? *
            </label>
            <div className="space-y-2">
              {reasonOptions.map((reason, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reasons.includes(reason)}
                    onChange={() => handleReasonChange(reason)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
            
            {reasons.includes('Other (free text)') && (
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please specify..."
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Where should this apply? */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Where should this apply?
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="applyScope"
                  value="current"
                  checked={applyScope === 'current'}
                  onChange={(e) => setApplyScope(e.target.value)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Only this location & period</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="applyScope"
                  value="hospital"
                  checked={applyScope === 'hospital'}
                  onChange={(e) => setApplyScope(e.target.value)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">All wards in this hospital for this period</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="applyScope"
                  value="group"
                  checked={applyScope === 'group'}
                  onChange={(e) => setApplyScope(e.target.value)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">All hospitals in group for this period</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Apply similar uplift to next 2 weeks if trend continues</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!adjustmentType || reasons.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForecastAdjustmentDrawer;
