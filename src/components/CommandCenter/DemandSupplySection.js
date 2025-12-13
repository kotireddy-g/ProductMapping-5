import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { generateHeatmapData } from '../../data/commandCenterData';

const DemandSupplySection = ({ data, selectedTimePeriod = 'today' }) => {
    const { demandSupply, medicineCategories, name } = data;

    // Prepare demand-supply chart data based on selected period
    let demandSupplyData = [];
    let xAxisLabel = '';

    if (selectedTimePeriod === 'today') {
        // For "Today": Show internal departments
        const internalDepartments = [
            { name: `Overall ${name}`, demand: 450, supply: 420 },
            { name: 'NICU', demand: 120, supply: 115 },
            { name: 'ICCU', demand: 95, supply: 92 },
            { name: 'MICU', demand: 110, supply: 105 },
            { name: 'SICU', demand: 85, supply: 80 },
            { name: 'PICU', demand: 40, supply: 38 }
        ];
        demandSupplyData = internalDepartments;
        xAxisLabel = 'Departments';
    } else {
        // For other periods: Show days on X-axis
        const days = selectedTimePeriod === 'next_7_days' ? 7 :
            selectedTimePeriod === 'next_14_days' ? 14 :
                selectedTimePeriod === 'next_21_days' ? 21 : 30;

        demandSupplyData = Array.from({ length: days }, (_, i) => ({
            name: `Day ${i + 1}`,
            demand: Math.floor(Math.random() * 50) + 100,
            supply: Math.floor(Math.random() * 50) + 90
        }));
        xAxisLabel = 'Days';
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Demand-Supply & Medicine Category Analysis
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel - Demand-Supply */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">DEMAND-SUPPLY</h3>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <div className="text-xs text-slate-600 mb-1">OTIF (On-Time In-Full)</div>
                            <div className="text-xl font-bold text-blue-700">{demandSupply.otif}%</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <div className="text-xs text-slate-600 mb-1">OT (On-Time)</div>
                            <div className="text-xl font-bold text-green-700">{demandSupply.onTime}%</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <div className="text-xs text-slate-600 mb-1">IF (In-Full)</div>
                            <div className="text-xl font-bold text-purple-700">{demandSupply.inFull}%</div>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={demandSupplyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    angle={selectedTimePeriod === 'today' ? -45 : 0}
                                    textAnchor={selectedTimePeriod === 'today' ? 'end' : 'middle'}
                                    height={selectedTimePeriod === 'today' ? 100 : 30}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="demand" fill="#3b82f6" name="Demand" />
                                <Bar dataKey="supply" fill="#10b981" name="Supply" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-3 text-xs text-slate-600 text-center">
                        {selectedTimePeriod === 'today' ? 'Internal Departments' : `${xAxisLabel} Forecast`}
                    </div>
                </div>

                {/* Right Panel - Medicine Category Heatmap */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">MEDICINE-CATEGORY</h3>
                    <p className="text-sm text-slate-600 mb-4">OTIF Distribution by Category Over Time</p>

                    {/* Generate heatmap data */}
                    {(() => {
                        const heatmapData = generateHeatmapData(medicineCategories, selectedTimePeriod);

                        // Helper function to get cell color based on OTIF
                        const getCellColor = (otif) => {
                            if (otif >= 90) return 'bg-green-500';
                            if (otif >= 80) return 'bg-yellow-500';
                            return 'bg-red-500';
                        };

                        // Helper function to get opacity based on OTIF
                        const getCellOpacity = (otif) => {
                            if (otif >= 95) return 'bg-opacity-90';
                            if (otif >= 90) return 'bg-opacity-80';
                            if (otif >= 85) return 'bg-opacity-70';
                            if (otif >= 80) return 'bg-opacity-60';
                            return 'bg-opacity-50';
                        };

                        return (
                            <>
                                {/* Enhanced Heatmap Visualization */}
                                <div className="overflow-x-auto mb-3">
                                    <div className="min-w-full">
                                        {/* Heatmap Grid */}
                                        <div className="grid gap-1" style={{
                                            gridTemplateColumns: `150px repeat(${heatmapData[0]?.timeSeries.length || 1}, minmax(60px, 1fr))`
                                        }}>
                                            {/* Header Row - Empty cell + Time periods */}
                                            <div className="h-8"></div>
                                            {heatmapData[0]?.timeSeries.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="h-8 flex items-center justify-center text-xs font-semibold text-slate-700"
                                                >
                                                    {item.period}
                                                </div>
                                            ))}

                                            {/* Data Rows */}
                                            {heatmapData.map((row, rowIdx) => (
                                                <React.Fragment key={rowIdx}>
                                                    {/* Row Label */}
                                                    <div className="flex items-center text-sm font-medium text-slate-700 pr-2">
                                                        {row.category}
                                                    </div>

                                                    {/* Data Cells */}
                                                    {row.timeSeries.map((cell, cellIdx) => {
                                                        const bgColor = getCellColor(cell.otif);
                                                        const opacity = getCellOpacity(cell.otif);

                                                        return (
                                                            <div
                                                                key={cellIdx}
                                                                className={`${bgColor} ${opacity} rounded-md h-12 flex items-center justify-center text-white font-bold text-sm hover:scale-105 transition-transform cursor-pointer shadow-sm`}
                                                                title={`${row.category} - ${cell.period}: ${cell.otif}% OTIF`}
                                                            >
                                                                {cell.otif}%
                                                            </div>
                                                        );
                                                    })}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Color Coding Legend */}
                                <div className="mt-4 pt-4 border-t border-slate-300 flex items-center gap-4 text-xs text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <span>Green: OTIF ≥ 90%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <span>Yellow: OTIF 80-90%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <span>Red: OTIF &lt; 80%</span>
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};

export default DemandSupplySection;
