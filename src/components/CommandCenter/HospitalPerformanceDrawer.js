import React from 'react';
import { X, TrendingUp, AlertCircle, CheckCircle, Info, BarChart3, DollarSign, Users, Activity } from 'lucide-react';

const HospitalPerformanceDrawer = ({ isOpen, onClose, performanceData }) => {
    if (!isOpen || !performanceData) return null;

    const {
        currentScore,
        ifAchievedScore,
        ifMissedScore,
        formula,
        inputs,
        medicineImpact
    } = performanceData;

    const getScoreColor = (score) => {
        if (score >= 70) return 'text-green-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score) => {
        if (score >= 70) return 'bg-green-50 border-green-200';
        if (score >= 50) return 'bg-yellow-50 border-yellow-200';
        return 'bg-red-50 border-red-200';
    };

    const components = inputs?.components || {};
    const componentWeights = [
        { name: 'OTIF Performance', key: 'OTIF_norm', weight: 30, icon: CheckCircle, color: 'blue' },
        { name: 'Revenue Impact', key: 'Revenue_norm', weight: 25, icon: DollarSign, color: 'green' },
        { name: 'Cost Efficiency', key: 'Cost_efficiency_norm', weight: 20, icon: TrendingUp, color: 'purple' },
        { name: 'Patient Satisfaction', key: 'Patient_Sat_norm', weight: 15, icon: Users, color: 'pink' },
        { name: 'Clinical Risk', key: 'Clinical_Risk_norm', weight: 10, icon: Activity, color: 'red' }
    ];

    const getComponentColor = (color) => {
        const colors = {
            blue: { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700' },
            green: { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700' },
            purple: { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700' },
            pink: { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-700' },
            red: { bg: 'bg-red-500', light: 'bg-red-100', text: 'text-red-700' }
        };
        return colors[color] || colors.blue;
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[600px] bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b-2 border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-slate-800">Hospital Performance Index</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-slate-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Section 1: Score Overview */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp size={20} className="text-blue-600" />
                            <h3 className="text-lg font-bold text-slate-800">PERFORMANCE SCORES</h3>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {/* Current Score */}
                            <div className={`border-2 rounded-xl p-4 ${getScoreBgColor(currentScore)}`}>
                                <div className="text-xs font-semibold text-slate-600 mb-1">Current</div>
                                <div className={`text-3xl font-bold ${getScoreColor(currentScore)}`}>
                                    {currentScore.toFixed(2)}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">Active Score</div>
                            </div>

                            {/* If Achieved */}
                            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                                <div className="text-xs font-semibold text-slate-600 mb-1">If Achieved</div>
                                <div className="text-3xl font-bold text-green-600">
                                    {ifAchievedScore.toFixed(2)}
                                </div>
                                <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    +{(ifAchievedScore - currentScore).toFixed(2)}
                                </div>
                            </div>

                            {/* If Missed */}
                            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                                <div className="text-xs font-semibold text-slate-600 mb-1">If Missed</div>
                                <div className="text-3xl font-bold text-red-600">
                                    {ifMissedScore.toFixed(2)}
                                </div>
                                <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 rotate-180" />
                                    {(ifMissedScore - currentScore).toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {/* Score Comparison Bar */}
                        <div className="mt-4 bg-slate-100 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-slate-600">Score Range</span>
                                <span className="text-xs text-slate-500">0 - 100</span>
                            </div>
                            <div className="relative h-8 bg-slate-200 rounded-full overflow-hidden">
                                {/* Missed marker */}
                                <div
                                    className="absolute top-0 h-full w-1 bg-red-500"
                                    style={{ left: `${ifMissedScore}%` }}
                                />
                                {/* Current marker */}
                                <div
                                    className="absolute top-0 h-full w-2 bg-blue-600"
                                    style={{ left: `${currentScore}%` }}
                                />
                                {/* Achieved marker */}
                                <div
                                    className="absolute top-0 h-full w-1 bg-green-500"
                                    style={{ left: `${ifAchievedScore}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between mt-2 text-xs">
                                <span className="text-red-600">Missed: {ifMissedScore.toFixed(1)}%</span>
                                <span className="text-blue-600 font-bold">Current: {currentScore.toFixed(1)}%</span>
                                <span className="text-green-600">Achieved: {ifAchievedScore.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Formula */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Info size={20} className="text-blue-600" />
                            <h3 className="text-lg font-bold text-slate-800">CALCULATION FORMULA</h3>
                        </div>
                        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                            <div className="text-sm text-slate-700 font-mono leading-relaxed">
                                {formula}
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Component Breakdown */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 size={20} className="text-blue-600" />
                            <h3 className="text-lg font-bold text-slate-800">COMPONENT BREAKDOWN</h3>
                        </div>

                        <div className="space-y-3">
                            {componentWeights.map((comp) => {
                                const value = components[comp.key] || 0;
                                const weightedValue = (value * comp.weight) / 100;
                                const colors = getComponentColor(comp.color);
                                const Icon = comp.icon;

                                return (
                                    <div key={comp.key} className={`${colors.light} border-2 border-${comp.color}-200 rounded-xl p-4`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Icon className={`w-5 h-5 ${colors.text}`} />
                                                <div>
                                                    <div className="font-bold text-slate-800">{comp.name}</div>
                                                    <div className="text-xs text-slate-600">Weight: {comp.weight}%</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-2xl font-bold ${colors.text}`}>
                                                    {value.toFixed(2)}%
                                                </div>
                                                <div className="text-xs text-slate-600">
                                                    Contributes: {weightedValue.toFixed(2)}%
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div
                                                className={`${colors.bg} h-2 rounded-full transition-all duration-500`}
                                                style={{ width: `${value}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section 4: Medicine Impact */}
                    {medicineImpact && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle size={20} className="text-blue-600" />
                                <h3 className="text-lg font-bold text-slate-800">MEDICINE IMPACT</h3>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-5">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                                        <div className="text-xs font-semibold text-slate-600 mb-1">OTIF Delta</div>
                                        <div className="text-2xl font-bold text-blue-600">
                                            +{medicineImpact.deltaOtifPct.toFixed(2)}%
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-green-200">
                                        <div className="text-xs font-semibold text-slate-600 mb-1">Protected Units</div>
                                        <div className="text-2xl font-bold text-green-600">
                                            {medicineImpact.protectedUnitsIfAchieved.toFixed(0)}
                                        </div>
                                    </div>
                                </div>

                                {medicineImpact.riskUnitsIfMissed > 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <div className="text-xs font-semibold text-red-700 mb-1">Risk Units if Missed</div>
                                        <div className="text-xl font-bold text-red-600">
                                            {medicineImpact.riskUnitsIfMissed.toFixed(0)} units
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 text-sm text-slate-700 bg-white rounded-lg p-3 border border-slate-200">
                                    <span className="font-semibold">Impact Summary:</span> Achieving the forecast OTIF
                                    will improve overall performance by {medicineImpact.deltaOtifPct.toFixed(2)}% and
                                    protect {medicineImpact.protectedUnitsIfAchieved.toFixed(0)} units from stockouts.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 5: Key Inputs */}
                    {inputs && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Info size={20} className="text-blue-600" />
                                <h3 className="text-lg font-bold text-slate-800">KEY INPUTS</h3>
                            </div>

                            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Current OTIF:</span>
                                        <span className="font-bold">{inputs.currentOtifPct?.toFixed(2)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Forecast Vendor OTIF:</span>
                                        <span className="font-bold">{inputs.forecastVendorOtifPct?.toFixed(2)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Vendor Coverage:</span>
                                        <span className="font-bold">{inputs.vendorCoveragePct?.toFixed(0)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Total Forecast Qty:</span>
                                        <span className="font-bold">{inputs.totalForecastQty?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HospitalPerformanceDrawer;
