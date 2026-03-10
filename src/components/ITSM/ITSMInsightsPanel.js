import React, { useState, useEffect, useCallback } from 'react';
import {
    Loader2, AlertTriangle, RefreshCw, TrendingDown, TrendingUp,
    AlertCircle, CheckCircle, Info, Zap, Target
} from 'lucide-react';
import itsmInsightsService from '../../services/itsmInsightsService';
import SourceInsightDrawer from './SourceInsightDrawer';

// ─── Config ──────────────────────────────────────────────────────────────────

const SOURCE_META = {
    JIRA: { color: '#0052CC', bg: '#e8f0ff', border: '#c7d9ff' },
    GITHUB: { color: '#24292e', bg: '#f1f1f1', border: '#d5d5d5' },
    TEAMS: { color: '#6264A7', bg: '#eeeefc', border: '#ccccf4' },
    BIOMETRIC: { color: '#0ea5e9', bg: '#e0f5ff', border: '#bae6fd' },
    HRMS: { color: '#10b981', bg: '#d1fae5', border: '#a7f3d0' },
    FINANCE: { color: '#f59e0b', bg: '#fef3c7', border: '#fde68a' },
    CCTV: { color: '#ef4444', bg: '#fee2e2', border: '#fecaca' },
    SALESFORCE: { color: '#00A1E0', bg: '#e0f4ff', border: '#bae8ff' },
    SERVICENOW: { color: '#62d84e', bg: '#ecfdf5', border: '#a7f3d0' },
};

const SEVERITY_CONFIG = {
    CRITICAL: {
        gradient: 'from-red-50 to-red-100/40',
        accent: 'bg-red-500',
        badge: 'bg-red-100 text-red-700 border border-red-300',
        icon: <AlertCircle className="w-4 h-4 text-red-500" />,
        label: '🔴 CRITICAL',
    },
    AT_RISK: {
        gradient: 'from-amber-50 to-amber-100/40',
        accent: 'bg-amber-500',
        badge: 'bg-amber-100 text-amber-700 border border-amber-300',
        icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
        label: '🟡 AT RISK',
    },
    RED: {
        gradient: 'from-red-50 to-rose-100/40',
        accent: 'bg-rose-500',
        badge: 'bg-rose-100 text-rose-700 border border-rose-300',
        icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
        label: '🔴 RED',
    },
    AMBER: {
        gradient: 'from-amber-50 to-yellow-100/40',
        accent: 'bg-yellow-500',
        badge: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
        icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
        label: '🟡 AMBER',
    },
    GREEN: {
        gradient: 'from-green-50 to-emerald-100/40',
        accent: 'bg-green-500',
        badge: 'bg-green-100 text-green-700 border border-green-300',
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        label: '🟢 HEALTHY',
    },
    DEFAULT: {
        gradient: 'from-blue-50 to-indigo-100/40',
        accent: 'bg-blue-500',
        badge: 'bg-blue-100 text-blue-700 border border-blue-300',
        icon: <Info className="w-4 h-4 text-blue-500" />,
        label: '🔵 MONITOR',
    },
};

const getConfig = (severity) => SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.DEFAULT;

// ─── Sub-components ───────────────────────────────────────────────────────────

const TopRiskCard = ({ risk }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{risk.milestone_code}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                {risk.days_to_due}d left
            </span>
        </div>
        <p className="text-sm font-bold text-gray-900 mb-1">{risk.title}</p>
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{risk.risk_reason}</p>
        <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-600">
                ₹{(risk.amount_inr / 100000).toFixed(1)}L at risk
            </span>
            <span className="text-xs text-gray-400">{risk.due_date}</span>
        </div>
    </div>
);

const CriticalModuleChip = ({ mod }) => {
    const color = mod.status === 'CRITICAL' ? '#ef4444' : mod.status === 'RED' ? '#f97316' : '#f59e0b';
    return (
        <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold"
            style={{ borderColor: color + '55', backgroundColor: color + '12', color }}
        >
            <span>{mod.code}</span>
            <span className="font-normal text-gray-500">{mod.name}</span>
            <span className="ml-auto font-bold">{mod.score?.toFixed(0)}%</span>
        </div>
    );
};

const ModuleSummaryRow = ({ m }) => {
    const statusColor = {
        GREEN: 'text-green-600 bg-green-50',
        AMBER: 'text-amber-600 bg-amber-50',
        RED: 'text-red-600 bg-red-50',
        CRITICAL: 'text-red-700 bg-red-100',
    }[m.status] || 'text-gray-600 bg-gray-50';

    return (
        <div className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">{m.module_name}</p>
                <p className="text-[10px] text-gray-400">{m.module_code}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}>{m.status}</span>
                <span className="text-xs font-bold text-gray-700 w-10 text-right">{m.score?.toFixed(0)}%</span>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * ITSMInsightsPanel — shown below the Sankey diagram for ITSM users.
 * Replaces department cards. Updates when supplyParent or demandParent changes.
 *
 * Props:
 *   supplyParent {string|null} - entity ID of the clicked supply-side node
 *   demandParent {string|null} - entity ID of the clicked demand-side node
 *   timePeriod   {string}      - e.g. "next_7_days"
 */
const ITSMInsightsPanel = ({ supplyParent = null, demandParent = null, timePeriod = 'next_7_days' }) => {
    const [insightData, setInsightData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeSource, setActiveSource] = useState(null);

    const fetchInsights = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await itsmInsightsService.getInsights({ supplyParent, demandParent, time_period: timePeriod });
            if (res?.success) setInsightData(res.data);
            else setError('Unexpected response from insights API.');
        } catch {
            setError('Failed to load insights. Please check the server connection.');
        } finally {
            setLoading(false);
        }
    }, [supplyParent, demandParent, timePeriod]);

    useEffect(() => {
        fetchInsights();
    }, [fetchInsights]);

    const handleSourceClick = (source) => {
        setActiveSource(source);
        setDrawerOpen(true);
    };

    const insight = insightData?.insight;
    const context = insightData?.context;
    const config = getConfig(insight?.severity);

    return (
        <section className="mt-2">
            {/* Section header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-500" />
                    <h2 className="text-base font-bold text-gray-900">
                        AI Insights
                        {context && (
                            <span className="ml-2 text-sm font-normal text-gray-400">
                                — {context.entity_name}
                            </span>
                        )}
                    </h2>
                </div>
                <button
                    onClick={fetchInsights}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Loading…' : 'Refresh'}
                </button>
            </div>

            {/* Loading state */}
            {loading && !insightData && (
                <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-sm">Fetching insights…</span>
                </div>
            )}

            {/* Error state */}
            {!loading && error && !insightData && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-red-700">Unable to load insights</p>
                        <p className="text-xs text-red-500 mt-0.5">{error}</p>
                    </div>
                    <button
                        onClick={fetchInsights}
                        className="ml-auto text-xs text-red-600 underline shrink-0"
                    >Retry</button>
                </div>
            )}

            {/* Insight content */}
            {insight && (
                <div className="space-y-5">
                    {/* ── Hero card ─────────────────────────────────────────────────── */}
                    <div className={`rounded-2xl bg-gradient-to-br ${config.gradient} border border-gray-200 p-5 shadow-sm`}>
                        {/* Severity bar */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-1 h-8 rounded-full ${config.accent}`} />
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${config.badge}`}>
                                    {config.label}
                                </span>
                                <span className="text-xs text-gray-400 font-semibold">{insight.decision_type}</span>
                                {insight.confidence != null && (
                                    <span className="text-xs text-gray-400">· {insight.confidence}% confidence</span>
                                )}
                                {insight.requires_action && (
                                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                        Action Required
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Title + summary */}
                        <h3 className="text-base font-extrabold text-gray-900 mb-2 leading-snug">{insight.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{insight.summary}</p>

                        {/* Signals */}
                        {insight.signals?.length > 0 && (
                            <div className="space-y-1.5">
                                {insight.signals.map((s, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                                        <span className="text-gray-400 shrink-0 mt-0.5">▸</span>
                                        <span>{s}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Recommendation + Impact ────────────────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {insight.recommendation && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Target className="w-4 h-4 text-blue-500 shrink-0" />
                                    <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">Recommendation</p>
                                </div>
                                <p className="text-sm text-blue-800 leading-relaxed">
                                    {typeof insight.recommendation === 'string'
                                        ? insight.recommendation
                                        : Array.isArray(insight.recommendation)
                                            ? insight.recommendation.join(' ')
                                            : ''}
                                </p>
                            </div>
                        )}
                        {insight.impact && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Impact</p>
                                    <p className="text-sm text-amber-800">{insight.impact}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Top Risks ─────────────────────────────────────────────────── */}
                    {insight.top_risks?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Top Risks</p>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                                {insight.top_risks.map((r) => (
                                    <TopRiskCard key={r.milestone_code} risk={r} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Critical Modules ──────────────────────────────────────────── */}
                    {insight.critical_modules?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Critical Modules</p>
                            <div className="space-y-2">
                                {insight.critical_modules.map((m) => (
                                    <CriticalModuleChip key={m.code} mod={m} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Module Summary (project-level drill-down) ─────────────────── */}
                    {insight.module_summary?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Module Summary</p>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                {insight.module_summary.map((m) => (
                                    <ModuleSummaryRow key={m.module_code} m={m} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Contributing Sources ──────────────────────────────────────── */}
                    {insight.contributing_sources?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                Contributing Sources
                                <span className="ml-2 font-normal normal-case text-gray-400">Click to view source details</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {insight.contributing_sources.map((src) => {
                                    const m = SOURCE_META[src] || { color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db' };
                                    return (
                                        <button
                                            key={src}
                                            onClick={() => handleSourceClick(src)}
                                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 hover:shadow-md active:scale-95"
                                            style={{
                                                color: m.color,
                                                backgroundColor: m.bg,
                                                borderColor: m.border,
                                            }}
                                        >
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: m.color }}
                                            />
                                            {src}
                                            <span className="text-[10px] font-normal opacity-60">→</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── Worst Module (simple summary level) ─────────────────────── */}
                    {insight.worst_module && !insight.critical_modules?.length && (
                        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                            <TrendingDown className="w-4 h-4 text-amber-500 shrink-0" />
                            <div className="text-sm">
                                <span className="font-bold text-amber-800">Worst module: </span>
                                <span className="text-amber-700">
                                    {insight.worst_module.name} ({insight.worst_module.code}) — {insight.worst_module.score?.toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ── As of timestamp ──────────────────────────────────────────── */}
                    {insight.as_of && (
                        <p className="text-[10px] text-gray-400 text-right pt-1">
                            As of {new Date(insight.as_of).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                        </p>
                    )}
                </div>
            )}

            {/* Source Insight Drawer */}
            <SourceInsightDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                source={activeSource}
                supplyParent={supplyParent}
                demandParent={demandParent}
                timePeriod={timePeriod}
            />
        </section>
    );
};

export default ITSMInsightsPanel;
