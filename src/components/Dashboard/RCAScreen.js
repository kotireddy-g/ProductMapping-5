import React, { useState, useMemo } from 'react';
import { ArrowLeft, AlertTriangle, Clock, Target, Lightbulb, ChevronRight, TrendingUp, TrendingDown, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import { getRCADataForContext } from '../../data/unifiedPharmaData';

const RCAScreen = ({ data, onBack }) => {
  const [selectedCause, setSelectedCause] = useState(null);
  const [actionStatus, setActionStatus] = useState('pending');

  const contextualRCAData = useMemo(() => getRCADataForContext(data), [data]);
  const causes = contextualRCAData.causes;
  const recommendations = contextualRCAData.recommendations;
  
  const getContextTitle = () => {
    if (data?.type === 'otif_reason') {
      return data.data?.reason || 'OTIF Issue';
    }
    if (data?.type === 'label') {
      return data.subLabel?.name || data.label?.name || 'Label Analysis';
    }
    return 'Analysis Details';
  };

  const decisionSummary = {
    impactedItems: 45,
    totalValue: '₹12.4L',
    avgDelay: '2.3 days',
    riskLevel: 'Medium',
    confidence: 0.87,
    trend: '+12%'
  };

  const rcaDrivers = [
    { name: 'Supplier Lead Time Variance', impact: -0.42, type: 'negative' },
    { name: 'Demand Forecast Accuracy', impact: 0.32, type: 'positive' },
    { name: 'Safety Stock Coverage', impact: 0.24, type: 'neutral' },
    { name: 'Order Frequency Pattern', impact: -0.18, type: 'negative' }
  ];

  const rootCauseTree = [
    {
      id: 'root',
      label: getContextTitle(),
      severity: 'high',
      children: [
        {
          id: 'cause1',
          label: causes[0]?.cause || 'Primary Root Cause',
          type: 'critical',
          probability: causes[0]?.probability || 65,
          children: [
            { id: 'sub1', label: 'Vendor capacity constraints', type: 'contributing' },
            { id: 'sub2', label: 'Quality control bottleneck', type: 'contributing' }
          ]
        },
        {
          id: 'cause2',
          label: causes[1]?.cause || 'Secondary Factor',
          type: 'contributing',
          probability: causes[1]?.probability || 45,
          children: [
            { id: 'sub3', label: 'Logistics network delays', type: 'minor' }
          ]
        },
        {
          id: 'cause3',
          label: causes[2]?.cause || 'Tertiary Factor',
          type: 'contributing',
          probability: causes[2]?.probability || 30,
          children: []
        }
      ]
    }
  ];

  const renderTreeNode = (node, depth = 0) => {
    const typeColors = {
      critical: 'text-red-600',
      contributing: 'text-amber-600',
      minor: 'text-blue-600'
    };
    
    return (
      <div key={node.id} className={`${depth > 0 ? 'ml-6 border-l-2 border-slate-200 pl-4' : ''}`}>
        <div className={`py-2 ${depth === 0 ? 'font-semibold text-slate-800' : ''}`}>
          <div className="flex items-center gap-2">
            {depth > 0 && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                node.type === 'critical' ? 'bg-red-100 text-red-600' :
                node.type === 'contributing' ? 'bg-amber-100 text-amber-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {node.type === 'critical' ? 'Root' : node.type === 'contributing' ? 'Contributing' : 'Minor'}
              </span>
            )}
            <span className={depth === 0 ? 'text-slate-800' : typeColors[node.type] || 'text-slate-600'}>
              {node.label}
            </span>
            {node.probability && (
              <span className="text-xs text-slate-400 ml-2">({node.probability}%)</span>
            )}
          </div>
        </div>
        {node.children?.map(child => renderTreeNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Root Cause Analysis & Recommendations</h1>
              <p className="text-sm text-slate-500">
                Analyzing: {getContextTitle()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
              Confidence: {(decisionSummary.confidence * 100).toFixed(0)}%
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              decisionSummary.riskLevel === 'High' ? 'bg-red-100 text-red-600' :
              decisionSummary.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-600' :
              'bg-green-100 text-green-600'
            }`}>
              Risk: {decisionSummary.riskLevel}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Decision Summary</h2>
                  <p className="text-xs text-slate-400 mt-1">Impact overview and key metrics</p>
                </div>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-200">
                  AI Analysis
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Impacted Items</p>
                  <p className="text-2xl font-bold text-slate-800">{decisionSummary.impactedItems}</p>
                  <p className="text-xs text-amber-600 mt-1">Requires attention</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Total Value Impact</p>
                  <p className="text-2xl font-bold text-slate-800">{decisionSummary.totalValue}</p>
                  <p className="text-xs text-red-600 mt-1">{decisionSummary.trend} vs last month</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Average Delay</p>
                  <p className="text-2xl font-bold text-slate-800">{decisionSummary.avgDelay}</p>
                  <p className="text-xs text-green-600 mt-1">Improving trend</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Resolution Rate</p>
                  <p className="text-2xl font-bold text-slate-800">78%</p>
                  <p className="text-xs text-blue-600 mt-1">Target: 85%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">RCA — Key Drivers</h2>
                  <p className="text-xs text-slate-400 mt-1">Top factors influencing this issue</p>
                </div>
                <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-xs font-medium border border-amber-200">
                  Explainability
                </span>
              </div>

              <div className="space-y-4">
                {rcaDrivers.map((driver, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{driver.name}</span>
                      <span className={`font-medium ${
                        driver.impact > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {driver.impact > 0 ? '+' : ''}{driver.impact.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          driver.type === 'positive' ? 'bg-gradient-to-r from-green-400 to-blue-500' :
                          driver.type === 'negative' ? 'bg-gradient-to-r from-red-400 to-amber-400' :
                          'bg-gradient-to-r from-blue-400 to-cyan-400'
                        }`}
                        style={{ width: `${Math.abs(driver.impact) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs border border-red-100">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Lead time variance high
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 rounded-full text-xs border border-amber-100">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Forecast needs calibration
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs border border-green-100">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Safety stock adequate
                </span>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-slate-600">
                  <strong className="text-slate-800">Why this issue?</strong> The primary driver is 
                  <strong className="text-red-600"> supplier lead time variance</strong>, which has increased 
                  by 42% compared to baseline. Combined with <strong className="text-green-600">rising demand</strong> patterns, 
                  this has created supply-demand gaps affecting delivery performance.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Root Cause Tree</h2>
                  <p className="text-xs text-slate-400 mt-1">Hierarchical analysis of contributing factors</p>
                </div>
                <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-200">
                  Severity: High
                </span>
              </div>

              <div className="font-mono text-sm bg-slate-50 rounded-lg p-4 border border-slate-200">
                {rootCauseTree.map(node => renderTreeNode(node))}
              </div>

              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-sm text-slate-600">
                  <strong className="text-slate-800">Recommendation:</strong> Address the 
                  <strong className="text-red-600"> primary root cause</strong> first to achieve 
                  maximum impact. The contributing factors can be addressed in parallel for 
                  comprehensive resolution.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Recommendations</h2>
                  <p className="text-xs text-slate-500">Actionable steps</p>
                </div>
              </div>

              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div
                    key={rec.id}
                    className={`p-3 rounded-lg border-l-4 bg-slate-50 ${
                      rec.priority === 'High' ? 'border-red-500' :
                      rec.priority === 'Medium' ? 'border-amber-500' :
                      'border-blue-500'
                    }`}
                  >
                    <h3 className="text-sm font-medium text-slate-800 mb-2">{rec.action}</h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded ${
                        rec.priority === 'High' ? 'bg-red-100 text-red-600' :
                        rec.priority === 'Medium' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {rec.priority}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded">
                        {rec.timeline}
                      </span>
                      <span className={`px-2 py-0.5 rounded ${
                        rec.effort === 'Low' ? 'bg-green-100 text-green-600' :
                        rec.effort === 'Medium' ? 'bg-amber-100 text-amber-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {rec.effort} effort
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Priority Matrix</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-red-600 font-medium text-xs">Quick Wins</span>
                  </div>
                  <p className="text-slate-500 text-xs">High impact, low effort</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span className="text-amber-600 font-medium text-xs">Major Projects</span>
                  </div>
                  <p className="text-slate-500 text-xs">High impact, high effort</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-blue-600 font-medium text-xs">Fill-ins</span>
                  </div>
                  <p className="text-slate-500 text-xs">Low impact, low effort</p>
                </div>
                <div className="bg-slate-100 border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full" />
                    <span className="text-slate-500 font-medium text-xs">Avoid</span>
                  </div>
                  <p className="text-slate-400 text-xs">Low impact, high effort</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Take Action</h2>
              <div className="space-y-2">
                <button 
                  onClick={() => setActionStatus('accepted')}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    actionStatus === 'accepted' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept Recommendations
                </button>
                <button 
                  onClick={() => setActionStatus('modified')}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    actionStatus === 'modified' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Modify & Approve
                </button>
                <button 
                  onClick={onBack}
                  className="w-full px-4 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  Back to Dashboard
                </button>
              </div>
              <div className="mt-3 text-center">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  actionStatus === 'accepted' ? 'bg-green-100 text-green-600' :
                  actionStatus === 'modified' ? 'bg-amber-100 text-amber-600' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  Status: {actionStatus.charAt(0).toUpperCase() + actionStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RCAScreen;
