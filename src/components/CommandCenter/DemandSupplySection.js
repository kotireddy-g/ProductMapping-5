import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const DemandSupplySection = ({ data, selectedTimePeriod = 'today' }) => {
    const { demandSupply, medicineCategories, name } = data;

    // Prepare demand-supply chart data based on selected period
    let demandSupplyData = [];
    let xAxisLabel = '';

    if (selectedTimePeriod === 'today') {
        // For "Today": Show internal departments
        // First bar is overall department, then internal departments
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

    // Prepare pie chart data with color based on OTIF percentage
    const getPieColor = (otif) => {
        if (otif < 80) return '#ef4444'; // Red
        if (otif >= 80 && otif <= 90) return '#f59e0b'; // Yellow
        return '#10b981'; // Green
    };

    const pieData = medicineCategories.map(cat => ({
        name: cat.name,
        value: cat.percentage,
        otif: cat.otif,
        color: getPieColor(cat.otif)
    }));

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

                {/* Right Panel - Medicine Category Pie Chart */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">MEDICINE-CATEGORY</h3>
                    <p className="text-sm text-slate-600 mb-4">OTIF Distribution by Category</p>

                    {/* Larger Pie Chart */}
                    <div className="h-96 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({ name, value, otif }) => `${name}: ${value}% (OTIF: ${otif}%)`}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name, props) => {
                                        const { payload } = props;
                                        return [
                                            `${value}% (OTIF: ${payload.otif}%)`,
                                            payload.name
                                        ];
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Simplified Legend */}
                    <div className="mt-4 space-y-2">
                        <div className="grid grid-cols-1 gap-2 text-xs">
                            {medicineCategories.map((cat, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: getPieColor(cat.otif) }}
                                        ></div>
                                        <span className="text-slate-700">{cat.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-600">{cat.percentage}%</span>
                                        <span className={`font-semibold ${cat.otif < 80 ? 'text-red-700' :
                                                cat.otif >= 80 && cat.otif <= 90 ? 'text-yellow-700' :
                                                    'text-green-700'
                                            }`}>
                                            OTIF: {cat.otif}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-300 flex items-center gap-4 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span>Green: OTIF &gt; 90%</span>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemandSupplySection;
