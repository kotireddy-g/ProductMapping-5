import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DemandSupplySection = ({ data }) => {
    const { demandSupply, medicineCategories } = data;

    // Prepare demand-supply chart data
    const demandSupplyData = demandSupply.demand.map((demand, index) => ({
        name: demandSupply.labels[index],
        value: index % 2 === 0 ? demand : demandSupply.supply[Math.floor(index / 2)]
    }));

    // Prepare pie chart data
    const pieData = medicineCategories.map(cat => ({
        name: cat.name,
        value: cat.percentage,
        color: cat.color,
        otif: cat.otif,
        days: cat.days,
        range: cat.range
    }));

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                SECTION I: Demand-Supply & Medicine Category Analysis
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel - Demand-Supply */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">DEMAND-SUPPLY</h3>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <div className="text-xs text-slate-600 mb-1">OTIF</div>
                            <div className="text-xl font-bold text-blue-700">{demandSupply.otif}%</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <div className="text-xs text-slate-600 mb-1">OT</div>
                            <div className="text-xl font-bold text-green-700">{demandSupply.onTime}%</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <div className="text-xs text-slate-600 mb-1">IF</div>
                            <div className="text-xl font-bold text-purple-700">{demandSupply.inFull}</div>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={demandSupplyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Panel - Medicine Category Pie Chart */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">MEDICINE-CATEGORY</h3>
                    <p className="text-sm text-slate-600 mb-4">OTIF Distribution</p>

                    {/* Pie Chart */}
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${value}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 space-y-2">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                            {medicineCategories.slice(0, 3).map((cat, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: cat.color }}
                                    ></div>
                                    <span className="text-slate-700">{cat.name}: {cat.percentage}%</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-300">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span>Green: {medicineCategories[4].days} days, {medicineCategories[4].otif}%, {medicineCategories[4].range}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span>Orange</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span>Red</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemandSupplySection;
