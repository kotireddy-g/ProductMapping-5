import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, AlertTriangle, CheckCircle, Info, ExternalLink } from 'lucide-react';
import itsmInsightsService from '../../services/itsmInsightsService';

// Source logos / colors
const SOURCE_META = {
    JIRA: { color: '#0052CC', bg: '#e8f0ff', label: 'Jira' },
    GITHUB: { color: '#24292e', bg: '#f0f0f0', label: 'GitHub' },
    TEAMS: { color: '#6264A7', bg: '#eeeefc', label: 'Teams' },
    BIOMETRIC: { color: '#0ea5e9', bg: '#e0f5ff', label: 'Biometric' },
    HRMS: { color: '#10b981', bg: '#d1fae5', label: 'HRMS' },
    FINANCE: { color: '#f59e0b', bg: '#fef3c7', label: 'Finance' },
    CCTV: { color: '#ef4444', bg: '#fee2e2', label: 'CCTV' },
    SALESFORCE: { color: '#00A1E0', bg: '#e0f4ff', label: 'Salesforce' },
    SERVICENOW: { color: '#62d84e', bg: '#ecfdf5', label: 'ServiceNow' },
};

const SEVERITY_STYLE = {
    CRITICAL: { bar: 'bg-red-500', badge: 'bg-red-100 text-red-700 border border-red-200', icon: '🔴' },
    AT_RISK: { bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700 border border-amber-200', icon: '🟡' },
    GREEN: { bar: 'bg-green-500', badge: 'bg-green-100 text-green-700 border border-green-200', icon: '🟢' },
    AMBER: { bar: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700 border border-amber-200', icon: '🟡' },
    RED: { bar: 'bg-red-500', badge: 'bg-red-100 text-red-700 border border-red-200', icon: '🔴' },
    DEFAULT: { bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700 border border-blue-200', icon: '🔵' },
};

const getSeverityStyle = (s) => SEVERITY_STYLE[s] || SEVERITY_STYLE.DEFAULT;

// Render a single cross_source_evidence card for the selected source:
const SourceEvidenceCard = ({ sourceKey, data }) => {
    if (!data) return null;
    const entries = Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== '');
    return (
        <div className="space-y-1">
            {entries.map(([k, v]) => (
                <div key={k} className="flex items-start justify-between py-1.5 border-b border-gray-100 last:border-0 gap-2">
                    <span className="text-xs text-gray-500 capitalize w-40 shrink-0">{k.replace(/_/g, ' ')}</span>
                    <span className="text-xs font-medium text-gray-800 text-right break-words">
                        {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}
                    </span>
                </div>
            ))}
        </div>
    );
};

const SourceInsightDrawer = ({
    isOpen,
    onClose,
    source,          // e.g. "JIRA"
    supplyParent,
    demandParent,
    timePeriod,
}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const drawerRef = useRef(null);

    const meta = SOURCE_META[source] || { color: '#6b7280', bg: '#f3f4f6', label: String(source || '') };

    useEffect(() => {
        if (!isOpen || !source) return;
        setLoading(true);
        setError(null);
        setData(null);

        itsmInsightsService
            .getInsights({ supplyParent, demandParent, source: source.toLowerCase(), time_period: timePeriod })
            .then((res) => {
                if (res?.success) setData(res.data);
                else setError('Unexpected response from server.');
            })
            .catch(() => setError('Failed to load source insights. Please try again.'))
            .finally(() => setLoading(false));
    }, [isOpen, source, supplyParent, demandParent, timePeriod]);

    // Close on ESC
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    const insight = data?.insight;
    const context = data?.context;
    const evidence = insight?.cross_source_evidence?.[source?.toLowerCase()];
    const severityStyle = getSeverityStyle(insight?.severity);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-5 py-4 border-b"
                    style={{ borderColor: meta.color + '33', backgroundColor: meta.bg }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: meta.color }}
                        >
                            {meta.label.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: meta.color }}>
                                {meta.label} Source Insights
                            </p>
                            {context && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {context.entity_name} · {context.entity_code}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">

                    {/* Loading */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
                            <Loader2 className="w-7 h-7 animate-spin" />
                            <p className="text-sm">Loading {meta.label} insights…</p>
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Content */}
                    {!loading && insight && (
                        <>
                            {/* Severity + Title */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${severityStyle.badge}`}>
                                        {severityStyle.icon} {insight.severity}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">{insight.decision_type}</span>
                                </div>
                                <p className="text-sm font-bold text-gray-900 leading-snug">{insight.title}</p>
                            </div>

                            {/* Summary */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Summary</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{insight.summary}</p>
                            </div>

                            {/* Source-specific Evidence */}
                            {evidence && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                        {meta.label} Evidence
                                    </p>
                                    <div
                                        className="rounded-xl p-4 border"
                                        style={{ borderColor: meta.color + '44', backgroundColor: meta.bg }}
                                    >
                                        <SourceEvidenceCard sourceKey={source.toLowerCase()} data={evidence} />
                                    </div>
                                </div>
                            )}

                            {/* Signals */}
                            {insight.signals?.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Signals</p>
                                    <ul className="space-y-2">
                                        {insight.signals.map((s, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                <span className="text-gray-400 mt-0.5 shrink-0">•</span>
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Recommendation */}
                            {insight.recommendation && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Info className="w-4 h-4 text-blue-500 shrink-0" />
                                        <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">Recommendation</p>
                                    </div>
                                    <p className="text-sm text-blue-800 leading-relaxed">{insight.recommendation}</p>
                                </div>
                            )}

                            {/* Impact */}
                            {insight.impact && (
                                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                    <p className="text-sm text-amber-800">{insight.impact}</p>
                                </div>
                            )}

                            {/* Confidence */}
                            {insight.confidence != null && (
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">AI Confidence</p>
                                        <p className="text-xs font-bold text-gray-800">{insight.confidence}%</p>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{ width: `${insight.confidence}%`, backgroundColor: meta.color }}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default SourceInsightDrawer;
