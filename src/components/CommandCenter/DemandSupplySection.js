import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DemandSupplySection = ({ data, selectedTimePeriod = 'today' }) => {
    const { demandSupply, medicineCategories, name } = data;

    // Use API chart data if available, otherwise use fallback
    const demandSupplyData = demandSupply?.chart_data || [];
    const xAxisLabel = 'Days Forecast';

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
                            <div className="text-xl font-bold text-blue-700">{demandSupply?.otif || 0}%</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <div className="text-xs text-slate-600 mb-1">OT (On-Time)</div>
                            <div className="text-xl font-bold text-green-700">{demandSupply?.on_time || demandSupply?.onTime || 0}%</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <div className="text-xs text-slate-600 mb-1">IF (In-Full)</div>
                            <div className="text-xl font-bold text-purple-700">{demandSupply?.in_full || demandSupply?.inFull || 0}%</div>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={demandSupplyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="label"
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

                    {/* Use API heatmap data */}
                    {(() => {
                        const heatmapData = data.heatmapData || { categories: [] };


                        // Helper function to get cell color based on OTIF
                        const getCellColor = (otif) => {
                            if (otif >= 95) return 'bg-green-500';
                            if (otif >= 85) return 'bg-amber-500';
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
                                            gridTemplateColumns: `150px repeat(${heatmapData.categories?.[0]?.time_series?.length || 7}, minmax(60px, 1fr))`
                                        }}>
                                            {/* Header Row - Empty cell + Time periods */}
                                            <div className="h-8"></div>
                                            {heatmapData.categories?.[0]?.time_series?.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="h-8 flex items-center justify-center text-xs font-semibold text-slate-700"
                                                >
                                                    {item.period}
                                                </div>
                                            ))}

                                            {/* Data Rows */}
                                            {heatmapData.categories?.map((row, rowIdx) => (
                                                <React.Fragment key={rowIdx}>
                                                    {/* Row Label */}
                                                    <div className="flex items-center text-sm font-medium text-slate-700 pr-2">
                                                        {row.category}
                                                    </div>

                                                    {/* Data Cells */}
                                                    {row.time_series?.map((cell, cellIdx) => {
                                                        const bgColor = getCellColor(cell.otif);
                                                        const opacity = getCellOpacity(cell.otif);

                                                        return (
                                                            <div
                                                                key={cellIdx}
                                                                className={`${bgColor} ${opacity} rounded-md h-12 flex items-center justify-center text-white font-bold text-sm hover:scale-105 transition-transform cursor-pointer shadow-sm`}
                                                                title={`${row.category} - ${cell.period}: ${Number(cell.otif).toFixed(2)}% OTIF`}
                                                            >
                                                                {Number(cell.otif).toFixed(2)}%
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
                                        <span>Green: 95-100%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                        <span>Amber: 85-95%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <span>Red: &lt;85%</span>
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
