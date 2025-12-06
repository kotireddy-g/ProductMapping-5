import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Edit3, X, TrendingUp, BarChart3 } from 'lucide-react';

const RCARecommendationsPage = ({ onBack, sourceTab, selectedData }) => {
  const [actionStatus, setActionStatus] = useState('pending');
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    qty: '',
    vendor: '',
    rating: 5,
    comment: ''
  });

  // Generate dynamic data based on source tab
  const generatePageData = () => {
    if (sourceTab === 'otif') {
      return {
        title: 'SKU-MED-001 • Paracetamol 500mg',
        subtitle: 'Location: Emergency & Critical Care | Date: 06 Dec 2025',
        policy: 'OTIF ANALYSIS • Policy: Demand → Supply → Distribution',
        confidence: '0.89',
        route: 'MANUAL-REVIEW',
        decision: {
          recommendedQty: '420 units',
          vendor: 'Pharma Supplier A',
          confidence: '0.89',
          riskLevel: 'HIGH',
          stockoutRisk: '12%',
          onTimeDelivery: '94%',
          qtyChange: '+65',
          period: 'vs. last week'
        },
        rcaDrivers: [
          { name: 'OTIF Performance Decline', value: -0.45, type: 'negative' },
          { name: 'Emergency Demand Surge', value: +0.38, type: 'positive' },
          { name: 'Supplier Reliability Drop', value: +0.29, type: 'neutral' },
          { name: 'Stock Buffer Depletion', value: -0.22, type: 'negative' }
        ],
        chips: [
          { text: 'OTIF < 85% → Increase safety stock', type: 'danger' },
          { text: 'Emergency demand +28% vs 30d', type: 'warning' },
          { text: 'Supplier A reliability 94%', type: 'success' }
        ],
        narrative: 'Current OTIF performance at 82% indicates supply chain stress. Emergency demand has increased 28% while supplier reliability dropped to 94%. The system recommends increasing order quantity and safety stock to maintain service levels.',
        rootCause: `OTIF Decline to 82% (HIGH)
├── [Root] Supplier delivery delays (+2.3 days avg)
│   └─ New quality checks implemented
├── [Contributing] Emergency demand volatility
│   └─ Seasonal illness outbreak in region
└── [Contributing] Insufficient safety stock buffer
    └─ Previous month stock optimization too aggressive`,
        scenarios: [
          { name: 'Recommended', qty: 420, cost: '₹ 16,800', stockoutRisk: '12%', serviceLevel: '88%' },
          { name: '+25% Qty', qty: 525, cost: '₹ 21,000', stockoutRisk: '6%', serviceLevel: '94%' },
          { name: '-15% Qty', qty: 357, cost: '₹ 14,280', stockoutRisk: '22%', serviceLevel: '78%' }
        ]
      };
    } else {
      return {
        title: 'ACT-INV-003 • Inventory Optimization',
        subtitle: 'Category: General Medicines | Date: 06 Dec 2025',
        policy: 'ACTIONS ANALYSIS • Policy: Forecast → Optimize → Execute',
        confidence: '0.92',
        route: 'AUTO-APPROVE',
        decision: {
          recommendedQty: '850 units',
          vendor: 'Multi-Vendor Strategy',
          confidence: '0.92',
          riskLevel: 'LOW',
          stockoutRisk: '3%',
          onTimeDelivery: '97%',
          qtyChange: '+120',
          period: 'vs. forecast'
        },
        rcaDrivers: [
          { name: 'Demand Forecast Accuracy', value: +0.42, type: 'positive' },
          { name: 'Inventory Turnover Rate', value: +0.35, type: 'positive' },
          { name: 'Carrying Cost Optimization', value: +0.28, type: 'neutral' },
          { name: 'Seasonal Adjustment Factor', value: -0.19, type: 'negative' }
        ],
        chips: [
          { text: 'Forecast accuracy > 95%', type: 'success' },
          { text: 'Inventory turnover improved +18%', type: 'success' },
          { text: 'Seasonal demand pattern detected', type: 'warning' }
        ],
        narrative: 'Inventory optimization model shows strong performance with 95% forecast accuracy. Seasonal demand patterns require adjustment to safety stock levels.',
        rootCause: `Inventory Optimization Success (LOW RISK)
├── [Success Factor] High forecast accuracy (95.2%)
│   └─ ML model performance improved
├── [Contributing] Multi-vendor diversification
│   └─ Risk spread across 3 reliable suppliers
└── [Monitoring] Seasonal demand variance
    └─ Winter season medicine demand +15%`,
        scenarios: [
          { name: 'Recommended', qty: 850, cost: '₹ 42,500', stockoutRisk: '3%', serviceLevel: '97%' },
          { name: '+15% Buffer', qty: 978, cost: '₹ 48,900', stockoutRisk: '1%', serviceLevel: '99%' },
          { name: '-10% Lean', qty: 765, cost: '₹ 38,250', stockoutRisk: '8%', serviceLevel: '92%' }
        ]
      };
    }
  };

  const pageData = generatePageData();

  useEffect(() => {
    setFormData({
      qty: pageData.decision.recommendedQty.split(' ')[0],
      vendor: pageData.decision.vendor,
      rating: 5,
      comment: ''
    });
  }, [pageData]);

  const handleAction = (action) => {
    setActionStatus(action);
    
    // Show notification based on action
    const notifications = {
      accepted: {
        type: 'success',
        title: 'Recommendation Accepted',
        message: 'Your decision has been logged and the system will learn from this feedback.'
      },
      modified: {
        type: 'warning', 
        title: 'Recommendation Modified',
        message: 'Changes saved successfully. The updated parameters will be applied.'
      },
      rejected: {
        type: 'error',
        title: 'Recommendation Rejected',
        message: 'Decision recorded. The system will adjust future recommendations based on this feedback.'
      }
    };
    
    setNotification(notifications[action]);
    
    // Auto-hide notification after 4 seconds
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const getBarColor = (type) => {
    switch (type) {
      case 'positive': return 'bg-gradient-to-r from-green-500 to-blue-500';
      case 'negative': return 'bg-gradient-to-r from-red-500 to-red-700';
      default: return 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500';
    }
  };

  const getChipColor = (type) => {
    switch (type) {
      case 'success': return 'border-green-500 text-green-600 bg-green-50';
      case 'warning': return 'border-yellow-500 text-yellow-600 bg-yellow-50';
      case 'danger': return 'border-red-500 text-red-600 bg-red-50';
      default: return 'border-gray-300 text-gray-600 bg-gray-50';
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
              <h1 className="text-xl font-bold text-gray-900">{pageData.title}</h1>
              <p className="text-sm text-gray-500">{pageData.subtitle}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-blue-700">{pageData.policy}</span>
            </div>
            <div className="flex gap-2">
              <div className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">
                Conf: <span className="font-medium text-yellow-600">{pageData.confidence}</span>
              </div>
              <div className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">
                Route: <span className="font-medium text-yellow-600">{pageData.route}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Decision Summary */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Decision Summary</h2>
                  <p className="text-xs text-gray-400 mt-1">Recommended action • single SKU</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 border border-blue-300 rounded-full text-xs font-medium text-blue-700">
                  {sourceTab.toUpperCase()} Decision
                </span>
              </div>

              {/* KPI Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">Recommended Order Qty</div>
                  <div className="text-lg font-semibold text-gray-900">{pageData.decision.recommendedQty}</div>
                  <div className="text-xs text-gray-500">
                    <span className="text-green-600 font-medium">{pageData.decision.qtyChange}</span> {pageData.decision.period}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">Vendor</div>
                  <div className="text-lg font-semibold text-gray-900">{pageData.decision.vendor}</div>
                  <div className="text-xs text-gray-500">
                    On-time: <span className="text-green-600 font-medium">{pageData.decision.onTimeDelivery}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">Confidence</div>
                  <div className="text-lg font-semibold text-gray-900">{pageData.decision.confidence}</div>
                  <div className="text-xs text-gray-500">
                    Route: <span className="text-blue-600 font-medium">AUTO</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">Risk Level</div>
                  <div className="text-lg font-semibold text-gray-900">{pageData.decision.riskLevel}</div>
                  <div className="text-xs text-gray-500">
                    Stockout risk: <span className="text-red-600 font-medium">{pageData.decision.stockoutRisk}</span>
                  </div>
                </div>
              </div>

              {/* Risk Radar with Small Graph */}
              <div className="h-32 border border-gray-200 rounded-lg p-4 mb-6 bg-gradient-to-r from-blue-50 to-transparent">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Risk Radar</span>
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                </div>
                <div className="grid grid-cols-5 gap-2 h-16">
                  {['Stockout', 'Waste', 'Price', 'Lead Time', 'Supplier'].map((risk, index) => {
                    // Dynamic heights based on actual risk levels from page data
                    const riskLevels = sourceTab === 'otif' ? [75, 45, 60, 35, 80] : [25, 30, 40, 20, 35];
                    const colors = ['bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'];
                    return (
                      <div key={index} className="flex flex-col items-center h-full">
                        <div className="flex-1 flex items-end w-full">
                          <div 
                            className={`w-full ${colors[index]} rounded-t transition-all duration-500`}
                            style={{ height: `${riskLevels[index]}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 text-center">{risk}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Human Action Panel */}
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Human Action on This Recommendation</h3>
                  <span className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-400">
                    Decision ID: DEC-2025-{sourceTab.toUpperCase()}-01
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => handleAction('accepted')}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-medium transition-colors"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Accept as-is
                  </button>
                  <button
                    onClick={() => handleAction('modified')}
                    className="flex items-center gap-2 px-3 py-2 bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-full text-xs font-medium transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    Modify & Approve
                  </button>
                  <button
                    onClick={() => handleAction('rejected')}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-medium transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Reject
                  </button>
                </div>

                {/* Action Form */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Updated Order Qty</label>
                    <input
                      type="number"
                      value={formData.qty}
                      onChange={(e) => setFormData({...formData, qty: e.target.value})}
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Updated Vendor</label>
                    <select
                      value={formData.vendor}
                      onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value={pageData.decision.vendor}>{pageData.decision.vendor} (Reco)</option>
                      <option value="Vendor B">Vendor B</option>
                      <option value="Vendor C">Vendor C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Rating (1–5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: e.target.value})}
                      className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <textarea
                  placeholder="Add comment / reason for override (optional)…"
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  className="w-full px-2 py-2 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  rows="2"
                />

                {/* Status */}
                <div className="flex items-center justify-between mt-3 text-xs">
                  <span className="text-gray-400 flex-1">
                    {actionStatus === 'pending' && `No action taken yet. This will be logged as ${sourceTab.toUpperCase()} feedback.`}
                    {actionStatus === 'accepted' && 'Recommendation accepted as-is. Logged as positive feedback.'}
                    {actionStatus === 'modified' && 'Recommendation modified and approved. Learning signal updated.'}
                    {actionStatus === 'rejected' && 'Recommendation rejected. System will learn from this feedback.'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs border ${
                    actionStatus === 'accepted' ? 'bg-green-100 border-green-300 text-green-700' :
                    actionStatus === 'modified' ? 'bg-yellow-100 border-yellow-300 text-yellow-700' :
                    actionStatus === 'rejected' ? 'bg-red-100 border-red-300 text-red-700' :
                    'bg-gray-800 border-gray-600 text-gray-400'
                  }`}>
                    {actionStatus.charAt(0).toUpperCase() + actionStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* RCA Drivers */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">RCA — Key Drivers</h2>
                  <p className="text-xs text-gray-400 mt-1">Top factors influencing this recommendation</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 border border-yellow-300 rounded text-xs font-medium text-yellow-700">
                  Explainability: Template
                </span>
              </div>

              {/* Driver Bars */}
              <div className="space-y-4 mb-4">
                {pageData.rcaDrivers.map((driver, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{driver.name}</span>
                      <span>{driver.value > 0 ? '+' : ''}{driver.value}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getBarColor(driver.type)}`}
                        style={{ width: `${Math.abs(driver.value) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {pageData.chips.map((chip, index) => (
                  <div key={index} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getChipColor(chip.type)}`}>
                    <div className={`w-2 h-2 rounded-full ${chip.type === 'success' ? 'bg-green-500' : chip.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    {chip.text}
                  </div>
                ))}
              </div>

              {/* Narrative */}
              <div className="text-xs text-gray-600 leading-relaxed">
                <strong className="text-gray-900">Why this action?</strong> {pageData.narrative}
              </div>
            </div>

            {/* Root Cause Tree */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Outcome RCA (Last Week)</h2>
                  <p className="text-xs text-gray-400 mt-1">Root cause analysis of recent issues</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${sourceTab === 'otif' ? 'bg-red-100 border-red-300 text-red-700' : 'bg-green-100 border-green-300 text-green-700'}`}>
                  Severity: {sourceTab === 'otif' ? 'HIGH' : 'LOW'}
                </span>
              </div>

              <pre className="text-xs text-gray-600 font-mono leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded border">
                {pageData.rootCause}
              </pre>

              <div className="text-xs text-gray-600 leading-relaxed mt-4">
                <strong className="text-gray-900">Recommendation:</strong> {sourceTab === 'otif' ? 
                  'Implement supplier performance monitoring and adjust safety stock parameters for critical medicines.' :
                  'Continue current optimization strategy while monitoring seasonal demand patterns.'
                }
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Counterfactual Scenarios */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">WHAT-IF</h2>
                  <p className="text-xs text-gray-400 mt-1">What if we ordered more / less?</p>
                </div>
                <span className="px-2 py-1 bg-green-100 border border-green-300 rounded text-xs font-medium text-green-700">
                  Simulated
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-500">Scenario</th>
                      <th className="text-left py-2 text-gray-500">Order Qty</th>
                      <th className="text-left py-2 text-gray-500">Total Cost</th>
                      <th className="text-left py-2 text-gray-500">Stockout Risk</th>
                      <th className="text-left py-2 text-gray-500">Service Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.scenarios.map((scenario, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2">
                          {index === 0 && (
                            <span className="px-2 py-1 bg-blue-100 border border-blue-300 rounded text-xs text-blue-700">
                              Recommended
                            </span>
                          )}
                          {index > 0 && scenario.name}
                        </td>
                        <td className="py-2">{scenario.qty}</td>
                        <td className="py-2">{scenario.cost}</td>
                        <td className="py-2">{scenario.stockoutRisk}</td>
                        <td className="py-2">{scenario.serviceLevel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-xs text-gray-600 leading-relaxed mt-4">
                The model selects <strong className="text-gray-900">{pageData.scenarios[0].qty} units</strong> as the best balance.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-[9999] max-w-sm">
          <div className={`w-full shadow-xl rounded-lg pointer-events-auto border-2 transform transition-all duration-300 ${
            notification.type === 'success' ? 'bg-green-50 border-green-300' :
            notification.type === 'warning' ? 'bg-yellow-50 border-yellow-300' :
            'bg-red-50 border-red-300'
          }`}>
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === 'success' && <CheckCircle className="h-6 w-6 text-green-500" />}
                  {notification.type === 'warning' && <Edit3 className="h-6 w-6 text-yellow-500" />}
                  {notification.type === 'error' && <X className="h-6 w-6 text-red-500" />}
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className={`text-sm font-semibold ${
                    notification.type === 'success' ? 'text-green-800' :
                    notification.type === 'warning' ? 'text-yellow-800' :
                    'text-red-800'
                  }`}>
                    {notification.title}
                  </p>
                  <p className={`mt-1 text-xs ${
                    notification.type === 'success' ? 'text-green-700' :
                    notification.type === 'warning' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {notification.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={() => setNotification(null)}
                    className={`rounded-md inline-flex p-1 ${
                      notification.type === 'success' ? 'text-green-500 hover:text-green-600 hover:bg-green-100' :
                      notification.type === 'warning' ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-100' :
                      'text-red-500 hover:text-red-600 hover:bg-red-100'
                    } focus:outline-none transition-colors`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RCARecommendationsPage;
