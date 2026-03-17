import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, Mic, Plus, CheckCircle2, Loader2, AlertTriangle,
    Briefcase, Users, Code2, Monitor, Shield, Brain, Bell, BarChart2,
    ChevronRight, Zap, X, RefreshCw, TrendingUp, TrendingDown,
    AlertCircle, Clock, GitPullRequest, Activity, Target, Lightbulb, DollarSign, Flame,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import ceoItsmService from '../../services/ceoItsmService';
import itsmApiClient from '../../services/itsmApiClient';

/* ── helpers ── */
const ALL_SOURCES = [
    { id: 'jira', name: 'Jira', logo: 'https://cdn.worldvectorlogo.com/logos/jira-1.svg' },
    { id: 'github', name: 'GitHub', logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' },
    { id: 'saperp', name: 'SAP ERP', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg' },
    { id: 'slack', name: 'Slack', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg' },
    { id: 'salesforce', name: 'Salesforce', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' },
];
const ICON_MAP = {
    briefcase: <Briefcase className="w-4 h-4" />, users: <Users className="w-4 h-4" />,
    code: <Code2 className="w-4 h-4" />, monitor: <Monitor className="w-4 h-4" />,
    shield: <Shield className="w-4 h-4" />, brain: <Brain className="w-4 h-4" />,
    bell: <Bell className="w-4 h-4" />, 'bar-chart': <BarChart2 className="w-4 h-4" />,
};

/* Fields to never display as user-facing KPIs */
const BLACKLIST = new Set(['id', '_id', 'uuid', 'color', 'color_hex', 'icon', 'created_at', 'updated_at', 'source', 'module', 'owner_dept', 'stage_name']);

const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening'; };
const fmtDate = () => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const fmtINR = v => { if (!v && v !== 0) return '—'; if (v >= 1e7) return `₹${(v / 1e7).toFixed(1)}Cr`; if (v >= 1e5) return `₹${(v / 1e5).toFixed(1)}L`; if (v >= 1e3) return `₹${(v / 1e3).toFixed(0)}K`; return `₹${v}`; };
const fmtNum = (k, v) => { if (typeof v !== 'number') return String(v ?? '—'); const kl = k.toLowerCase(); if (['value', 'amount', 'pipeline_value'].some(s => kl.includes(s)) && v > 1000) return fmtINR(v); if (['pct', 'percent', 'rate', 'efficiency', 'dtif', 'score', 'utilization'].some(s => kl.includes(s))) return `${v.toFixed ? v.toFixed(1) : v}%`; return typeof v === 'number' ? Number.isInteger(v) ? v.toLocaleString() : v.toFixed(2) : String(v); };

const statusCls = s => {
    const v = String(s || '').toLowerCase();
    if (['on_track', 'healthy', 'resolved', 'closed', 'won', 'success', 'yes', 'active'].some(x => v.includes(x))) return { pill: 'bg-green-100 text-green-800 border-green-200', bar: 'bg-green-500', left: 'border-l-green-500' };
    if (['warning', 'at_risk', 'pending', 'delayed'].some(x => v.includes(x))) return { pill: 'bg-amber-100 text-amber-800 border-amber-200', bar: 'bg-amber-500', left: 'border-l-amber-400' };
    return { pill: 'bg-red-100 text-red-800 border-red-200', bar: 'bg-red-500', left: 'border-l-red-500' };
};
const sevCls = s => {
    const v = String(s || '').toUpperCase();
    if (v.includes('P1') || v.includes('CRITICAL')) return 'bg-red-600 text-white';
    if (v.includes('P2') || v.includes('HIGH')) return 'bg-orange-500 text-white';
    if (v.includes('P3') || v.includes('MEDIUM')) return 'bg-amber-400 text-gray-900';
    return 'bg-slate-200 text-slate-700';
};

/* Auto-detects time-series arrays */
const isTimeSeries = arr => Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object' &&
    Object.keys(arr[0]).some(k => ['date', 'week', 'month', 'period'].includes(k.toLowerCase())) &&
    Object.keys(arr[0]).some(k => ['value', 'score', 'count', 'dtif', 'pct'].some(s => k.toLowerCase().includes(s)));

/* Finds x-key and y-key in a time-series row */
const tsKeys = row => {
    const xk = Object.keys(row).find(k => ['date', 'week', 'month', 'period'].includes(k.toLowerCase())) || 'date';
    const yk = Object.keys(row).find(k => ['value', 'score', 'count', 'dtif', 'pct'].some(s => k.toLowerCase().includes(s))) || 'value';
    return { xk, yk };
};

/* Auto-collect scalar KPI fields from an object, skipping blacklisted/internal */
const scalarKpis = obj => Object.entries(obj).filter(([k, v]) =>
    !BLACKLIST.has(k.toLowerCase()) && (typeof v === 'number' || (typeof v === 'string' && v.length < 40 && v !== '')));

/* Auto-collect first array of objects for list rendering */
const firstListArray = obj => { for (const v of Object.values(obj)) { if (Array.isArray(v) && v.length && typeof v[0] === 'object') return v; } return null; };

/* ── Shared UI ── */
const SummaryBanner = ({ grad, icon, label, subtitle, children }) => (
    <div className={`${grad} rounded-2xl p-5 mb-5 text-white`}>
        <div className="flex items-center gap-2 mb-0.5">{icon}<p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">{subtitle}</p></div>
        <h3 className="text-xl font-extrabold mb-3">{label}</h3>
        <div className="grid grid-cols-2 gap-2.5">{children}</div>
    </div>
);
const BStat = ({ label, value }) => (
    <div className="bg-white/20 backdrop-blur rounded-xl p-3">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-70 mb-0.5">{label}</p>
        <p className="text-xl font-extrabold leading-none">{value ?? '—'}</p>
    </div>
);
const SecTitle = ({ icon, label }) => (
    <div className="flex items-center gap-2 mb-3">
        <span className="text-indigo-500">{icon}</span>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600">{label}</p>
    </div>
);
const TrendChart = ({ data, xKey, yKey, color = '#6366f1' }) => {
    const gid = `g${yKey}${color.replace('#', '')}`;
    return (
        <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.28} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey={xKey} tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={32} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,.1)' }} labelStyle={{ fontWeight: 700, color: '#475569' }} />
                    <Area type="monotone" dataKey={yKey} stroke={color} strokeWidth={2.5} fill={`url(#${gid})`} dot={false} activeDot={{ r: 4, fill: '#fff', stroke: color, strokeWidth: 2 }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

/* ── Renderers per API type ── */

/* Generic KPI metrics display — auto-scans any object */
const AutoKpiGrid = ({ obj }) => {
    const entries = scalarKpis(obj).slice(0, 8);
    if (!entries.length) return null;
    return (
        <div className="grid grid-cols-2 gap-3 mb-5">
            {entries.map(([k, v]) => (
                <div key={k} className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl p-3.5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{k.replace(/_/g, ' ')}</p>
                    <p className="text-xl font-extrabold text-slate-900 leading-none">{fmtNum(k, v)}</p>
                </div>
            ))}
        </div>
    );
};

/* Auto item card — works for any object shape */
const AutoItemCard = ({ item, idx }) => {
    const TK = ['title', 'name', 'label', 'deal_code', 'module_name', 'project_name', 'feature_name', 'pr_title'];
    const SK = ['status', 'sla_status', 'health', 'stage', 'priority'];
    const VK = ['value', 'amount', 'score', 'count', 'total', 'pipeline_value'];
    const titleK = TK.find(k => item[k] && typeof item[k] === 'string');
    const statusK = SK.find(k => item[k] && typeof item[k] === 'string');
    const valK = VK.find(k => typeof item[k] === 'number');
    const cls = statusCls(statusK ? item[statusK] : '');
    const kv = Object.entries(item).filter(([k, v]) => !BLACKLIST.has(k.toLowerCase()) && ![titleK, statusK, valK, 'id', '_id'].includes(k) && typeof v !== 'object' && v != null).slice(0, 6);
    return (
        <div className={`bg-white border border-l-4 ${cls.left} border-gray-100 rounded-xl shadow-sm overflow-hidden`}>
            <div className="px-4 py-3 flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{titleK ? item[titleK] : `Item #${idx + 1}`}</p>
                    {statusK && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls.pill} mt-1 inline-block`}>{String(item[statusK]).replace(/_/g, ' ')}</span>}
                </div>
                {valK && <p className="text-base font-extrabold text-gray-900 shrink-0">{fmtNum(valK, item[valK])}</p>}
            </div>
            {kv.length > 0 && (
                <div className="px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {kv.map(([k, v]) => (
                        <div key={k}>
                            <p className="text-[10px] text-slate-400 capitalize leading-none mb-0.5">{k.replace(/_/g, ' ')}</p>
                            <p className="text-xs font-semibold text-slate-800">{fmtNum(k, v)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* DEALS */
const DealsRenderer = ({ data }) => {
    const deals = data.deals || data.items || data.data || (Array.isArray(data) ? data : []);
    return (
        <div>
            <SummaryBanner grad="bg-gradient-to-br from-blue-600 to-indigo-700" icon={<DollarSign className="w-4 h-4" />} subtitle="Deal Pipeline" label="Client Engagements">
                <BStat label="Total" value={data.count || deals.length} />
                <BStat label="Pipeline" value={fmtINR(data.total_pipeline_value)} />
                <BStat label="Active" value={data.active_deals_count} />
                <BStat label="Won" value={data.won_deals_count} />
            </SummaryBanner>
            <SecTitle icon={<Briefcase className="w-3.5 h-3.5" />} label={`${deals.length} Deals`} />
            <div className="space-y-3">{deals.map((d, i) => <AutoItemCard key={i} item={d} idx={i} />)}</div>
        </div>
    );
};

/* RCA */
const RcaRenderer = ({ data }) => {
    const list = data.rca_list || data.items || data.data || (Array.isArray(data) ? data : []);
    return (
        <div>
            <SummaryBanner grad="bg-gradient-to-br from-red-600 to-rose-700" icon={<Flame className="w-4 h-4" />} subtitle="Incidents" label="Root Cause Analysis">
                <BStat label="Open" value={data.total_open_rca || list.length} />
                <BStat label="P1 Critical" value={data.p1_critical} />
                <BStat label="P2 High" value={data.p2_high} />
                <BStat label="P3 Medium" value={data.p3_medium} />
            </SummaryBanner>
            <div className="space-y-3">
                {list.map((r, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-sm font-bold text-gray-900 leading-snug">{r.title || r.name || `Incident #${i + 1}`}</p>
                            {(r.severity || r.priority) && <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg shrink-0 ${sevCls(r.severity || r.priority)}`}>{r.severity || r.priority}</span>}
                        </div>
                        {r.description && <p className="text-xs text-slate-500 leading-relaxed mb-2">{r.description}</p>}
                        <div className="flex flex-wrap gap-2">
                            {r.status && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCls(r.status).pill}`}>{r.status.replace(/_/g, ' ')}</span>}
                            {r.assigned_to && <span className="bg-slate-50 text-slate-600 text-[10px] px-2 py-0.5 rounded-lg">👤 {r.assigned_to}</span>}
                            {r.impact && <span className="bg-orange-50 text-orange-700 text-[10px] px-2 py-0.5 rounded-lg">⚠ {r.impact}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* OPI — auto-scans all numeric fields */
const OpiRenderer = ({ data }) => {
    const score = data.opiScore ?? data.score;
    const target = data.opiTarget ?? data.target ?? 85;
    const status = data.status || 'warning';
    const ifAch = data.opiIfAchieved;
    const ifMiss = data.opiIfMissed;
    const revAch = data.revenueIfAchievedInr;
    const revMiss = data.revenueIfMissedInr;
    const dims = data.dimensions || [];
    const trend = data.trend || [];
    const formula = data.meta?.formula || '';
    const period = data.meta?.period || '';
    const pct = target > 0 ? Math.min((score / target) * 100, 100) : 0;
    const sCls = statusCls(status);

    return (
        <div className="space-y-4">
            {/* ── Header banner ── */}
            <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 opacity-80" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">OPI · Organisation Performance Index</p>
                </div>
                <div className="flex items-end justify-between mb-3">
                    <div>
                        <p className="text-4xl font-extrabold leading-none">{score?.toFixed(1) ?? '—'}</p>
                        <p className="text-sm opacity-70 mt-0.5">Target: {target}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${sCls.pill}`}>{status.toUpperCase()}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-white/20 rounded-full h-2.5 mb-4">
                    <div className="h-2.5 rounded-full bg-white transition-all" style={{ width: `${pct}%` }} />
                </div>
                {/* 4-stat grid */}
                <div className="grid grid-cols-2 gap-2.5">
                    <BStat label="OPI Score" value={score?.toFixed(2) ?? '—'} />
                    <BStat label="Target" value={target} />
                    <BStat label="OPI If Achieved" value={ifAch?.toFixed(2) ?? '—'} />
                    <BStat label="OPI If Missed" value={ifMiss?.toFixed(2) ?? '—'} />
                </div>
            </div>

            {/* ── Revenue impact ── */}
            {(revAch || revMiss) && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Revenue if Achieved</p>
                        <p className="text-lg font-extrabold text-emerald-800">{fmtINR(revAch)}</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-1">Revenue if Missed</p>
                        <p className="text-lg font-extrabold text-red-800">{fmtINR(revMiss)}</p>
                    </div>
                </div>
            )}

            {/* ── Trend chart ── */}
            {trend.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <SecTitle icon={<TrendingUp className="w-3.5 h-3.5" />} label="OPI Trend" />
                    {period && <p className="text-[10px] text-slate-400 -mt-2 mb-2">{period}</p>}
                    <TrendChart data={trend} xKey="date" yKey="value" color="#7c3aed" />
                </div>
            )}

            {/* ── Formula ── */}
            {formula && (
                <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-violet-500 mb-1">Formula</p>
                    <p className="text-xs font-semibold text-violet-800 leading-relaxed">{formula}</p>
                </div>
            )}

            {/* ── Dimensions ── */}
            {dims.length > 0 && (
                <div>
                    <SecTitle icon={<BarChart2 className="w-3.5 h-3.5" />} label={`${dims.length} Dimensions`} />
                    <div className="space-y-3">
                        {dims.map((d, i) => {
                            const sc = d.score ?? 0;
                            const delta = d.delta ?? 0;
                            const up = d.direction === 'up';
                            const dCls = statusCls(d.status || '');
                            return (
                                <div key={d.dimensionId || i} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                                    {/* Top row */}
                                    <div className="px-4 pt-3 pb-2 flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900">{d.dimensionName || `Dimension ${i + 1}`}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Weight: {d.weightPct ?? (d.weight * 100).toFixed(0)}% · Contribution: {d.contribution?.toFixed(1) ?? '—'}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`text-sm font-extrabold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {up ? '▲' : '▼'} {Math.abs(delta).toFixed(2)}
                                            </span>
                                            <span className="text-lg font-extrabold text-slate-900">{sc.toFixed(1)}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${dCls.pill}`}>{(d.status || '').toUpperCase()}</span>
                                        </div>
                                    </div>
                                    {/* Score bar */}
                                    <div className="px-4 pb-2">
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div className={`h-2 rounded-full ${dCls.bar} transition-all`} style={{ width: `${Math.min(sc, 100)}%` }} />
                                        </div>
                                    </div>
                                    {/* Component chips */}
                                    {d.components?.length > 0 && (
                                        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                                            {d.components.map((c, ci) => (
                                                <span key={ci} className="bg-slate-50 text-slate-600 border border-slate-100 text-[10px] font-medium px-2 py-0.5 rounded-lg">{c}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

/* DTIF/Sprint */
const DtifRenderer = ({ data }) => {
    const trend = data.trend || data.weekly_data || data.data_points || [];
    const dtif = data.dtif_pct ?? data.dtif_score ?? data.score;
    const stage = data.stage_name || data.stage || '';
    const transitions = data.total_transitions ?? data.transitions;
    const tk = trend.length ? tsKeys(trend[0]) : { xk: 'date', yk: 'value' };
    return (
        <div>
            <SummaryBanner grad="bg-gradient-to-br from-rose-600 to-red-700" icon={<Target className="w-4 h-4" />} subtitle="Stage Performance" label={stage || 'DTIF Overview'}>
                <BStat label="DTIF %" value={dtif != null ? `${Number(dtif).toFixed(1)}%` : '—'} />
                <BStat label="Stage" value={stage || '—'} />
                <BStat label="Transitions" value={transitions?.toLocaleString() || '—'} />
                <BStat label="Target" value={data.target_pct ? `${data.target_pct}%` : '85%'} />
            </SummaryBanner>
            {trend.length > 0 ? (
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm mb-5">
                    <SecTitle icon={<TrendingUp className="w-3.5 h-3.5" />} label="Historical Trend" />
                    <TrendChart data={trend} xKey={tk.xk} yKey={tk.yk} color="#ef4444" />
                </div>
            ) : (
                <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-500 mb-4">
                    <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    No trend data available for this stage.
                </div>
            )}
            <AutoKpiGrid obj={data} />
        </div>
    );
};

/* FORECAST — generic KPI + any arrays */
const ForecastRenderer = ({ data }) => {
    /* API returns a top-level array of forecast area objects */
    const areas = Array.isArray(data) ? data : (data.data || data.items || []);
    if (!areas.length) return <p className="text-sm text-slate-400 italic text-center py-12">No forecast data available.</p>;

    const green = areas.filter(a => a.status === 'green').length;
    const amber = areas.filter(a => a.status === 'amber').length;
    const red = areas.filter(a => a.status === 'red').length;

    const dotCls = s => s === 'green' ? 'bg-green-500' : s === 'amber' ? 'bg-amber-400' : 'bg-red-500';
    const barCls = s => s === 'green' ? 'bg-green-500' : s === 'amber' ? 'bg-amber-400' : 'bg-red-500';
    const cardBorder = s => s === 'green' ? 'border-l-green-500' : s === 'amber' ? 'border-l-amber-400' : 'border-l-red-500';

    return (
        <div className="space-y-4">
            {/* ── Summary banner ── */}
            <div className="bg-gradient-to-br from-sky-600 to-cyan-700 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 opacity-80" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">Delivery Forecast</p>
                </div>
                <p className="text-3xl font-extrabold mb-1">{areas.length} <span className="text-base font-semibold opacity-70">Areas Tracked</span></p>
                <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="bg-green-500/30 rounded-xl p-3 text-center">
                        <p className="text-2xl font-extrabold">{green}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mt-0.5">On Target</p>
                    </div>
                    <div className="bg-amber-400/30 rounded-xl p-3 text-center">
                        <p className="text-2xl font-extrabold">{amber}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mt-0.5">At Risk</p>
                    </div>
                    <div className="bg-red-500/30 rounded-xl p-3 text-center">
                        <p className="text-2xl font-extrabold">{red}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mt-0.5">Below Target</p>
                    </div>
                </div>
            </div>

            {/* ── Per-area cards ── */}
            <SecTitle icon={<BarChart2 className="w-3.5 h-3.5" />} label="Area Breakdown" />
            <div className="space-y-3">
                {areas.map((a, i) => {
                    const pct = a.target > 0 ? Math.min((a.value / a.target) * 100, 120) : 0;
                    const barW = Math.min(pct, 100);
                    const gapAbs = Math.abs(a.gap ?? 0).toFixed(1);
                    const ahead = (a.gap ?? 0) < 0;   /* negative gap = above target */
                    const up = a.trendDirection !== 'down';
                    return (
                        <div key={a.id || i} className={`bg-white border border-l-4 ${cardBorder(a.status)} border-gray-100 rounded-xl shadow-sm overflow-hidden`}>
                            {/* Header row */}
                            <div className="px-4 pt-3 pb-2 flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full shrink-0 ${dotCls(a.status)}`} />
                                        <p className="text-sm font-extrabold text-slate-900">{a.areaName || a.area}</p>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5 ml-4">{a.description}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xl font-extrabold text-slate-900">{a.value?.toFixed(1) ?? '—'}</p>
                                    <p className="text-[10px] text-slate-400">Target: {a.target}</p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="px-4 pb-2">
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${barCls(a.status)} transition-all`} style={{ width: `${barW}%` }} />
                                </div>
                                <div className="flex items-center justify-between mt-1.5">
                                    <span className={`text-[10px] font-bold ${ahead ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {ahead ? `▲ ${gapAbs} above target` : `▼ ${gapAbs} below target`}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{pct.toFixed(0)}% of target</span>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="px-4 pb-3 grid grid-cols-3 gap-3 border-t border-slate-50 pt-2">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Forecast</p>
                                    <p className="text-sm font-bold text-slate-800">{a.currentForecast ?? '—'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Previous</p>
                                    <p className="text-sm font-bold text-slate-800">{a.previousForecast ?? '—'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">Trend</p>
                                    <p className={`text-sm font-bold ${up ? 'text-emerald-600' : 'text-red-500'}`}>{up ? '▲ Up' : '▼ Down'}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* INSIGHTS */
const InsightsRenderer = ({ data }) => {
    const scalars = scalarKpis(data);
    const listArr = firstListArray(data);
    const trendEntry = Object.entries(data).find(([, v]) => isTimeSeries(v));
    return (
        <div>
            <SummaryBanner grad="bg-gradient-to-br from-emerald-600 to-teal-700" icon={<Lightbulb className="w-4 h-4" />} subtitle="AI Insights" label="Release Insights">
                {scalars.slice(0, 4).map(([k, v]) => <BStat key={k} label={k.replace(/_/g, ' ')} value={fmtNum(k, v)} />)}
                {scalars.length < 4 && [...Array(Math.max(0, 4 - scalars.length))].map((_, i) => <BStat key={i} label="" value="" />)}
            </SummaryBanner>
            {trendEntry && (
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm mb-5">
                    <SecTitle icon={<TrendingUp className="w-3.5 h-3.5" />} label={trendEntry[0].replace(/_/g, ' ')} />
                    <TrendChart data={trendEntry[1]} xKey={tsKeys(trendEntry[1][0]).xk} yKey={tsKeys(trendEntry[1][0]).yk} color="#10b981" />
                </div>
            )}
            {listArr && <div className="space-y-3">{listArr.map((item, i) => <AutoItemCard key={i} item={item} idx={i} />)}</div>}
            {!trendEntry && !listArr && scalars.length === 0 && (
                <p className="text-sm text-slate-400 italic text-center py-10">No insights data available.</p>
            )}
        </div>
    );
};

/* RECOMMENDATIONS */
const RecsRenderer = ({ data }) => {
    const items = data.items || data.recommendations || (Array.isArray(data) ? data : []);
    return (
        <div>
            <SummaryBanner grad="bg-gradient-to-br from-emerald-600 to-teal-700" icon={<Lightbulb className="w-4 h-4" />} subtitle="AI Recommendations" label="Actionable Recommendations">
                <BStat label="Total" value={data.total || items.length} />
                <BStat label="Pending" value={data.pending_count} />
                <BStat label="DTIF Impact" value={data.expected_dtif_delta ? `+${data.expected_dtif_delta}%` : '—'} />
                <BStat label="Revenue" value={fmtINR(data.revenue_impact)} />
            </SummaryBanner>
            <div className="space-y-3">
                {items.map((r, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-sm font-bold text-gray-900">{r.title || r.label || r.action || `Recommendation #${i + 1}`}</p>
                            {(r.priority || r.severity) && <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg shrink-0 ${sevCls(r.priority || r.severity)}`}>{r.priority || r.severity}</span>}
                        </div>
                        {r.description && <p className="text-xs text-slate-500 leading-relaxed mb-2">{r.description}</p>}
                        <div className="flex flex-wrap gap-2">
                            {r.expected_dtif_delta && <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg">+{r.expected_dtif_delta}% DTIF</span>}
                            {r.revenue_impact && <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-lg">{fmtINR(r.revenue_impact)}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ENGINEERING */
const EngRenderer = ({ data }) => {
    const teams = data.teams || data.engineers || (Array.isArray(data) ? data : []);
    const scalars = scalarKpis(data);
    return (
        <div>
            <SummaryBanner grad="bg-gradient-to-br from-slate-700 to-slate-900" icon={<Code2 className="w-4 h-4" />} subtitle="Engineering" label="Team Performance">
                {scalars.slice(0, 4).map(([k, v]) => <BStat key={k} label={k.replace(/_/g, ' ')} value={fmtNum(k, v)} />)}
                {scalars.length < 4 && [...Array(Math.max(0, 4 - scalars.length))].map((_, i) => <BStat key={i} label="" value="" />)}
            </SummaryBanner>
            <div className="space-y-3">
                {teams.map((t, i) => {
                    const util = t.utilization_pct || t.utilization || 0;
                    return (
                        <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-slate-900">{t.name || t.team || `Team #${i + 1}`}</p>
                                <p className={`text-sm font-extrabold ${util < 65 ? 'text-red-600' : util > 85 ? 'text-amber-500' : 'text-green-600'}`}>{util}%</p>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className={`h-2 rounded-full ${util < 65 ? 'bg-red-500' : util > 85 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${Math.min(util, 100)}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* PR AGING */
const PrRenderer = ({ data }) => {
    const prs = data.prs || data.items || (Array.isArray(data) ? data : []);
    const scalars = scalarKpis(data);
    return (
        <div>
            <SummaryBanner grad="bg-gradient-to-br from-pink-600 to-rose-700" icon={<GitPullRequest className="w-4 h-4" />} subtitle="PR Health" label="Pull Request Aging">
                {scalars.slice(0, 4).map(([k, v]) => <BStat key={k} label={k.replace(/_/g, ' ')} value={fmtNum(k, v)} />)}
                {scalars.length < 4 && [...Array(Math.max(0, 4 - scalars.length))].map((_, i) => <BStat key={i} label="" value="" />)}
            </SummaryBanner>
            <div className="space-y-2">
                {prs.map((p, i) => {
                    const age = p.age_days || p.days_open || p.review_days || 0;
                    return (
                        <div key={i} className={`bg-white border ${age > 3 ? 'border-red-200' : 'border-gray-100'} rounded-xl p-3 shadow-sm flex items-start justify-between gap-2`}>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{p.title || p.pr_title || `PR #${p.pr_number || i + 1}`}</p>
                                <p className="text-xs text-slate-400">{p.author || p.developer} · {p.repo || p.repository}</p>
                            </div>
                            <div className={`text-sm font-extrabold shrink-0 ${age > 3 ? 'text-red-600' : 'text-amber-500'}`}>{age}d</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* NOTIFICATIONS */
const NotifRenderer = ({ data }) => {
    const items = data.notifications || data.items || (Array.isArray(data) ? data : []);
    const scalars = scalarKpis(data);
    return (
        <div>
            <SummaryBanner grad="bg-gradient-to-br from-amber-500 to-orange-600" icon={<Bell className="w-4 h-4" />} subtitle="Alerts" label="Notifications">
                {scalars.slice(0, 4).map(([k, v]) => <BStat key={k} label={k.replace(/_/g, ' ')} value={fmtNum(k, v)} />)}
                {scalars.length < 4 && [...Array(Math.max(0, 4 - scalars.length))].map((_, i) => <BStat key={i} label="" value="" />)}
            </SummaryBanner>
            <div className="space-y-2">
                {items.map((n, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-start gap-3">
                        <span className="text-lg">{n.type === 'critical' ? '🔴' : n.type === 'warning' ? '🟡' : '🔵'}</span>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{n.title || n.message || n.label}</p>
                            {n.description && <p className="text-xs text-slate-500 mt-0.5">{n.description}</p>}
                        </div>
                        {n.created_at && <p className="text-[10px] text-slate-400 shrink-0">{n.created_at}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

/* DECISION ACTIONS */
const DecisionRenderer = ({ data }) => {
    const items = data.items || data.actions || (Array.isArray(data) ? data : []);
    const scalars = scalarKpis(data);
    return (
        <div>
            <SummaryBanner grad="bg-gradient-to-br from-cyan-600 to-teal-700" icon={<Target className="w-4 h-4" />} subtitle="Actions Queue" label="AI Decision Actions">
                {scalars.slice(0, 4).map(([k, v]) => <BStat key={k} label={k.replace(/_/g, ' ')} value={fmtNum(k, v)} />)}
                {scalars.length < 4 && [...Array(Math.max(0, 4 - scalars.length))].map((_, i) => <BStat key={i} label="" value="" />)}
            </SummaryBanner>
            <div className="space-y-3">
                {items.map((a, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-bold text-gray-900">{a.title || a.label || a.action || `Action #${i + 1}`}</p>
                            {a.priority && <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg shrink-0 ${sevCls(a.priority)}`}>{a.priority}</span>}
                        </div>
                        {a.description && <p className="text-xs text-slate-500 mt-1">{a.description}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

/* GENERIC — catch-all */
const GenericRenderer = ({ data }) => {
    if (Array.isArray(data)) {
        if (!data.length) return <p className="text-sm text-slate-400 italic text-center py-12">No data available</p>;
        if (typeof data[0] === 'object') return <div className="space-y-3">{data.map((item, i) => <AutoItemCard key={i} item={item} idx={i} />)}</div>;
        return <div className="flex flex-wrap gap-2">{data.map((x, i) => <span key={i} className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg">{String(x)}</span>)}</div>;
    }
    if (typeof data === 'object' && data) {
        const scalars = Object.entries(data).filter(([k, v]) => !BLACKLIST.has(k.toLowerCase()) && typeof v !== 'object');
        const nested = Object.entries(data).filter(([, v]) => typeof v === 'object' && v !== null);
        const trendEntry = Object.entries(data).find(([, v]) => isTimeSeries(v));
        return (
            <div className="space-y-5">
                {scalars.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        {scalars.map(([k, v]) => (
                            <div key={k} className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl p-3.5 shadow-sm">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{k.replace(/_/g, ' ')}</p>
                                <p className="text-xl font-extrabold text-slate-900">{fmtNum(k, v)}</p>
                            </div>
                        ))}
                    </div>
                )}
                {trendEntry && (
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                        <SecTitle icon={<TrendingUp className="w-3.5 h-3.5" />} label={trendEntry[0].replace(/_/g, ' ')} />
                        <TrendChart data={trendEntry[1]} xKey={tsKeys(trendEntry[1][0]).xk} yKey={tsKeys(trendEntry[1][0]).yk} color="#6366f1" />
                    </div>
                )}
                {nested.filter(([, v]) => !isTimeSeries(v)).map(([k, val]) => (
                    <div key={k}>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600 mb-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />{k.replace(/_/g, ' ')}
                        </p>
                        <GenericRenderer data={val} />
                    </div>
                ))}
            </div>
        );
    }
    return <p className="text-sm text-slate-800">{String(data)}</p>;
};

/* ── Smart Dispatcher ── */
const detectType = p => {
    if (!p) return 'generic';
    if (p.includes('/deals/')) return 'deals';
    if (p.includes('/rca/')) return 'rca';
    if (p.includes('/opi/')) return 'opi';
    if (p.includes('/recommendations/')) return 'recs';
    if (p.includes('/notifications/')) return 'notif';
    if (p.includes('/pr-aging/')) return 'pr';
    if (p.includes('/command-center/')) return 'eng';
    if (p.includes('/decision-actions/')) return 'decision';
    if (p.includes('/dtif/') || p.includes('/stage/')) return 'dtif';
    if (p.includes('/forecast/')) return 'forecast';
    if (p.includes('/insights/')) return 'insights';
    return 'generic';
};

const SmartRenderer = ({ data, apiPath }) => {
    if (!data) return <p className="text-sm text-slate-400 text-center py-12">No data returned</p>;
    const payload = data?.data ?? data;
    switch (detectType(apiPath || '')) {
        case 'deals': return <DealsRenderer data={payload} />;
        case 'rca': return <RcaRenderer data={payload} />;
        case 'opi': return <OpiRenderer data={payload} />;
        case 'recs': return <RecsRenderer data={payload} />;
        case 'notif': return <NotifRenderer data={payload} />;
        case 'pr': return <PrRenderer data={payload} />;
        case 'eng': return <EngRenderer data={payload} />;
        case 'decision': return <DecisionRenderer data={payload} />;
        case 'dtif': return <DtifRenderer data={payload} />;
        case 'forecast': return <ForecastRenderer data={payload} />;
        case 'insights': return <InsightsRenderer data={payload} />;
        default: return <GenericRenderer data={payload} />;
    }
};

/* ── Drill-Down Panel ── */
const DrillDownPanel = ({ open, title, apiPath, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [payload, setPayload] = useState(null);

    const load = useCallback(async () => {
        if (!apiPath) return;
        setLoading(true); setError(null); setPayload(null);
        try {
            const path = apiPath.replace(/^\/api\//, '/');
            const res = await itsmApiClient.get(path);
            setPayload(res.data);
        } catch (e) { console.error(e); setError('Failed to load data. Please retry.'); }
        finally { setLoading(false); }
    }, [apiPath]);

    useEffect(() => { if (open && apiPath) load(); }, [open, apiPath, load]);
    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
            <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-slate-50 shadow-2xl z-50 flex flex-col">
                <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-extrabold text-indigo-500 tracking-widest uppercase">Drill-Down</p>
                        <h2 className="text-base font-extrabold text-slate-900 mt-0.5 leading-tight">{title}</h2>
                        <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">{apiPath}</p>
                    </div>
                    <div className="flex gap-1 shrink-0 mt-1">
                        {!loading && payload && <button onClick={load} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700" title="Refresh"><RefreshCw className="w-4 h-4" /></button>}
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900"><X className="w-4 h-4" /></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {loading && <div className="flex flex-col items-center justify-center h-full gap-4"><div className="w-10 h-10 rounded-full border-[3px] border-indigo-200 border-t-indigo-600 animate-spin" /><p className="text-sm text-slate-500">Loading…</p></div>}
                    {!loading && error && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /><p className="text-sm text-red-700 flex-1">{error}</p>
                            <button onClick={load} className="text-xs font-bold text-red-600 underline">Retry</button>
                        </div>
                    )}
                    {!loading && payload && !error && <SmartRenderer data={payload} apiPath={apiPath} />}
                </div>
                <div className="px-6 py-3 border-t border-slate-200 bg-white flex justify-end">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">Close</button>
                </div>
            </div>
        </>
    );
};

/* ── Dashboard Sub-components ── */
const SubItemRow = ({ item, onDrill }) => (
    <button onClick={() => onDrill(item.drill_down_api, item.label)}
        className="w-full flex items-start justify-between py-2.5 border-b border-gray-100 last:border-0 gap-3 hover:bg-indigo-50/60 -mx-4 px-4 rounded-lg transition-colors text-left group">
        <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 flex items-center gap-1 group-hover:text-indigo-700">
                {item.label}<ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-indigo-400" />
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{item.description}</p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1 pt-0.5">
            <span className="text-sm font-extrabold text-gray-900">{item.value}<span className="text-xs font-normal text-slate-400 ml-0.5">{item.unit}</span></span>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.status_color }} />
        </div>
    </button>
);

const SectionCard = ({ section, onSubDrill, onCardDrill, onActionClick, isCEO }) => {
    const icon = ICON_MAP[section.icon] || <Briefcase className="w-4 h-4" />;
    const badgeCls = { healthy: 'bg-green-100 text-green-700', warning: 'bg-amber-100 text-amber-700', critical: 'bg-red-100 text-red-700' }[section.overall_status] || 'bg-slate-100 text-slate-600';
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">
            <div className="h-1.5" style={{ backgroundColor: section.color }} />
            <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2 border-b border-gray-100">
                <div className="flex items-center gap-2 min-w-0">
                    <span style={{ color: section.color }}>{icon}</span>
                    <h3 className="text-sm font-bold text-gray-900 truncate">{section.label}</h3>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-lg font-extrabold text-gray-900">{section.overall_score}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeCls}`}>{section.overall_status?.toUpperCase()}</span>
                </div>
            </div>
            <div className="px-4 py-1 flex-1">
                {section.sub_items?.map(item => <SubItemRow key={item.id} item={item} onDrill={onSubDrill} />)}
            </div>
            {section.itsm_action_pills?.length > 0 && (
                <div className="px-4 pb-3 pt-1 flex flex-wrap gap-1.5">
                    {section.itsm_action_pills.slice(0, 4).map(p => (
                        <button key={p.id} onClick={() => onActionClick && onActionClick(p.id, p.label)}
                            className="flex items-center gap-1 text-[10px] font-semibold border border-gray-200 rounded-full px-2.5 py-1 text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">
                            {p.label}{isCEO && <ChevronRight className="w-2.5 h-2.5 opacity-60" />}
                        </button>
                    ))}
                    {section.itsm_action_pills.length > 4 && <span className="text-[10px] text-slate-400 self-center">+{section.itsm_action_pills.length - 4} more</span>}
                </div>
            )}
            {section.drill_down && (
                <button onClick={() => onCardDrill(section.drill_down.api, section.drill_down.label)}
                    className="w-full px-4 py-2.5 bg-slate-50 border-t border-gray-100 flex items-center justify-between hover:bg-indigo-50 transition-colors group">
                    <span className="text-[11px] font-semibold text-slate-500 group-hover:text-indigo-700">{section.drill_down.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
                </button>
            )}
        </div>
    );
};

const AgentCol = ({ title, tags, tagColor, items }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex-1">
        <p className="text-xs font-bold text-gray-800 mb-2">{title}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">{tags?.map(t => <span key={t} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagColor}`}>{t}</span>)}</div>
        <ul className="space-y-1.5">{items?.map(i => <li key={i.id} className="flex items-start gap-2 text-xs text-slate-700"><span className="text-slate-300 shrink-0 mt-0.5">▸</span><span>{i.label}</span></li>)}</ul>
    </div>
);

/* ── Main Page ── */
const ITSMSearchPage = ({ currentUser, onSearch, onActionClick, onConnectMore, onLogout }) => {
    const [query, setQuery] = useState('');
    const [connected, setConnected] = useState([]);
    const [sections, setSections] = useState([]);
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [panel, setPanel] = useState({ open: false, title: '', api: '' });
    const isCEO = currentUser?.role === 'itsm-ceo';

    useEffect(() => {
        (async () => {
            setLoading(true); setError(null);
            try {
                const res = await ceoItsmService.getHome();
                if (res?.success && res?.data) { setConnected(res.data.connected_sources || []); setSections(res.data.dashboard_sections || []); setAgent(res.data.agent_intelligence || null); }
                else setError('Failed to load dashboard.');
            } catch (e) { console.error(e); setError('Unable to reach the server.'); }
            finally { setLoading(false); }
        })();
    }, []);

    const handleSearch = e => { e.preventDefault(); if (query.trim()) onSearch && onSearch(query.trim()); };

    const handleDrill = (api, title) => {
        if (!api) return;
        if (api.includes('/itsm/ceo/kpi-detail')) {
            const id = new URLSearchParams(api.split('?')[1] || '').get('action_id');
            if (id) { onActionClick && onActionClick(id, title); return; }
        }
        setPanel({ open: true, title, api });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-white">
                <img src="https://experienceflow.ai/wp-content/uploads/2024/05/Logo-with-Tagline-240px.svg" alt="EF" className="h-9 w-auto" onError={e => { e.target.style.display = 'none'; }} />
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700">{isCEO ? '👔' : '🛠'} {currentUser?.name || currentUser?.email?.split('@')[0]}</span>
                    <button onClick={onLogout} className="text-sm text-slate-400 hover:text-red-500 transition-colors">Logout</button>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-4xl font-bold text-slate-900 mb-1">{greeting()}!</h1>
                    <p className="text-slate-400 text-sm mb-6">Today is {fmtDate()}.</p>
                    <form onSubmit={handleSearch} className="w-full max-w-2xl">
                        <div className="flex items-center border border-slate-200 rounded-2xl px-5 py-3 shadow-sm bg-white hover:shadow-md transition-shadow gap-3">
                            <Search className="w-5 h-5 text-slate-400" />
                            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ask anything for business…" className="flex-1 text-slate-700 outline-none bg-transparent placeholder-slate-300" />
                            <button type="button" className="p-1 rounded-full hover:bg-slate-100"><Mic className="w-5 h-5 text-slate-400" /></button>
                            <button type="submit" className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors">Search</button>
                        </div>
                    </form>
                </div>
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">Data Sources</p>
                        <button onClick={onConnectMore} className="flex items-center gap-1 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors"><Plus className="w-3.5 h-3.5" />Connect More</button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {ALL_SOURCES.map(src => (
                            <div key={src.id} className="relative flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 bg-white shadow-sm hover:shadow transition-all">
                                <img src={src.logo} alt={src.name} className="w-5 h-5 object-contain" />
                                <span className="text-sm font-semibold text-slate-700">{src.name}</span>
                                {connected.includes(src.id) && <CheckCircle2 className="w-4 h-4 text-green-500 absolute -top-1.5 -right-1.5" />}
                            </div>
                        ))}
                    </div>
                </div>
                {error && <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"><AlertTriangle className="w-4 h-4" />{error}</div>}
                {loading && <div className="flex items-center justify-center py-16 gap-3 text-slate-400"><Loader2 className="w-6 h-6 animate-spin" /><span className="text-sm">Loading dashboard…</span></div>}
                {!loading && sections.length > 0 && (
                    <div className="mb-10">
                        <p className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-4">CEO Executive Dashboard</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {sections.map(s => <SectionCard key={s.id} section={s} onSubDrill={handleDrill} onCardDrill={handleDrill} onActionClick={onActionClick} isCEO={isCEO} />)}
                        </div>
                    </div>
                )}
                {!loading && agent && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-1"><Zap className="w-4 h-4 text-indigo-500" /><h2 className="text-sm font-bold text-indigo-900">{agent.title}</h2></div>
                        <p className="text-xs text-indigo-600 mb-4">{agent.description}</p>
                        <div className="flex flex-col lg:flex-row gap-3">
                            <AgentCol title={agent.actionable_insights?.label} tags={agent.actionable_insights?.tags} tagColor="bg-red-100 text-red-700" items={agent.actionable_insights?.items} />
                            <AgentCol title={agent.actionable_labels?.label} tags={agent.actionable_labels?.tags} tagColor="bg-amber-100 text-amber-700" items={agent.actionable_labels?.items} />
                            <AgentCol title={agent.actionable_recommendations?.label} tags={agent.actionable_recommendations?.tags} tagColor="bg-green-100 text-green-700" items={agent.actionable_recommendations?.items} />
                        </div>
                    </div>
                )}
            </main>
            <DrillDownPanel open={panel.open} title={panel.title} apiPath={panel.api} onClose={() => setPanel({ open: false, title: '', api: '' })} />
        </div>
    );
};
export default ITSMSearchPage;
