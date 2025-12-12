import React, { useState } from 'react';
import { X } from 'lucide-react';
import { rcaData, getPriorityColor } from '../../data/rcaData';

const RootCausesSection = ({ data }) => {
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Handle clicking on Why, Demand, or Supplied cells
    const handleDetailClick = (item, columnType) => {
        setSelectedDetail({ item, columnType });
        setShowDetailModal(true);
    };

    // Handle clicking on Preventive Recommendations
    const handlePreventiveClick = (item) => {
        alert(`Alert sent to Purchase Team:\n\nAction: ${item.preventiveRecommendations}\nPriority: ${item.priority.toUpperCase()}\n\nThe purchase team has been notified to take action.`);
    };

    // Handle clicking on Actions
    const handleActionClick = (item) => {
        alert(`Alert sent to Pharma Team:\n\nAction: ${item.actions}\nPriority: ${item.priority.toUpperCase()}\n\nThe pharmacy team has been notified to prioritize based on ${item.priority} priority level.`);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Root Causes Analysis
            </h2>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-100 border-b border-slate-300">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Reason</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Why</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Medicine Type</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Demand</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Supplied</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Forecast</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Preventive Recommendations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rcaData.map((item) => {
                            const colors = getPriorityColor(item.priority);
                            return (
                                <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-800">{item.reason}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDetailClick(item, 'why')}
                                            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                        >
                                            {item.why}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-slate-700">{item.medicineType}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDetailClick(item, 'demand')}
                                            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-semibold"
                                        >
                                            {item.demand}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDetailClick(item, 'supplied')}
                                            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-semibold"
                                        >
                                            {item.supplied}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-900">{item.forecast}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleActionClick(item)}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.badge} hover:opacity-80 transition-opacity`}
                                        >
                                            {item.actions}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handlePreventiveClick(item)}
                                            className="text-green-600 hover:text-green-800 hover:underline cursor-pointer text-xs"
                                        >
                                            {item.preventiveRecommendations}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="mt-4 flex items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>{rcaData.filter(item => item.priority === 'critical' || item.priority === 'urgent').length} High Priority Issues</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>{rcaData.filter(item => item.priority === 'normal').length} Medium Priority Issues</span>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedDetail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {selectedDetail.columnType === 'why' && 'Why - Detailed Breakdown'}
                                    {selectedDetail.columnType === 'demand' && 'Demand - Detailed Breakdown'}
                                    {selectedDetail.columnType === 'supplied' && 'Supplied - Detailed Breakdown'}
                                </h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    Reason: {selectedDetail.item.reason}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-160px)]">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-100 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700">ICU Type</th>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Bed No</th>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Patient Type/Status</th>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Medicine Ordered</th>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Forecast</th>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Label</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedDetail.item.details.map((detail, index) => (
                                            <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="px-4 py-3 font-medium text-slate-900">{detail.icuType}</td>
                                                <td className="px-4 py-3 text-slate-700">{detail.bedNo}</td>
                                                <td className="px-4 py-3 text-slate-700">{detail.patientStatus}</td>
                                                <td className="px-4 py-3 text-slate-900">{detail.medicineOrdered}</td>
                                                <td className="px-4 py-3 font-semibold text-blue-600">{detail.forecast}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${detail.label.includes('Critical') || detail.label.includes('High')
                                                            ? 'bg-red-100 text-red-700'
                                                            : detail.label.includes('Medium')
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-slate-100 text-slate-700'
                                                        }`}>
                                                        {detail.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary in Modal */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
                                <div className="text-sm text-blue-800">
                                    <p><strong>Total Records:</strong> {selectedDetail.item.details.length}</p>
                                    <p><strong>Total Forecast:</strong> {selectedDetail.item.details.reduce((sum, d) => sum + d.forecast, 0)} units</p>
                                    <p><strong>Priority Distribution:</strong> {
                                        selectedDetail.item.details.filter(d => d.label.includes('High') || d.label.includes('Critical')).length
                                    } High, {
                                            selectedDetail.item.details.filter(d => d.label.includes('Medium')).length
                                        } Medium, {
                                            selectedDetail.item.details.filter(d => d.label.includes('Low')).length
                                        } Low</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RootCausesSection;
