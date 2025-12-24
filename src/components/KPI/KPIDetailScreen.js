import React, { useState } from 'react';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { Target, Package, AlertTriangle } from 'lucide-react';
import KPIDetailCard from './KPIDetailCard';
import RootCausePanel from './RootCausePanel';
import RelatedKPIsGrid from './RelatedKPIsGrid';
import { kpiDetailData, relatedKPIs } from '../../data/kpiDetailData';

const KPIDetailScreen = ({ selectedKPI, onBack, onNavigateToKPI }) => {
    // Get KPI data based on selected KPI ID
    const kpiData = kpiDetailData[selectedKPI?.id] || kpiDetailData.otif;

    // Icon mapping
    const iconMap = {
        otif: Target,
        stockHealth: Package,
        expiryRisk: AlertTriangle
    };

    const Icon = iconMap[kpiData.id] || Target;

    // Handle recommendation implementation
    const [recommendations, setRecommendations] = useState(kpiData.recommendations);

    const handleImplementRecommendation = (recId) => {
        setRecommendations(prev =>
            prev.map(rec =>
                rec.id === recId ? { ...rec, implemented: !rec.implemented } : rec
            )
        );
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'CRITICAL':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-300',
                    badge: 'bg-red-100 text-red-700 border-red-300'
                };
            case 'HIGH':
                return {
                    bg: 'bg-orange-50',
                    border: 'border-orange-300',
                    badge: 'bg-orange-100 text-orange-700 border-orange-300'
                };
            case 'MEDIUM':
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-300',
                    badge: 'bg-yellow-100 text-yellow-700 border-yellow-300'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    border: 'border-gray-300',
                    badge: 'bg-gray-100 text-gray-700 border-gray-300'
                };
        }
    };

    const getImpactColor = (impact) => {
        switch (impact) {
            case 'high':
                return 'text-red-600';
            case 'medium':
                return 'text-orange-600';
            case 'low':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-[1600px] mx-auto px-6 py-6">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold">Back to Dashboard</span>
                    </button>

                    <h1 className="text-4xl font-bold text-slate-800">
                        {kpiData.name} - Detailed Analysis
                    </h1>
                    <p className="text-gray-600 mt-2">{kpiData.description}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
                {/* Top Section: KPI Detail + Root Causes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: KPI Detail Card */}
                    <div className="relative">
                        <KPIDetailCard kpiData={kpiData} icon={Icon} />
                    </div>

                    {/* Right: Root Causes */}
                    <RootCausePanel rootCauses={kpiData.rootCauses} />
                </div>

                {/* Middle Section: Recommendations */}
                <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Lightbulb className="w-6 h-6 text-blue-600" />
                        <h3 className="text-2xl font-bold text-gray-800">Agent Recommendations For {kpiData.name}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.map((rec) => {
                            const colors = getPriorityColor(rec.priority);
                            const impactColor = getImpactColor(rec.impact);

                            return (
                                <div
                                    key={rec.id}
                                    className={`${colors.bg} ${colors.border} border-2 rounded-xl p-5 hover:shadow-lg transition-all ${rec.implemented ? 'opacity-60' : ''
                                        }`}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors.badge}`}>
                                            {rec.priority}
                                        </span>
                                        <span className={`text-xs font-semibold ${impactColor} capitalize`}>
                                            Impact: {rec.impact}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">{rec.title}</h4>

                                    {/* Description */}
                                    <p className="text-sm text-slate-600 mb-4">{rec.description}</p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {rec.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Metrics */}
                                    <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t border-gray-200">
                                        <div className="text-center">
                                            <div className="text-xs text-gray-600 mb-1">Improvement</div>
                                            <div className="text-sm font-bold text-green-700">{rec.improvement}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-gray-600 mb-1">Timeline</div>
                                            <div className="text-sm font-bold text-blue-700">{rec.timeline}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-gray-600 mb-1">Cost</div>
                                            <div className="text-sm font-bold text-orange-700">{rec.cost}</div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => handleImplementRecommendation(rec.id)}
                                        className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${rec.implemented
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {rec.implemented ? '✓ Implemented' : 'Implement Recommendation'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Section: Related KPIs */}
                <RelatedKPIsGrid
                    relatedKPIs={relatedKPIs}
                    onKPIClick={(kpi) => {
                        // Navigate to the related KPI's detail screen
                        if (onNavigateToKPI) {
                            onNavigateToKPI({ id: kpi.id, name: kpi.name });
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default KPIDetailScreen;
