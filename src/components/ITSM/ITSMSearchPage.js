import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, Mic, Plus, CheckCircle2, Loader2, AlertTriangle,
    Briefcase, Users, Code2, Monitor, Shield, Brain, Bell, BarChart2,
    ChevronRight, Zap, X, RefreshCw, TrendingUp, TrendingDown,
    AlertCircle, Clock, GitPullRequest, Activity, Target, Lightbulb, DollarSign, Flame, Layers,
} from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
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
    /* API: { data: [], total, openCount, p1Count, p2Count } */
    const list = Array.isArray(data) ? data : (data.data || []);
    const total = data.total ?? list.length;
    const open = data.openCount ?? list.filter(r => r.isOpen).length;
    const p1 = data.p1Count ?? 0;
    const p2 = data.p2Count ?? 0;

    const [expanded, setExpanded] = React.useState(null);
    const toggle = id => setExpanded(prev => prev === id ? null : id);

    const sevGrad = s => {
        const v = String(s || '').toUpperCase();
        if (v === 'CRITICAL') return { pill: 'bg-red-600 text-white', border: 'border-l-red-600', badge: 'bg-red-600 text-white' };
        if (v === 'HIGH') return { pill: 'bg-orange-500 text-white', border: 'border-l-orange-500', badge: 'bg-orange-500 text-white' };
        if (v === 'MEDIUM') return { pill: 'bg-amber-400 text-gray-900', border: 'border-l-amber-400', badge: 'bg-amber-400 text-gray-900' };
        return { pill: 'bg-slate-200 text-slate-700', border: 'border-l-slate-300', badge: 'bg-slate-200 text-slate-700' };
    };

    return (
        <div className="space-y-4">
            {/* ── Summary banner ── */}
            <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 opacity-80" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">Top Risks · Root Cause Analysis</p>
                </div>
                <p className="text-3xl font-extrabold mb-1">{total} <span className="text-base font-semibold opacity-70">Incidents Tracked</span></p>
                <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="bg-white/20 rounded-xl p-3 text-center">
                        <p className="text-2xl font-extrabold">{open}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mt-0.5">Open</p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-3 text-center">
                        <p className="text-2xl font-extrabold">{p1}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mt-0.5">CRITICAL</p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-3 text-center">
                        <p className="text-2xl font-extrabold">{p2}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mt-0.5">HIGH</p>
                    </div>
                </div>
            </div>

            {/* ── Per-incident cards ── */}
            <SecTitle icon={<AlertTriangle className="w-3.5 h-3.5" />} label={`${list.length} Active Incidents`} />
            <div className="space-y-3">
                {list.map((r, i) => {
                    const cls = sevGrad(r.severity);
                    const isExp = expanded === r.id;
                    const rev = r.context?.impactRevenue;
                    const days = r.context?.impactDays;
                    const whyChain = r.why?.full_why_chain || [];
                    const signals = r.why?.signals || [];
                    const opts = r.action?.recommended_options || [];
                    const tags = r.context?.tags || [];
                    const prevTags = r.preventive?.prevention_tags || [];

                    return (
                        <div key={r.id || i} className={`bg-white border border-l-4 ${cls.border} border-gray-100 rounded-xl shadow-sm overflow-hidden`}>
                            {/* ── Card header (always visible) ── */}
                            <button
                                className="w-full px-4 pt-3 pb-3 text-left"
                                onClick={() => toggle(r.id)}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${cls.badge}`}>{r.severity}</span>
                                            <span className="text-[10px] font-mono text-slate-400">{r.rca_code}</span>
                                            <span className="text-[10px] text-slate-400">{r.reason?.cause_group}</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 leading-snug">{r.reason?.title || `Incident #${i + 1}`}</p>
                                    </div>
                                    <div className="shrink-0 flex flex-col items-end gap-1">
                                        {r.reason?.dtif_impact_pct != null && (
                                            <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg">
                                                DTIF -{r.reason.dtif_impact_pct}%
                                            </span>
                                        )}
                                        <span className="text-slate-300 text-xs">{isExp ? '▲' : '▼'}</span>
                                    </div>
                                </div>

                                {/* Key impact pills (always visible) */}
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {rev > 0 && <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-lg">💰 {fmtINR(rev)} at risk</span>}
                                    {days > 0 && <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-lg">⏱ {days}d delay risk</span>}
                                    <span className="bg-slate-50 text-slate-600 text-[10px] px-2 py-0.5 rounded-lg">{r.context?.department} · {r.context?.stage}</span>
                                </div>
                            </button>

                            {/* ── Expanded details ── */}
                            {isExp && (
                                <div className="border-t border-slate-100">
                                    {/* Cause display text */}
                                    {r.reason?.display_text && (
                                        <div className="px-4 py-3 bg-red-50 border-b border-red-100">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-1">Root Cause</p>
                                            <p className="text-xs text-red-800 leading-relaxed">{r.reason.display_text}</p>
                                        </div>
                                    )}

                                    {/* Signals grid */}
                                    {signals.length > 0 && (
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Health Signals</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {signals.map((s, si) => (
                                                    <div key={si} className="bg-slate-50 rounded-lg p-2.5 flex items-center justify-between">
                                                        <p className="text-[10px] text-slate-500 leading-tight">{s.label}</p>
                                                        <span className={`text-sm font-extrabold shrink-0 ml-1 ${s.direction === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                            {s.value}{s.unit === '%' ? '%' : ''}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 5-Why chain */}
                                    {whyChain.length > 0 && (
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">5-Why Analysis</p>
                                            <div className="space-y-2">
                                                {whyChain.map((w, wi) => (
                                                    <div key={wi} className="flex gap-2.5">
                                                        <span className="shrink-0 w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-extrabold flex items-center justify-center mt-0.5">{w.level}</span>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-violet-600">{w.label}</p>
                                                            <p className="text-xs text-slate-700 leading-relaxed">{w.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Recommended options */}
                                    {opts.length > 0 && (
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Recommended Options</p>
                                            <div className="space-y-2">
                                                {opts.map((o, oi) => (
                                                    <div key={oi} className={`rounded-xl p-3 flex items-start justify-between gap-2 ${oi === 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-100'}`}>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${oi === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-400 text-white'}`}>#{o.rank}</span>
                                                                <p className="text-xs font-bold text-slate-900">{o.label}</p>
                                                            </div>
                                                        </div>
                                                        <div className="shrink-0 text-right">
                                                            <p className={`text-sm font-extrabold ${o.expected_dtif_delta_pct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                                {o.expected_dtif_delta_pct >= 0 ? '+' : ''}{o.expected_dtif_delta_pct}%
                                                            </p>
                                                            <p className="text-[10px] text-slate-400">DTIF Δ</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action summary */}
                                    {r.action?.display_text && (
                                        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">Recommended Action</p>
                                            <p className="text-xs text-blue-800 leading-relaxed">{r.action.display_text}</p>
                                        </div>
                                    )}

                                    {/* Preventive */}
                                    {r.preventive?.display_text && (
                                        <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">Prevention</p>
                                            <p className="text-xs text-amber-900 leading-relaxed mb-2">{r.preventive.display_text}</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {prevTags.map((t, ti) => (
                                                    <span key={ti} className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-lg">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Context tags */}
                                    {tags.length > 0 && (
                                        <div className="px-4 py-3 flex flex-wrap gap-1.5">
                                            {tags.map((t, ti) => (
                                                <span key={ti} className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-lg">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
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
    /* API: { stage, stage_name, owner_dept, dtif_pct, total_transitions, dtif_count, avg_cycle_hours, status, status_color, trend[] } */
    const d = data?.data || data || {};
    const trend = d.trend || [];
    const dtif = d.dtif_pct ?? d.dtif_score ?? d.score;
    const stage = d.stage_name || d.stage || '';
    const statuCol = d.status === 'critical' ? 'from-red-700 to-rose-800'
        : d.status === 'warning' ? 'from-amber-600 to-orange-700'
            : 'from-emerald-600 to-teal-700';
    const statBadge = d.status === 'critical'
        ? 'bg-red-100 text-red-700' : d.status === 'warning'
            ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';

    // Subsample trend for chart readability (max 60 points)
    const step = Math.max(1, Math.floor(trend.length / 60));
    const chartData = trend.filter((_, i) => i % step === 0);

    return (
        <div className="space-y-4">
            {/* ── Hero Banner ── */}
            <div className={`bg-gradient-to-br ${statuCol} rounded-2xl p-5 text-white`}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 opacity-80" />
                        <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">Stage Performance</p>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${statBadge}`}>
                        {(d.status || 'unknown').toUpperCase()}
                    </span>
                </div>
                <p className="text-3xl font-extrabold mb-0.5">{dtif != null ? `${Number(dtif).toFixed(1)}%` : '—'}</p>
                <p className="text-xs font-bold opacity-80 mb-3">{stage || 'Execution & Delivery'}</p>

                {/* DTIF progress bar vs 85% target */}
                <div className="mb-3">
                    <div className="flex justify-between text-[10px] mb-1 opacity-80">
                        <span>DTIF: {dtif != null ? `${Number(dtif).toFixed(1)}%` : '—'}</span>
                        <span>Target: {d.target_pct ?? 85}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2.5">
                        <div className="h-2.5 rounded-full bg-white transition-all"
                            style={{ width: `${Math.min(dtif ?? 0, 100)}%` }} />
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-xs font-extrabold">{dtif != null ? `${Number(dtif).toFixed(1)}%` : '—'}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">DTIF</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-xs font-extrabold">{d.total_transitions?.toLocaleString() ?? '—'}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">Transitions</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-xs font-extrabold">{d.dtif_count != null ? `${Number(d.dtif_count).toLocaleString()}%` : '—'}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">DTIF Count</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-xs font-extrabold">{d.avg_cycle_hours != null ? `${d.avg_cycle_hours}h` : '—'}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">Avg Cycle</p>
                    </div>
                </div>
            </div>

            {/* ── Stage Info Row ── */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Stage', value: d.stage },
                    { label: 'Owner Dept', value: d.owner_dept },
                    { label: 'SLA Hours', value: d.sla_hours != null ? `${d.sla_hours}h` : 'N/A' },
                ].map(({ label, value }) => (
                    <div key={label} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                        <p className="text-[10px] text-slate-500 font-semibold">{label}</p>
                        <p className="text-sm font-extrabold text-slate-900 mt-0.5">{value || '—'}</p>
                    </div>
                ))}
            </div>

            {/* ── Multi-line Trend Chart ── */}
            {chartData.length > 1 ? (
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <SecTitle icon={<TrendingUp className="w-3.5 h-3.5" />} label="Historical Trend — DTIF / On-Time / In-Full" />
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData} margin={{ top: 5, right: 8, left: -24, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 8 }}
                                tickFormatter={v => v?.slice(5)}
                                interval={Math.floor(chartData.length / 8)} />
                            <YAxis tick={{ fontSize: 8 }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                            <Tooltip
                                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                                formatter={(v, name) => [`${Number(v).toFixed(1)}%`, name]}
                                labelFormatter={l => l}
                            />
                            <Line type="monotone" dataKey="dtif_pct" name="DTIF" stroke="#ef4444" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="on_time_pct" name="On-Time" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                            <Line type="monotone" dataKey="in_full_pct" name="In-Full" stroke="#10b981" strokeWidth={1.5} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                        {[['#ef4444', 'DTIF %'], ['#3b82f6', 'On-Time %'], ['#10b981', 'In-Full %']].map(([c, label]) => (
                            <div key={label} className="flex items-center gap-1.5">
                                <div className="w-4 h-2 rounded-full" style={{ background: c }} />
                                <span className="text-[10px] text-slate-500">{label}</span>
                            </div>
                        ))}
                        <span className="text-[10px] text-slate-400 ml-auto">{trend.length} data points · showing every {step}th</span>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-500">
                    <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    No trend data available for this stage.
                </div>
            )}
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

/* INSIGHTS — /dashboard/insights/ : Release Readiness */
const InsightsRenderer = ({ data }) => {
    /* API shape: { context{}, insight{ severity, title, summary, signals[], recommendation, impact, actions[], blockers[], top_risks[], critical_modules[], critical_decisions[] } } */
    const ctx = data?.context || data?.data?.context || {};
    const ins = data?.insight || data?.data?.insight || data || {};
    const blockers = ins.blockers || [];
    const topRisks = ins.top_risks || [];
    const critModules = ins.critical_modules || [];
    const critDecisions = ins.critical_decisions || [];
    const signals = ins.signals || [];
    const actions = ins.actions || [];

    const sevBanner = s => s === 'CRITICAL' ? 'from-red-700 to-rose-800'
        : s === 'WARNING' ? 'from-amber-600 to-orange-700'
            : 'from-emerald-600 to-teal-700';
    const sevBadge = s => s === 'CRITICAL' ? 'bg-red-100 text-red-700'
        : s === 'WARNING' ? 'bg-amber-100 text-amber-700'
            : 'bg-emerald-100 text-emerald-700';
    const healthClr = h => h === 'CRITICAL' ? 'bg-red-100 text-red-700'
        : h === 'RED' ? 'bg-orange-100 text-orange-700'
            : h === 'AMBER' ? 'bg-amber-100 text-amber-700'
                : 'bg-emerald-100 text-emerald-700';
    const riskClr = r => r === 'AT_RISK' ? 'bg-red-100 text-red-700'
        : r === 'WATCH' ? 'bg-amber-100 text-amber-700'
            : 'bg-emerald-100 text-emerald-700';

    const [openBlocker, setOpenBlocker] = React.useState(null);
    const [openAction, setOpenAction] = React.useState(null);

    return (
        <div className="space-y-4">
            {/* ── Severity Banner ── */}
            <div className={`bg-gradient-to-br ${sevBanner(ins.severity)} rounded-2xl p-5 text-white`}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 opacity-80" />
                        <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">
                            {ctx.entity_name || 'Company'} · Release Readiness
                        </p>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${sevBadge(ins.severity)}`}>
                        {ins.severity}
                    </span>
                </div>
                <p className="text-sm font-bold mb-1 leading-snug">{ins.title}</p>
                <p className="text-[10px] opacity-70 leading-relaxed mb-3">{ins.summary}</p>

                <div className="grid grid-cols-4 gap-2">
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-sm font-extrabold">{blockers.length}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">Blockers</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-sm font-extrabold">{topRisks.length}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">At-Risk</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-sm font-extrabold">{critModules.length}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">Crit Mods</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-sm font-extrabold">{critDecisions.length}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">Decisions</p>
                    </div>
                </div>
            </div>

            {/* ── Live Signals ── */}
            {signals.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <SecTitle icon={<Activity className="w-3.5 h-3.5" />} label="Live Signals" />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {signals.map((s, i) => {
                            const isCrit = s.startsWith('CRITICAL');
                            const isRed = s.startsWith('RED');
                            const isRisk = s.startsWith('Finance');
                            return (
                                <span key={i} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${isCrit ? 'bg-red-100 text-red-700'
                                    : isRed ? 'bg-orange-100 text-orange-700'
                                        : isRisk ? 'bg-purple-100 text-purple-700'
                                            : 'bg-slate-100 text-slate-600'
                                    }`}>{s}</span>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Impact & Recommendation ── */}
            {(ins.impact || ins.recommendation) && (
                <div className="grid grid-cols-1 gap-3">
                    {ins.impact && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                            <p className="text-[10px] font-extrabold text-red-700 uppercase mb-1">💰 Impact</p>
                            <p className="text-xs text-red-800 leading-relaxed">{ins.impact}</p>
                        </div>
                    )}
                    {ins.recommendation && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                            <p className="text-[10px] font-extrabold text-blue-700 uppercase mb-1">💡 Recommendation</p>
                            <p className="text-xs text-blue-800 leading-relaxed">{ins.recommendation}</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── Critical Modules ── */}
            {critModules.length > 0 && (
                <div>
                    <SecTitle icon={<Layers className="w-3.5 h-3.5" />} label="Critical Modules" />
                    <div className="grid grid-cols-1 gap-2 mt-2">
                        {critModules.map((m, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-xs font-bold text-slate-900">{m.name}</p>
                                    <p className="text-[10px] text-slate-400">{m.project_name} · {m.module_code}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {m.finance_at_risk && (
                                        <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">₹ At Risk</span>
                                    )}
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${healthClr(m.status)}`}>
                                        {m.status}
                                    </span>
                                    <span className="text-sm font-extrabold text-slate-700">{m.score?.toFixed(0)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Top Finance Risks ── */}
            {topRisks.length > 0 && (
                <div>
                    <SecTitle icon={<DollarSign className="w-3.5 h-3.5" />} label="Finance Milestones at Risk" />
                    <div className="space-y-2 mt-2">
                        {topRisks.map((r, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">{r.title}</p>
                                        <p className="text-[10px] text-slate-400">{r.project_name} · {r.milestone_code}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-extrabold text-purple-700">₹{(r.amount_inr / 100000).toFixed(1)}L</p>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${riskClr(r.status)}`}>{r.status}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] text-slate-500">Due: {r.due_date}</span>
                                    <span className={`text-[10px] font-bold ${r.days_to_due <= 7 ? 'text-red-600' : 'text-amber-600'}`}>
                                        {r.days_to_due}d remaining
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-relaxed">{r.risk_reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Blockers ── */}
            {blockers.length > 0 && (
                <div>
                    <SecTitle icon={<AlertTriangle className="w-3.5 h-3.5" />} label={`Blocked Features (${blockers.length})`} />
                    <div className="space-y-2 mt-2">
                        {blockers.map((b, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                                <button
                                    className="w-full p-3 text-left flex items-center justify-between gap-2"
                                    onClick={() => setOpenBlocker(openBlocker === i ? null : i)}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded shrink-0 ${healthClr(b.health_status)}`}>
                                            {b.health_status}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-900 truncate">{b.feature_name}</p>
                                            <p className="text-[10px] text-slate-400">{b.module_name} · {b.assignee}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {b.github?.prs_open > 0 && (
                                            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                                                {b.github.prs_open} PR
                                            </span>
                                        )}
                                        {b.finance?.amount_lakh && (
                                            <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-1.5 py-0.5 rounded">
                                                ₹{b.finance.amount_lakh}L
                                            </span>
                                        )}
                                        <span className="text-slate-400 text-xs">{openBlocker === i ? '▲' : '▼'}</span>
                                    </div>
                                </button>
                                {openBlocker === i && (
                                    <div className="border-t border-gray-100 p-3 space-y-2 bg-slate-50">
                                        {/* JIRA */}
                                        {b.jira && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[10px] font-bold text-slate-600">JIRA:</span>
                                                <a href={b.jira.url} target="_blank" rel="noreferrer"
                                                    className="text-[10px] text-blue-600 hover:underline font-mono">{b.jira.ticket}</a>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${b.jira.status === 'BLOCKED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>{b.jira.status}</span>
                                                <span className="text-[10px] text-slate-400">{b.jira.days_open}d open</span>
                                            </div>
                                        )}
                                        {/* GitHub */}
                                        {b.github && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[10px] font-bold text-slate-600">GitHub:</span>
                                                <a href={b.github.branch_url} target="_blank" rel="noreferrer"
                                                    className="text-[10px] text-indigo-600 hover:underline font-mono truncate max-w-[160px]">{b.github.branch}</a>
                                                <span className="text-[10px] text-slate-400">
                                                    {b.github.last_commit_days}d since last commit
                                                </span>
                                            </div>
                                        )}
                                        {/* Finance */}
                                        {b.finance && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[10px] font-bold text-slate-600">Milestone:</span>
                                                <span className="text-[10px] text-slate-700">{b.finance.title}</span>
                                                <span className="text-[10px] font-bold text-purple-700">₹{b.finance.amount_lakh}L</span>
                                                <span className={`text-[10px] font-bold ${b.finance.days_to_due <= 7 ? 'text-red-600' : 'text-amber-600'}`}>
                                                    {b.finance.days_to_due}d to due
                                                </span>
                                            </div>
                                        )}
                                        {/* Leave */}
                                        {b.leave && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-600">Leave:</span>
                                                <span className="text-[10px] text-amber-700">{b.leave.status} · {b.leave.from} – {b.leave.to}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Critical AI Decisions ── */}
            {critDecisions.length > 0 && (
                <div>
                    <SecTitle icon={<Brain className="w-3.5 h-3.5" />} label="AI Decision Actions Required" />
                    <div className="space-y-2 mt-2">
                        {critDecisions.map((dec, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                                <button
                                    className="w-full p-3 text-left flex items-center gap-2"
                                    onClick={() => setOpenAction(openAction === i ? null : i)}
                                >
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded shrink-0 ${dec.decision_type === 'ESCALATE' ? 'bg-red-100 text-red-700'
                                        : dec.decision_type === 'DECISION_REQUIRED' ? 'bg-amber-100 text-amber-700'
                                            : 'bg-blue-100 text-blue-700'
                                        }`}>{dec.decision_type?.replace(/_/g, ' ')}</span>
                                    <p className="text-xs font-bold text-slate-900 flex-1 text-left">{dec.title}</p>
                                    <span className="text-slate-400 text-xs shrink-0">{openAction === i ? '▲' : '▼'}</span>
                                </button>
                                {openAction === i && (
                                    <div className="border-t border-gray-100 p-3 bg-blue-50">
                                        <p className="text-[11px] text-blue-800 leading-relaxed">{dec.recommendation}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Suggested Actions ── */}
            {actions.length > 0 && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <SecTitle icon={<CheckCircle2 className="w-3.5 h-3.5" />} label="Suggested Actions" />
                    <ol className="space-y-2 mt-2 list-decimal list-inside">
                        {actions.map((a, i) => (
                            <li key={i} className="text-[11px] text-slate-700 leading-relaxed">{a}</li>
                        ))}
                    </ol>
                </div>
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

/* ENGINEERING / TEAM PERFORMANCE */
const EngRenderer = ({ data }) => {
    /* API: { data: { context, insight: { metrics, kpis, stage_breakdown, active_deals, rca_events, recommendations, signals, trend } } } */
    const ctx = data?.context || data?.data?.context || {};
    const ins = data?.insight || data?.data?.insight || data?.data || data || {};
    const metrics = ins.metrics || {};
    const kpis = ins.kpis || [];
    const stages = ins.stage_breakdown || [];
    const deals = ins.active_deals || [];
    const rcaEvts = ins.rca_events || [];
    const recs = ins.recommendations || [];
    const signals = ins.signals || [];
    const trend = ins.trend || [];

    const kpiColor = s => s === 'healthy' ? 'text-emerald-600 bg-emerald-50' : s === 'warning' ? 'text-amber-600 bg-amber-50' : s === 'critical' ? 'text-red-600 bg-red-50' : 'text-slate-600 bg-slate-50';
    const stgColor = s => s === 'critical' ? 'text-red-600' : s === 'warning' ? 'text-amber-600' : 'text-emerald-600';
    const dealPriColor = p => p === 'P1_CRITICAL' ? 'bg-red-100 text-red-700' : p === 'P2_HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600';

    const [showRec, setShowRec] = React.useState(false);

    return (
        <div className="space-y-4">
            {/* ── Header banner ── */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <Code2 className="w-4 h-4 opacity-80" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">Team Performance · {ctx.entity_name || 'Engineering Command Center'}</p>
                </div>
                <div className="flex items-end gap-3 mb-3">
                    <p className="text-4xl font-extrabold">{metrics.dtif_pct?.toFixed(1) ?? ins.dtif_pct?.toFixed(1) ?? '—'}%</p>
                    <div className="mb-1">
                        <p className="text-xs font-bold text-emerald-400">DTIF Score</p>
                        <p className="text-[10px] opacity-60">{ins.title || ins.summary?.slice(0, 80)}</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-extrabold">{metrics.on_time_pct?.toFixed(1) ?? '—'}%</p>
                        <p className="text-[10px] opacity-70 mt-0.5 font-semibold">On Time</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-extrabold">{metrics.in_full_pct?.toFixed(1) ?? '—'}%</p>
                        <p className="text-[10px] opacity-70 mt-0.5 font-semibold">In Full</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-extrabold">{metrics.active_items ?? '—'}</p>
                        <p className="text-[10px] opacity-70 mt-0.5 font-semibold">Active Items</p>
                    </div>
                </div>
                <div className="flex gap-3 mt-2">
                    <span className="bg-red-500/30 text-red-200 text-[10px] font-bold px-2 py-0.5 rounded-lg">⚠ {metrics.sla_breach_count ?? 0} SLA Breached</span>
                    <span className="bg-white/10 text-white/70 text-[10px] font-bold px-2 py-0.5 rounded-lg">Risk Score: {metrics.risk_score ?? '—'}</span>
                    <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-lg">Confidence: {ins.confidence ?? '—'}%</span>
                </div>
            </div>

            {/* ── Signals chip list ── */}
            {signals.length > 0 && (
                <div>
                    <SecTitle icon={<Activity className="w-3.5 h-3.5" />} label="Live Signals" />
                    <div className="space-y-1.5">
                        {signals.map((s, i) => (
                            <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[11px] text-slate-700 leading-snug">
                                • {s}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── KPI Grid ── */}
            {kpis.length > 0 && (
                <div>
                    <SecTitle icon={<BarChart2 className="w-3.5 h-3.5" />} label="Engineering KPIs" />
                    <div className="grid grid-cols-2 gap-2">
                        {kpis.map((k, i) => {
                            const hitTarget = k.status === 'healthy';
                            const pct = k.target > 0 ? Math.min((k.current / k.target) * 100, 150) : 0;
                            const barW = Math.min(pct, 100);
                            return (
                                <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-[10px] text-slate-500 font-semibold">{k.title}</p>
                                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${kpiColor(k.status)}`}>{k.status?.toUpperCase()}</span>
                                    </div>
                                    <p className="text-xl font-extrabold text-slate-900">{k.current}<span className="text-xs font-normal text-slate-400 ml-1">{k.unit}</span></p>
                                    <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5">
                                        <div className={`h-1.5 rounded-full ${hitTarget ? 'bg-emerald-500' : k.status === 'warning' ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${barW}%` }} />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Target: {k.target} {k.unit}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Stage Breakdown ── */}
            {stages.length > 0 && (
                <div>
                    <SecTitle icon={<Layers className="w-3.5 h-3.5" />} label="Stage Breakdown" />
                    <div className="space-y-2">
                        {stages.map((s, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.colorHex || '#94a3b8' }} />
                                        <p className="text-sm font-bold text-slate-900">{s.stageName}</p>
                                    </div>
                                    <span className={`text-sm font-extrabold ${stgColor(s.status)}`}>{s.dtifPct?.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                                    <div className="h-2 rounded-full bg-red-500/70 transition-all" style={{ width: `${Math.min(s.dtifPct ?? 0, 100)}%` }} />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400">On-Time</p>
                                        <p className="text-xs font-bold text-slate-700">{s.onTimePct?.toFixed(1)}%</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400">In-Full</p>
                                        <p className="text-xs font-bold text-slate-700">{s.inFullPct?.toFixed(1)}%</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400">Avg Cycle</p>
                                        <p className="text-xs font-bold text-slate-700">{s.avgCycleHours ? `${s.avgCycleHours.toFixed(0)}h` : '—'}</p>
                                    </div>
                                </div>
                                {s.slaBreachCount > 0 && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1.5">⚠ {s.slaBreachCount} SLA breaches</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Active Deals ── */}
            {deals.length > 0 && (
                <div>
                    <SecTitle icon={<DollarSign className="w-3.5 h-3.5" />} label={`${deals.length} Active Deals`} />
                    <div className="space-y-2">
                        {deals.map((d, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${dealPriColor(d.priority)}`}>{d.priority?.replace('_', ' ')}</span>
                                        <span className="text-[10px] font-mono text-slate-400">{d.deal_code}</span>
                                        <span className="text-[10px] text-slate-400">{d.stage}</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-900">{d.title}</p>
                                    <div className="flex gap-2 mt-1">
                                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${d.on_time ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>OT {d.on_time ? '✓' : '✗'}</span>
                                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${d.in_full ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>IF {d.in_full ? '✓' : '✗'}</span>
                                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${d.risk_score < 30 ? 'bg-emerald-50 text-emerald-700' : d.risk_score < 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>Risk {d.risk_score?.toFixed(0)}</span>
                                    </div>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p className="text-sm font-extrabold text-slate-900">{fmtINR(d.value)}</p>
                                    <p className="text-[10px] text-slate-400">{d.client}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── RCA Events ── */}
            {rcaEvts.length > 0 && (
                <div>
                    <SecTitle icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Active RCA Events" />
                    <div className="space-y-2">
                        {rcaEvts.map((r, i) => (
                            <div key={i} className={`bg-white border-l-4 ${r.severity === 'P1' ? 'border-l-red-500' : 'border-l-orange-400'} border border-gray-100 rounded-xl p-3 shadow-sm`}>
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${r.severity === 'P1' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'}`}>{r.severity}</span>
                                        <span className="text-[10px] font-mono text-slate-400">{r.rca_id}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">DTIF -{r.reason?.dtif_impact_pct?.toFixed(1)}%</span>
                                </div>
                                <p className="text-xs font-bold text-slate-900 leading-snug">{r.reason?.title}</p>
                                <p className="text-[11px] text-slate-500 mt-1 leading-snug">{r.action?.display_text?.slice(0, 120)}…</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Recommendations ── */}
            {recs.length > 0 && (
                <div>
                    <button className="w-full flex items-center justify-between py-1" onClick={() => setShowRec(v => !v)}>
                        <SecTitle icon={<Lightbulb className="w-3.5 h-3.5" />} label={`${recs.length} Recommendations`} />
                        <span className="text-slate-400 text-xs">{showRec ? '▲' : '▼'}</span>
                    </button>
                    {showRec && (
                        <div className="space-y-2 mt-2">
                            {recs.map((r, i) => (
                                <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                                    <div className="flex gap-2 flex-wrap mb-1">
                                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${r.severity === 'high' ? 'bg-orange-500 text-white' : 'bg-amber-400 text-gray-900'}`}>{r.severity?.toUpperCase()}</span>
                                        <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{r.category?.replace('_', ' ')}</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-900 leading-snug">{r.name}</p>
                                    <p className="text-[11px] text-slate-500 mt-1">{r.details}</p>
                                    {r.signals && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {r.signals.slice(0, 3).map((s, si) => (
                                                <span key={si} className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded">{s}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── DTIF Trend chart ── */}
            {trend.length > 1 && (
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <SecTitle icon={<TrendingUp className="w-3.5 h-3.5" />} label="DTIF Trend" />
                    <TrendChart data={trend} xKey="date" yKey="dtif_pct" color="#6366f1" />
                </div>
            )}
        </div>
    );
};

/* PR AGING / PR REVIEW DELAYS */
const PrRenderer = ({ data }) => {
    /* API shape: { data: { pr_list[], summary{} }, meta{} } */
    const prList = data?.pr_list || data?.data?.pr_list || (Array.isArray(data) ? data : []);
    const summary = data?.summary || data?.data?.summary || {};
    const meta = data?.meta || data?.data?.meta || {};

    const healthClr = s => s === 'GREEN' ? 'bg-emerald-100 text-emerald-700' :
        s === 'AMBER' ? 'bg-amber-100 text-amber-700' :
            s === 'RED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600';
    const ageClr = d => d > (summary.target_review_days || 2) ? 'text-red-600' : 'text-emerald-600';
    const sevClr = s => s === 'critical' ? 'bg-red-600 text-white' : s === 'warning' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white';

    return (
        <div className="space-y-4">
            {/* ── Summary banner ── */}
            <div className="bg-gradient-to-br from-pink-600 to-rose-700 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <GitPullRequest className="w-4 h-4 opacity-80" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">PR Review Delays · {meta.snapshot_date || 'Live'}</p>
                </div>
                <div className="flex items-end gap-3 mb-3">
                    <p className="text-4xl font-extrabold">{summary.total_open_prs ?? prList.length}</p>
                    <div className="mb-1">
                        <p className="text-xs font-bold text-pink-200">Open PRs</p>
                        <p className="text-[10px] opacity-60">{summary.total_features_with_prs ?? prList.length} features · avg {summary.avg_age_days?.toFixed(1) ?? '—'}d age</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-extrabold">{summary.oldest_pr_days ?? '—'}d</p>
                        <p className="text-[10px] opacity-70 mt-0.5 font-semibold">Oldest PR</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-extrabold">{summary.target_review_days ?? 2}d</p>
                        <p className="text-[10px] opacity-70 mt-0.5 font-semibold">Target Review</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-lg font-extrabold">{summary.critical_path_count ?? 0}</p>
                        <p className="text-[10px] opacity-70 mt-0.5 font-semibold">Critical Path</p>
                    </div>
                </div>
                {summary.bottleneck_severity && (
                    <div className="mt-2">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg ${sevClr(summary.bottleneck_severity)}`}>
                            ⚠ Bottleneck: {summary.bottleneck_severity.toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Per-PR cards ── */}
            <SecTitle icon={<GitPullRequest className="w-3.5 h-3.5" />} label={`${prList.length} Open Pull Requests`} />
            <div className="space-y-3">
                {prList.map((p, i) => {
                    const target = summary.target_review_days || 2;
                    const barW = Math.min((p.pr_age_days / Math.max(target * 2.5, p.pr_age_days)) * 100, 100);
                    const isOverdue = p.pr_age_days > target;
                    return (
                        <div key={i} className={`bg-white border ${p.health_status === 'RED' ? 'border-red-200' : p.health_status === 'AMBER' ? 'border-amber-200' : 'border-gray-100'} rounded-xl p-4 shadow-sm`}>
                            {/* Header row */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                        <span className="text-[10px] font-mono font-bold text-slate-500">{p.feature_code}</span>
                                        <span className="text-[10px] text-slate-400">·</span>
                                        <span className="text-[10px] text-slate-400">{p.module_code}</span>
                                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${healthClr(p.health_status)}`}>{p.health_status}</span>
                                        {p.is_critical_path && <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">CRITICAL PATH</span>}
                                    </div>
                                    <p className="text-sm font-bold text-slate-900">{p.feature_name}</p>
                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.github_branch}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p className={`text-xl font-extrabold ${ageClr(p.pr_age_days)}`}>{p.pr_age_days}d</p>
                                    <p className="text-[10px] text-slate-400">PR age</p>
                                </div>
                            </div>

                            {/* Age progress bar */}
                            <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                                <div className={`h-2 rounded-full transition-all ${isOverdue ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${barW}%` }} />
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                <div className="bg-slate-50 rounded-lg p-2 text-center">
                                    <p className="text-[10px] text-slate-400">Open PRs</p>
                                    <p className="text-sm font-bold text-slate-900">{p.prs_open}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-2 text-center">
                                    <p className="text-[10px] text-slate-400">Approvals Needed</p>
                                    <p className="text-sm font-bold text-slate-900">{p.approvals_needed}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-2 text-center">
                                    <p className="text-[10px] text-slate-400">Last Commit</p>
                                    <p className={`text-sm font-bold ${p.last_commit_days === 0 ? 'text-emerald-600' : p.last_commit_days > 2 ? 'text-red-600' : 'text-slate-900'}`}>
                                        {p.last_commit_days === 0 ? 'Today' : `${p.last_commit_days}d ago`}
                                    </p>
                                </div>
                            </div>

                            {/* Assignee + JIRA row */}
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${p.current_assignee?.present ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    <p className="text-xs text-slate-700 font-semibold">{p.current_assignee?.name || '—'}</p>
                                    <span className="text-[10px] text-slate-400">{p.current_assignee?.emp_code}</span>
                                    {p.current_assignee?.on_leave && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">ON LEAVE</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">{p.jira_ticket}</span>
                                    <span className="text-[10px] text-slate-400">{p.jira_status?.replace('_', ' ')}</span>
                                </div>
                            </div>

                            {/* Risk label */}
                            {p.risk_label && (
                                <div className="mt-2 pt-2 border-t border-slate-100">
                                    <p className="text-[11px] text-slate-600 font-medium">{p.risk_label}</p>
                                </div>
                            )}

                            {/* URL Links */}
                            {p.urls && (
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {p.urls.pr && (
                                        <a href={p.urls.pr} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded hover:bg-indigo-100 transition-colors">
                                            ↗ GitHub PR
                                        </a>
                                    )}
                                    {p.urls.jira && (
                                        <a href={p.urls.jira} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors">
                                            ↗ JIRA {p.jira_ticket}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Meta footer */}
            {meta.generated_at && (
                <p className="text-[10px] text-slate-400 text-center">
                    Snapshot: {meta.snapshot_date} · Generated {new Date(meta.generated_at).toLocaleTimeString()}
                </p>
            )}
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

/* KPI DETAIL — /api/kpi/detail/ */
const KpiDetailRenderer = ({ data }) => {
    /* API: { kpiId, title, subtitle, description, current, target, unit, change, status, formula, whyItMatters, goal{}, trendData{history[], forecast{dates[],values[]}}, relatedKPIs[] } */
    const d = data?.data || data || {};
    const td = d.trendData || {};
    const history = td.history || [];
    const forecast = td.forecast || {};
    const related = d.relatedKPIs || [];

    // Combine history + forecast into one chart dataset with a forecast flag
    const overlapPts = forecast.overlapPoints || 2;
    const fcDates = forecast.dates || [];
    const fcVals = forecast.values || [];
    const allDates = [...new Set([...history.map(h => h.date), ...fcDates])];
    const histMap = Object.fromEntries(history.map(h => [h.date, h.value]));
    const fcMap = Object.fromEntries(fcDates.map((d, i) => [d, fcVals[i]]));
    const chartData = allDates.map(dt => ({
        date: dt,
        actual: histMap[dt] ?? null,
        forecast: fcMap[dt] ?? null,
    }));

    const stClr = s => s === 'critical' ? 'text-red-600' : s === 'warning' ? 'text-amber-500' : 'text-emerald-600';
    const bgBanner = s => s === 'critical'
        ? 'bg-gradient-to-br from-red-600 to-rose-700'
        : s === 'warning'
            ? 'bg-gradient-to-br from-amber-500 to-orange-600'
            : 'bg-gradient-to-br from-emerald-600 to-teal-700';
    const pct = d.target > 0 ? Math.min((d.current / d.target) * 100, 150) : 0;
    const barW = Math.min(pct, 100);

    return (
        <div className="space-y-4">
            {/* ── Hero Banner ── */}
            <div className={`${bgBanner(d.status)} rounded-2xl p-5 text-white`}>
                <div className="flex items-center gap-2 mb-1">
                    <BarChart2 className="w-4 h-4 opacity-80" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">{d.kpiId} · KPI Detail</p>
                </div>
                <p className="text-3xl font-extrabold mb-0.5">{d.current}{d.unit}</p>
                <p className="text-xs font-bold opacity-80 mb-3">{d.title}</p>
                <p className="text-[10px] opacity-60 leading-snug mb-3">{d.subtitle}</p>

                {/* vs target bar */}
                <div className="mb-3">
                    <div className="flex justify-between text-[10px] mb-1 opacity-80">
                        <span>Current: {d.current}{d.unit}</span>
                        <span>Target: {d.target}{d.unit}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2.5">
                        <div className="h-2.5 rounded-full bg-white transition-all" style={{ width: `${barW}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] mt-1 opacity-70">
                        <span>{pct.toFixed(1)}% of target</span>
                        <span className={d.change >= 0 ? 'text-green-200' : 'text-red-200'}>
                            {d.change >= 0 ? '▲' : '▼'} {Math.abs(d.change)}{d.unit} change
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-xs font-extrabold">{d.current}{d.unit}</p>
                        <p className="text-[10px] opacity-70 mt-0.5 font-semibold">Current</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-xs font-extrabold">{d.target}{d.unit}</p>
                        <p className="text-[10px] opacity-70 mt-0.5 font-semibold">Target</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className={`text-xs font-extrabold ${d.change >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                            {d.change >= 0 ? '+' : ''}{d.change}{d.unit}
                        </p>
                        <p className="text-[10px] opacity-70 mt-0.5 font-semibold">Change</p>
                    </div>
                </div>
            </div>

            {/* ── Description ── */}
            {d.description && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                    <p className="text-[11px] text-slate-600 leading-relaxed">{d.description}</p>
                </div>
            )}

            {/* ── Trend + Forecast Chart ── */}
            {chartData.length > 1 && (
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <SecTitle icon={<TrendingUp className="w-3.5 h-3.5" />} label="Trend & Forecast" />
                        {forecast.confidencePct && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">
                                {forecast.confidencePct}% confidence
                            </span>
                        )}
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                        <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -24, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={v => v?.slice(5)} />
                            <YAxis tick={{ fontSize: 9 }} />
                            <Tooltip
                                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                                formatter={(v, name) => [`${v}${d.unit}`, name === 'actual' ? 'Actual' : 'Forecast']}
                                labelFormatter={l => l}
                            />
                            <Area type="monotone" dataKey="actual" stroke="#6366f1" fill="#e0e7ff" strokeWidth={2} dot={{ r: 2 }} connectNulls />
                            <Area type="monotone" dataKey="forecast" stroke="#64748b" fill="#f1f5f9" strokeWidth={1.5} strokeDasharray="5 3" dot={{ r: 2 }} connectNulls />
                        </AreaChart>
                    </ResponsiveContainer>
                    {/* Target line annotation */}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-0.5 bg-indigo-500" />
                            <span className="text-[10px] text-slate-500">Actual</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-0.5 bg-slate-400" style={{ borderTop: '2px dashed #64748b', background: 'none' }} />
                            <span className="text-[10px] text-slate-500">Forecast</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-0.5 bg-blue-400" style={{ borderTop: '2px dashed #60a5fa', background: 'none' }} />
                            <span className="text-[10px] text-slate-500">Target {d.target}{d.unit}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Goal ── */}
            {d.goal && (
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <SecTitle icon={<Target className="w-3.5 h-3.5" />} label="Goal" />
                    <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-slate-600">{d.goal.description}</p>
                        <span className="text-lg font-extrabold text-slate-900 ml-3 shrink-0">{d.goal.value}{d.goal.unit}</span>
                    </div>
                </div>
            )}

            {/* ── Formula ── */}
            {d.formula && (
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <SecTitle icon={<Zap className="w-3.5 h-3.5" />} label="Formula" />
                    <p className="text-xs font-mono bg-slate-50 rounded-lg px-3 py-2 mt-2 text-slate-800">{d.formula}</p>
                </div>
            )}

            {/* ── Why It Matters ── */}
            {d.whyItMatters && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <SecTitle icon={<Lightbulb className="w-3.5 h-3.5" />} label="Why It Matters" />
                    <p className="text-[11px] text-amber-800 leading-relaxed mt-1">{d.whyItMatters}</p>
                </div>
            )}

            {/* ── Related KPIs ── */}
            {related.length > 0 && (
                <div>
                    <SecTitle icon={<Activity className="w-3.5 h-3.5" />} label="Related KPIs" />
                    <div className="space-y-2">
                        {related.map((r, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-xs font-bold text-slate-900">{r.title}</p>
                                    <p className="text-[10px] font-mono text-slate-400">{r.kpiId}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className={`text-sm font-extrabold ${r.status === 'critical' ? 'text-red-600' : r.status === 'warning' ? 'text-amber-500' : 'text-emerald-600'}`}>
                                        {r.current}{r.unit}
                                    </p>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${r.status === 'critical' ? 'bg-red-100 text-red-700' :
                                        r.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                        }`}>{r.status?.toUpperCase()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
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
    if (p.includes('/kpi/')) return 'kpidetail';
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
        case 'kpidetail': return <KpiDetailRenderer data={payload} />;
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
