import React, { useState } from 'react';
import { Brain, CheckCircle, X } from 'lucide-react';

const AgentRecommendationsSection = ({ data }) => {
    const { agentRecommendations, name } = data;
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Show toast notification
    const showToastNotification = (title) => {
        setToastMessage(`✓ ${title} - Action initiated`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const getPriorityColor = (priority) => {
        const priorityLower = priority?.toLowerCase();
        switch (priorityLower) {
            case 'critical':
                return 'bg-red-100 border-red-400 text-red-800';
            case 'high':
                return 'bg-orange-100 border-orange-400 text-orange-800';
            case 'medium':
                return 'bg-yellow-100 border-yellow-400 text-yellow-800';
            default:
                return 'bg-gray-100 border-gray-400 text-gray-800';
        }
    };

    const getImpactColor = (impact) => {
        const impactLower = impact?.toLowerCase();
        switch (impactLower) {
            case 'high':
                return 'text-red-700';
            case 'medium':
                return 'text-orange-700';
            case 'low':
                return 'text-green-700';
            default:
                return 'text-gray-700';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Brain size={28} className="text-blue-600" />
                Agent Recommendations For {name?.toUpperCase() || 'DEPARTMENT'}
            </h2>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agentRecommendations?.map((rec) => (
                    <div
                        key={rec.id}
                        className="border-2 border-slate-200 rounded-lg p-4 hover:shadow-lg transition-all hover:border-blue-300"
                    >
                        {/* Priority and Impact Badges */}
                        <div className="flex items-center justify-between mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(rec.priority)}`}>
                                {rec.priority?.toUpperCase()}
                            </span>
                            <span className={`text-xs font-semibold ${getImpactColor(rec.impact)}`}>
                                Impact: {rec.impact}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                            {rec.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                            {rec.description}
                        </p>

                        {/* Affected Categories */}
                        {rec.affected_categories && rec.affected_categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {rec.affected_categories.map((cat, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                                    >
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="bg-green-50 p-2 rounded text-center">
                                <div className="font-bold text-green-700 text-sm">
                                    {rec.estimated_improvement}
                                </div>
                                <div className="text-xs text-slate-600">Improvement</div>
                            </div>
                            <div className="bg-blue-50 p-2 rounded text-center">
                                <div className="font-bold text-blue-700 text-sm">
                                    {rec.implementation_time}
                                </div>
                                <div className="text-xs text-slate-600">Timeline</div>
                            </div>
                            <div className="bg-purple-50 p-2 rounded text-center">
                                <div className="font-bold text-purple-700 text-sm">
                                    {rec.cost_impact}
                                </div>
                                <div className="text-xs text-slate-600">Cost</div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => showToastNotification(rec.title)}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Implement Recommendation
                        </button>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {(!agentRecommendations || agentRecommendations.length === 0) && (
                <div className="text-center py-12 text-slate-500">
                    <Brain size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No recommendations available at this time.</p>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
                    <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]">
                        <CheckCircle className="w-6 h-6 flex-shrink-0" />
                        <p className="font-medium">{toastMessage}</p>
                        <button
                            onClick={() => setShowToast(false)}
                            className="ml-auto p-1 hover:bg-green-700 rounded transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentRecommendationsSection;
