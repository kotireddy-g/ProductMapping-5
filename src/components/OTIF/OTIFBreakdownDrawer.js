import React, { useState } from 'react';
import { X, Package, Clock, CheckCircle, Info, TrendingUp, AlertTriangle, AlertCircle, FileText } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import VennDiagram from '../common/VennDiagram';

const OTIFBreakdownDrawer = ({ isOpen, onClose, breakdownData }) => {
    const [activeTab, setActiveTab] = useState('breakdown');

    if (!isOpen || !breakdownData) return null;

    const {
        totalOrders = 0,
        onTimeOrders = 0,
        inFullOrders = 0,
        otifOrders = 0,
        otifWithinOTPct = 0,
        otifWithinIFPct = 0,
        otifGapRca
    } = breakdownData;

    // Calculate percentages with safe defaults
    const otifPct = totalOrders > 0 ? (otifOrders / totalOrders) * 100 : 0;
    const otPct = totalOrders > 0 ? (onTimeOrders / totalOrders) * 100 : 0;
    const ifPct = totalOrders > 0 ? (inFullOrders / totalOrders) * 100 : 0;

    // Calculate gaps
    const onTimeButNotInFull = onTimeOrders - otifOrders;
    const inFullButNotOnTime = inFullOrders - otifOrders;
    const neitherOnTimeNorInFull = totalOrders - onTimeOrders - inFullOrders + otifOrders;

    // Calculate percentages for detailed analysis
    const otifWithinOTOrders = onTimeOrders > 0 ? Math.round((otifWithinOTPct / 100) * onTimeOrders) : 0;
    const notInFullWithinOT = onTimeOrders - otifWithinOTOrders;
    const otifWithinIFOrders = inFullOrders > 0 ? Math.round((otifWithinIFPct / 100) * inFullOrders) : 0;
    const notOnTimeWithinIF = inFullOrders - otifWithinIFOrders;

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'bg-red-100 text-red-800 border-red-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'low': return 'bg-green-100 text-green-800 border-green-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'high': return <AlertCircle className="w-4 h-4" />;
            case 'medium': return <AlertTriangle className="w-4 h-4" />;
            default: return <Info className="w-4 h-4" />;
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[550px] bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b-2 border-slate-200 z-10">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800">Understanding OTIF Metrics</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-slate-600" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 px-6">
                        <button
                            onClick={() => setActiveTab('breakdown')}
                            className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'breakdown'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-600 hover:text-slate-800'
                                }`}
                        >
                            OTIF Breakdown
                        </button>
                        <button
                            onClick={() => setActiveTab('rca')}
                            className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'rca'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-600 hover:text-slate-800'
                                }`}
                        >
                            OTIF Gap RCA
                            {otifGapRca && (
                                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                    {otifGapRca.gapPct}% Gap
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {activeTab === 'breakdown' ? (
                        <>
                            {/* Section 1: Overall Performance */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Package size={20} className="text-blue-600" />
                                    <h3 className="text-lg font-bold text-slate-800">OVERALL PERFORMANCE</h3>
                                </div>
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-700">OTIF:</span>
                                        <span className="text-2xl font-bold text-amber-600">{otifPct.toFixed(2)}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-700">On-Time (OT):</span>
                                        <span className="text-xl font-bold text-green-600">{otPct.toFixed(2)}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-700">In-Full (IF):</span>
                                        <span className="text-xl font-bold text-green-600">{ifPct.toFixed(2)}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Breakdown */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp size={20} className="text-blue-600" />
                                    <h3 className="text-lg font-bold text-slate-800">
                                        BREAKDOWN <span className="text-sm text-slate-600">(Total: {totalOrders.toLocaleString()} Orders)</span>
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {/* Perfect Orders (OTIF) */}
                                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CheckCircle size={18} className="text-green-600" />
                                            <span className="font-bold text-slate-800">Perfect Orders (OTIF)</span>
                                        </div>
                                        <ProgressBar
                                            value={otifPct}
                                            count={otifOrders}
                                            label="both on-time AND in-full"
                                            variant="success"
                                        />
                                    </div>

                                    {/* On-Time Orders */}
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Clock size={18} className="text-blue-600" />
                                            <span className="font-bold text-slate-800">On-Time Orders</span>
                                        </div>
                                        <ProgressBar
                                            value={otPct}
                                            count={onTimeOrders}
                                            label="delivered by promised date"
                                            variant="info"
                                        />
                                    </div>

                                    {/* In-Full Orders */}
                                    <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Package size={18} className="text-purple-600" />
                                            <span className="font-bold text-slate-800">In-Full Orders</span>
                                        </div>
                                        <ProgressBar
                                            value={ifPct}
                                            count={inFullOrders}
                                            label="complete quantity delivered"
                                            variant="secondary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Visual Overlap */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Info size={20} className="text-blue-600" />
                                    <h3 className="text-lg font-bold text-slate-800">VISUAL OVERLAP</h3>
                                </div>
                                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
                                    <VennDiagram
                                        otif={otifOrders}
                                        onTime={onTimeOrders}
                                        inFull={inFullOrders}
                                        total={totalOrders}
                                    />
                                </div>
                            </div>

                            {/* Section 4: Gap Analysis */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle size={20} className="text-amber-600" />
                                    <h3 className="text-lg font-bold text-slate-800">GAP ANALYSIS</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-slate-700">On-Time but NOT In-Full</span>
                                            <span className="text-lg font-bold text-amber-700">{onTimeButNotInFull}</span>
                                        </div>
                                        <p className="text-xs text-slate-600">Delivered on time but quantity was short</p>
                                    </div>

                                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-slate-700">In-Full but NOT On-Time</span>
                                            <span className="text-lg font-bold text-amber-700">{inFullButNotOnTime}</span>
                                        </div>
                                        <p className="text-xs text-slate-600">Complete quantity but delivered late</p>
                                    </div>

                                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-slate-700">Neither On-Time NOR In-Full</span>
                                            <span className="text-lg font-bold text-red-700">{neitherOnTimeNorInFull}</span>
                                        </div>
                                        <p className="text-xs text-slate-600">Both late and incomplete delivery</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 5: Detailed Breakdown Analysis */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp size={20} className="text-blue-600" />
                                    <h3 className="text-lg font-bold text-slate-800">DETAILED BREAKDOWN ANALYSIS</h3>
                                </div>
                                <div className="space-y-4">
                                    {/* Within On-Time */}
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                                        <h4 className="font-bold text-slate-800 mb-3">Within On-Time Orders ({onTimeOrders})</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-700">✓ Also In-Full (OTIF)</span>
                                                <span className="font-bold text-green-600">{otifWithinOTOrders} ({otifWithinOTPct.toFixed(2)}%)</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-700">✗ Not In-Full</span>
                                                <span className="font-bold text-amber-600">{notInFullWithinOT} ({(100 - otifWithinOTPct).toFixed(2)}%)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Within In-Full */}
                                    <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                                        <h4 className="font-bold text-slate-800 mb-3">Within In-Full Orders ({inFullOrders})</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-700">✓ Also On-Time (OTIF)</span>
                                                <span className="font-bold text-green-600">{otifWithinIFOrders} ({otifWithinIFPct.toFixed(2)}%)</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-700">✗ Not On-Time</span>
                                                <span className="font-bold text-amber-600">{notOnTimeWithinIF} ({(100 - otifWithinIFPct).toFixed(2)}%)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* OTIF Gap RCA Tab */}
                            {otifGapRca && (
                                <>
                                    {/* Summary */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <FileText size={20} className="text-blue-600" />
                                            <h3 className="text-lg font-bold text-slate-800">GAP SUMMARY</h3>
                                        </div>
                                        <div className="bg-gradient-to-r from-red-50 to-amber-50 border-2 border-red-200 rounded-xl p-5">
                                            <div className="grid grid-cols-3 gap-4 mb-4">
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-green-600">{otifGapRca.otifPct}%</div>
                                                    <div className="text-xs text-slate-600 mt-1">OTIF Achieved</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-red-600">{otifGapRca.gapPct}%</div>
                                                    <div className="text-xs text-slate-600 mt-1">Gap</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-amber-600">{otifGapRca.gapOrders}</div>
                                                    <div className="text-xs text-slate-600 mt-1">Orders Missed</div>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-amber-200">
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    <span className="font-semibold text-amber-700">📊 {otifGapRca.narrative}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Segments Breakdown */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <TrendingUp size={20} className="text-blue-600" />
                                            <h3 className="text-lg font-bold text-slate-800">FAILURE SEGMENTS</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {/* On-Time but short supplied */}
                                            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <div className="font-bold text-slate-800 mb-1">
                                                            {otifGapRca.segments.onTimeNotInFull.label}
                                                        </div>
                                                        <div className="text-xs text-slate-600 mb-3">
                                                            {otifGapRca.segments.onTimeNotInFull.primaryCause}
                                                        </div>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <div className="text-2xl font-bold text-yellow-700">
                                                            {otifGapRca.segments.onTimeNotInFull.count}
                                                        </div>
                                                        <div className="text-xs text-slate-600">orders</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded font-semibold">
                                                        {otifGapRca.segments.onTimeNotInFull.percentageOfGap}% of gap
                                                    </span>
                                                    <span className="px-2 py-1 bg-white text-slate-700 rounded border border-yellow-300">
                                                        {otifGapRca.segments.onTimeNotInFull.shareOfTotalOrders}% of total
                                                    </span>
                                                </div>
                                            </div>

                                            {/* In-Full but delayed */}
                                            <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <div className="font-bold text-slate-800 mb-1">
                                                            {otifGapRca.segments.inFullNotOnTime.label}
                                                        </div>
                                                        <div className="text-xs text-slate-600 mb-3">
                                                            {otifGapRca.segments.inFullNotOnTime.primaryCause}
                                                        </div>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <div className="text-2xl font-bold text-orange-700">
                                                            {otifGapRca.segments.inFullNotOnTime.count}
                                                        </div>
                                                        <div className="text-xs text-slate-600">orders</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded font-semibold">
                                                        {otifGapRca.segments.inFullNotOnTime.percentageOfGap}% of gap
                                                    </span>
                                                    <span className="px-2 py-1 bg-white text-slate-700 rounded border border-orange-300">
                                                        {otifGapRca.segments.inFullNotOnTime.shareOfTotalOrders}% of total
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Delayed & short supply */}
                                            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <div className="font-bold text-slate-800 mb-1">
                                                            {otifGapRca.segments.delayedAndShort.label}
                                                        </div>
                                                        <div className="text-xs text-slate-600 mb-3">
                                                            {otifGapRca.segments.delayedAndShort.primaryCause}
                                                        </div>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <div className="text-2xl font-bold text-red-700">
                                                            {otifGapRca.segments.delayedAndShort.count}
                                                        </div>
                                                        <div className="text-xs text-slate-600">orders</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="px-2 py-1 bg-red-200 text-red-800 rounded font-semibold">
                                                        {otifGapRca.segments.delayedAndShort.percentageOfGap}% of gap
                                                    </span>
                                                    <span className="px-2 py-1 bg-white text-slate-700 rounded border border-red-300">
                                                        {otifGapRca.segments.delayedAndShort.shareOfTotalOrders}% of total
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Root Causes */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <AlertTriangle size={20} className="text-red-600" />
                                            <h3 className="text-lg font-bold text-slate-800">ROOT CAUSES & ACTIONS</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {otifGapRca.reasonCategories.map((reason, index) => (
                                                <div
                                                    key={reason.id}
                                                    className={`border-2 rounded-xl p-4 ${getSeverityColor(reason.severity)}`}
                                                >
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div className="flex-shrink-0 mt-0.5">
                                                            {getSeverityIcon(reason.severity)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex-1">
                                                                    <div className="font-bold text-slate-900 mb-1">
                                                                        {index + 1}. {reason.label}
                                                                    </div>
                                                                    <div className="text-xs text-slate-600 mb-2">
                                                                        Segment: {reason.segmentLabel}
                                                                    </div>
                                                                </div>
                                                                <div className="text-right ml-4">
                                                                    <div className="text-xl font-bold text-slate-900">
                                                                        {reason.count}
                                                                    </div>
                                                                    <div className="text-xs text-slate-600">
                                                                        {reason.percentageOfGap}%
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1 mb-3">
                                                                {reason.tags.map((tag) => (
                                                                    <span
                                                                        key={tag}
                                                                        className="px-2 py-0.5 bg-white bg-opacity-60 text-slate-700 rounded text-xs font-medium border border-slate-300"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${reason.severity === 'high'
                                                                    ? 'bg-red-200 text-red-900'
                                                                    : 'bg-yellow-200 text-yellow-900'
                                                                    }`}>
                                                                    {reason.severity}
                                                                </span>
                                                            </div>
                                                            <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-slate-300">
                                                                <div className="text-xs font-semibold text-slate-700 mb-1">
                                                                    💡 Recommended Action:
                                                                </div>
                                                                <div className="text-xs text-slate-800 leading-relaxed">
                                                                    {reason.comment}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default OTIFBreakdownDrawer;
