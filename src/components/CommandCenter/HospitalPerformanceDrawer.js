import React, { useState, useEffect } from 'react';
import { X, TrendingUp, AlertCircle, CheckCircle, Info, BarChart3, DollarSign, Users, Activity, Sliders } from 'lucide-react';
import HPISimulationTab from './HPISimulationTab';
import scorMetricsData from '../../data/scorMetricsData';
import kpiService from '../../services/kpiService';

const HospitalPerformanceDrawer = ({ isOpen, onClose, performanceData, selectedModule = 'otif' }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [moduleKPIs, setModuleKPIs] = useState([]);
    const [kpiLoading, setKpiLoading] = useState(false);

    const isOtif = selectedModule === 'otif';

    // Fetch KPIs for non-OTIF modules whenever the drawer opens or module changes
    useEffect(() => {
        if (!isOpen || isOtif) {
            setModuleKPIs([]);
            return;
        }
        const fetchKPIs = async () => {
            setKpiLoading(true);
            try {
                const response = await kpiService.getAllKPIs(selectedModule);
                if (response?.success && response?.data) {
                    // API returns a flat object — convert to array for rendering
                    const kpiArray = Object.entries(response.data)
                        .filter(([, v]) => v && typeof v === 'object' && v.title)
                        .map(([key, kpi]) => ({
                            key,
                            name: kpi.title || key,
                            current: kpi.current,
                            target: kpi.target,
                            unit: kpi.unit || '',
                            change: kpi.change,
                            status: kpi.status || 'neutral',
                        }));
                    setModuleKPIs(kpiArray);
                }
            } catch (err) {
                console.error('Failed to fetch KPIs for contributors:', err);
            } finally {
                setKpiLoading(false);
            }
        };
        fetchKPIs();
    }, [isOpen, selectedModule, isOtif]);

    if (!isOpen || !performanceData) return null;

    const {
        currentScore,
        ifAchievedScore,
        ifMissedScore,
        formula,
        inputs,
        medicineImpact,
        explanation
    } = performanceData;

    // Debug: Log explanation data
    console.log('HospitalPerformanceDrawer - performanceData:', performanceData);
    console.log('HospitalPerformanceDrawer - explanation:', explanation);

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
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-6 h-6 text-teal-600" />
                            <h2 className="text-xl font-bold text-slate-800">Hospital Performance Index</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-slate-600" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === 'overview'
                                ? 'text-blue-600'
                                : 'text-slate-600 hover:text-slate-800'
                                }`}
                        >
                            Overview
                            {activeTab === 'overview' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('simulation')}
                            className={`px-4 py-2 font-medium text-sm transition-colors relative flex items-center gap-2 ${activeTab === 'simulation'
                                ? 'text-blue-600'
                                : 'text-slate-600 hover:text-slate-800'
                                }`}
                        >
                            <Sliders className="w-4 h-4" />
                            Simulation
                            {activeTab === 'simulation' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'simulation' ? (
                    <HPISimulationTab
                        baselineData={{
                            otifPct: inputs?.components?.OTIF_norm || 0.92,
                            revenueNorm: inputs?.components?.Revenue_norm || 1.0,
                            costEfficiencyNorm: inputs?.components?.Cost_efficiency_norm || 1.0,
                            patientSatisfaction: inputs?.components?.Patient_Sat_norm || 0.82,
                            hpi: currentScore
                        }}
                        selectedModule={selectedModule}
                    />
                ) : (
                    <div className="p-6 space-y-6">
                        {/* Section 1: Performance Score */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp size={20} className="text-teal-600" />
                                <h3 className="text-lg font-bold text-gray-900">Performance Score</h3>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {/* Current Score */}
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                        Current
                                        {explanation?.current && (
                                            <div className="group relative">
                                                <Info className="w-3 h-3 text-gray-400 cursor-help" />
                                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg z-10">
                                                    {explanation.current}
                                                    <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-3xl font-bold text-orange-500">
                                        {currentScore.toFixed(2)}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Active Score</div>
                                </div>

                                {/* If Achieved */}
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                        If Achieved
                                        {explanation?.ifAchieved && (
                                            <div className="group relative">
                                                <Info className="w-3 h-3 text-gray-400 cursor-help" />
                                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg z-10">
                                                    {explanation.ifAchieved}
                                                    <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-3xl font-bold text-green-600">
                                        {ifAchievedScore.toFixed(2)}
                                    </div>
                                    <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        +{(ifAchievedScore - currentScore).toFixed(2)}%
                                    </div>
                                </div>

                                {/* If Missed */}
                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                        If Missed
                                        {explanation?.ifMissed && (
                                            <div className="group relative">
                                                <Info className="w-3 h-3 text-gray-400 cursor-help" />
                                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg z-10">
                                                    {explanation.ifMissed}
                                                    <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-3xl font-bold text-red-600">
                                        {ifMissedScore.toFixed(2)}
                                    </div>
                                    <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3 rotate-180" />
                                        {(ifMissedScore - currentScore).toFixed(2)}%
                                    </div>
                                </div>
                            </div>

                            {/* Score Range */}
                            <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-900">Score Range</span>
                                    <span className="text-xs text-gray-500">0 - 100</span>
                                </div>
                                <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                                    {/* Missed marker */}
                                    <div
                                        className="absolute top-0 h-full w-1 bg-red-500"
                                        style={{ left: `${ifMissedScore}%` }}
                                    />
                                    {/* Current marker */}
                                    <div
                                        className="absolute top-0 h-full w-2 bg-gray-800"
                                        style={{ left: `${currentScore}%` }}
                                    />
                                    {/* Achieved marker */}
                                    <div
                                        className="absolute top-0 h-full w-1 bg-green-500"
                                        style={{ left: `${ifAchievedScore}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-2 text-xs">
                                    <span className="text-red-600">Missed: {ifMissedScore.toFixed(1)}</span>
                                    <span className="text-gray-900 font-bold">Current: {currentScore.toFixed(1)}</span>
                                    <span className="text-green-600">Achieved: {ifAchievedScore.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Calculation Formula */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Info size={20} className="text-teal-600" />
                                <h3 className="text-lg font-bold text-gray-900">Calculation Formula</h3>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                <div className="text-sm text-gray-700 font-mono leading-relaxed">
                                    {formula}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Contributors */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Users size={20} className="text-teal-600" />
                                <h3 className="text-lg font-bold text-gray-900">Contributors</h3>
                            </div>

                            {isOtif ? (
                                /* ── OTIF: hardcoded SCOR metrics ── */
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-white border border-orange-200 rounded-lg p-3">
                                        <div className="text-xs font-semibold text-gray-600 mb-1">Plan</div>
                                        <div className="text-sm font-bold text-gray-900 mb-2">Forecast Quality (WAPE)</div>
                                        <div className="text-2xl font-bold text-orange-500">20.2%</div>
                                        <div className="text-xs text-gray-500 mt-1">Current: 12.5%</div>
                                        <div className="text-xs text-gray-500">Goal: 10%</div>
                                    </div>
                                    <div className="bg-white border border-orange-200 rounded-lg p-3">
                                        <div className="text-xs font-semibold text-gray-600 mb-1">Source</div>
                                        <div className="text-sm font-bold text-gray-900 mb-2">Inbound Supplier OTIF</div>
                                        <div className="text-2xl font-bold text-orange-500">41.0%</div>
                                        <div className="text-xs text-gray-500 mt-1">Current: 96.8%</div>
                                        <div className="text-xs text-gray-500">Goal: 98%</div>
                                    </div>
                                    <div className="bg-white border border-orange-200 rounded-lg p-3">
                                        <div className="text-xs font-semibold text-gray-600 mb-1">Make</div>
                                        <div className="text-sm font-bold text-gray-900 mb-2">First Pass Yield (FPY)</div>
                                        <div className="text-2xl font-bold text-orange-500">30.9%</div>
                                        <div className="text-xs text-gray-500 mt-1">Current: 94.2%</div>
                                        <div className="text-xs text-gray-500">Goal: 96%</div>
                                    </div>
                                    <div className="bg-white border border-orange-200 rounded-lg p-3">
                                        <div className="text-xs font-semibold text-gray-600 mb-1">Deliver</div>
                                        <div className="text-sm font-bold text-gray-900 mb-2">Customer OTIF</div>
                                        <div className="text-2xl font-bold text-orange-500">95.2%</div>
                                        <div className="text-xs text-gray-500 mt-1">Current: 97.5%</div>
                                        <div className="text-xs text-gray-500">Goal: 99%</div>
                                    </div>
                                    <div className="bg-white border border-red-200 rounded-lg p-3">
                                        <div className="text-xs font-semibold text-gray-600 mb-1">Return</div>
                                        <div className="text-sm font-bold text-gray-900 mb-2">Return Resolution Lead Time</div>
                                        <div className="text-2xl font-bold text-red-600">68.1%</div>
                                        <div className="text-xs text-gray-500 mt-1">Current: 3.5days</div>
                                        <div className="text-xs text-gray-500">Goal: 2days</div>
                                    </div>
                                    <div className="bg-white border border-red-200 rounded-lg p-3">
                                        <div className="text-xs font-semibold text-gray-600 mb-1">Enable</div>
                                        <div className="text-sm font-bold text-gray-900 mb-2">Exception-to-Recovery Time</div>
                                        <div className="text-2xl font-bold text-red-600">99.8%</div>
                                        <div className="text-xs text-gray-500 mt-1">Current: 4.2hours</div>
                                        <div className="text-xs text-gray-500">Goal: 2hours</div>
                                    </div>
                                </div>
                            ) : kpiLoading ? (
                                /* ── Other modules: loading state ── */
                                <div className="flex items-center justify-center py-8 text-gray-400 text-sm gap-2">
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Loading contributors…
                                </div>
                            ) : moduleKPIs.length > 0 ? (
                                /* ── Other modules: dynamic KPI cards ── */
                                <div className="grid grid-cols-3 gap-3">
                                    {moduleKPIs.map((kpi) => {
                                        const isWarning = kpi.status === 'warning' || kpi.status === 'at_risk';
                                        const isCritical = kpi.status === 'critical' || kpi.status === 'below_target';
                                        const borderColor = isCritical ? 'border-red-200' : isWarning ? 'border-orange-200' : 'border-green-200';
                                        const valueColor = isCritical ? 'text-red-600' : isWarning ? 'text-orange-500' : 'text-green-600';
                                        const currentDisplay = kpi.current != null
                                            ? `${kpi.current}${kpi.unit}`
                                            : '—';
                                        const targetDisplay = kpi.target != null
                                            ? `${kpi.target}${kpi.unit}`
                                            : '—';
                                        return (
                                            <div key={kpi.key} className={`bg-white border ${borderColor} rounded-lg p-3`}>
                                                <div className="text-sm font-bold text-gray-900 mb-2 leading-tight">{kpi.name}</div>
                                                <div className={`text-2xl font-bold ${valueColor}`}>{currentDisplay}</div>
                                                <div className="text-xs text-gray-500 mt-1">Goal: {targetDisplay}</div>
                                                {kpi.change != null && (
                                                    <div className={`text-xs mt-1 font-medium ${kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {kpi.change >= 0 ? '↑' : '↓'} {Math.abs(kpi.change)}{kpi.unit}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-400 py-4 text-center">No contributor data available.</div>
                            )}
                        </div>

                        {/* Section 4: Medicine Impact — OTIF only */}
                        {isOtif && medicineImpact && (
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Info size={20} className="text-teal-600" />
                                    <h3 className="text-lg font-bold text-gray-900">Medicine Impact</h3>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                                            <div className="text-xs font-semibold text-gray-600 mb-1">OTIF Delta</div>
                                            <div className="text-2xl font-bold text-green-600">
                                                +{medicineImpact.deltaOtifPct.toFixed(2)}%
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                                            <div className="text-xs font-semibold text-gray-600 mb-1">Protected Units</div>
                                            <div className="text-2xl font-bold text-green-600">
                                                {medicineImpact.protectedUnitsIfAchieved.toFixed(0)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-200">
                                        <span className="font-semibold">Impact Summary:</span> Achieving the forecast OTIF
                                        will improve overall performance by {medicineImpact.deltaOtifPct.toFixed(2)}% and
                                        protect {medicineImpact.protectedUnitsIfAchieved.toFixed(0)} units from stockouts.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Section 5: Key Inputs — OTIF only */}
                        {isOtif && inputs && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Info size={20} className="text-teal-600" />
                                    <h3 className="text-lg font-bold text-gray-900">Key Inputs</h3>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Current OTIF:</span>
                                            <span className="font-bold text-gray-900">{inputs.currentOtifPct?.toFixed(2)}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Vendor Coverage:</span>
                                            <span className="font-bold text-gray-900">{inputs.vendorCoveragePct?.toFixed(0)}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Forecast Vendor OTIF:</span>
                                            <span className="font-bold text-gray-900">{inputs.forecastVendorOtifPct?.toFixed(2)}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Total Forecast Qty:</span>
                                            <span className="font-bold text-gray-900">{inputs.totalForecastQty?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default HospitalPerformanceDrawer;
