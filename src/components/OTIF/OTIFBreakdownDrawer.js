import React from 'react';
import { X, Package, Clock, CheckCircle, Info, TrendingUp } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';
import VennDiagram from '../common/VennDiagram';

const OTIFBreakdownDrawer = ({ isOpen, onClose, breakdownData }) => {
    if (!isOpen || !breakdownData) return null;

    const {
        totalOrders,
        onTimeOrders,
        inFullOrders,
        otifOrders,
        otifWithinOTPct,
        otifWithinIFPct
    } = breakdownData;

    // Calculate percentages
    const otifPct = (otifOrders / totalOrders) * 100;
    const otPct = (onTimeOrders / totalOrders) * 100;
    const ifPct = (inFullOrders / totalOrders) * 100;

    // Calculate gaps
    const onTimeButNotInFull = onTimeOrders - otifOrders;
    const inFullButNotOnTime = inFullOrders - otifOrders;
    const neitherOnTimeNorInFull = totalOrders - onTimeOrders - inFullOrders + otifOrders;

    // Calculate percentages for detailed analysis
    const otifWithinOTOrders = Math.round((otifWithinOTPct / 100) * onTimeOrders);
    const notInFullWithinOT = onTimeOrders - otifWithinOTOrders;
    const otifWithinIFOrders = Math.round((otifWithinIFPct / 100) * inFullOrders);
    const notOnTimeWithinIF = inFullOrders - otifWithinIFOrders;

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
                className={`fixed top-0 right-0 h-full w-[500px] bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b-2 border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-slate-800">Understanding OTIF Metrics</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-slate-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Section 1: Overall Performance */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Package size={20} className="text-blue-600" />
                            <h3 className="text-lg font-bold text-slate-800">OVERALL PERFORMANCE</h3>
                        </div>
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700">OTIF:</span>
                                <span className="text-2xl font-bold text-amber-600">{otifPct.toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700">On-Time (OT):</span>
                                <span className="text-xl font-bold text-green-600">{otPct.toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700">In-Full (IF):</span>
                                <span className="text-xl font-bold text-green-600">{ifPct.toFixed(1)}%</span>
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
                                    color="green"
                                    showPercentage={true}
                                    description="Both on-time AND in-full"
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
                                    color="blue"
                                    showPercentage={true}
                                    description="Delivered by promised date"
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
                                    color="purple"
                                    showPercentage={true}
                                    description="Complete quantity delivered"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Venn Diagram */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Info size={20} className="text-blue-600" />
                            <h3 className="text-lg font-bold text-slate-800">VISUAL BREAKDOWN</h3>
                        </div>
                        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                            <VennDiagram
                                totalOrders={totalOrders}
                                onTimeOrders={onTimeOrders}
                                inFullOrders={inFullOrders}
                                otifOrders={otifOrders}
                            />
                        </div>
                    </div>

                    {/* Section 4: Detailed Analysis */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={20} className="text-blue-600" />
                            <h3 className="text-lg font-bold text-slate-800">DETAILED ANALYSIS</h3>
                        </div>
                        <div className="bg-white border-2 border-slate-200 rounded-xl p-4 space-y-4">
                            {/* Of the On-Time orders */}
                            <div>
                                <p className="text-sm font-bold text-slate-700 mb-3">
                                    Of the On-Time orders ({onTimeOrders.toLocaleString()}):
                                </p>
                                <div className="space-y-3 ml-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-green-600 font-bold">✓</span>
                                            <span className="text-sm text-slate-700">
                                                {otifWithinOTPct.toFixed(1)}% were also In-Full ({otifOrders.toLocaleString()})
                                            </span>
                                        </div>
                                        <ProgressBar
                                            value={otifWithinOTPct}
                                            color="green"
                                            showPercentage={false}
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-amber-600 font-bold">✗</span>
                                            <span className="text-sm text-slate-700">
                                                {(100 - otifWithinOTPct).toFixed(1)}% were NOT In-Full ({onTimeButNotInFull.toLocaleString()})
                                            </span>
                                        </div>
                                        <ProgressBar
                                            value={100 - otifWithinOTPct}
                                            color="amber"
                                            showPercentage={false}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-4">
                                <p className="text-sm font-bold text-slate-700 mb-3">
                                    Of the In-Full orders ({inFullOrders.toLocaleString()}):
                                </p>
                                <div className="space-y-3 ml-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-green-600 font-bold">✓</span>
                                            <span className="text-sm text-slate-700">
                                                {otifWithinIFPct.toFixed(1)}% were also On-Time ({otifOrders.toLocaleString()})
                                            </span>
                                        </div>
                                        <ProgressBar
                                            value={otifWithinIFPct}
                                            color="green"
                                            showPercentage={false}
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-amber-600 font-bold">✗</span>
                                            <span className="text-sm text-slate-700">
                                                {(100 - otifWithinIFPct).toFixed(1)}% were NOT On-Time ({inFullButNotOnTime.toLocaleString()})
                                            </span>
                                        </div>
                                        <ProgressBar
                                            value={100 - otifWithinIFPct}
                                            color="amber"
                                            showPercentage={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: What This Means */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Info size={20} className="text-blue-600" />
                            <h3 className="text-lg font-bold text-slate-800">WHAT THIS MEANS</h3>
                        </div>
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 space-y-3">
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5">●</span>
                                    <p className="text-sm text-slate-700">
                                        <span className="font-bold">OTIF</span> = Perfect orders (both On-Time AND In-Full)
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">●</span>
                                    <p className="text-sm text-slate-700">
                                        <span className="font-bold">OT</span> = Delivered on or before promised date
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-purple-600 mt-0.5">●</span>
                                    <p className="text-sm text-slate-700">
                                        <span className="font-bold">IF</span> = Complete quantity received
                                    </p>
                                </div>
                            </div>

                            <div className="border-t-2 border-yellow-300 pt-3">
                                <p className="text-sm font-bold text-slate-800 mb-2">Gap Analysis:</p>
                                <div className="space-y-1.5 ml-4">
                                    <div className="flex items-start gap-2">
                                        <span className="text-amber-600 mt-0.5">⚠</span>
                                        <p className="text-sm text-slate-700">
                                            <span className="font-bold">{onTimeButNotInFull.toLocaleString()} orders:</span> On-time but incomplete
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-amber-600 mt-0.5">⚠</span>
                                        <p className="text-sm text-slate-700">
                                            <span className="font-bold">{inFullButNotOnTime.toLocaleString()} orders:</span> Complete but late
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-red-600 mt-0.5">⚠</span>
                                        <p className="text-sm text-slate-700">
                                            <span className="font-bold">{neitherOnTimeNorInFull.toLocaleString()} orders:</span> Both late and incomplete
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OTIFBreakdownDrawer;
