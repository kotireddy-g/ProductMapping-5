import React from 'react';
import { X } from 'lucide-react';
import SCORMetricCard from './SCORMetricCard';
import scorMetricsData, { itsmSCORMetricsData } from '../../data/scorMetricsData';

const RootCausesModal = ({ isOpen, onClose, metricType, isITSM = false }) => {
    if (!isOpen) return null;

    // Filter metrics based on type (and isITSM for ITSM-aware labels)
    const getRelevantMetrics = () => {
        const dataSource = isITSM ? itsmSCORMetricsData : scorMetricsData;
        const allMetrics = Object.values(dataSource);

        if (metricType === 'performance') {
            // Show 3 root causes for Performance Index: Plan/Intake, Source/Process, Make/Resolve
            return [
                allMetrics.find(m => m.stage === (isITSM ? 'Intake' : 'Plan')),
                allMetrics.find(m => m.stage === (isITSM ? 'Process' : 'Source')),
                allMetrics.find(m => m.stage === (isITSM ? 'Resolve' : 'Make'))
            ].filter(Boolean);
        } else if (metricType === 'otif') {
            // For OTIF (pharma-only), use standard SCOR metrics
            const pharmaMetrics = Object.values(scorMetricsData);
            return [
                pharmaMetrics.find(m => m.stage === 'Source'),
                pharmaMetrics.find(m => m.stage === 'Make'),
                pharmaMetrics.find(m => m.stage === 'Deliver'),
                pharmaMetrics.find(m => m.stage === 'Enable')
            ].filter(Boolean);
        }

        return allMetrics;
    };

    const metrics = getRelevantMetrics();

    const getTitle = () => {
        if (metricType === 'performance') {
            return isITSM
                ? 'Performance Index - Root Causes (3 DTIF Metrics)'
                : 'Performance Index - Root Causes (3 SCOR Metrics)';
        } else if (metricType === 'otif') {
            return 'OTIF - Root Causes (4 SCOR Metrics)';
        }
        return isITSM ? 'Root Causes (DTIF Framework)' : 'Root Causes (SCOR Framework)';
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="absolute inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="sticky top-0 bg-black px-6 py-5 z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{getTitle()}</h2>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {isITSM
                                            ? 'End-to-end ITSM metrics that impact overall team performance'
                                            : 'End-to-end supply chain metrics that impact overall performance'
                                        }
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <X size={24} className="text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {metrics.map((metric, index) => (
                                    <SCORMetricCard key={index} metric={metric} />
                                ))}
                            </div>

                            {/* Footer Info */}
                            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">How These Metrics Roll Up End-to-End</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-sm font-semibold text-green-600 mb-1">Growth</div>
                                        <div className="text-xs text-gray-600">
                                            {isITSM ? 'Ticket throughput / resolved per sprint' : 'Throughput / revenue per unit time'}
                                            <br />
                                            <span className="font-semibold">
                                                {isITSM ? 'Improves when Intake + Resolve stabilize' : 'Improves when Plan + Make stabilize'}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-blue-600 mb-1">Performance</div>
                                        <div className="text-xs text-gray-600">
                                            {isITSM ? 'Team DTIF (resolution SLA)' : 'Customer OTIF'}
                                            <br />
                                            <span className="font-semibold">
                                                {isITSM ? 'Driven by First Response OTIF + FCR' : 'Driven by Source OTIF + FPY + E2R'}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-red-600 mb-1">Efficiency</div>
                                        <div className="text-xs text-gray-600">
                                            {isITSM ? 'Resolution time, rework, recovery speed' : 'Lead times, rework, recovery speed'}
                                            <br />
                                            <span className="font-semibold">
                                                {isITSM ? 'FCR and response speed are the fastest levers' : 'FPY and E2R are the fastest levers'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RootCausesModal;
