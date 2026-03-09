import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

// ── Mock KPI data per action ──────────────────────────────────────────────────
const generate30DayData = (base, trend = 0.3, variance = 3) =>
    Array.from({ length: 24 }, (_, i) => ({
        date: `Feb ${i + 2}`,
        value: parseFloat((base + trend * i + (Math.random() - 0.5) * variance).toFixed(1)),
    }));

const KPI_SETS = {
    'SLA BREACH IMMINENT': [
        {
            name: 'DELIVERY PREDICTABILITY',
            current: 84.2,
            unit: '%',
            vsLastWeek: +3.1,
            color: '#3b82f6',
            data: generate30DayData(78, 0.28, 1.5),
            periodHigh: 84,
            periodLow: 72,
            dataPoints: 24,
            summary: 'Delivery Predictability has been consistently improving over the past period, showing a positive trajectory. This aligns well with the current sprint goals.',
        },
        {
            name: 'LEAD TIME',
            current: 6.4,
            unit: ' days',
            vsLastWeek: -0.8,
            color: '#8b5cf6',
            data: generate30DayData(7.2, -0.035, 0.4),
            periodHigh: 9,
            periodLow: 6.4,
            dataPoints: 24,
            summary: 'Lead Time has been decreasing over the past period, showing a positive trajectory that aligns with the current sprint goals.',
        },
        {
            name: 'FLOW EFFICIENCY',
            current: 61.7,
            unit: '%',
            vsLastWeek: +2.4,
            color: '#10b981',
            data: generate30DayData(52, 0.4, 2),
            periodHigh: 61.7,
            periodLow: 52,
            dataPoints: 24,
            summary: 'Flow Efficiency has been consistently improving over the past period, showing a positive trajectory aligned with sprint goals.',
        },
    ],
    'MTTA SPIKE': [
        {
            name: 'MEAN TIME TO ACKNOWLEDGE',
            current: 12.3,
            unit: ' min',
            vsLastWeek: +2.1,
            color: '#ef4444',
            data: generate30DayData(9, 0.14, 1.2),
            periodHigh: 14,
            periodLow: 8,
            dataPoints: 24,
            summary: 'MTTA has increased over the period indicating slower acknowledgment. Immediate action required to prevent SLA violations.',
        },
        {
            name: 'FIRST RESPONSE RATE',
            current: 78.5,
            unit: '%',
            vsLastWeek: -4.2,
            color: '#f59e0b',
            data: generate30DayData(85, -0.3, 2),
            periodHigh: 88,
            periodLow: 77,
            dataPoints: 24,
            summary: 'First Response Rate has dropped. Consider increasing on-call staffing during peak hours.',
        },
        {
            name: 'ESCALATION RATE',
            current: 18.4,
            unit: '%',
            vsLastWeek: +5.7,
            color: '#ef4444',
            data: generate30DayData(11, 0.31, 1.5),
            periodHigh: 20,
            periodLow: 10,
            dataPoints: 24,
            summary: 'Escalation rate is rising sharply. Root cause analysis should be triggered immediately.',
        },
    ],
    'BACKLOG BURNUP': [
        {
            name: 'BACKLOG VELOCITY',
            current: 43.2,
            unit: ' pts',
            vsLastWeek: +6.8,
            color: '#3b82f6',
            data: generate30DayData(30, 0.55, 3),
            periodHigh: 46,
            periodLow: 28,
            dataPoints: 24,
            summary: 'Backlog velocity is trending upward — the team is clearing more story points per sprint.',
        },
        {
            name: 'SPRINT COMPLETION',
            current: 91.5,
            unit: '%',
            vsLastWeek: +2.3,
            color: '#10b981',
            data: generate30DayData(82, 0.4, 2),
            periodHigh: 94,
            periodLow: 80,
            dataPoints: 24,
            summary: 'Sprint completion rate continues to improve, reflecting better estimation accuracy.',
        },
        {
            name: 'CARRY-OVER RATE',
            current: 8.5,
            unit: '%',
            vsLastWeek: -3.1,
            color: '#10b981',
            data: generate30DayData(15, -0.27, 1.5),
            periodHigh: 16,
            periodLow: 8,
            dataPoints: 24,
            summary: 'Carry-over rate has reduced significantly — fewer stories are spilling into the next sprint.',
        },
    ],
    'MTTR AT RISK': [
        {
            name: 'MEAN TIME TO RESOLVE',
            current: 4.7,
            unit: ' hrs',
            vsLastWeek: +0.9,
            color: '#ef4444',
            data: generate30DayData(3.5, 0.05, 0.3),
            periodHigh: 5.2,
            periodLow: 3.2,
            dataPoints: 24,
            summary: 'MTTR is creeping up — resolution bottlenecks need to be identified and cleared.',
        },
        {
            name: 'SLA COMPLIANCE',
            current: 87.3,
            unit: '%',
            vsLastWeek: -2.8,
            color: '#f59e0b',
            data: generate30DayData(92, -0.2, 1.5),
            periodHigh: 93,
            periodLow: 87,
            dataPoints: 24,
            summary: 'SLA compliance has dipped below the 90% threshold. Priority action required.',
        },
        {
            name: 'TICKET AGING INDEX',
            current: 22.4,
            unit: '%',
            vsLastWeek: +4.1,
            color: '#ef4444',
            data: generate30DayData(15, 0.31, 2),
            periodHigh: 25,
            periodLow: 14,
            dataPoints: 24,
            summary: 'More tickets are aging past the SLA threshold. Triage and reassignment is recommended.',
        },
    ],
};

// Fallback for actions not in the set above
const DEFAULT_KPI_SET = [
    {
        name: 'RESOLUTION RATE',
        current: 82.1,
        unit: '%',
        vsLastWeek: +1.8,
        color: '#3b82f6',
        data: generate30DayData(76, 0.26, 2),
        periodHigh: 84,
        periodLow: 74,
        dataPoints: 24,
        summary: 'Resolution rate remains steady and is improving week-over-week.',
    },
    {
        name: 'TEAM UTILIZATION',
        current: 74.5,
        unit: '%',
        vsLastWeek: -0.9,
        color: '#8b5cf6',
        data: generate30DayData(70, 0.19, 2.5),
        periodHigh: 78,
        periodLow: 68,
        dataPoints: 24,
        summary: 'Team utilization is within acceptable range. Minor capacity risk detected.',
    },
    {
        name: 'DTIF',
        current: 94.3,
        unit: '%',
        vsLastWeek: +0.7,
        color: '#10b981',
        data: generate30DayData(90, 0.18, 1.5),
        periodHigh: 96,
        periodLow: 88,
        dataPoints: 24,
        summary: 'DTIF metric is healthy and trending upward toward the target threshold.',
    },
];

const TIME_FILTERS = ['Today', 'Next 7 Days', 'Next 14 Days', 'Next 28 Days'];

const KPICard = ({ kpi }) => {
    const positive = kpi.vsLastWeek >= 0;
    // For metrics where lower is better (Lead Time, MTTR, Carry-over, Escalation Rate, Aging)
    const lowerIsBetter = ['LEAD TIME', 'MTTR', 'CARRY-OVER RATE', 'ESCALATION RATE', 'TICKET AGING INDEX', 'MEAN TIME TO RESOLVE', 'MEAN TIME TO ACKNOWLEDGE'].some(
        (k) => kpi.name.includes(k)
    );
    const isGood = lowerIsBetter ? !positive : positive;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Name */}
            <p className="text-xs font-bold text-gray-500 tracking-widest mb-4">{kpi.name}</p>

            {/* Main value row */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Current Value</p>
                    <p className="text-4xl font-extrabold text-gray-900">
                        {kpi.current}
                        <span className="text-2xl">{kpi.unit}</span>
                    </p>
                </div>
                <div
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold ${isGood ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                        }`}
                >
                    {isGood ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {isGood ? '+' : ''}{kpi.vsLastWeek}
                    {kpi.unit === ' days' || kpi.unit === ' hrs' || kpi.unit === ' min' || kpi.unit === ' pts' ? kpi.unit.trim() : '%'}
                    <span className="font-normal text-xs ml-1 opacity-70">vs last week</span>
                </div>
            </div>

            {/* Date range label */}
            <p className="text-xs text-gray-400 mb-3">30-Day Trend (Feb 2 – Feb 25, 2026)</p>

            {/* Chart */}
            <div className="h-32 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpi.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={5} />
                        <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
                            labelStyle={{ color: '#64748b' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={kpi.color}
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                    { label: 'PERIOD HIGH', value: kpi.periodHigh },
                    { label: 'PERIOD LOW', value: kpi.periodLow },
                    { label: 'DATA POINTS', value: kpi.dataPoints },
                ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-[9px] text-gray-400 tracking-widest font-bold mb-1">{label}</p>
                        <p className="text-xl font-bold text-gray-800">{value}</p>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">📋</span>
                    <p className="text-xs font-bold text-gray-600">Summary</p>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{kpi.summary}</p>
            </div>
        </div>
    );
};

const CEOKPIDetailPage = ({ action, onBack }) => {
    const [activeFilter, setActiveFilter] = useState('Next 7 Days');
    const kpis = KPI_SETS[action] || DEFAULT_KPI_SET;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top search bar (decorative, mirrors mock) */}
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Ask anything for business"
                        className="flex-1 text-sm text-gray-500 outline-none bg-transparent"
                        readOnly
                    />
                    <button className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl">
                        Search
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Back + Title */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{action}</h1>
                        <p className="text-sm text-gray-500">Key Performance Indicators (Priority)</p>
                    </div>
                    {/* Time filters */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                        {TIME_FILTERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${activeFilter === f
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* KPI cards grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {kpis.map((kpi) => (
                        <KPICard key={kpi.name} kpi={kpi} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CEOKPIDetailPage;
