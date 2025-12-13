import React from 'react';
import { Brain, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const AgentRecommendationsSection = ({ data, selectedTimePeriod = 'today' }) => {
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

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Brain size={28} className="text-blue-600" />
                Agent Recommendation For {name.toUpperCase()}: TOP 10 TODAY
            </h2>

            {/* Center-aligned Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-100 border-b border-slate-300">
                            <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                #
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                Medicine
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                Status
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                Stock Available
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                Expected Demand
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                Action Available
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                Priority
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
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
                                <td className="px-4 py-3 text-center font-semibold text-slate-600">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className="font-medium text-slate-800">{rec.medicine}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
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
                                    <span className="font-semibold text-blue-700">
                                        {rec.expectedDemand || Math.floor(Math.random() * 200) + 50}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {rec.actionAvailable ? (
                                        <CheckCircle size={20} className="text-green-600 inline-block" />
                                    ) : (
                                        <XCircle size={20} className="text-red-600 inline-block" />
                                    )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(rec.priority)}`}>
                                        {rec.priority}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
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
    );
};

export default AgentRecommendationsSection;
