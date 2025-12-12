import React, { useState } from 'react';
import {
    Target,
    Package,
    AlertTriangle,
    TrendingUp,
    Clock,
    DollarSign
} from 'lucide-react';
import { kpiData, getStatusColor } from '../data/kpiData';

const KPIDashboard = () => {
    // Professional line chart component with axes and tooltip
    const TrendChart = ({ data, color = '#3b82f6', kpiKey }) => {
        const [timePeriod, setTimePeriod] = useState('weekly');
        const [hoveredPoint, setHoveredPoint] = useState(null);

        if (!data || data.length === 0) return null;

        // Get data based on time period
        const getDataForPeriod = () => {
            switch (timePeriod) {
                case 'daily':
                    // Show 30 days
                    return {
                        values: [...data, ...data, ...data, ...data].slice(0, 30),
                        labels: Array.from({ length: 30 }, (_, i) => i + 1)
                    };
                case 'weekly':
                    // Show 8 weeks (default)
                    return {
                        values: data,
                        labels: data.map((_, i) => i + 1)
                    };
                case 'monthly':
                    // Show 12 months
                    return {
                        values: [...data, ...data].slice(0, 12),
                        labels: Array.from({ length: 12 }, (_, i) => i + 1)
                    };
                default:
                    return {
                        values: data,
                        labels: data.map((_, i) => i + 1)
                    };
            }
        };

        const chartData = getDataForPeriod();
        const values = chartData.values;
        const labels = chartData.labels;

        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = max - min || 1;

        const width = 280;
        const height = 120;
        const padding = { top: 10, right: 10, bottom: 25, left: 10 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // Generate path for line
        const points = values.map((value, index) => {
            const x = padding.left + (index / (values.length - 1)) * chartWidth;
            const y = padding.top + chartHeight - ((value - min) / range) * chartHeight;
            return { x, y, value };
        });

        const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

        // X-axis labels - show every nth label to avoid crowding
        const labelInterval = Math.ceil(labels.length / 10);
        const visibleLabels = labels.filter((_, i) => i % labelInterval === 0 || i === labels.length - 1);

        return (
            <div>
                {/* Time Period Selector */}
                <div className="flex items-center gap-2 mb-3">
                    <button
                        onClick={() => setTimePeriod('daily')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${timePeriod === 'daily'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Daily
                    </button>
                    <button
                        onClick={() => setTimePeriod('weekly')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${timePeriod === 'weekly'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setTimePeriod('monthly')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${timePeriod === 'monthly'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Monthly
                    </button>
                </div>

                {/* Chart */}
                <div className="bg-gray-50 rounded-lg p-3 relative">
                    <svg width={width} height={height} className="w-full">
                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                            const y = padding.top + chartHeight * (1 - ratio);
                            return (
                                <line
                                    key={i}
                                    x1={padding.left}
                                    y1={y}
                                    x2={width - padding.right}
                                    y2={y}
                                    stroke="#e5e7eb"
                                    strokeWidth="1"
                                />
                            );
                        })}

                        {/* Line path */}
                        <path
                            d={linePath}
                            fill="none"
                            stroke={color}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Data points */}
                        {points.map((point, i) => (
                            <circle
                                key={i}
                                cx={point.x}
                                cy={point.y}
                                r="4"
                                fill={color}
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredPoint({ ...point, index: i })}
                                onMouseLeave={() => setHoveredPoint(null)}
                            />
                        ))}

                        {/* X-axis labels */}
                        {visibleLabels.map((label, i) => {
                            const index = labels.indexOf(label);
                            const x = padding.left + (index / (values.length - 1)) * chartWidth;
                            return (
                                <text
                                    key={i}
                                    x={x}
                                    y={height - 5}
                                    textAnchor="middle"
                                    className="text-[10px] fill-gray-500"
                                >
                                    {label}
                                </text>
                            );
                        })}
                    </svg>

                    {/* Tooltip */}
                    {hoveredPoint && (
                        <div
                            className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs font-semibold z-10 pointer-events-none"
                            style={{
                                left: `${hoveredPoint.x}px`,
                                top: `${hoveredPoint.y - 40}px`,
                                transform: 'translateX(-50%)'
                            }}
                        >
                            {hoveredPoint.value.toFixed(1)}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // KPI Card Component with all details inline
    const KPICard = ({ kpiKey, data, icon: Icon }) => {
        const [showFormula, setShowFormula] = useState(false);
        const colors = getStatusColor(data.status);
        const isPositiveChange = data.change >= 0;
        const chartColor = data.status === 'healthy' ? '#10b981' : data.status === 'warning' ? '#f59e0b' : '#ef4444';

        return (
            <div className={`bg-white rounded-xl shadow-md border-2 ${colors.border} p-6 hover:shadow-lg transition-shadow`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colors.bg}`}>
                            <Icon size={20} className={colors.text} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 text-sm">{data.title}</h3>
                            <p className="text-xs text-gray-500">{data.subtitle}</p>
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.badge} capitalize`}>
                        {data.status}
                    </div>
                </div>

                {/* Main Value and Comparison */}
                <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold text-gray-900">
                            {kpiKey === 'expiryRisk' || kpiKey === 'revenueProtection' ? data.unit : ''}
                            {data.current}
                            {kpiKey === 'expiryRisk' || kpiKey === 'revenueProtection' ? 'M' : data.unit}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <div className={`flex items-center gap-1 font-semibold ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{isPositiveChange ? '↑' : '↓'}</span>
                            <span>
                                {isPositiveChange ? '+' : ''}
                                {data.change}
                                {kpiKey === 'expiryRisk' || kpiKey === 'revenueProtection' ? data.unit + 'M' : data.unit}
                            </span>
                        </div>
                        <span className="text-gray-500">vs last month</span>
                    </div>
                </div>

                {/* Formula Section (Collapsible) */}
                {data.formula && (
                    <div className="mb-4">
                        <button
                            onClick={() => setShowFormula(!showFormula)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                            {showFormula ? '▼' : '▶'} Formula
                        </button>
                        {showFormula && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs text-gray-700 font-mono leading-relaxed">
                                    {data.formula}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Target and Additional Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="text-xs text-gray-600 mb-1">Target</div>
                        <div className="text-lg font-bold text-blue-700">
                            {kpiKey === 'expiryRisk' || kpiKey === 'revenueProtection' ? data.unit : ''}
                            {data.target}
                            {kpiKey === 'expiryRisk' || kpiKey === 'revenueProtection' ? 'M' : data.unit}
                        </div>
                    </div>

                    {/* Additional metric based on KPI type */}
                    {kpiKey === 'stockHealth' && (
                        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                            <div className="text-xs text-gray-600 mb-1">Overstock</div>
                            <div className="text-lg font-bold text-red-700">{data.overstock}%</div>
                        </div>
                    )}

                    {kpiKey === 'expiryRisk' && (
                        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                            <div className="text-xs text-gray-600 mb-1">≤30 Days</div>
                            <div className="text-lg font-bold text-red-700">RM{data.breakdown['30days']}M</div>
                        </div>
                    )}

                    {kpiKey === 'forecastAccuracy' && (
                        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                            <div className="text-xs text-gray-600 mb-1">MAPE</div>
                            <div className="text-lg font-bold text-orange-700">{data.mape}%</div>
                        </div>
                    )}

                    {kpiKey === 'revenueProtection' && (
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                            <div className="text-xs text-gray-600 mb-1">Cases Saved</div>
                            <div className="text-lg font-bold text-green-700">{data.casesSaved}</div>
                        </div>
                    )}

                    {(kpiKey === 'otif' || kpiKey === 'fulfillmentTime') && (
                        <div className={`${colors.bg} rounded-lg p-3 border ${colors.border}`}>
                            <div className="text-xs text-gray-600 mb-1">Gap</div>
                            <div className={`text-lg font-bold ${colors.text}`}>
                                {Math.abs(data.current - data.target).toFixed(1)}{data.unit}
                            </div>
                        </div>
                    )}
                </div>

                {/* Trend Graph with Time Period Selector */}
                <div className="mb-3">
                    <div className="text-xs text-gray-600 mb-2">Trend</div>
                    <TrendChart data={data.trend} color={chartColor} kpiKey={kpiKey} />
                </div>

                {/* Additional Breakdowns */}
                {kpiKey === 'expiryRisk' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-600 mb-2">Breakdown by Days</div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-700">31-60 Days</span>
                                <span className="font-semibold text-orange-600">RM{data.breakdown['60days']}M</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-700">61-90 Days</span>
                                <span className="font-semibold text-yellow-600">RM{data.breakdown['90days']}M</span>
                            </div>
                        </div>
                    </div>
                )}

                {kpiKey === 'stockHealth' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-600 mb-2">Stock Balance</div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-700">Understock</span>
                            <span className="font-semibold text-red-600">{data.understock}%</span>
                        </div>
                    </div>
                )}

                {/* Why It Matters */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs font-semibold text-gray-700 mb-1">Why It Matters</div>
                    <div className="text-xs text-gray-600 italic">
                        {data.whyItMatters}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mb-16">
            {/* KPI Dashboard Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Key Performance Indicators</h2>
                <p className="text-gray-600 mt-2">Critical pharmacy performance metrics and trends</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <KPICard kpiKey="otif" data={kpiData.otif} icon={Target} />
                <KPICard kpiKey="stockHealth" data={kpiData.stockHealth} icon={Package} />
                <KPICard kpiKey="expiryRisk" data={kpiData.expiryRisk} icon={AlertTriangle} />
                <KPICard kpiKey="forecastAccuracy" data={kpiData.forecastAccuracy} icon={TrendingUp} />
                <KPICard kpiKey="fulfillmentTime" data={kpiData.fulfillmentTime} icon={Clock} />
                <KPICard kpiKey="revenueProtection" data={kpiData.revenueProtection} icon={DollarSign} />
            </div>
        </div>
    );
};

export default KPIDashboard;
