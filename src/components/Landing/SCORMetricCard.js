import React from 'react';
import { getMetricStatusColor, getImpactColor } from '../../data/scorMetricsData';

const SCORMetricCard = ({ metric }) => {
    const colors = getMetricStatusColor(metric.status);
    const impactColor = getImpactColor(metric.impact);
    const isAboveTarget = metric.unit === 'days' || metric.unit === 'hours'
        ? metric.currentValue <= metric.target
        : metric.currentValue >= metric.target;

    return (
        <div className={`${colors.bg} ${colors.border} border-2 rounded-xl p-5 hover:shadow-lg transition-all`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                            {metric.stage}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors.badge} capitalize`}>
                            {metric.status}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mt-2">{metric.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{metric.description}</p>
                </div>
            </div>

            {/* Current Value */}
            <div className="mb-4">
                <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${colors.text}`}>
                        {metric.currentValue}{metric.unit}
                    </span>
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-600">Target:</span>
                        <span className="text-sm font-semibold text-gray-700">
                            {metric.target}{metric.unit}
                        </span>
                    </div>
                </div>
                <div className="mt-1">
                    <span className={`text-xs font-semibold ${isAboveTarget ? 'text-green-600' : 'text-red-600'}`}>
                        {isAboveTarget ? '✓ On Track' : '✗ Below Target'}
                    </span>
                </div>
            </div>

            {/* Formula */}
            <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                <div className="text-xs font-semibold text-gray-700 mb-1">Formula</div>
                <div className="text-xs text-gray-600 font-mono mb-1">{metric.formula}</div>
                <div className="text-xs text-gray-500 italic">{metric.formulaExplanation}</div>
            </div>

            {/* Impact */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-gray-700">Impact:</span>
                    <span className={`text-xs font-bold ${impactColor} uppercase`}>{metric.impact}</span>
                </div>
                <div className="space-y-1">
                    {metric.connections.map((connection, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                            <span className="text-gray-400 text-xs mt-0.5">•</span>
                            <span className="text-xs text-gray-600">{connection}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Goal Setting */}
            <div className="pt-3 border-t border-gray-200">
                <div className="text-xs font-semibold text-gray-700 mb-1">Goal Setting</div>
                <div className="text-xs text-gray-600">{metric.goalSetting}</div>
                {metric.typicalTargets && (
                    <div className="mt-2 space-y-1">
                        {Object.entries(metric.typicalTargets).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                <span className="text-xs font-semibold text-gray-700">{value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SCORMetricCard;
