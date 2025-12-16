import React from 'react';

const VennDiagram = ({ totalOrders, onTimeOrders, inFullOrders, otifOrders }) => {
    // Calculate percentages for display
    const otifPct = ((otifOrders / totalOrders) * 100).toFixed(1);
    const otPct = ((onTimeOrders / totalOrders) * 100).toFixed(1);
    const ifPct = ((inFullOrders / totalOrders) * 100).toFixed(1);

    // Calculate gaps
    const onlyOT = onTimeOrders - otifOrders;
    const onlyIF = inFullOrders - otifOrders;

    return (
        <div className="w-full flex flex-col items-center py-6">
            <svg width="400" height="280" viewBox="0 0 400 280" className="max-w-full">
                {/* Definitions for gradients and patterns */}
                <defs>
                    {/* Blue gradient for On-Time */}
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.5" />
                    </linearGradient>

                    {/* Purple gradient for In-Full */}
                    <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5" />
                    </linearGradient>

                    {/* Green gradient for OTIF overlap */}
                    <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.6" />
                    </linearGradient>
                </defs>

                {/* On-Time Circle (Left) */}
                <circle
                    cx="150"
                    cy="140"
                    r="90"
                    fill="url(#blueGradient)"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    opacity="0.8"
                />

                {/* In-Full Circle (Right) */}
                <circle
                    cx="250"
                    cy="140"
                    r="90"
                    fill="url(#purpleGradient)"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    opacity="0.8"
                />

                {/* OTIF Overlap (Center) - Visual representation */}
                <ellipse
                    cx="200"
                    cy="140"
                    rx="60"
                    ry="80"
                    fill="url(#greenGradient)"
                    stroke="#10B981"
                    strokeWidth="2"
                    opacity="0.9"
                />

                {/* Labels */}
                {/* On-Time Label (Left side) */}
                <text x="110" y="100" textAnchor="middle" className="fill-blue-700 font-bold text-sm">
                    On-Time
                </text>
                <text x="110" y="120" textAnchor="middle" className="fill-blue-600 font-semibold text-xs">
                    {onTimeOrders.toLocaleString()}
                </text>
                <text x="110" y="135" textAnchor="middle" className="fill-blue-600 text-xs">
                    ({otPct}%)
                </text>

                {/* In-Full Label (Right side) */}
                <text x="290" y="100" textAnchor="middle" className="fill-purple-700 font-bold text-sm">
                    In-Full
                </text>
                <text x="290" y="120" textAnchor="middle" className="fill-purple-600 font-semibold text-xs">
                    {inFullOrders.toLocaleString()}
                </text>
                <text x="290" y="135" textAnchor="middle" className="fill-purple-600 text-xs">
                    ({ifPct}%)
                </text>

                {/* OTIF Label (Center overlap) */}
                <text x="200" y="130" textAnchor="middle" className="fill-green-800 font-bold text-base">
                    OTIF
                </text>
                <text x="200" y="148" textAnchor="middle" className="fill-green-700 font-bold text-sm">
                    {otifOrders.toLocaleString()}
                </text>
                <text x="200" y="163" textAnchor="middle" className="fill-green-700 font-semibold text-xs">
                    ({otifPct}%)
                </text>

                {/* Legend at bottom */}
                <g transform="translate(50, 240)">
                    {/* On-Time only */}
                    <rect x="0" y="0" width="12" height="12" fill="#3B82F6" opacity="0.5" rx="2" />
                    <text x="18" y="10" className="fill-slate-700 text-xs">
                        Only On-Time: {onlyOT.toLocaleString()}
                    </text>

                    {/* OTIF */}
                    <rect x="130" y="0" width="12" height="12" fill="#10B981" opacity="0.6" rx="2" />
                    <text x="148" y="10" className="fill-slate-700 text-xs">
                        Perfect (OTIF): {otifOrders.toLocaleString()}
                    </text>

                    {/* In-Full only */}
                    <rect x="270" y="0" width="12" height="12" fill="#8B5CF6" opacity="0.5" rx="2" />
                    <text x="288" y="10" className="fill-slate-700 text-xs">
                        Only In-Full: {onlyIF.toLocaleString()}
                    </text>
                </g>
            </svg>

            {/* Text explanation below */}
            <div className="mt-4 text-center text-sm text-slate-600 max-w-md">
                <p className="font-semibold text-slate-700 mb-1">Visual Overlap</p>
                <p className="text-xs">
                    The green center shows orders that are both On-Time AND In-Full (Perfect/OTIF).
                    Blue shows orders that are only On-Time. Purple shows orders that are only In-Full.
                </p>
            </div>
        </div>
    );
};

export default VennDiagram;
