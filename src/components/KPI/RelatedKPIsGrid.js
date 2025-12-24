import React from 'react';
import {
    Target,
    Truck,
    CheckCircle,
    Package,
    RotateCcw,
    Zap
} from 'lucide-react';

const RelatedKPIsGrid = ({ relatedKPIs, onKPIClick }) => {
    const iconMap = {
        Target,
        Truck,
        CheckCircle,
        Package,
        RotateCcw,
        Zap
    };

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

    return (
        <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Related KPIs (SCOR Framework)</h3>
            <p className="text-sm text-gray-600 mb-6">
                End-to-end supply chain metrics that impact overall performance
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedKPIs.map((kpi) => {
                    const Icon = iconMap[kpi.icon] || Target;
                    const colors = getStatusColor(kpi.status);
                    const isAboveTarget = kpi.value >= kpi.target;

                    return (
                        <button
                            key={kpi.id}
                            onClick={() => onKPIClick && onKPIClick(kpi)}
                            className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 hover:shadow-lg transition-all text-left group`}
                        >
                            {/* Stage Badge */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                    {kpi.stage}
                                </span>
                                <div className={`p-1.5 rounded-lg ${colors.bg} group-hover:scale-110 transition-transform`}>
                                    <Icon size={16} className={colors.text} />
                                </div>
                            </div>

                            {/* KPI Name */}
                            <h4 className="text-sm font-bold text-gray-800 mb-1">{kpi.name}</h4>
                            <p className="text-xs text-gray-600 mb-3">{kpi.description}</p>

                            {/* Value */}
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className={`text-2xl font-bold ${colors.text}`}>
                                    {kpi.value}{kpi.unit}
                                </span>
                            </div>

                            {/* Target */}
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">Target: {kpi.target}{kpi.unit}</span>
                                <span className={`font-semibold ${isAboveTarget ? 'text-green-600' : 'text-red-600'}`}>
                                    {isAboveTarget ? '✓ On Track' : '✗ Below'}
                                </span>
                            </div>

                            {/* Formula (small) */}
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500 font-mono truncate" title={kpi.formula}>
                                    {kpi.formula}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default RelatedKPIsGrid;
