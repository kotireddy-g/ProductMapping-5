import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, Mic, Plus, CheckCircle2, Loader2, AlertTriangle,
    Briefcase, Users, Code2, Monitor, Shield, Brain, Bell, BarChart2,
    ChevronRight, Zap, X, RefreshCw
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import ceoItsmService from '../../services/ceoItsmService';
import itsmApiClient from '../../services/itsmApiClient';

// ── Constants ─────────────────────────────────────────────────────────────────

const ALL_SOURCES = [
    { id: 'jira', name: 'Jira', logoUrl: 'https://cdn.worldvectorlogo.com/logos/jira-1.svg' },
    { id: 'github', name: 'GitHub', logoUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' },
    { id: 'saperp', name: 'SAP ERP', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg' },
    { id: 'slack', name: 'Slack', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg' },
    { id: 'salesforce', name: 'Salesforce', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' },
];

const SECTION_ICON_MAP = {
    briefcase: <Briefcase className="w-4 h-4" />,
    users: <Users className="w-4 h-4" />,
    code: <Code2 className="w-4 h-4" />,
    monitor: <Monitor className="w-4 h-4" />,
    shield: <Shield className="w-4 h-4" />,
    brain: <Brain className="w-4 h-4" />,
    bell: <Bell className="w-4 h-4" />,
    'bar-chart': <BarChart2 className="w-4 h-4" />,
};

const SECTION_STATUS_BADGE = {
    healthy: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    critical: 'bg-red-100 text-red-700',
};

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7'];

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
};

const formatDate = () =>
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const extractItsmActionId = (api) => {
    try {
        const qs = api.includes('?') ? api.split('?')[1] : '';
        return new URLSearchParams(qs).get('action_id') || null;
    } catch { return null; }
};

// ── Smart field detection helpers ─────────────────────────────────────────────

const CURRENCY_KEYS_LIST = ['value', 'amount', 'revenue', 'pipeline_value', 'total_pipeline_value'];
const PERCENT_KEYS_LIST = ['pct', 'percent', 'rate', 'efficiency', 'utilization', 'score', 'dtif'];
const STATUS_FIELD_KEYS = ['status', 'sla_status', 'stage', 'priority', 'health'];

const isCurrencyKey = (k) => CURRENCY_KEYS_LIST.some((s) => k.toLowerCase().includes(s));
const isPercentKey = (k) => PERCENT_KEYS_LIST.some((s) => k.toLowerCase().includes(s));
const isStatusKey = (k) => STATUS_FIELD_KEYS.some((s) => k.toLowerCase() === s);

const isTimeSeriesArr = (arr) =>
    Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object' &&
    ('date' in arr[0] || 'week' in arr[0] || 'month' in arr[0] || 'period' in arr[0]) &&
    ('value' in arr[0] || 'score' in arr[0] || 'count' in arr[0]);

const statusBadgeClass = (val) => {
    const v = String(val).toLowerCase();
    if (['on_track', 'healthy', 'success', 'won', 'active', 'resolved', 'closed'].some((s) => v.includes(s)))
        return 'bg-green-100 text-green-700 border-green-200';
    if (['warning', 'at_risk', 'delayed', 'pending', 'escalated'].some((s) => v.includes(s)))
        return 'bg-amber-100 text-amber-700 border-amber-200';
    if (['critical', 'breached', 'p1_critical', 'high', 'overdue', 'failed', 'no'].some((s) => v.includes(s)))
        return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
};

const formatINR = (v) => {
    if (v >= 1e7) return `₹${(v / 1e7).toFixed(1)}Cr`;
    if (v >= 1e5) return `₹${(v / 1e5).toFixed(1)}L`;
    if (v >= 1e3) return `₹${(v / 1e3).toFixed(0)}K`;
    return `₹${v}`;
};

const smartFormatValue = (key, val) => {
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (typeof val !== 'number') return String(val);
    if (isCurrencyKey(key) && val > 1000) return formatINR(val);
    if (isPercentKey(key)) return `${val.toFixed(1)}%`;
    if (Number.isInteger(val)) return val.toLocaleString();
    return val.toFixed(2);
};

// ── Drill-Down Panel Sub-components ──────────────────────────────────────────

/** Stat cards row for top-level scalar fields */
const StatCards = ({ obj }) => {
    const entries = Object.entries(obj)
        .filter(([k, v]) =>
            !['id', '_id', 'uuid', 'created_at', 'updated_at'].includes(k.toLowerCase()) &&
            (typeof v === 'number' || (typeof v === 'string' && v.length < 50))
        )
        .slice(0, 6);

    if (entries.length === 0) return null;

    return (
        <div className="grid grid-cols-2 gap-3 mb-5">
            {entries.map(([key, val]) => (
                <div key={key} className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-3 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        {key.replace(/_/g, ' ')}
                    </p>
                    {isStatusKey(key) ? (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusBadgeClass(val)}`}>
                            {String(val).replace(/_/g, ' ')}
                        </span>
                    ) : (
                        <p className="text-xl font-extrabold text-gray-900">{smartFormatValue(key, val)}</p>
                    )}
                </div>
            ))}
        </div>
    );
};

/** Area chart for time-series arrays */
const TrendAreaChart = ({ data, title, color = '#6366f1' }) => {
    const dateKey = 'date' in data[0] ? 'date' : 'week' in data[0] ? 'week' : 'period';
    const valKey = 'value' in data[0] ? 'value' : 'score' in data[0] ? 'score' : 'count';
    const gradId = `grad-${valKey}-${color.replace('#', '')}`;

    return (
        <div className="mb-5">
            {title && (
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                    {title.replace(/_/g, ' ')}
                </p>
            )}
            <div className="bg-gradient-to-br from-indigo-50/50 to-white border border-indigo-100 rounded-xl p-4">
                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey={dateKey} tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                            <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={32} />
                            <Tooltip
                                contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                labelStyle={{ color: '#64748b', fontWeight: 700 }}
                            />
                            <Area
                                type="monotone"
                                dataKey={valKey}
                                stroke={color}
                                strokeWidth={2.5}
                                fill={`url(#${gradId})`}
                                dot={false}
                                activeDot={{ r: 4, stroke: color, strokeWidth: 2, fill: '#fff' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

/** Rich card for a single object in an array */
const ItemCard = ({ item, idx }) => {
    const TITLE_CANDIDATES = ['title', 'name', 'label', 'deal_code', 'module_name', 'project_name', 'feature_name'];
    const SUBTITLE_CANDIDATES = ['client', 'subtitle', 'description', 'team', 'owner_name', 'stage'];
    const VALUE_CANDIDATES = ['value', 'amount', 'score', 'count', 'total'];

    const titleField = TITLE_CANDIDATES.find((k) => item[k]);
    const subtitleField = SUBTITLE_CANDIDATES.find((k) => item[k] && k !== titleField);
    const valueField = VALUE_CANDIDATES.find((k) => typeof item[k] === 'number');
    const statusField = STATUS_FIELD_KEYS.find((k) => item[k]);

    const kv = Object.entries(item).filter(([k, v]) => {
        if ([titleField, subtitleField, valueField, statusField, 'id', '_id'].includes(k)) return false;
        return typeof v !== 'object' && v !== null;
    }).slice(0, 6);

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-50 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    {titleField
                        ? <p className="text-sm font-bold text-gray-900 truncate">{item[titleField]}</p>
                        : <p className="text-xs font-bold text-gray-400">Item #{idx + 1}</p>
                    }
                    {subtitleField && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{item[subtitleField]}</p>
                    )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {valueField && (
                        <span className="text-base font-extrabold text-gray-900">
                            {smartFormatValue(valueField, item[valueField])}
                        </span>
                    )}
                    {statusField && item[statusField] && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadgeClass(item[statusField])}`}>
                            {String(item[statusField]).replace(/_/g, ' ')}
                        </span>
                    )}
                </div>
            </div>

            {/* Key-value grid */}
            {kv.length > 0 && (
                <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    {kv.map(([k, v]) => (
                        <div key={k}>
                            <p className="text-[10px] text-gray-400 capitalize">{k.replace(/_/g, ' ')}</p>
                            {isStatusKey(k) ? (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${statusBadgeClass(v)}`}>
                                    {String(v).replace(/_/g, ' ')}
                                </span>
                            ) : (
                                <p className="text-xs font-semibold text-gray-800">{smartFormatValue(k, v)}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/** Recursive smart renderer */
const SmartRenderer = ({ data, depth = 0, parentKey = '' }) => {
    if (data === null || data === undefined)
        return <p className="text-xs text-gray-400 italic">No data returned</p>;

    // Time-series → area chart
    if (isTimeSeriesArr(data)) {
        return (
            <TrendAreaChart
                data={data}
                title={parentKey}
                color={CHART_COLORS[depth % CHART_COLORS.length]}
            />
        );
    }

    // Array
    if (Array.isArray(data)) {
        if (data.length === 0)
            return <p className="text-xs text-gray-400 italic">No items found</p>;

        if (typeof data[0] === 'object' && data[0] !== null) {
            return (
                <div className="space-y-3">
                    {data.map((item, i) => <ItemCard key={i} item={item} idx={i} />)}
                </div>
            );
        }
        // Array of primitives → pill chips
        return (
            <div className="flex flex-wrap gap-2">
                {data.map((item, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                        {String(item)}
                    </span>
                ))}
            </div>
        );
    }

    // Plain object
    if (typeof data === 'object') {
        const scalars = Object.entries(data).filter(([, v]) => typeof v !== 'object' || v === null);
        const nested = Object.entries(data).filter(([, v]) => typeof v === 'object' && v !== null);

        return (
            <div className="space-y-5">
                {/* Summary stat cards (top level only) */}
                {scalars.length > 0 && depth === 0 && (
                    <StatCards obj={Object.fromEntries(scalars)} />
                )}

                {/* Nested sections */}
                {nested.map(([key, val]) => (
                    <div key={key}>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                            {key.replace(/_/g, ' ')}
                        </p>
                        <SmartRenderer data={val} depth={depth + 1} parentKey={key} />
                    </div>
                ))}

                {/* Compact key-value for nested scalars */}
                {scalars.length > 0 && depth > 0 && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {scalars.map(([k, v]) => (
                            <div key={k}>
                                <p className="text-[10px] text-gray-400 capitalize">{k.replace(/_/g, ' ')}</p>
                                {isStatusKey(k) ? (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${statusBadgeClass(v)}`}>
                                        {String(v).replace(/_/g, ' ')}
                                    </span>
                                ) : (
                                    <p className="text-xs font-semibold text-gray-800">{smartFormatValue(k, v)}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return <p className="text-sm text-gray-800">{String(data)}</p>;
};

// ── Drill-Down Slide-Over Panel ───────────────────────────────────────────────

const DrillDownPanel = ({ open, title, apiPath, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [payload, setPayload] = useState(null);

    const doFetch = useCallback(async () => {
        if (!apiPath) return;
        setLoading(true);
        setError(null);
        setPayload(null);
        try {
            // drill_down_api paths start with /api/... but itsmApiClient base already ends with /api
            const normalizedPath = apiPath.replace(/^\/api\//, '/');
            const res = await itsmApiClient.get(normalizedPath);
            setPayload(res.data);
        } catch (err) {
            console.error('DrillDownPanel fetch error:', err);
            setError('Unable to load data. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, [apiPath]);

    useEffect(() => {
        if (open && apiPath) doFetch();
    }, [open, apiPath, doFetch]);

    if (!open) return null;

    const displayData = payload?.data ?? payload;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Slide-over panel */}
            <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-4">
                            <p className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase mb-0.5">
                                Drill-Down View
                            </p>
                            <h2 className="text-lg font-bold text-gray-900 truncate">{title}</h2>
                            <p className="text-[11px] text-gray-400 mt-0.5 font-mono truncate">{apiPath}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            {!loading && payload && (
                                <button
                                    onClick={doFetch}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                                    title="Refresh"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="w-10 h-10 rounded-full border-2 border-indigo-200 border-t-indigo-500 animate-spin" />
                            <p className="text-sm text-gray-400">Fetching data…</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <div className="flex-1">{error}</div>
                            <button onClick={doFetch} className="text-xs underline font-semibold shrink-0">Retry</button>
                        </div>
                    )}

                    {!loading && payload && !error && (
                        <SmartRenderer data={displayData} />
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
};

// ── Dashboard Sub-item Row ────────────────────────────────────────────────────

const SubItemRow = ({ item, onDrillDown }) => (
    <button
        onClick={() => onDrillDown(item.drill_down_api, item.label)}
        className="w-full flex items-start justify-between py-2.5 border-b border-gray-100 last:border-0 gap-3 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors text-left"
    >
        <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 mb-0.5 flex items-center gap-1">
                {item.label}
                <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
            </p>
            <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">{item.description}</p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
            <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                {item.value}
                <span className="text-xs font-normal text-gray-400 ml-0.5">{item.unit}</span>
            </span>
            <span
                className="w-2 h-2 rounded-full mt-0.5"
                style={{ backgroundColor: item.status_color }}
                title={item.status}
            />
        </div>
    </button>
);

// ── Section Card ──────────────────────────────────────────────────────────────

const SectionCard = ({ section, onSubItemDrillDown, onCardDrillDown, onActionClick, isCEO }) => {
    const icon = SECTION_ICON_MAP[section.icon] || <Briefcase className="w-4 h-4" />;
    const badgeCls = SECTION_STATUS_BADGE[section.overall_status] || 'bg-gray-100 text-gray-600';

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="h-1" style={{ backgroundColor: section.color }} />

            {/* Header */}
            <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2 border-b border-gray-100">
                <div className="flex items-center gap-2 min-w-0">
                    <span style={{ color: section.color }}>{icon}</span>
                    <h3 className="text-sm font-bold text-gray-900 leading-snug truncate">{section.label}</h3>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-lg font-extrabold text-gray-900">{section.overall_score}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeCls}`}>
                        {section.overall_status?.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Sub-items */}
            <div className="px-4 py-1 flex-1">
                {section.sub_items?.map((item) => (
                    <SubItemRow key={item.id} item={item} onDrillDown={onSubItemDrillDown} />
                ))}
            </div>

            {/* ITSM action pills (only for itsm_service_reliability) */}
            {section.itsm_action_pills?.length > 0 && (
                <div className="px-4 pb-3 pt-1 flex flex-wrap gap-1.5">
                    {section.itsm_action_pills.slice(0, 4).map((pill) => (
                        <button
                            key={pill.id}
                            onClick={() => onActionClick && onActionClick(pill.id, pill.label)}
                            className="flex items-center gap-1 text-[10px] font-semibold border border-gray-200 rounded-full px-2.5 py-1 text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200"
                        >
                            {pill.label}
                            {isCEO && <ChevronRight className="w-2.5 h-2.5 opacity-60" />}
                        </button>
                    ))}
                    {section.itsm_action_pills.length > 4 && (
                        <span className="text-[10px] text-gray-400 self-center">
                            +{section.itsm_action_pills.length - 4} more
                        </span>
                    )}
                </div>
            )}

            {/* Drill-down footer */}
            {section.drill_down && (
                <button
                    onClick={() => onCardDrillDown(section.drill_down.api, section.drill_down.label)}
                    className="w-full px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between hover:bg-gray-100 transition-colors group"
                >
                    <span className="text-[11px] font-semibold text-gray-500 group-hover:text-gray-800 transition-colors">
                        {section.drill_down.label}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 transition-colors" />
                </button>
            )}
        </div>
    );
};

// ── Agent Panel Column ────────────────────────────────────────────────────────

const AgentColumn = ({ title, tags, tagColor, items }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex-1">
        <p className="text-xs font-bold text-gray-700 mb-2">{title}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
            {tags?.map((tag) => (
                <span key={tag} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagColor}`}>{tag}</span>
            ))}
        </div>
        <ul className="space-y-1.5">
            {items?.map((item) => (
                <li key={item.id} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-gray-300 shrink-0 mt-0.5">▸</span>
                    <span>{item.label}</span>
                </li>
            ))}
        </ul>
    </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────

const ITSMSearchPage = ({
    currentUser,
    onSearch,
    onActionClick,
    onConnectMore,
    onLogout,
}) => {
    const [query, setQuery] = useState('');
    const [connectedSources, setConnectedSources] = useState([]);
    const [dashboardSections, setDashboardSections] = useState([]);
    const [agentIntelligence, setAgentIntelligence] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Drill-down panel state
    const [panel, setPanel] = useState({ open: false, title: '', api: '' });

    const isCEO = currentUser?.role === 'itsm-ceo';

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await ceoItsmService.getHome();
                if (res?.success && res?.data) {
                    setConnectedSources(res.data.connected_sources || []);
                    setDashboardSections(res.data.dashboard_sections || []);
                    setAgentIntelligence(res.data.agent_intelligence || null);
                } else {
                    setError('Failed to load dashboard data.');
                }
            } catch (err) {
                console.error(err);
                setError('Unable to reach the server.');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        onSearch && onSearch(query.trim());
    };

    const isConnected = (id) => connectedSources.includes(id);

    /** Central drill-down handler */
    const handleDrillDown = (api, title) => {
        if (!api) return;
        // ITSM KPI sub-items → navigate to CEOKPIDetailPage
        if (api.includes('/itsm/ceo/kpi-detail')) {
            const actionId = extractItsmActionId(api);
            if (actionId) {
                onActionClick && onActionClick(actionId, title);
                return;
            }
        }
        // All other endpoints → slide-over panel
        setPanel({ open: true, title, api });
    };

    const closePanel = () => setPanel({ open: false, title: '', api: '' });

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Top bar */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
                <img
                    src="https://experienceflow.ai/wp-content/uploads/2024/05/Logo-with-Tagline-240px.svg"
                    alt="ExperienceFlow"
                    className="h-9 w-auto"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">{isCEO ? '👔' : '🛠'}</span>
                        <span className="font-medium text-gray-700">
                            {currentUser?.name || currentUser?.email?.split('@')[0]}
                        </span>
                    </div>
                    <button onClick={onLogout} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Greeting + Search */}
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-1 tracking-tight">{getGreeting()}!</h1>
                    <p className="text-gray-400 text-sm mb-6">Today is {formatDate()}.</p>
                    <form onSubmit={handleSearch} className="w-full max-w-2xl">
                        <div className="flex items-center border border-gray-200 rounded-2xl px-5 py-3 shadow-sm bg-white hover:shadow-md transition-shadow gap-3">
                            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ask anything for business…"
                                className="flex-1 text-gray-700 text-base outline-none bg-transparent placeholder-gray-300"
                            />
                            <button type="button" className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                                <Mic className="w-5 h-5 text-gray-400" />
                            </button>
                            <button type="submit" className="ml-1 px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors">
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Data Sources */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-gray-400 tracking-widest">DATA SOURCES</p>
                        <button
                            onClick={onConnectMore}
                            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" /> Connect More
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {ALL_SOURCES.map((src) => (
                            <div key={src.id} className="relative flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white shadow-sm hover:shadow transition-all">
                                <img src={src.logoUrl} alt={src.name} className="w-5 h-5 object-contain" />
                                <span className="text-sm font-semibold text-gray-700">{src.name}</span>
                                {isConnected(src.id) && (
                                    <CheckCircle2 className="w-4 h-4 text-green-500 absolute -top-1.5 -right-1.5" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                        <AlertTriangle className="w-4 h-4 shrink-0" />{error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-sm">Loading dashboard…</span>
                    </div>
                )}

                {/* Section Cards Grid */}
                {!loading && dashboardSections.length > 0 && (
                    <div className="mb-10">
                        <p className="text-xs font-bold text-gray-400 tracking-widest mb-4">CEO EXECUTIVE DASHBOARD</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {dashboardSections.map((section) => (
                                <SectionCard
                                    key={section.id}
                                    section={section}
                                    onSubItemDrillDown={handleDrillDown}
                                    onCardDrillDown={handleDrillDown}
                                    onActionClick={onActionClick}
                                    isCEO={isCEO}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Agent Intelligence Panel */}
                {!loading && agentIntelligence && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-4 h-4 text-indigo-500" />
                            <h2 className="text-sm font-bold text-indigo-900">{agentIntelligence.title}</h2>
                        </div>
                        <p className="text-xs text-indigo-600 mb-4">{agentIntelligence.description}</p>
                        <div className="flex flex-col lg:flex-row gap-3">
                            <AgentColumn
                                title={agentIntelligence.actionable_insights?.label}
                                tags={agentIntelligence.actionable_insights?.tags}
                                tagColor="bg-red-100 text-red-700"
                                items={agentIntelligence.actionable_insights?.items}
                            />
                            <AgentColumn
                                title={agentIntelligence.actionable_labels?.label}
                                tags={agentIntelligence.actionable_labels?.tags}
                                tagColor="bg-amber-100 text-amber-700"
                                items={agentIntelligence.actionable_labels?.items}
                            />
                            <AgentColumn
                                title={agentIntelligence.actionable_recommendations?.label}
                                tags={agentIntelligence.actionable_recommendations?.tags}
                                tagColor="bg-green-100 text-green-700"
                                items={agentIntelligence.actionable_recommendations?.items}
                            />
                        </div>
                    </div>
                )}
            </main>

            {/* Drill-Down Panel */}
            <DrillDownPanel
                open={panel.open}
                title={panel.title}
                apiPath={panel.api}
                onClose={closePanel}
            />
        </div>
    );
};

export default ITSMSearchPage;
