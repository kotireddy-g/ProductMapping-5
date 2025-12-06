import React, { useState, useMemo } from 'react';
import { ArrowLeft, Check, Settings, X, Star, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { rcaProducts, generateRCAData, vendorsList } from '../../data/rcaData';

const RCAScreen = ({ flowData, onBack }) => {
  const [selectedProductId, setSelectedProductId] = useState(rcaProducts[0].id);
  const [actionState, setActionState] = useState('pending');
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [overrideData, setOverrideData] = useState({ qty: 120, vendor: 'Vendor A', rating: 5, comment: '' });

  const rcaData = useMemo(() => generateRCAData(selectedProductId), [selectedProductId]);

  const handleAction = (action) => {
    if (action === 'modify') {
      setShowOverrideForm(true);
      setOverrideData({ 
        qty: rcaData.decision.recommendedQty, 
        vendor: rcaData.decision.vendor, 
        rating: 5, 
        comment: '' 
      });
    } else {
      setActionState(action);
      setShowOverrideForm(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">RCA & Recommendations</h1>
            <p className="text-sm text-slate-400">Root Cause Analysis and AI-driven Recommendations</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {rcaProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProductId(product.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedProductId === product.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {product.name}
              <span className="ml-2 opacity-75">({product.quantity})</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300">DECISION SUMMARY</h3>
              <span className="px-2 py-1 bg-blue-600 text-xs rounded">AI DECISION</span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400">Recommended Order Qty</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{rcaData.decision.recommendedQty}</span>
                  <span className="text-sm text-slate-400">units</span>
                  <span className={`text-sm ${rcaData.decision.qtyDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {rcaData.decision.qtyDiff > 0 ? '+' : ''}{rcaData.decision.qtyDiff} vs. last week
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400">Vendor</p>
                  <p className="font-semibold">{rcaData.decision.vendor}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-green-600 text-xs rounded">
                    OTIF {rcaData.decision.otif}%
                  </span>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400">Confidence</p>
                  <p className="font-semibold">{rcaData.decision.confidence}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-600 text-xs rounded">
                    {rcaData.decision.route}
                  </span>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Risk Level</p>
                    <p className={`font-semibold ${
                      rcaData.decision.riskLevel === 'LOW' ? 'text-green-400' :
                      rcaData.decision.riskLevel === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'
                    }`}>{rcaData.decision.riskLevel}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Stockout Risk</p>
                    <p className="font-semibold">{rcaData.decision.stockoutRisk}%</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAction('approved')}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    actionState === 'approved' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={() => handleAction('modify')}
                  className={`flex-1 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 flex items-center justify-center gap-2 ${
                    showOverrideForm ? 'bg-slate-700' : ''
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Modify
                </button>
                <button
                  onClick={() => handleAction('rejected')}
                  className={`flex-1 py-2 rounded-lg border border-red-600 text-red-400 hover:bg-red-600/20 flex items-center justify-center gap-2 ${
                    actionState === 'rejected' ? 'bg-red-600 text-white' : ''
                  }`}
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>

              {showOverrideForm && (
                <div className="bg-slate-700 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="text-xs text-slate-400">Updated Order Qty</label>
                    <input
                      type="number"
                      value={overrideData.qty}
                      onChange={(e) => setOverrideData({ ...overrideData, qty: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Updated Vendor</label>
                    <select
                      value={overrideData.vendor}
                      onChange={(e) => setOverrideData({ ...overrideData, vendor: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-slate-600 rounded-lg text-white"
                    >
                      {vendorsList.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={overrideData.rating}
                      onChange={(e) => setOverrideData({ ...overrideData, rating: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Comment (optional)</label>
                    <textarea
                      value={overrideData.comment}
                      onChange={(e) => setOverrideData({ ...overrideData, comment: e.target.value })}
                      placeholder="Add comment / reason for override..."
                      className="w-full mt-1 px-3 py-2 bg-slate-600 rounded-lg text-white resize-none"
                      rows="2"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Decision ID: {rcaData.decision.decisionId}</span>
                    <span className="px-2 py-1 bg-yellow-600 rounded text-white">Pending</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300">COUNTERFACTUAL SCENARIOS</h3>
              <span className="px-2 py-1 bg-purple-600 text-xs rounded">Simulated</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 text-xs">
                    <th className="text-left py-2">Scenario</th>
                    <th className="text-right py-2">Order Qty</th>
                    <th className="text-right py-2">Total Cost</th>
                    <th className="text-right py-2">Stockout</th>
                    <th className="text-right py-2">Service</th>
                  </tr>
                </thead>
                <tbody>
                  {rcaData.counterfactual.map((cf, idx) => (
                    <tr key={idx} className={`border-t border-slate-700 ${idx === 0 ? 'bg-blue-600/20' : ''}`}>
                      <td className="py-2 font-medium">{cf.scenario}</td>
                      <td className="text-right">{cf.orderQty}</td>
                      <td className="text-right">₹{cf.totalCost.toLocaleString()}</td>
                      <td className="text-right">{cf.stockoutRisk}%</td>
                      <td className="text-right">{cf.serviceLevel}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-slate-400 leading-relaxed">
              The model selects {rcaData.decision.recommendedQty} units as the best balance: it avoids most stockout risk without incurring the extra holding cost from {Math.round(rcaData.decision.recommendedQty * 1.2)} units.
            </p>

            <div className="mt-6 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-300">HUMAN FEEDBACK LOOP</h4>
                <span className="px-2 py-1 bg-orange-600 text-xs rounded">Feedback Stream</span>
              </div>

              <div className="space-y-3">
                {rcaData.feedbackHistory.map((feedback, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      feedback.status === 'approved' ? 'bg-blue-500' :
                      feedback.status === 'modified' ? 'bg-orange-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{feedback.date}</span>
                        <span className="text-xs">{feedback.action}</span>
                        <span className={`px-1.5 py-0.5 text-xs rounded ${
                          feedback.status === 'approved' ? 'bg-blue-600' :
                          feedback.status === 'modified' ? 'bg-orange-600' : 'bg-red-600'
                        }`}>
                          {feedback.status === 'approved' ? 'Approved' :
                           feedback.status === 'modified' ? 'Qty Changed' : 'Rejected'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {feedback.status === 'modified' 
                          ? `System: ${feedback.systemQty} → User: ${feedback.userQty}`
                          : `Recommended ${feedback.systemQty}`}
                        {feedback.comment && ` • "${feedback.comment}"`}
                      </p>
                      {feedback.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(feedback.rating)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-slate-400">Override rate (7d)</p>
                  <p className="font-semibold">{rcaData.overrideRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Avg. rating</p>
                  <p className="font-semibold">{rcaData.avgRating} / 5</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Learning signal</p>
                  <p className="font-semibold text-green-400">Enabled</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300">POLICY HEALTH ({selectedProductId})</h3>
              <span className="px-2 py-1 bg-cyan-600 text-xs rounded">Monitoring</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400">Episodes Reward</p>
                <p className="text-2xl font-bold text-green-400">+{rcaData.policyHealth.episodesReward}</p>
                <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>improving vs last month</span>
                </div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-400">Stockout Days</p>
                <p className="text-2xl font-bold">{rcaData.policyHealth.stockoutDays}</p>
                <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
                  <TrendingDown className="w-3 h-3" />
                  <span>from {rcaData.policyHealth.lastMonthStockoutDays} last month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">RCA — KEY DRIVERS</h3>
            <span className="px-2 py-1 bg-orange-600 text-xs rounded">Explainability: Template</span>
          </div>

          <div className="space-y-3">
            {rcaData.rcaDrivers.map((driver, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="w-48 text-sm text-slate-300 truncate">{driver.factor}</span>
                <div className="flex-1 h-6 bg-slate-700 rounded-full overflow-hidden relative">
                  <div
                    className={`absolute h-full ${driver.type === 'positive' ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{
                      width: `${Math.abs(driver.impact) * 100}%`,
                      left: driver.type === 'positive' ? '50%' : `${50 - Math.abs(driver.impact) * 100}%`
                    }}
                  />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-500" />
                </div>
                <span className={`w-16 text-right text-sm font-medium ${
                  driver.type === 'positive' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {driver.impact > 0 ? '+' : ''}{driver.impact.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RCAScreen;