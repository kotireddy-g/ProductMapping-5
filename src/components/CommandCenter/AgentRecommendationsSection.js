import React from 'react';
import { Brain, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const AgentRecommendationsSection = ({ data }) => {
    const { agentRecommendations, name } = data;

    const getPriorityColor = (priority) => {
        switch (priority) {
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

    const getStatusIcon = (status) => {
        if (status === 'Expected') return <AlertCircle size={16} className="text-orange-600" />;
        if (status === 'Critical') return <XCircle size={16} className="text-red-600" />;
        return <CheckCircle size={16} className="text-green-600" />;
    };

    // Get critical medicines (first 2 recommendations)
    const criticalMedicines = agentRecommendations.slice(0, 2);
    const otherRecommendations = agentRecommendations.slice(2);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Brain size={28} className="text-blue-600" />
                SECTION V: Agent Recommendation For {name.toUpperCase()}: TOP 10 TODAY
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Critical Medicine Panel */}
                <div className="bg-red-50 rounded-lg p-5 border-2 border-red-300">
                    <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                        <AlertCircle size={20} />
                        CRITICAL MEDICINE
                    </h3>

                    <div className="space-y-3">
                        {criticalMedicines.map((rec) => (
                            <div
                                key={rec.id}
                                className="bg-white rounded-lg p-3 border-2 border-red-400"
                            >
                                <div className="font-bold text-red-900 text-lg mb-2">{rec.medicine}</div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600">Status:</span>
                                        <span className="font-medium text-red-700">{rec.status}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600">Stock:</span>
                                        {rec.stockAvailable ? (
                                            <CheckCircle size={16} className="text-green-600" />
                                        ) : (
                                            <XCircle size={16} className="text-red-600" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600">Action:</span>
                                        {rec.actionAvailable ? (
                                            <CheckCircle size={16} className="text-green-600" />
                                        ) : (
                                            <XCircle size={16} className="text-red-600" />
                                        )}
                                    </div>
                                </div>
                                <button className="w-full mt-3 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                                    {rec.action}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Additional medicine codes */}
                    <div className="mt-4 space-y-2">
                        {otherRecommendations.slice(0, 3).map((rec) => (
                            <div
                                key={rec.id}
                                className="px-3 py-2 bg-white rounded-full border border-red-300 text-center text-sm font-medium text-red-800"
                            >
                                {rec.medicine}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations Table */}
                <div className="lg:col-span-3">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-100 border-b border-slate-300">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        #
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        Medicine
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                        Stock Available
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                        Action Available
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        Priority
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {agentRecommendations.map((rec, index) => (
                                    <tr
                                        key={rec.id}
                                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 font-semibold text-slate-600">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-slate-800">{rec.medicine}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(rec.status)}
                                                <span className="text-sm text-slate-700">{rec.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {rec.stockAvailable ? (
                                                <CheckCircle size={20} className="text-green-600 inline-block" />
                                            ) : (
                                                <XCircle size={20} className="text-red-600 inline-block" />
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {rec.actionAvailable ? (
                                                <CheckCircle size={20} className="text-green-600 inline-block" />
                                            ) : (
                                                <XCircle size={20} className="text-red-600 inline-block" />
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(rec.priority)}`}>
                                                {rec.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${rec.priority === 'High'
                                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                                    : rec.priority === 'Medium'
                                                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                                                        : 'bg-green-600 text-white hover:bg-green-700'
                                                }`}>
                                                {rec.action}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentRecommendationsSection;
