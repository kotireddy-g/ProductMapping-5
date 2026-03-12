import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import ceoItsmService from '../../services/ceoItsmService';

// ── Time filter config ─────────────────────────────────────────────────────────
const TIME_FILTERS = [
    { label: 'Today', value: 'today' },
    { label: 'Next 7 Days', value: 'next_7_days' },
    { label: 'Next 14 Days', value: 'next_14_days' },
    { label: 'Next 28 Days', value: 'next_28_days' },
];

// ── KPI Card ──────────────────────────────────────────────────────────────────
const KPICard = ({ kpi }) => {
    const positive = kpi.vs_last_week >= 0;
    const isGood = kpi.lower_is_better ? !positive : positive;
    const delta = Math.abs(kpi.vs_last_week);

    // Determine unit suffix for delta badge
    const deltaSuffix = ['%'].includes(kpi.unit) ? '%' : kpi.unit;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Name */}
            <p className="text-xs font-bold text-gray-500 tracking-widest mb-4">{kpi.name}</p>

            {/* Main value row */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Current Value</p>
                    <p className="text-4xl font-extrabold text-gray-900">
                        {kpi.current_value}
                        <span className="text-2xl">{kpi.unit === '%' ? '%' : ` ${kpi.unit}`}</span>
                    </p>
                </div>
                <div
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold ${isGood ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                        }`}
                >
                    {isGood ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {positive ? '+' : '-'}{delta}{deltaSuffix}
                    <span className="font-normal text-xs ml-1 opacity-70">vs last week</span>
                </div>
            </div>

            {/* Date range label */}
            <p className="text-xs text-gray-400 mb-3">30-Day Trend ({kpi.trend_date_range || ''})</p>

            {/* Chart */}
            <div className="h-32 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpi.trend_data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
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
                    { label: 'PERIOD HIGH', value: kpi.period_high },
                    { label: 'PERIOD LOW', value: kpi.period_low },
                    { label: 'DATA POINTS', value: kpi.data_points },
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

// ── Main Page ──────────────────────────────────────────────────────────────────
const CEOKPIDetailPage = ({ action, onBack }) => {
    const [activeFilter, setActiveFilter] = useState('next_7_days');
    const [kpiData, setKpiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchKpis = useCallback(async () => {
        if (!action) return;
        setLoading(true);
        setError(null);
        try {
            const res = await ceoItsmService.getKpiDetail(action, activeFilter);
            if (res?.success && res?.data) {
                // Attach trend_date_range to each KPI card for display
                const enrichedKpis = (res.data.kpis || []).map((kpi) => ({
                    ...kpi,
                    trend_date_range: res.data.trend_date_range,
                }));
                setKpiData({ ...res.data, kpis: enrichedKpis });
            } else {
                setError('Unexpected response from API.');
            }
        } catch (err) {
            console.error('CEOKPIDetailPage fetch error:', err);
            setError('Unable to load KPI data. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, [action, activeFilter]);

    useEffect(() => {
        fetchKpis();
    }, [fetchKpis]);

    const pageTitle = kpiData?.action_label || (action?.replace(/_/g, ' ').toUpperCase() ?? '');

    return (
        <div className="min-h-screen bg-gray-50">
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
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{pageTitle}</h1>
                        <p className="text-sm text-gray-500">Key Performance Indicators (Priority)</p>
                    </div>

                    {/* Time filters */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                        {TIME_FILTERS.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setActiveFilter(f.value)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${activeFilter === f.value
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-500 hover:text-gray-800'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-sm">Loading KPI data…</span>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-6">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="flex-1">{error}</div>
                        <button
                            onClick={fetchKpis}
                            className="flex items-center gap-1 text-red-600 underline text-xs shrink-0"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> Retry
                        </button>
                    </div>
                )}

                {/* KPI cards grid */}
                {!loading && kpiData?.kpis?.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {kpiData.kpis.map((kpi) => (
                            <KPICard key={kpi.id} kpi={kpi} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default CEOKPIDetailPage;
