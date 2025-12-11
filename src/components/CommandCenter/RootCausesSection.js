import React, { useState } from 'react';
import { AlertCircle, ChevronUp, ChevronDown, X } from 'lucide-react';

const RootCausesSection = ({ data }) => {
    const { rootCauses } = data;
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [showMedicinesModal, setShowMedicinesModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState(null);

    // Sample medicines data for the popup
    const medicinesByReason = {
        'STOCKOUTS': [
            { id: 1, name: 'Paracetamol 500mg', category: 'Life-saving', stock: 0, demand: 150 },
            { id: 2, name: 'Insulin Glargine', category: 'Life-saving', stock: 0, demand: 80 },
            { id: 3, name: 'Morphine Sulfate', category: 'Life-saving', stock: 0, demand: 45 },
            { id: 4, name: 'Epinephrine', category: 'Life-saving', stock: 0, demand: 60 },
            { id: 5, name: 'Norepinephrine', category: 'Life-saving', stock: 0, demand: 35 }
        ],
        'PROCESS DELAY': [
            { id: 1, name: 'Amoxicillin 250mg', category: 'Fast-moving', stock: 50, demand: 200 },
            { id: 2, name: 'Ciprofloxacin', category: 'Fast-moving', stock: 30, demand: 120 },
            { id: 3, name: 'Metformin', category: 'Fast-moving', stock: 45, demand: 180 }
        ],
        'Restricted': [
            { id: 1, name: 'Fentanyl', category: 'Critical', stock: 20, demand: 80 },
            { id: 2, name: 'Midazolam', category: 'Critical', stock: 15, demand: 75 }
        ],
        'Expired': [
            { id: 1, name: 'Aspirin 75mg', category: 'General', stock: 100, demand: 100 },
            { id: 2, name: 'Vitamin D3', category: 'General', stock: 80, demand: 100 }
        ],
        'Under stock': [
            { id: 1, name: 'Propofol', category: 'Surgical', stock: 25, demand: 120 },
            { id: 2, name: 'Rocuronium', category: 'Surgical', stock: 18, demand: 95 },
            { id: 3, name: 'Sevoflurane', category: 'Surgical', stock: 12, demand: 85 }
        ],
        'Black sheet': [
            { id: 1, name: 'Warfarin', category: 'Restricted', stock: 15, demand: 50 },
            { id: 2, name: 'Heparin', category: 'Restricted', stock: 20, demand: 40 }
        ]
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedCauses = [...rootCauses].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return sortConfig.direction === 'asc'
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
    });

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'medium':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'low':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-300';
        }
    };

    const handleMedicineCountClick = (reason) => {
        setSelectedReason(reason);
        setShowMedicinesModal(true);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Root Causes Analysis
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-100 border-b border-slate-300">
                            <th
                                className="px-4 py-3 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-200"
                                onClick={() => handleSort('reason')}
                            >
                                <div className="flex items-center gap-2">
                                    Reason
                                    {sortConfig.key === 'reason' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                                    )}
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                Medicine Count
                            </th>
                            <th
                                className="px-4 py-3 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-200"
                                onClick={() => handleSort('demand')}
                            >
                                <div className="flex items-center gap-2">
                                    Demand
                                    {sortConfig.key === 'demand' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                                    )}
                                </div>
                            </th>
                            <th
                                className="px-4 py-3 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-200"
                                onClick={() => handleSort('supplied')}
                            >
                                <div className="flex items-center gap-2">
                                    Supplied
                                    {sortConfig.key === 'supplied' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                                    )}
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                Stock Status / TIME
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCauses.map((cause) => {
                            const medicineCount = medicinesByReason[cause.reason]?.length || 0;

                            return (
                                <tr
                                    key={cause.id}
                                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <span className="font-medium text-slate-800">{cause.reason}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleMedicineCountClick(cause.reason)}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                                        >
                                            {medicineCount}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-blue-700">{cause.demand}</td>
                                    <td className="px-4 py-3 font-semibold text-green-700">{cause.supplied}</td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <div className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(cause.severity)}`}>
                                                {cause.stockStatus}
                                            </div>
                                            <div className="text-xs text-slate-600 mt-1">{cause.time}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                            {cause.action}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}\n          </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600" />
                    <span>{rootCauses.filter(c => c.severity === 'high').length} High Priority Issues</span>
                </div>
                <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-orange-600" />
                    <span>{rootCauses.filter(c => c.severity === 'medium').length} Medium Priority Issues</span>
                </div>
            </div>

            {/* Medicines Modal */}
            {showMedicinesModal && selectedReason && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
                            <h3 className="text-2xl font-bold text-slate-800">
                                Medicines - {selectedReason}
                            </h3>
                            <button
                                onClick={() => setShowMedicinesModal(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <div className="p-6">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-100 border-b border-slate-300">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">#</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Medicine Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Category</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Current Stock</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Demand</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Shortage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicinesByReason[selectedReason]?.map((medicine, index) => (
                                        <tr key={medicine.id} className="border-b border-slate-200 hover:bg-slate-50">
                                            <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                                            <td className="px-4 py-3 font-medium text-slate-800">{medicine.name}</td>
                                            <td className="px-4 py-3 text-slate-700">{medicine.category}</td>
                                            <td className="px-4 py-3 font-semibold text-blue-700">{medicine.stock}</td>
                                            <td className="px-4 py-3 font-semibold text-orange-700">{medicine.demand}</td>
                                            <td className="px-4 py-3 font-semibold text-red-700">
                                                {medicine.demand - medicine.stock}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RootCausesSection;
