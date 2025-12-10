import React, { useState } from 'react';
import { AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';

const RootCausesSection = ({ data }) => {
    const { rootCauses } = data;
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                SECTION II: Root Causes Analysis
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
                            <th
                                className="px-4 py-3 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-200"
                                onClick={() => handleSort('medicineType')}
                            >
                                <div className="flex items-center gap-2">
                                    Medicine Type
                                    {sortConfig.key === 'medicineType' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                                    )}
                                </div>
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
                        {sortedCauses.map((cause) => (
                            <tr
                                key={cause.id}
                                className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-slate-800">{cause.reason}</span>
                                        {cause.tag && (
                                            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                                                {cause.tag}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-700">{cause.medicineType}</td>
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
                        ))}
                    </tbody>
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
        </div>
    );
};

export default RootCausesSection;
