import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, X } from 'lucide-react';

const DemandForecastSection = ({ data, selectedTimePeriod = 'today' }) => {
    const { name } = data;
    const [selectedMedicineType, setSelectedMedicineType] = useState('Surgical');
    const [showMedicineModal, setShowMedicineModal] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);

    // Medicine types for Y-axis
    const medicineTypes = [
        'Life-saving',
        'Fast-moving',
        'Critical',
        'Surgical',
        'General',
        'Restricted',
        'New Stock'
    ];

    // Prepare horizontal bar chart data based on period
    const getBarChartData = () => {
        return medicineTypes.map(type => ({
            name: type,
            value: Math.floor(Math.random() * 100) + 50,
            isSelected: type === selectedMedicineType
        }));
    };

    // Risk medicines data by type
    const riskMedicinesByType = {
        'Surgical': [
            { name: 'Propofol', urgency: 7, risk: 'High' },
            { name: 'Rocuronium', urgency: 14, risk: 'Medium' },
            { name: 'Sevoflurane', urgency: 28, risk: 'Low' },
            { name: 'Fentanyl', urgency: 5, risk: 'Critical' },
            { name: 'Midazolam', urgency: 21, risk: 'Low' }
        ],
        'Life-saving': [
            { name: 'Paracetamol', urgency: 3, risk: 'Critical' },
            { name: 'Insulin', urgency: 10, risk: 'Medium' },
            { name: 'Epinephrine', urgency: 6, risk: 'High' },
            { name: 'Norepinephrine', urgency: 25, risk: 'Low' }
        ],
        'Fast-moving': [
            { name: 'Amoxicillin', urgency: 12, risk: 'Medium' },
            { name: 'Ciprofloxacin', urgency: 8, risk: 'High' },
            { name: 'Metformin', urgency: 30, risk: 'Normal' }
        ],
        'Critical': [
            { name: 'Dopamine', urgency: 4, risk: 'Critical' },
            { name: 'Heparin', urgency: 15, risk: 'Medium' },
            { name: 'Warfarin', urgency: 20, risk: 'Low' }
        ],
        'General': [
            { name: 'Aspirin', urgency: 18, risk: 'Low' },
            { name: 'Ibuprofen', urgency: 22, risk: 'Low' },
            { name: 'Omeprazole', urgency: 35, risk: 'Normal' }
        ],
        'Restricted': [
            { name: 'Morphine', urgency: 9, risk: 'High' },
            { name: 'Ketamine', urgency: 16, risk: 'Medium' }
        ],
        'New Stock': [
            { name: 'Remdesivir', urgency: 11, risk: 'Medium' },
            { name: 'Tocilizumab', urgency: 27, risk: 'Low' }
        ]
    };

    // Get color based on urgency (days)
    const getUrgencyColor = (urgency) => {
        if (urgency <= 7) return 'bg-red-100 text-red-800 border-red-400';
        if (urgency <= 14) return 'bg-orange-100 text-orange-800 border-orange-400';
        if (urgency <= 28) return 'bg-lime-100 text-lime-800 border-lime-400';
        return 'bg-green-100 text-green-800 border-green-400';
    };

    // Medicine details for popup
    const getMedicineDetails = (medicineName) => {
        return {
            name: medicineName,
            format: 'Tablet',
            otif: 79,
            departments: [
                {
                    name: 'NICU',
                    label: 'Fast-moving',
                    demand: 120,
                    supply: 95,
                    stockAvailable: 450,
                    cost: 15000,
                    revenue: 18500,
                    forecast: 12,
                    vendor: 'MedSupply Co.',
                    stockOrder: 150
                },
                {
                    name: 'ICCU',
                    label: 'Life-saving',
                    demand: 200,
                    supply: 195,
                    stockAvailable: 600,
                    cost: 25000,
                    revenue: 32000,
                    forecast: 15,
                    vendor: 'PharmaCorp Ltd.',
                    stockOrder: 220
                },
                {
                    name: 'MICU',
                    label: 'Critical',
                    demand: 85,
                    supply: 80,
                    stockAvailable: 320,
                    cost: 12000,
                    revenue: 15500,
                    forecast: 10,
                    vendor: 'HealthMeds Inc.',
                    stockOrder: 100
                },
                {
                    name: 'SICU',
                    label: 'Surgical',
                    demand: 150,
                    supply: 145,
                    stockAvailable: 520,
                    cost: 20000,
                    revenue: 26000,
                    forecast: 18,
                    vendor: 'MedSupply Co.',
                    stockOrder: 180
                }
            ]
        };
    };

    const handleMedicineClick = (medicine) => {
        setSelectedMedicine(getMedicineDetails(medicine.name));
        setShowMedicineModal(true);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Demand & Risk Forecast
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Horizontal Bar Chart (2/3 width) */}
                <div className="lg:col-span-2 bg-slate-50 rounded-lg p-5 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">
                        Medicine Type Forecast - {name.toUpperCase()}
                    </h3>

                    {/* Horizontal Bar Chart */}
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={getBarChartData()}
                                layout="vertical"
                                onClick={(data) => {
                                    if (data && data.activeLabel) {
                                        setSelectedMedicineType(data.activeLabel);
                                    }
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar
                                    dataKey="value"
                                    fill="#3b82f6"
                                    onClick={(data) => setSelectedMedicineType(data.name)}
                                    cursor="pointer"
                                    radius={[0, 8, 8, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Panel - Risk Analysis (1/3 width) */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-orange-600" />
                        {selectedMedicineType} Medicine Risk
                    </h3>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {riskMedicinesByType[selectedMedicineType]?.map((medicine, index) => (
                            <button
                                key={index}
                                onClick={() => handleMedicineClick(medicine)}
                                className={`w-full px-3 py-2 rounded-lg border-2 font-medium text-sm transition-all hover:shadow-md ${getUrgencyColor(medicine.urgency)}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{medicine.name}</span>
                                    <span className="text-xs">{medicine.urgency}d</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Note */}
            <div className="mt-4 text-sm text-slate-600 italic">
                Note: Select any medicine type that will show the risk
            </div>

            {/* Impact Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-sm text-slate-600 mb-1">Cost Impact</div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-blue-700">10%</span>
                        <span className="text-sm text-slate-600">RM 200,000</span>
                    </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-slate-600 mb-1">Revenue Impact</div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-green-700">15%</span>
                        <span className="text-sm text-slate-600">300,000</span>
                    </div>
                </div>

                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="text-sm text-slate-600 mb-1">Customer Satisfaction</div>
                    <div className="text-2xl font-bold text-red-700">-20%</div>
                </div>
            </div>

            {/* Medicine Details Modal */}
            {showMedicineModal && selectedMedicine && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800">
                                    {selectedMedicine.name}
                                </h3>
                                <p className="text-slate-600 mt-1">
                                    {selectedMedicine.format} - OTIF {selectedMedicine.otif}%
                                </p>
                            </div>
                            <button
                                onClick={() => setShowMedicineModal(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-100 border-b border-slate-300">
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                                Internal Department
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                                Label
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                                Demand
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                                Supply
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                                Stock Available
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                                Cost & Revenue
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                                Forecast %
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                                Vendor
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                                Stock Order
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedMedicine.departments.map((dept, index) => (
                                            <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                                                <td className="px-4 py-3 font-medium text-slate-800">{dept.name}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                                        {dept.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-blue-700">{dept.demand}</td>
                                                <td className="px-4 py-3 font-semibold text-green-700">{dept.supply}</td>
                                                <td className="px-4 py-3 font-semibold text-purple-700">{dept.stockAvailable}</td>
                                                <td className="px-4 py-3">
                                                    <div className="text-xs">
                                                        <div className="text-green-700 font-semibold">RM {dept.cost.toLocaleString()}</div>
                                                        <div className="text-blue-700 font-semibold">RM {dept.revenue.toLocaleString()}</div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-amber-700">{dept.forecast}%</td>
                                                <td className="px-4 py-3 text-slate-700 text-sm">{dept.vendor}</td>
                                                <td className="px-4 py-3 font-semibold text-cyan-700">{dept.stockOrder}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DemandForecastSection;
