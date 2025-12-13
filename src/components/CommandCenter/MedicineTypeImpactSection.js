import React, { useState } from 'react';
import { Filter } from 'lucide-react';

const MedicineTypeImpactSection = ({ data, selectedTimePeriod = 'today' }) => {
    const { medicineTypeImpact, name } = data;
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [humanInputs, setHumanInputs] = useState({});

    const classifications = [
        { id: 'all', label: 'All', color: 'bg-slate-100 text-slate-700' },
        { id: 'life_saving', label: 'Life-saving', color: 'bg-red-100 text-red-700' },
        { id: 'fast_moving', label: 'Fast-moving', color: 'bg-orange-100 text-orange-700' },
        { id: 'new_expiry', label: 'New Expiry', color: 'bg-purple-100 text-purple-700' },
        { id: 'under_stock', label: 'Under stock', color: 'bg-yellow-100 text-yellow-700' }
    ];

    const filteredImpact = selectedFilter === 'all'
        ? medicineTypeImpact
        : medicineTypeImpact.filter(item => item.classification === selectedFilter);

    const getOTIFColor = (otif) => {
        if (otif >= 95) return 'text-green-700 bg-green-50';
        if (otif >= 85) return 'text-yellow-700 bg-yellow-50';
        return 'text-red-700 bg-red-50';
    };

    const handleHumanInputChange = (itemType, value) => {
        setHumanInputs(prev => ({
            ...prev,
            [itemType]: value
        }));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            < h2 className="text-2xl font-bold text-slate-800 mb-2" >
                Medicine Type Impacting {name.toUpperCase()}
            </h2 >

            {/* Classification Filters */}
            < div className="mb-6 flex flex-wrap items-center gap-3" >
                <Filter size={18} className="text-slate-600" />
                {
                    classifications.map((classification) => (
                        <button
                            key={classification.id}
                            onClick={() => setSelectedFilter(classification.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFilter === classification.id
                                ? 'ring-2 ring-blue-500 ' + classification.color
                                : classification.color + ' opacity-60 hover:opacity-100'
                                }`}
                        >
                            {classification.label}
                        </button>
                    ))
                }
            </div >

            {/* Medicine Type Impact Table */}
            < div className="overflow-x-auto" >
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-100 border-b border-slate-300">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                Medicine Type
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                Medicine Count
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                Location
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                OTIF
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                Action (Agent)
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                Human In The Loop
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredImpact.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                <td className="px-4 py-3">
                                    <span className="font-medium text-slate-800">{item.type}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="font-semibold text-blue-700">{item.count}</span>
                                </td>
                                <td className="px-4 py-3 text-slate-700">{item.location}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-3 py-1 rounded-lg font-semibold ${getOTIFColor(item.otif)}`}>
                                        {item.otif}%
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value={item.action}>{item.action}</option>
                                        <option value="Assign">Assign</option>
                                        <option value="Increase Safety Stock">Increase Safety Stock</option>
                                        <option value="Monitor">Monitor</option>
                                        <option value="Reorder">Reorder</option>
                                        <option value="Review">Review</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <input
                                        type="text"
                                        value={humanInputs[item.type] || ''}
                                        onChange={(e) => handleHumanInputChange(item.type, e.target.value)}
                                        placeholder="Enter reason for low OTIF..."
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >

            {/* Summary */}
            < div className="mt-4 text-sm text-slate-600" >
                Showing {filteredImpact.length} of {medicineTypeImpact.length} medicine types
            </div >
        </div >
    );
};

export default MedicineTypeImpactSection;
