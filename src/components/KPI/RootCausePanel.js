import React from 'react';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

const RootCausePanel = ({ rootCauses }) => {
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-300',
                    text: 'text-red-700',
                    badge: 'bg-red-100 text-red-700'
                };
            case 'medium':
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-300',
                    text: 'text-yellow-700',
                    badge: 'bg-yellow-100 text-yellow-700'
                };
            case 'low':
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-300',
                    text: 'text-blue-700',
                    badge: 'bg-blue-100 text-blue-700'
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

    return (
        <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-800">Root Cause Analysis (Level 1)</h3>
            </div>

            <div className="space-y-4">
                {rootCauses.map((categoryGroup, idx) => (
                    <div key={idx} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">{categoryGroup.category}</h4>
                        <div className="space-y-2">
                            {categoryGroup.causes.map((cause) => {
                                const colors = getSeverityColor(cause.severity);
                                return (
                                    <div
                                        key={cause.id}
                                        className={`${colors.bg} ${colors.border} border rounded-lg p-3 hover:shadow-md transition-shadow`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h5 className={`text-sm font-semibold ${colors.text}`}>
                                                        {cause.name}
                                                    </h5>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors.badge} capitalize`}>
                                                        {cause.severity}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600">{cause.description}</p>
                                            </div>
                                            <div className="ml-3 text-right">
                                                <div className="text-xs text-gray-500 mb-1">Impact</div>
                                                <div className={`text-lg font-bold ${colors.text}`}>{cause.impact}%</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RootCausePanel;
