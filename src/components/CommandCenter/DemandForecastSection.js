import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const DemandForecastSection = ({ data, onShowMedicineDetails }) => {
    const { demandForecast, riskAnalysis, impactAnalysis, name } = data;
    const [selectedMedicineType, setSelectedMedicineType] = useState(null);

    // Prepare forecast chart data
    const forecastData = demandForecast.weeks.map((week, index) => {
        const weekData = { week };
        demandForecast.medicineTypes.forEach(type => {
            weekData[type.name] = type.values[index];
        });
        return weekData;
    });

    const getRiskColor = (level) => {
        switch (level) {
            case 'High':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'Medium':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'Low':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-300';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                SECTION IV: Demand & Risk Forecast
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Forecast Chart (2/3 width) */}
                <div className="lg:col-span-2 bg-slate-50 rounded-lg p-5 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">
                        DEMAND & Risk FORECAST: {name.toUpperCase()}
                    </h3>

                    {/* Medicine Type Selector */}
                    <div className="mb-4">
                        <p className="text-xs text-slate-600 mb-2">
                            Note: Select any medicine type that will show M/L
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {demandForecast.medicineTypes.map((type, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedMedicineType(type.name)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${selectedMedicineType === type.name
                                            ? 'ring-2 ring-blue-500 bg-blue-100 text-blue-800'
                                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                                        }`}
                                    style={{
                                        borderColor: selectedMedicineType === type.name ? type.color : undefined
                                    }}
                                >
                                    {type.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stacked Bar Chart */}
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={forecastData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {demandForecast.medicineTypes.map((type, index) => (
                                    <Bar
                                        key={index}
                                        dataKey={type.name}
                                        stackId="a"
                                        fill={type.color}
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Panel - Risk Analysis & Impact (1/3 width) */}
                <div className="space-y-6">
                    {/* Surgical Medicine Risk */}
                    <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <AlertTriangle size={20} className="text-orange-600" />
                            Surgical Medicine Risk
                        </h3>

                        <div className="space-y-2">
                            {riskAnalysis.surgicalRisk.map((risk, index) => (
                                <div
                                    key={index}
                                    className={`px-3 py-2 rounded-lg border font-medium text-sm ${getRiskColor(risk.riskLevel)}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{risk.medicine}</span>
                                        <span className="text-xs">{risk.riskLevel}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Impact Analysis */}
                    <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-700 mb-4">CAST/IMPACT</h3>

                        {/* Revenue Impact */}
                        <div className="mb-4">
                            <p className="text-xs text-slate-600 mb-2">Revenue Impact:</p>
                            <div className="flex items-center gap-2">
                                {impactAnalysis.castImpact.revenueImpact.map((impact, index) => (
                                    <div
                                        key={index}
                                        className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold text-sm"
                                    >
                                        {impact}%
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Financial Metrics */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">RM:</span>
                                <span className="font-semibold text-green-700">
                                    ₹{impactAnalysis.castImpact.costs.rm.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">KM:</span>
                                <span className={`font-semibold ${impactAnalysis.castImpact.costs.negative ? 'text-red-700' : 'text-green-700'}`}>
                                    {impactAnalysis.castImpact.costs.negative ? '-' : ''}₹{impactAnalysis.castImpact.costs.km.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Medicine Pop-up Trigger */}
                        <button
                            onClick={onShowMedicineDetails}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                            <TrendingUp size={16} />
                            ON CLICK - Show Medicine Details
                        </button>
                    </div>

                    {/* Label/Forecast Details */}
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-300">
                        <p className="text-xs font-medium text-amber-900 mb-2">Forecast/Demand Label:</p>
                        <p className="text-sm text-amber-800">
                            Medicine {impactAnalysis.medicineDetails.name}: {impactAnalysis.medicineDetails.form} {impactAnalysis.medicineDetails.purpose} OTIF {impactAnalysis.medicineDetails.otif}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemandForecastSection;
