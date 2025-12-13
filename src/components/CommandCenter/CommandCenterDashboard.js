import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getDepartmentData, getOTIFColorClass, timePeriods } from '../../data/commandCenterData';
import DemandSupplySection from './DemandSupplySection';
import RootCausesSection from './RootCausesSection';
import MedicineTypeImpactSection from './MedicineTypeImpactSection';
import DemandForecastSection from './DemandForecastSection';
import AgentRecommendationsSection from './AgentRecommendationsSection';

const CommandCenterDashboard = ({ departmentId, onBack }) => {
    const [selectedTimePeriod, setSelectedTimePeriod] = useState('today');
    const [showMedicineModal, setShowMedicineModal] = useState(false);

    // Get department data
    const departmentData = getDepartmentData(departmentId);

    if (!departmentData) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Department Not Found</h2>
                    <p className="text-slate-600 mb-4">Unable to load data for this department.</p>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const { overview, name } = departmentData;
    const otifColors = getOTIFColorClass(overview.otif);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Dashboard</span>
                    </button>

                    {/* Department Title */}
                    <h1 className="text-4xl font-bold text-slate-800 mb-6">
                        {name.toUpperCase()} COMMAND CENTER
                    </h1>

                    {/* Key Metrics and Filters Row */}
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        {/* Key Metrics */}
                        <div className="flex flex-wrap items-center gap-4">
                            {/* OTIF Metric */}
                            <div className={`${otifColors.bg} ${otifColors.border} border-2 rounded-lg px-6 py-3`}>
                                <div className="text-sm text-slate-600 mb-1">OTIF</div>
                                <div className={`text-3xl font-bold ${otifColors.text}`}>
                                    {overview.otif}%
                                </div>
                            </div>

                            {/* OT Metric */}
                            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg px-6 py-3">
                                <div className="text-sm text-slate-600 mb-1">OT (On-Time)</div>
                                <div className="text-3xl font-bold text-blue-700">
                                    {overview.onTime}%
                                </div>
                            </div>

                            {/* IF Metric */}
                            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg px-6 py-3">
                                <div className="text-sm text-slate-600 mb-1">IF (In-Full)</div>
                                <div className="text-3xl font-bold text-purple-700">
                                    {overview.inFull}%
                                </div>
                            </div>
                        </div>

                        {/* Time Period Filters */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-slate-700">Period:</span>
                            {timePeriods.map((period) => (
                                <button
                                    key={period.id}
                                    onClick={() => setSelectedTimePeriod(period.value)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${selectedTimePeriod === period.value
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    {period.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Section I: Demand-Supply & Medicine Category */}
                <DemandSupplySection data={departmentData} selectedTimePeriod={selectedTimePeriod} />

                {/* Section II: Root Causes */}
                <RootCausesSection data={departmentData} selectedTimePeriod={selectedTimePeriod} />

                {/* Section III: Medicine Type Impact */}
                <MedicineTypeImpactSection data={departmentData} selectedTimePeriod={selectedTimePeriod} />

                {/* Section IV: Demand & Risk Forecast */}
                <DemandForecastSection
                    data={departmentData}
                    selectedTimePeriod={selectedTimePeriod}
                    onShowMedicineDetails={() => setShowMedicineModal(true)}
                />

                {/* Section V: Agent Recommendations */}
                <AgentRecommendationsSection data={departmentData} selectedTimePeriod={selectedTimePeriod} />
            </div>

            {/* Medicine Details Modal */}
            {showMedicineModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-slate-800">
                                    {departmentData.impactAnalysis.medicineDetails.name}
                                </h3>
                                <button
                                    onClick={() => setShowMedicineModal(false)}
                                    className="text-slate-400 hover:text-slate-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <p className="text-slate-600 mt-2">
                                {departmentData.impactAnalysis.medicineDetails.form} - {departmentData.impactAnalysis.medicineDetails.purpose} - OTIF {departmentData.impactAnalysis.medicineDetails.otif}%
                            </p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* ICU Breakdown */}
                            <div>
                                <h4 className="font-semibold text-lg text-slate-800 mb-3">ICU</h4>
                                <div className="grid grid-cols-5 gap-4">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="text-xs text-slate-600 mb-1">Demand</div>
                                        <div className="text-xl font-bold text-blue-700">
                                            {departmentData.impactAnalysis.medicineDetails.breakdown.icu.demand}
                                        </div>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <div className="text-xs text-slate-600 mb-1">Supply</div>
                                        <div className="text-xl font-bold text-green-700">
                                            {departmentData.impactAnalysis.medicineDetails.breakdown.icu.supply}
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                        <div className="text-xs text-slate-600 mb-1">Stocks</div>
                                        <div className="text-xl font-bold text-purple-700">
                                            {departmentData.impactAnalysis.medicineDetails.breakdown.icu.stocks}
                                        </div>
                                    </div>
                                    <div className="bg-amber-50 p-3 rounded-lg">
                                        <div className="text-xs text-slate-600 mb-1">Forecast</div>
                                        <div className="text-xl font-bold text-amber-700">
                                            {departmentData.impactAnalysis.medicineDetails.breakdown.icu.forecast}
                                        </div>
                                    </div>
                                    <div className="bg-cyan-50 p-3 rounded-lg">
                                        <div className="text-xs text-slate-600 mb-1">Stock Order</div>
                                        <div className="text-xl font-bold text-cyan-700">
                                            {departmentData.impactAnalysis.medicineDetails.breakdown.icu.stockorder}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* NICU Breakdown */}
                            <div>
                                <h4 className="font-semibold text-lg text-slate-800 mb-3">NICU</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <div className="text-xs text-slate-600 mb-1">Cost</div>
                                        <div className="text-xl font-bold text-green-700">
                                            RM {departmentData.impactAnalysis.medicineDetails.breakdown.nicu.cost.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="text-xs text-slate-600 mb-1">Revenue</div>
                                        <div className="text-xl font-bold text-blue-700">
                                            RM {departmentData.impactAnalysis.medicineDetails.breakdown.nicu.revenue.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ICCU Breakdown */}
                            <div>
                                <h4 className="font-semibold text-lg text-slate-800 mb-3">ICCU</h4>
                                <div className="grid grid-cols-5 gap-4">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="text-xs text-slate-600 mb-1">Demand</div>
                                        <div className="text-xl font-bold text-blue-700">
                                            {departmentData.impactAnalysis.medicineDetails.breakdown.iccu.demand}
                                        </div>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <div className="text-xs text-slate-600 mb-1">Supply</div>
                                        <div className="text-xl font-bold text-green-700">
                                            {departmentData.impactAnalysis.medicineDetails.breakdown.iccu.supply}
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                        <div className="text-xs text-slate-600 mb-1">Stocks</div>
                                        <div className="text-xl font-bold text-purple-700">
                                            {departmentData.impactAnalysis.medicineDetails.breakdown.iccu.stocks}
                                        </div>
                                    </div>
                                    <div className="bg-amber-50 p-3 rounded-lg">
                                        <div className="text-xs text-slate-600 mb-1">Forecast</div>
                                        <div className="text-xl font-bold text-amber-700">
                                            {departmentData.impactAnalysis.medicineDetails.breakdown.iccu.forecast}
                                        </div>
                                    </div>
                                    <div className="bg-cyan-50 p-3 rounded-lg">
                                        <div className="text-xs text-slate-600 mb-1">Stock Order</div>
                                        <div className="text-xl font-bold text-cyan-700">
                                            {departmentData.impactAnalysis.medicineDetails.breakdown.iccu.stockorder}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommandCenterDashboard;
