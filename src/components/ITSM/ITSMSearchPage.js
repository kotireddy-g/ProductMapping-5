import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, Mic, Plus, CheckCircle2, Loader2, AlertTriangle,
    Briefcase, Users, Code2, Monitor, Shield, Brain, Bell, BarChart2,
    ChevronRight, Zap, X, ExternalLink, RefreshCw
} from 'lucide-react';
import ceoItsmService from '../../services/ceoItsmService';
import itsmApiClient from '../../services/itsmApiClient';

// ── Helpers ───────────────────────────────────────────────────────────────────

const ALL_SOURCES = [
    { id: 'jira', name: 'Jira', logoUrl: 'https://cdn.worldvectorlogo.com/logos/jira-1.svg' },
    { id: 'github', name: 'GitHub', logoUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' },
    { id: 'saperp', name: 'SAP ERP', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg' },
    { id: 'slack', name: 'Slack', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg' },
    { id: 'salesforce', name: 'Salesforce', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' },
];

const ICON_MAP = {
    briefcase: <Briefcase className="w-4 h-4" />,
    users: <Users className="w-4 h-4" />,
    code: <Code2 className="w-4 h-4" />,
    monitor: <Monitor className="w-4 h-4" />,
    shield: <Shield className="w-4 h-4" />,
    brain: <Brain className="w-4 h-4" />,
    bell: <Bell className="w-4 h-4" />,
    'bar-chart': <BarChart2 className="w-4 h-4" />,
};

const STATUS_BADGE = {
    healthy: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    critical: 'bg-red-100 text-red-700',
};

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
};
const formatDate = () =>
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

// Extract action_id from ITSM KPI detail URL
const extractItsmActionId = (api) => {
    try {
        const qs = api.includes('?') ? api.split('?')[1] : '';
        return new URLSearchParams(qs).get('action_id') || null;
    } catch { return null; }
};

// ── Smart Data Renderer ───────────────────────────────────────────────────────

const ValueCell = ({ value }) => {
    if (value === null || value === undefined) return <span className="text-gray-300">—</span>;
    if (typeof value === 'boolean') return <span className={value ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>{value ? 'Yes' : 'No'}</span>;
    if (typeof value === 'object') return <span className="text-[10px] text-gray-400 font-mono">{JSON.stringify(value)}</span>;
    return <span>{String(value)}</span>;
};

const ObjectCard = ({ obj, idx }) => {
    const entries = Object.entries(obj).filter(([, v]) => typeof v !== 'object' || v === null);
    const nested = Object.entries(obj).filter(([, v]) => typeof v === 'object' && v !== null);
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            {idx !== undefined && <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2">#{idx + 1}</p>}
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {entries.map(([k, v]) => (
                    <div key={k}>
                        <dt className="text-[10px] text-gray-400 capitalize">{k.replace(/_/g, ' ')}</dt>
                        <dd className="text-xs font-semibold text-gray-800"><ValueCell value={v} /></dd>
                    </div>
                ))}
            </dl>
            {nested.map(([k, v]) => (
                <div key={k} className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{k.replace(/_/g, ' ')}</p>
                    {Array.isArray(v)
                        ? <SmartRenderer data={v} />
                        : <SmartRenderer data={v} />
                    }
                </div>
            ))}
        </div>
    );
};

const SmartRenderer = ({ data }) => {
    if (data === null || data === undefined) return <p className="text-xs text-gray-400">No data</p>;

    if (Array.isArray(data)) {
        if (data.length === 0) return <p className="text-xs text-gray-400 italic">Empty list</p>;
        if (typeof data[0] === 'object' && data[0] !== null) {
            return (
                <div className="grid grid-cols-1 gap-3">
                    {data.map((item, i) => <ObjectCard key={i} obj={item} idx={i} />)}
                </div>
            );
        }
        return (
            <ul className="space-y-1.5">
                {data.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                        {String(item)}
                    </li>
                ))}
            </ul>
        );
    }

    if (typeof data === 'object') {
        return (
            <div className="space-y-3">
                {Object.entries(data).map(([key, val]) => {
                    if (typeof val === 'object' && val !== null) {
                        return (
                            <div key={key}>
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    {key.replace(/_/g, ' ')}
                                </p>
                                <SmartRenderer data={val} />
                            </div>
                        );
                    }
                    return (
                        <div key={key} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                            <span className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                            <span className="text-xs font-semibold text-gray-800"><ValueCell value={val} /></span>
                        </div>
                    );
                })}
            </div>
        );
    }

    return <p className="text-sm text-gray-700">{String(data)}</p>;
};

// ── Drill-Down Slide-Over Panel ──────────────────────────────────────────────

const DrillDownPanel = ({ open, title, apiPath, onClose, onNavigateToKPI }) => {
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
            // Strip the leading /api prefix to avoid doubling: /api/api/opi/ → /opi/
            const normalizedPath = apiPath.replace(/^\/api\//, '/');
            const res = await itsmApiClient.get(normalizedPath);
            setPayload(res.data);
        } catch (err) {
            console.error('DrillDownPanel fetch error:', err);
            setError('Unable to load data. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }, [apiPath]);

    useEffect(() => {
        if (open && apiPath) doFetch();
    }, [open, apiPath, doFetch]);

    if (!open) return null;

    // Determine what data to render
    const displayData = payload?.data ?? payload;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">Drill-Down</p>
                        <h2 className="text-base font-bold text-gray-900">{title}</h2>
                        <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{apiPath}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {!loading && payload && (
                            <button
                                onClick={doFetch}
                                className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-400"
                                title="Refresh"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {loading && (
                        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Fetching data…</span>
                        </div>
                    )}
                    {!loading && error && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <div className="flex-1">{error}</div>
                            <button onClick={doFetch} className="text-xs underline shrink-0">Retry</button>
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
                        className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
};

// ── Sub-item Row ──────────────────────────────────────────────────────────────

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
                {item.value}<span className="text-xs font-normal text-gray-400 ml-0.5">{item.unit}</span>
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
    const icon = ICON_MAP[section.icon] || <Briefcase className="w-4 h-4" />;
    const badgeCls = STATUS_BADGE[section.overall_status] || 'bg-gray-100 text-gray-600';

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            {/* Coloured top bar */}
            <div className="h-1" style={{ backgroundColor: section.color }} />

            {/* Card header */}
            <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <span style={{ color: section.color }}>{icon}</span>
                    <h3 className="text-sm font-bold text-gray-900 leading-snug">{section.label}</h3>
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
                    <SubItemRow
                        key={item.id}
                        item={item}
                        onDrillDown={onSubItemDrillDown}
                    />
                ))}
            </div>

            {/* ITSM action pills for itsm_service_reliability */}
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

            {/* Drill-down footer — clickable */}
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

// ── Agent Column ──────────────────────────────────────────────────────────────

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
        const fetchHomeData = async () => {
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
                console.error('ITSMSearchPage home fetch error:', err);
                setError('Unable to reach the server. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        onSearch && onSearch(query.trim());
    };

    const isConnected = (id) => connectedSources.includes(id);

    /**
     * Central handler for any drill-down click.
     * If the API is an ITSM KPI detail endpoint → navigate to CEOKPIDetailPage.
     * Otherwise → open the slide-over panel.
     */
    const handleDrillDown = (api, title) => {
        if (!api) return;

        // ITSM KPI detail → navigate to the full KPI detail page
        if (api.includes('/itsm/ceo/kpi-detail')) {
            const actionId = extractItsmActionId(api);
            if (actionId) {
                onActionClick && onActionClick(actionId, title);
                return;
            }
        }

        // Everything else → fetch and display in the panel
        setPanel({ open: true, title, api });
    };

    const closePanel = () => setPanel({ open: false, title: '', api: '' });

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Top bar */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center">
                    <img
                        src="https://experienceflow.ai/wp-content/uploads/2024/05/Logo-with-Tagline-240px.svg"
                        alt="ExperienceFlow"
                        className="h-9 w-auto"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
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
                            <div key={src.id} className="relative flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white shadow-xs hover:shadow-sm transition-all">
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

                {/* ── Dashboard Section Cards ── */}
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

                {/* ── Agent-Driven Decision Intelligence ── */}
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

            {/* ── Drill-Down Slide-Over Panel ── */}
            <DrillDownPanel
                open={panel.open}
                title={panel.title}
                apiPath={panel.api}
                onClose={closePanel}
                onNavigateToKPI={(actionId) => {
                    closePanel();
                    onActionClick && onActionClick(actionId, actionId);
                }}
            />
        </div>
    );
};

export default ITSMSearchPage;
