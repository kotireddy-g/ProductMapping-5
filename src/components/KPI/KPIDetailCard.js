import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Info, Star } from 'lucide-react';
import EnhancedKPITrendGraph from './EnhancedKPITrendGraph';

const KPIDetailCard = ({ kpiData, icon: Icon }) => {
    const [showFormula, setShowFormula] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy':
                return {
                    bg: 'bg-green-50',
                    border: 'border-green-400',
                    text: 'text-green-700',
                    badge: 'bg-green-100 text-green-700'
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-400',
                    text: 'text-yellow-700',
                    badge: 'bg-yellow-100 text-yellow-700'
                };
            case 'critical':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-400',
                    text: 'text-red-700',
                    badge: 'bg-red-100 text-red-700'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    border: 'border-gray-300',
                    text: 'text-gray-700',
                    badge: 'bg-gray-100 text-gray-700'
                };
        }
    };

    const colors = getStatusColor(kpiData.status);
    const isPositiveChange = kpiData.trendValue >= 0;

    // Convert trendData array to the format expected by EnhancedKPITrendGraph
    const convertToTrendFormat = (trendArray) => {
        if (!trendArray || !Array.isArray(trendArray)) return null;

        const today = new Date();
        const history = trendArray.map((value, index) => {
            const date = new Date(today);
            date.setDate(date.getDate() - (trendArray.length - 1 - index) * 7); // Weekly data
            return {
                date: date.toISOString().split('T')[0],
                value: value
            };
        });

        return {
            history: history,
            forecast: null // No forecast for now
        };
    };

    const trendGraphData = convertToTrendFormat(kpiData.trendData);

    return (
        <div className={`bg-white rounded-xl shadow-md border-2 ${colors.border} p-6 h-full`}>
            {/* Star Icon - Top Right */}
            <div className="absolute top-4 right-4">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                        <Icon size={20} className={colors.text} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 text-sm">{kpiData.name}</h3>
                        <p className="text-xs text-gray-500">{kpiData.description}</p>
                    </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.badge} capitalize`}>
                    {kpiData.status}
                </div>
            </div>

            {/* Main Value */}
            <div className="mb-4">
                <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${colors.text}`}>
                        {kpiData.unit === 'M' ? `RM${kpiData.currentValue}${kpiData.unit}` : `${kpiData.currentValue}${kpiData.unit}`}
                    </span>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositiveChange ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span>{kpiData.trend} vs last month</span>
                    </div>
                </div>
            </div>

            {/* Formula */}
            <div className="mb-4">
                <button
                    onClick={() => setShowFormula(!showFormula)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    <Info size={14} />
                    {showFormula ? 'Hide' : 'Show'} Formula
                </button>
                {showFormula && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-gray-700 font-mono">{kpiData.formula}</p>
                    </div>
                )}
            </div>

            {/* Target vs Gap */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Target</div>
                    <div className="text-lg font-bold text-blue-700">
                        {kpiData.unit === 'M' ? `RM${kpiData.target}${kpiData.unit}` : `${kpiData.target}${kpiData.unit}`}
                    </div>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Gap</div>
                    <div className="text-lg font-bold text-red-700">
                        {kpiData.unit === 'M' ? `RM${kpiData.gap}${kpiData.unit}` : `${kpiData.gap}${kpiData.unit}`}
                    </div>
                </div>
            </div>

            {/* Overstock (if applicable) */}
            {kpiData.overstock && (
                <div className="bg-pink-50 rounded-lg p-3 mb-4">
                    <div className="text-xs text-gray-600 mb-1">Overstock</div>
                    <div className="text-lg font-bold text-pink-700">{kpiData.overstock}%</div>
                </div>
            )}

            {/* Trend Chart */}
            <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Trend</h4>
                {trendGraphData && (
                    <EnhancedKPITrendGraph
                        trendData={trendGraphData}
                        goal={{ value: kpiData.target, unit: kpiData.unit }}
                        status={kpiData.status}
                        unit={kpiData.unit}
                    />
                )}
            </div>
        </div>
    );
};

export default KPIDetailCard;
