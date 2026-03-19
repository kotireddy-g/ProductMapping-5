import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, Mic, Plus, CheckCircle2, Loader2, AlertTriangle,
    Briefcase, Users, Code2, Monitor, Shield, Brain, Bell, BarChart2,
    ChevronRight, Zap, X, RefreshCw, TrendingUp, TrendingDown,
    AlertCircle, Clock, GitPullRequest, Activity, Target, Lightbulb, DollarSign, Flame, Layers, MessageSquare,
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
/* EXEC APPROVALS — /dtif/api/recommendations/ */
const RecsRenderer = ({ data }) => {
    /* API shape: { decisionActions[], byCategory[], decisionActionsSummary{ totalPendingActions, alert_counters, labels_by_family[] } } */
    const actions = data?.decisionActions || data?.data?.decisionActions || [];
    const byCategory = data?.byCategory || data?.data?.byCategory || [];
    const summary = data?.decisionActionsSummary || data?.data?.decisionActionsSummary || {};
    const alertCnt = summary?.alert_counters || {};
    const totalCount = data?.totalCount || data?.data?.totalCount || actions.length;
    const highCount = data?.highPriorityCount || data?.data?.highPriorityCount || 0;

    // Category filter tabs
    const CATS = [{ id: 'ALL', label: 'All', color: '#64748b' }, ...byCategory.map(c => ({ id: c.family_id, label: c.family_name, color: c.color, count: c.total_items }))];
    const [activeCat, setActiveCat] = React.useState('ALL');
    const [openCard, setOpenCard] = React.useState(null);

    const filtered = activeCat === 'ALL' ? actions : actions.filter(a => a.category === activeCat);

    const sevBadgeCls = sev => sev === 'high' ? 'bg-red-100 text-red-700' : sev === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700';
    const catColor = cat => byCategory.find(c => c.family_id === cat)?.color || '#64748b';
    const entityIcon = e => e === 'feature' ? '🔧' : e === 'project' ? '📦' : e === 'department' ? '👥' : e === 'infrastructure' ? '🖥️' : '📌';

    const ALERT_META = [
        { key: 'pr_bottleneck_count', label: 'PR Bottleneck', color: 'bg-indigo-100 text-indigo-700' },
        { key: 'reopen_surge_count', label: 'Reopen Surge', color: 'bg-orange-100 text-orange-700' },
        { key: 'change_failure_count', label: 'Change Failure', color: 'bg-red-100 text-red-700' },
        { key: 'wip_overload_count', label: 'WIP Overload', color: 'bg-amber-100 text-amber-700' },
        { key: 'high_priority_recs', label: 'High Priority', color: 'bg-rose-100 text-rose-700' },
        { key: 'total_open', label: 'Total Open', color: 'bg-slate-100 text-slate-700' },
    ];

    return (
        <div className="space-y-4">
            {/* ── Hero Banner ── */}
            <div className="bg-gradient-to-br from-violet-700 to-purple-800 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 opacity-80" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">Exec Approvals · AI Decision Actions</p>
                </div>
                <p className="text-3xl font-extrabold mb-0.5">{totalCount} <span className="text-base font-semibold opacity-70">Actions Pending</span></p>
                <p className="text-[10px] opacity-70 mb-3">{highCount} HIGH priority · {byCategory.length} categories</p>

                <div className="grid grid-cols-4 gap-2">
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-sm font-extrabold">{totalCount}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">Total</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-sm font-extrabold text-red-200">{highCount}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">High Priority</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-sm font-extrabold">{alertCnt.pr_bottleneck_count ?? '—'}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">PR Bottleneck</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-sm font-extrabold">{alertCnt.wip_overload_count ?? '—'}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">WIP Overload</p>
                    </div>
                </div>
            </div>

            {/* ── Alert Counters Grid ── */}
            {Object.keys(alertCnt).length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {ALERT_META.map(({ key, label, color }) => alertCnt[key] != null && (
                        <div key={key} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm text-center">
                            <p className={`text-sm font-extrabold px-2 py-0.5 rounded-lg ${color} inline-block mb-1`}>{alertCnt[key]}</p>
                            <p className="text-[10px] text-slate-500">{label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Category Tabs ── */}
            {byCategory.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {CATS.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setActiveCat(c.id)}
                            className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all ${activeCat === c.id ? 'text-white shadow-sm border-transparent' : 'bg-white text-slate-600 border-gray-200 hover:border-gray-300'}`}
                            style={activeCat === c.id ? { background: c.color, borderColor: c.color } : {}}
                        >
                            {c.label}
                            {c.count != null && <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${activeCat === c.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{c.count}</span>}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Decision Action Cards ── */}
            <div className="space-y-2">
                {filtered.length === 0 && (
                    <p className="text-sm text-slate-400 italic text-center py-8">No actions in this category.</p>
                )}
                {filtered.map((action, i) => {
                    const isOpen = openCard === action.id;
                    const catCol = catColor(action.category);
                    return (
                        <div key={action.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                            {/* Color bar */}
                            <div className="h-1 w-full" style={{ background: action.color || catCol }} />

                            <button
                                className="w-full px-4 pt-3 pb-3 text-left flex items-start gap-3"
                                onClick={() => setOpenCard(isOpen ? null : action.id)}
                            >
                                {/* Left: entity icon + index */}
                                <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm mt-0.5"
                                    style={{ background: `${action.color || catCol}18` }}>
                                    <span>{entityIcon(action.targetEntity)}</span>
                                </div>

                                {/* Middle: title + meta */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-900 leading-snug mb-1">{action.title}</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${sevBadgeCls(action.severity)}`}>
                                            {action.priority || action.severity?.toUpperCase()}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-100">
                                            {action.categoryLabel}
                                        </span>
                                        {action.expiresAt && (() => {
                                            const hrs = Math.round((new Date(action.expiresAt) - Date.now()) / 36e5);
                                            return hrs > 0
                                                ? <span className={`text-[10px] font-bold ${hrs <= 24 ? 'text-red-600' : 'text-amber-600'}`}>⏱ {hrs}h left</span>
                                                : <span className="text-[10px] font-bold text-red-700">⚠ Expired</span>;
                                        })()}
                                    </div>
                                </div>

                                {/* Right: toggle */}
                                <span className="text-slate-400 text-xs shrink-0 mt-1">{isOpen ? '▲' : '▼'}</span>
                            </button>

                            {isOpen && (
                                <div className="border-t border-gray-100 p-4 space-y-3 bg-slate-50">
                                    {/* Target */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Target</span>
                                        <span className="text-[11px] text-slate-700 font-semibold">{action.targetName}</span>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Context</p>
                                        <p className="text-[11px] text-slate-700 leading-relaxed">{action.description}</p>
                                    </div>

                                    {/* Impact */}
                                    {action.estimatedImpact && (
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
                                            <p className="text-[10px] font-extrabold text-emerald-700 uppercase mb-0.5">📈 Estimated Impact</p>
                                            <p className="text-[11px] text-emerald-800">{action.estimatedImpact}</p>
                                        </div>
                                    )}

                                    {/* Signals */}
                                    {action.signals?.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">Signals</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {action.signals.map((s, si) => {
                                                    const isJira = s.startsWith('JIRA');
                                                    const isGithub = s.startsWith('GitHub');
                                                    const isFinance = s.toLowerCase().includes('finance') || s.includes('₹');
                                                    const isTeams = s.startsWith('Teams');
                                                    const isHRMS = s.startsWith('HRMS');
                                                    return (
                                                        <span key={si} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isJira ? 'bg-blue-100 text-blue-700' :
                                                            isGithub ? 'bg-indigo-100 text-indigo-700' :
                                                                isFinance ? 'bg-purple-100 text-purple-700' :
                                                                    isTeams ? 'bg-sky-100 text-sky-700' :
                                                                        isHRMS ? 'bg-amber-100 text-amber-700' :
                                                                            'bg-slate-100 text-slate-600'
                                                            }`}>{s}</span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Category Summary ── */}
            {byCategory.length > 0 && (
                <div>
                    <SecTitle icon={<BarChart2 className="w-3.5 h-3.5" />} label="By Category" />
                    <div className="grid grid-cols-1 gap-2 mt-2">
                        {byCategory.map((cat, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
                                <div className="w-2 h-10 rounded-full shrink-0" style={{ background: cat.color }} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-900">{cat.family_name}</p>
                                    <p className="text-[10px] text-slate-400">{cat.total_items} action{cat.total_items !== 1 ? 's' : ''}</p>
                                </div>
                                <span className="text-lg font-extrabold shrink-0" style={{ color: cat.color }}>{cat.total_items}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ENGINEERING / TEAM PERFORMANCE */
const EngRenderer = ({ data }) => {
    /* ── Engineering Factors: full-featured renderer ── */
    const s = data?.summary || {};
    const engineers = data?.engineers || [];
    const prAging = data?.pr_aging || [];
    const burnoutList = data?.burnout_list || [];
    const velocity = data?.sprint_velocity || [];
    const kpis = data?.kpis || [];

    const [tab, setTab] = React.useState('team');   // 'team' | 'prs' | 'burnout' | 'velocity'
    const [search, setSearch] = React.useState('');
    const [deptFilter, setDeptFilter] = React.useState('ALL');

    const pillCls = pill => {
        if (pill === 'pg') return { bg: 'bg-green-100 text-green-800', border: 'border-l-green-500', dot: '#22c55e' };
        if (pill === 'pa') return { bg: 'bg-amber-100 text-amber-800', border: 'border-l-amber-400', dot: '#f59e0b' };
        if (pill === 'pr') return { bg: 'bg-red-100 text-red-800', border: 'border-l-red-600', dot: '#ef4444' };
        return { bg: 'bg-slate-100 text-slate-600', border: 'border-l-slate-300', dot: '#94a3b8' };
    };
    const pillLabel = pill => pill === 'pg' ? 'GREEN' : pill === 'pa' ? 'AMBER' : pill === 'pr' ? 'RED' : '—';
    const kpiStatusCls = st => st === 'critical' ? 'text-red-600 bg-red-50' : st === 'warning' ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50';
    const priorCls = p => p === 'P1_CRITICAL' ? 'bg-red-600 text-white' : p === 'P2_HIGH' ? 'bg-orange-500 text-white' : p === 'P3_MEDIUM' ? 'bg-amber-400 text-gray-900' : 'bg-slate-100 text-slate-600';
    const burnoutRingColor = score => score >= 90 ? '#ef4444' : score >= 70 ? '#f59e0b' : '#10b981';

    const BurnoutRing = ({ score }) => {
        const r = 10, circ = 2 * Math.PI * r;
        const filled = (score / 100) * circ;
        const col = burnoutRingColor(score);
        return (
            <svg width="28" height="28" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle cx="14" cy="14" r={r} fill="none" stroke={col} strokeWidth="3"
                    strokeDasharray={`${filled} ${circ - filled}`}
                    strokeLinecap="round" transform="rotate(-90 14 14)" />
                <text x="14" y="18" textAnchor="middle" fontSize="6" fontWeight="700" fill={col}>{Math.round(score)}</text>
            </svg>
        );
    };

    const deps = ['ALL', ...Array.from(new Set(engineers.map(e => e.department_code)))];
    const filtered = engineers.filter(e => {
        const matchDept = deptFilter === 'ALL' || e.department_code === deptFilter;
        const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.emp_code.toLowerCase().includes(search.toLowerCase());
        return matchDept && matchSearch;
    });

    const bilGap = s.billable_util_gap ?? 0;
    const bilCurrent = s.billable_utilization ?? 0;
    const bilTarget = s.billable_util_target ?? 70;

    const TABS = [
        { key: 'team', label: `Team (${engineers.length})` },
        { key: 'prs', label: `Stale PRs (${prAging.length})` },
        { key: 'burnout', label: `🔥 Burnout (${burnoutList.length})` },
        { key: 'velocity', label: '🏆 Velocity' },
    ];

    return (
        <div className="space-y-4">
            {/* ── Summary Banner ── */}
            <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <Code2 className="w-4 h-4 opacity-80" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">Engineering Productivity · {s.departments?.join(' · ')}</p>
                </div>
                <div className="flex items-end gap-3 mb-4">
                    <p className="text-4xl font-extrabold leading-none">{s.total_engineers}</p>
                    <div>
                        <p className="text-sm font-semibold opacity-80">Engineers</p>
                        <p className="text-xs opacity-60">WIP: {s.total_wip} · Done: {s.total_stories_done} · Stale PRs: {s.stale_prs}</p>
                    </div>
                </div>
                {/* Billable utilization gap bar */}
                <div className="mb-3">
                    <div className="flex justify-between text-[10px] mb-1 opacity-80">
                        <span className="font-bold">Billable Utilization</span>
                        <span className="font-extrabold text-red-200">{bilCurrent}% / {bilTarget}% target · GAP {bilGap}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/20 overflow-hidden relative">
                        <div className="h-full rounded-full bg-white/80" style={{ width: `${Math.min((bilCurrent / bilTarget) * 100, 100)}%` }} />
                        {/* Target marker */}
                        <div className="absolute top-0 bottom-0 w-0.5 bg-yellow-300 opacity-80" style={{ left: '100%' }} />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    <BStat label="Sprint DTIF" value={`${s.sprint_dtif_pct}%`} />
                    <BStat label="PR Bottleneck" value={s.pr_bottleneck_count} />
                    <BStat label="Burnout Risk" value={s.burnout_risk_count} />
                    <BStat label="Avg Maker Time" value={`${s.avg_maker_time_pct}%`} />
                </div>
            </div>

            {/* ── KPI Grid ── */}
            {kpis.length > 0 && (
                <div>
                    <SecTitle icon={<BarChart2 className="w-3.5 h-3.5" />} label="Engineering KPIs" />
                    <div className="grid grid-cols-2 gap-2">
                        {kpis.map((k, i) => {
                            const barW = k.target > 0 ? Math.min((k.current / k.target) * 100, 100) : 0;
                            const barCol = k.status === 'critical' ? 'bg-red-500' : k.status === 'warning' ? 'bg-amber-400' : 'bg-emerald-500';
                            return (
                                <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-[10px] text-slate-500 font-semibold">{k.title}</p>
                                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${kpiStatusCls(k.status)}`}>{k.status?.toUpperCase()}</span>
                                    </div>
                                    <p className="text-xl font-extrabold text-slate-900">{k.current}<span className="text-xs font-normal text-slate-400 ml-1">{k.unit}</span></p>
                                    <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5">
                                        <div className={`h-1.5 rounded-full ${barCol}`} style={{ width: `${barW}%` }} />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Target: {k.target} {k.unit}</p>
                                    {k.definition && <p className="text-[9px] text-slate-300 mt-0.5 leading-tight">{k.definition}</p>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Tabs ── */}
            <div className="flex overflow-x-auto gap-1 pb-1">
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors ${tab === t.key ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── Team Tab ── */}
            {tab === 'team' && (
                <div>
                    {/* Search + dept filter */}
                    <div className="flex gap-2 mb-3">
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search engineer…"
                            className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-teal-400" />
                        <div className="flex gap-1 overflow-x-auto">
                            {deps.map(d => (
                                <button key={d} onClick={() => setDeptFilter(d)}
                                    className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${deptFilter === d ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{d}</button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        {filtered.map(e => {
                            const pc = pillCls(e.status_pill);
                            return (
                                <div key={e.emp_code} className={`bg-white border-l-4 ${pc.border} border border-gray-100 rounded-xl px-3 py-2.5 shadow-sm`}>
                                    <div className="flex items-start gap-2.5">
                                        {/* Burnout ring */}
                                        <div className="shrink-0 mt-0.5">
                                            <BurnoutRing score={e.burnout_score} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                                <span className="text-[11px] font-extrabold text-slate-800">{e.name}</span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${pc.bg}`}>{pillLabel(e.status_pill)}</span>
                                                {e.burnout_risk && <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-full">🔥 BURNOUT</span>}
                                                <span className="text-[10px] text-slate-400 font-mono">{e.emp_code}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-500">{e.role} · {e.department_code} · {e.attendance}</p>
                                            {/* Utilization bar */}
                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                    <div className="h-full rounded-full" style={{ width: `${Math.min(e.utilization_pct, 100)}%`, backgroundColor: pc.dot }} />
                                                </div>
                                                <span className="text-[10px] font-bold shrink-0" style={{ color: pc.dot }}>{e.utilization_pct}%</span>
                                            </div>
                                            {/* Story stats */}
                                            <div className="flex gap-2 mt-1 flex-wrap">
                                                {e.stories_done > 0 && <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">✓ {e.stories_done} done</span>}
                                                {e.stories_in_progress > 0 && <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">⚡ {e.stories_in_progress} WIP</span>}
                                                {e.stories_blocked > 0 && <span className="text-[10px] bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded">🚫 {e.stories_blocked} blocked</span>}
                                                {e.story_points_done > 0 && <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">{e.story_points_done} SP</span>}
                                                <span className="text-[10px] text-slate-400">Maker: {e.maker_time_pct}%</span>
                                            </div>
                                            {/* Source evidence */}
                                            {e.source_evidence?.length > 0 && (
                                                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                                    {e.source_evidence.map((ev, ei) => (
                                                        <span key={ei} className="text-[10px] bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded-lg border border-slate-100">{ev.icon} {ev.description}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {filtered.length === 0 && <p className="text-center text-slate-400 text-xs py-6">No engineers match filters</p>}
                    </div>
                </div>
            )}

            {/* ── Stale PRs Tab ── */}
            {tab === 'prs' && (
                <div className="space-y-2">
                    {prAging.map((pr, i) => {
                        const isP1 = pr.priority === 'P1_CRITICAL';
                        return (
                            <div key={i} className={`bg-white border-l-4 ${isP1 ? 'border-l-red-600' : 'border-l-orange-400'} border border-gray-100 rounded-xl px-3 py-2.5 shadow-sm`}>
                                <div className="flex items-start gap-2 justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${priorCls(pr.priority)}`}>{pr.priority?.replace('_', ' ')}</span>
                                            <span className="text-[10px] font-mono text-slate-400">{pr.story_key}</span>
                                            <span className="text-[10px] font-bold text-red-600">{pr.days_in_review}d stale</span>
                                            <span className="text-[10px] text-slate-400">{pr.story_points} SP</span>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-900 leading-snug">{pr.title}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">by {pr.author}</p>
                                    </div>
                                    {pr.github_pr_url && (
                                        <a href={pr.github_pr_url} target="_blank" rel="noreferrer"
                                            className="shrink-0 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-colors">
                                            View PR →
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {prAging.length === 0 && <p className="text-center text-slate-400 text-xs py-6">No stale PRs 🎉</p>}
                </div>
            )}

            {/* ── Burnout Tab ── */}
            {tab === 'burnout' && (
                <div className="space-y-2">
                    {burnoutList.map((e, i) => {
                        const pc = pillCls(e.status_pill);
                        return (
                            <div key={i} className={`bg-white border-l-4 border-l-red-500 border border-gray-100 rounded-xl px-3 py-2.5 shadow-sm`}>
                                <div className="flex items-center gap-2.5">
                                    <BurnoutRing score={e.burnout_score} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="text-[11px] font-extrabold text-slate-800">{e.name}</span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${pc.bg}`}>{e.health_status}</span>
                                            <span className="text-[10px] font-mono text-slate-400">{e.emp_code}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500">{e.role} · {e.department_code} · Utilization {e.utilization_pct}%</p>
                                        <div className="flex gap-2 mt-1 flex-wrap">
                                            {e.stories_blocked > 0 && <span className="text-[10px] bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded">🚫 {e.stories_blocked} blocked</span>}
                                            {e.stories_in_progress > 0 && <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">⚡ {e.stories_in_progress} WIP</span>}
                                            <span className="text-[10px] text-slate-400">Maker: {e.maker_time_pct}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {burnoutList.length === 0 && <p className="text-center text-slate-400 text-xs py-6">No burnout risks detected 🎉</p>}
                </div>
            )}

            {/* ── Velocity Leaderboard Tab ── */}
            {tab === 'velocity' && (
                <div className="space-y-2">
                    <SecTitle icon={<TrendingUp className="w-3.5 h-3.5" />} label="Sprint Velocity Leaderboard (Story Points)" />
                    {velocity.map((v, i) => {
                        const maxSP = velocity[0]?.story_points || 1;
                        const barPct = (v.story_points / maxSP) * 100;
                        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
                        return (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm shrink-0 w-6 text-center">{medal}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between text-[11px] mb-1">
                                            <span className="font-bold text-slate-900">{v.name}</span>
                                            <span className="font-extrabold text-indigo-600">{v.story_points} SP {v.wip > 0 && <span className="text-[10px] text-slate-400 font-normal">· {v.wip} WIP</span>}</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${barPct}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {velocity.length === 0 && <p className="text-center text-slate-400 text-xs py-6">No velocity data</p>}
                </div>
            )}

            {data?.as_of && <p className="text-[10px] text-slate-300 text-right font-mono">as of {data.as_of?.slice(0, 16).replace('T', ' ')} UTC</p>}
        </div>
    );
};

/* ENGINEERING COMMAND CENTER — /dtif/api/command-center/engineering/ */
const CommandCenterEngRenderer = ({ data }) => {
    /* API shape: { success, data:{ context{}, insight{ severity, title, summary, metrics{},
       stage_breakdown[], kpis[], rca_events[], recommendations[], active_deals[], signals[], actions[],
       contributing_sources[], trend[], confidence, decision_type } } } */
    const d = data?.data || data || {};
    const ctx = d.context || {};
    const ins = d.insight || {};
    const metrics = ins.metrics || {};
    const stages = ins.stage_breakdown || [];
    const kpis = ins.kpis || [];
    const rcas = ins.rca_events || [];
    const recs = ins.recommendations || [];
    const deals = ins.active_deals || [];
    const signals = ins.signals || [];
    const actions = ins.actions || [];
    const sources = ins.contributing_sources || [];
    const trend = d.trend || ins.trend || [];

    const [tab, setTab] = React.useState('overview');
    const [openRca, setOpenRca] = React.useState(null);
    const [openRec, setOpenRec] = React.useState(null);

    const sevColor = sev => {
        if (!sev) return { bg: 'bg-slate-100', text: 'text-slate-600', dot: '#94a3b8' };
        const s = sev.toLowerCase();
        if (s === 'critical') return { bg: 'bg-red-100', text: 'text-red-700', dot: '#ef4444' };
        if (s === 'high' || s === 'p1') return { bg: 'bg-orange-100', text: 'text-orange-700', dot: '#f97316' };
        if (s === 'medium' || s === 'p2') return { bg: 'bg-amber-100', text: 'text-amber-700', dot: '#f59e0b' };
        return { bg: 'bg-green-100', text: 'text-green-700', dot: '#22c55e' };
    };
    const kpiStat = st => st === 'critical' ? 'text-red-600 bg-red-50 border border-red-100'
        : st === 'warning' ? 'text-amber-600 bg-amber-50 border border-amber-100'
            : 'text-emerald-600 bg-emerald-50 border border-emerald-100';
    const dealPri = p => p === 'P1_CRITICAL' ? 'bg-red-600 text-white'
        : p === 'P2_HIGH' ? 'bg-orange-500 text-white'
            : 'bg-amber-400 text-gray-900';

    const dtif = metrics.dtif_pct ?? ins.dtif_pct ?? 0;
    const onTime = metrics.on_time_pct ?? 0;
    const inFull = metrics.in_full_pct ?? 0;
    const activeItems = metrics.active_items ?? 0;
    const slaBreaches = metrics.sla_breach_count ?? 0;
    const riskScore = metrics.risk_score ?? 0;

    const dtifColor = v => v >= 80 ? '#10b981' : v >= 60 ? '#f59e0b' : '#ef4444';
    const dtifBg = v => v >= 80 ? 'from-emerald-700 to-teal-800' : v >= 60 ? 'from-amber-600 to-orange-700' : 'from-red-700 to-rose-800';

    const MiniBar = ({ value, max = 100, color = '#3b82f6' }) => (
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
            <div className="h-1.5 rounded-full" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }} />
        </div>
    );

    const TABS = [
        { key: 'overview', label: '📊 Overview' },
        { key: 'kpis', label: `🎯 KPIs (${kpis.length})` },
        { key: 'pipeline', label: `🏗 Pipeline (${deals.length})` },
        { key: 'rca', label: `🔍 RCA (${rcas.length})` },
        { key: 'actions', label: `⚡ Actions (${recs.length})` },
    ];

    return (
        <div className="space-y-3">
            {/* ── Banner ── */}
            <div className={`bg-gradient-to-br ${dtifBg(dtif)} rounded-2xl p-4 text-white`}>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">
                        Engineering Command Center · {ins.severity || 'CRITICAL'} · {ins.decision_type || 'ESCALATE'}
                    </span>
                </div>
                <p className="text-lg font-extrabold leading-snug mb-3">{ins.title || ctx.entity_name}</p>

                {/* Metric strip */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-xl font-extrabold" style={{ color: dtifColor(dtif) === '#10b981' ? '#6ee7b7' : dtifColor(dtif) === '#f59e0b' ? '#fcd34d' : '#fca5a5' }}>{dtif.toFixed(1)}%</p>
                        <p className="text-[10px] opacity-70">DTIF</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-xl font-extrabold">{onTime.toFixed(1)}%</p>
                        <p className="text-[10px] opacity-70">On-Time</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-xl font-extrabold">{inFull.toFixed(1)}%</p>
                        <p className="text-[10px] opacity-70">In-Full</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/10 rounded-xl p-2 text-center">
                        <p className="text-sm font-extrabold">{activeItems}</p>
                        <p className="text-[9px] opacity-70">Active Items</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2 text-center">
                        <p className="text-sm font-extrabold text-red-200">{slaBreaches}</p>
                        <p className="text-[9px] opacity-70">SLA Breaches</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2 text-center">
                        <p className="text-sm font-extrabold">{riskScore.toFixed(1)}</p>
                        <p className="text-[9px] opacity-70">Risk Score</p>
                    </div>
                </div>

                {/* Source chips */}
                {sources.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {sources.map(src => (
                            <span key={src} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/20">{src}</span>
                        ))}
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/20">{ins.confidence}% confidence</span>
                    </div>
                )}
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 flex-wrap">
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${tab === t.key ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── OVERVIEW ── */}
            {tab === 'overview' && (
                <div className="space-y-3">
                    {/* Summary */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <p className="text-[10px] font-extrabold text-slate-500 uppercase mb-1">📋 Status Summary</p>
                        <p className="text-xs text-slate-700 leading-relaxed">{ins.summary || ins.current_status}</p>
                    </div>

                    {/* Stage breakdown */}
                    {stages.length > 0 && (
                        <div>
                            <p className="text-[10px] font-extrabold text-slate-500 uppercase mb-1.5">🔄 Stage Breakdown</p>
                            <div className="space-y-2">
                                {stages.map(st => (
                                    <div key={st.stageId} className="bg-white border border-slate-200 rounded-xl p-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-slate-800">{st.stageName}</span>
                                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${sevColor(st.status).bg} ${sevColor(st.status).text}`}>
                                                {st.status?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-1.5 text-center">
                                            <div>
                                                <p className="text-xs font-extrabold" style={{ color: dtifColor(st.dtifPct) }}>{st.dtifPct?.toFixed(1)}%</p>
                                                <p className="text-[9px] text-slate-500">DTIF</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-extrabold text-blue-600">{st.onTimePct?.toFixed(1)}%</p>
                                                <p className="text-[9px] text-slate-500">On-Time</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-extrabold text-purple-600">{st.inFullPct?.toFixed(1)}%</p>
                                                <p className="text-[9px] text-slate-500">In-Full</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-extrabold text-amber-600">{st.slaBreachCount?.toLocaleString()}</p>
                                                <p className="text-[9px] text-slate-500">SLA Breach</p>
                                            </div>
                                        </div>
                                        <MiniBar value={st.dtifPct} color={dtifColor(st.dtifPct)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Signals */}
                    {signals.length > 0 && (
                        <div>
                            <p className="text-[10px] font-extrabold text-slate-500 uppercase mb-1.5">📡 Signals ({signals.length})</p>
                            <div className="space-y-1">
                                {signals.map((sig, i) => (
                                    <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5">
                                        <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                                        <p className="text-[11px] text-amber-800 leading-snug">{sig}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Top Actions */}
                    {actions.length > 0 && (
                        <div>
                            <p className="text-[10px] font-extrabold text-slate-500 uppercase mb-1.5">✅ Top Actions</p>
                            <div className="space-y-1">
                                {actions.map((act, i) => (
                                    <div key={i} className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5">
                                        <span className="text-emerald-500 shrink-0 mt-0.5">{i + 1}.</span>
                                        <p className="text-[11px] text-emerald-800 leading-snug">{act}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── KPIs ── */}
            {tab === 'kpis' && (
                <div className="grid grid-cols-1 gap-2">
                    {kpis.map(kpi => {
                        const isGood = kpi.status === 'healthy';
                        const pct = kpi.unit === '%' ? kpi.current : null;
                        return (
                            <div key={kpi.id} className="bg-white border border-slate-200 rounded-xl p-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-bold text-slate-800">{kpi.title}</span>
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${kpiStat(kpi.status)}`}>
                                        {kpi.status?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-end gap-1.5 mb-1">
                                    <span className="text-lg font-extrabold text-slate-900">{kpi.current}</span>
                                    <span className="text-[10px] text-slate-500 mb-0.5">{kpi.unit}</span>
                                    <span className="text-[10px] text-slate-400 mb-0.5">/ target {kpi.target} {kpi.unit}</span>
                                </div>
                                {pct !== null && (
                                    <MiniBar value={pct} color={isGood ? '#10b981' : kpi.status === 'warning' ? '#f59e0b' : '#ef4444'} />
                                )}
                                <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">{kpi.current_status}</p>
                            </div>
                        );
                    })}
                    {kpis.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No KPI data</p>}
                </div>
            )}

            {/* ── PIPELINE (Active Deals) ── */}
            {tab === 'pipeline' && (
                <div className="space-y-2">
                    {deals.map(deal => (
                        <div key={deal.deal_code} className="bg-white border border-slate-200 rounded-xl p-3">
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <div>
                                    <p className="text-xs font-bold text-slate-800 leading-snug">{deal.title}</p>
                                    <p className="text-[10px] text-slate-500">{deal.deal_code} · {deal.stage}</p>
                                </div>
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ${dealPri(deal.priority)}`}>
                                    {deal.priority?.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-1 text-center mt-1.5">
                                <div className="bg-slate-50 rounded-lg p-1">
                                    <p className="text-[10px] font-bold text-slate-700">₹{(deal.value / 1e7).toFixed(1)}Cr</p>
                                    <p className="text-[9px] text-slate-400">Value</p>
                                </div>
                                <div className={`rounded-lg p-1 ${deal.on_time ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                    <p className={`text-[10px] font-bold ${deal.on_time ? 'text-emerald-600' : 'text-red-600'}`}>{deal.on_time ? '✓' : '✗'}</p>
                                    <p className="text-[9px] text-slate-400">On-Time</p>
                                </div>
                                <div className={`rounded-lg p-1 ${deal.in_full ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                    <p className={`text-[10px] font-bold ${deal.in_full ? 'text-emerald-600' : 'text-red-600'}`}>{deal.in_full ? '✓' : '✗'}</p>
                                    <p className="text-[9px] text-slate-400">In-Full</p>
                                </div>
                                <div className={`rounded-lg p-1 ${deal.risk_score < 30 ? 'bg-emerald-50' : deal.risk_score < 60 ? 'bg-amber-50' : 'bg-red-50'}`}>
                                    <p className={`text-[10px] font-bold ${deal.risk_score < 30 ? 'text-emerald-600' : deal.risk_score < 60 ? 'text-amber-600' : 'text-red-600'}`}>{deal.risk_score?.toFixed(0)}</p>
                                    <p className="text-[9px] text-slate-400">Risk</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {deals.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No active deals</p>}
                </div>
            )}

            {/* ── RCA ── */}
            {tab === 'rca' && (
                <div className="space-y-2">
                    {rcas.map((rca, i) => {
                        const isOpen = openRca === i;
                        const sev = sevColor(rca.severity);
                        return (
                            <div key={rca.rca_id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <button className="w-full px-3 py-2.5 text-left flex items-start gap-2"
                                    onClick={() => setOpenRca(isOpen ? null : i)}>
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${sev.bg} ${sev.text}`}>{rca.severity}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 leading-snug">{rca.reason?.title}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{rca.rca_id} · {rca.reason?.label_type?.replace(/_/g, ' ')}</p>
                                    </div>
                                    <span className="text-slate-400 shrink-0">{isOpen ? '▲' : '▼'}</span>
                                </button>
                                {isOpen && (
                                    <div className="border-t border-slate-100 p-3 space-y-2 bg-slate-50">
                                        <div className="bg-white border border-slate-100 rounded-lg p-2.5">
                                            <p className="text-[10px] font-extrabold text-slate-500 uppercase mb-0.5">Root Cause</p>
                                            <p className="text-[11px] text-slate-700 leading-relaxed">{rca.reason?.display_text}</p>
                                            <p className="text-[10px] text-indigo-600 font-semibold mt-1">DTIF Impact: −{rca.reason?.dtif_impact_pct?.toFixed(1)}%</p>
                                        </div>
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
                                            <p className="text-[10px] font-extrabold text-emerald-700 uppercase mb-0.5">✅ Recommended Action</p>
                                            <p className="text-[11px] text-emerald-800 leading-relaxed">{rca.action?.display_text}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 text-[10px] font-bold py-1.5 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                                {rca.action?.cta?.primary || 'Resolve Now'}
                                            </button>
                                            <button className="flex-1 text-[10px] font-bold py-1.5 px-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                                                {rca.action?.cta?.secondary || 'Assign Owner'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {rcas.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No RCA events</p>}
                </div>
            )}

            {/* ── ACTIONS (Recommendations) ── */}
            {tab === 'actions' && (
                <div className="space-y-2">
                    {recs.map((rec, i) => {
                        const isOpen = openRec === i;
                        const sc = sevColor(rec.severity);
                        return (
                            <div key={rec.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <button className="w-full px-3 py-2.5 text-left flex items-start gap-2"
                                    onClick={() => setOpenRec(isOpen ? null : i)}>
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${sc.bg} ${sc.text}`}>
                                        {rec.severity?.toUpperCase()}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 leading-snug">{rec.name}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{rec.category?.replace(/_/g, ' ')} · {rec.target_name}</p>
                                    </div>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 shrink-0">{rec.status}</span>
                                </button>
                                {isOpen && (
                                    <div className="border-t border-slate-100 p-3 space-y-2 bg-slate-50">
                                        <p className="text-[11px] text-slate-700 leading-relaxed">{rec.description}</p>
                                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2">
                                            <p className="text-[10px] font-extrabold text-indigo-700 uppercase mb-0.5">📈 Expected Outcome</p>
                                            <p className="text-[11px] text-indigo-800">{rec.details}</p>
                                        </div>
                                        {rec.signals?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-extrabold text-slate-500 uppercase mb-1">📡 Signal Evidence</p>
                                                {rec.signals.map((sig, j) => (
                                                    <p key={j} className="text-[10px] text-slate-600 flex items-start gap-1 mb-0.5">
                                                        <span className="text-slate-400">·</span>{sig}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                        <button className="w-full text-[10px] font-bold py-1.5 px-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                            Accept & Assign
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {recs.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No recommendations</p>}
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
/* CRITICAL ALERTS — /dtif/api/notifications/ */
const NotifRenderer = ({ data }) => {
    /* API shape: { unreadCount, notifications[{ id, type, title, message, timestamp, read, actionRequired, actionLink }] } */
    const notifs = data?.notifications || data?.data?.notifications || (Array.isArray(data) ? data : []);
    const unread = data?.unreadCount ?? data?.data?.unreadCount ?? notifs.filter(n => !n.read).length;
    const total = notifs.length;
    const actionReq = notifs.filter(n => n.actionRequired).length;

    const typeIcon = t => t === 'critical' ? '🔴' : t === 'warning' ? '🟡' : t === 'error' ? '🔴' : '🔵';
    const typeColor = t => t === 'critical' ? 'border-l-red-500' : t === 'warning' ? 'border-l-amber-400' : t === 'error' ? 'border-l-red-400' : 'border-l-blue-400';
    const fmtTs = ts => {
        if (!ts) return '';
        try {
            const d = new Date(ts);
            const diffMs = Date.now() - d.getTime();
            const diffMin = Math.floor(diffMs / 60000);
            if (diffMin < 60) return `${diffMin}m ago`;
            if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
            return d.toLocaleDateString();
        } catch { return ts; }
    };

    return (
        <div className="space-y-4">
            {/* ── Banner ── */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                    <Bell className="w-4 h-4 opacity-80" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">Critical Alerts · Notifications</p>
                </div>
                <p className="text-3xl font-extrabold mb-0.5">{unread} <span className="text-base font-semibold opacity-70">Unread</span></p>
                <p className="text-[10px] opacity-70 mb-3">{total} total · {actionReq} action required</p>

                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-sm font-extrabold">{total}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">Total</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-sm font-extrabold text-yellow-200">{unread}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">Unread</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 text-center">
                        <p className="text-sm font-extrabold text-red-200">{actionReq}</p>
                        <p className="text-[10px] opacity-70 mt-0.5">Action Req.</p>
                    </div>
                </div>
            </div>

            {/* ── Notification List ── */}
            {notifs.length === 0 ? (
                <p className="text-sm text-slate-400 italic text-center py-10">No notifications.</p>
            ) : (
                <div className="space-y-2">
                    {notifs.map((n, i) => (
                        <div key={n.id || i}
                            className={`bg-white border border-gray-100 border-l-4 ${typeColor(n.type)} rounded-xl shadow-sm p-3 flex items-start gap-3 ${!n.read ? 'bg-amber-50/30' : ''
                                }`}
                        >
                            <span className="text-base shrink-0 mt-0.5">{typeIcon(n.type)}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <p className={`text-xs font-bold truncate ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {n.title}
                                    </p>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {n.actionRequired && (
                                            <span className="text-[9px] font-extrabold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">ACTION</span>
                                        )}
                                        {!n.read && (
                                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Unread" />
                                        )}
                                    </div>
                                </div>
                                {n.message && <p className="text-[11px] text-slate-500 leading-snug">{n.message}</p>}
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-slate-400">{fmtTs(n.timestamp)}</span>
                                    {n.actionLink && (
                                        <a href={n.actionLink} target="_blank" rel="noreferrer"
                                            className="text-[10px] text-blue-600 hover:underline">View →</a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* BOTTLENECK ALERTS — /dtif/api/decision-actions/list/ */
const DecisionRenderer = ({ data }) => {
    /* ── Decision Intelligence: /dtif/api/decision/factors/ ── */
    const s = data?.summary || {};
    const rcaMap = data?.rca_map || [];
    const labelCounts = data?.itsm_label_counts || [];
    const recommendations = data?.pending_recommendations || [];
    const decisions = data?.di_decisions || [];
    const signalCounts = data?.source_signal_counts || {};
    const asOf = data?.as_of;

    const [tab, setTab] = React.useState('rca');
    const [expandedRca, setExpandedRca] = React.useState(null);
    const [expandedDec, setExpandedDec] = React.useState(null);
    const [expandedRec, setExpandedRec] = React.useState(null);

    /* ─── color helpers ─── */
    const sevBg = (sev) => {
        if (sev === 'CRITICAL') return 'bg-gradient-to-br from-red-600 to-rose-700';
        if (sev === 'HIGH') return 'bg-gradient-to-br from-orange-500 to-amber-600';
        if (sev === 'AT_RISK') return 'bg-gradient-to-br from-amber-500 to-yellow-600';
        return 'bg-gradient-to-br from-slate-500 to-slate-700';
    };
    const sevPill = (sev) => {
        if (sev === 'CRITICAL') return 'bg-red-600 text-white';
        if (sev === 'HIGH') return 'bg-orange-500 text-white';
        if (sev === 'AT_RISK') return 'bg-amber-400 text-gray-900';
        if (sev === 'MEDIUM') return 'bg-yellow-400 text-gray-900';
        return 'bg-slate-200 text-slate-700';
    };
    const pilCls = (p) => p === 'pr' ? 'bg-red-100 text-red-700' : p === 'pa' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';
    const priPill = (p) => p === 'HIGH' ? 'bg-red-100 text-red-700' : p === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600';
    const actionStyle = (style) => style === 'danger' ? 'bg-red-600 text-white' : style === 'warning' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700';
    const decTypeIcon = (t) => t === 'ESCALATE' ? '🚨' : t === 'DECISION_REQUIRED' ? '⚡' : t === 'MONITOR' ? '👁' : '📋';
    const srcIcon = { JIRA: '📋', GITHUB: '🐙', BIOMETRIC: '👆', TEAMS: '💬', FINANCE: '💰', HRMS: '👤', CCTV: '📷' };

    const TABS = [
        { key: 'rca', label: `🔍 RCA Map (${rcaMap.length})` },
        { key: 'decisions', label: `⚡ Decisions (${decisions.length})` },
        { key: 'recs', label: `💡 Actions (${recommendations.length})` },
        { key: 'labels', label: `🏷 Patterns (${labelCounts.length})` },
    ];

    return (
        <div className="space-y-4">
            {/* ── Summary Banner ── */}
            <div className="bg-gradient-to-br from-indigo-700 to-violet-800 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 opacity-80" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">Decision Intelligence · AI-Correlated Signals</p>
                </div>
                <div className="flex items-end gap-3 mb-4">
                    <p className="text-4xl font-extrabold leading-none">{s.total_alerts_active}</p>
                    <div>
                        <p className="text-sm font-semibold opacity-80">Active Alerts</p>
                        <p className="text-xs opacity-60">{s.open_rcas} open RCAs · {s.pending_decisions} pending decisions</p>
                    </div>
                </div>
                {/* Metric grid */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                    <BStat label="Confidence" value={`${s.avg_confidence_pct}%`} />
                    <BStat label="Revenue Safe" value={s.revenue_protected_fmt} />
                    <BStat label="P0 Decisions" value={s.p0_decisions} />
                    <BStat label="P1 Decisions" value={s.p1_decisions} />
                </div>
                {/* Source signal bar */}
                <div>
                    <p className="text-[10px] font-bold opacity-70 mb-1.5">Signal Sources ({s.sources_correlated})</p>
                    <div className="flex gap-1.5 flex-wrap">
                        {(s.source_names || []).map(src => (
                            <span key={src} className="flex items-center gap-1 bg-white/15 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                                <span>{srcIcon[src] || '🔗'}</span> {src}
                                {signalCounts[src] != null && <span className="ml-1 bg-white/20 rounded px-1">{signalCounts[src]}</span>}
                            </span>
                        ))}
                    </div>
                </div>
                {asOf && <p className="text-[9px] text-right opacity-40 mt-2 font-mono">as of {asOf?.slice(0, 16).replace('T', ' ')} UTC</p>}
            </div>

            {/* ── Tabs ── */}
            <div className="flex overflow-x-auto gap-1 pb-1">
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors ${tab === t.key ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ══ RCA Map Tab ══ */}
            {tab === 'rca' && (
                <div className="space-y-3">
                    {rcaMap.map((rca, i) => {
                        const isOpen = expandedRca === rca.rca_code;
                        const isCrit = rca.severity === 'CRITICAL';
                        return (
                            <div key={rca.rca_code} className={`rounded-xl border overflow-hidden shadow-sm ${isCrit ? 'border-red-200' : 'border-orange-100'}`}>
                                {/* Card header — always visible */}
                                <button className="w-full text-left px-4 py-3" onClick={() => setExpandedRca(isOpen ? null : rca.rca_code)}>
                                    <div className="flex items-start gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${sevPill(rca.severity)}`}>{rca.severity}</span>
                                                <span className="text-[10px] font-mono text-slate-400">{rca.rca_code}</span>
                                                <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{rca.label_type?.replace(/_/g, ' ')}</span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${rca.dtif_impact_pct >= 4 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                                                    -{rca.dtif_impact_pct}% DTIF
                                                </span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{rca.title}</p>
                                            {/* Source badges always show */}
                                            <div className="flex gap-1 mt-1.5 flex-wrap">
                                                {rca.source_badges?.map((b, bi) => (
                                                    <span key={bi} className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded font-semibold">{b.icon} {b.src}</span>
                                                ))}
                                                <span className="text-[10px] text-slate-400 self-center ml-1">Confidence {rca.confidence_pct}%</span>
                                                {rca.financial_risk_inr > 0 && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">⚠ {rca.financial_risk_fmt} at risk</span>}
                                            </div>
                                        </div>
                                        <span className="text-slate-400 text-xs shrink-0 mt-1">{isOpen ? '▲' : '▼'}</span>
                                    </div>
                                </button>

                                {/* Expanded body */}
                                {isOpen && (
                                    <div className="border-t border-slate-100 p-4 space-y-4 bg-slate-50">
                                        {/* Source Evidence */}
                                        {rca.source_evidence?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-extrabold uppercase text-slate-500 mb-2">📡 Source Evidence</p>
                                                <div className="space-y-1.5">
                                                    {rca.source_evidence.map((ev, ei) => (
                                                        <div key={ei} className="bg-white border border-slate-100 rounded-lg px-3 py-2 flex items-start gap-2">
                                                            <span className="text-base shrink-0">{ev.icon}</span>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex gap-1.5 flex-wrap">
                                                                    <span className="text-[10px] font-extrabold text-slate-700">{ev.source}</span>
                                                                    <span className="text-[10px] text-slate-400">{ev.src_label}</span>
                                                                    <span className="text-[10px] font-mono text-indigo-600">{ev.ref}</span>
                                                                    <span className="text-[10px] text-slate-400">{ev.when}</span>
                                                                </div>
                                                                <p className="text-[11px] text-slate-600 mt-0.5">{ev.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* 5-Why Chain */}
                                        {rca.why_chain?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-extrabold uppercase text-slate-500 mb-2">🔗 5-Why Root Cause Chain</p>
                                                <div className="relative pl-4">
                                                    {rca.why_chain.map((w, wi) => (
                                                        <div key={wi} className="relative mb-2 last:mb-0">
                                                            <div className="absolute -left-4 top-1.5 w-3 h-3 rounded-full border-2 border-indigo-400 bg-white flex items-center justify-center">
                                                                <span className="text-[8px] font-extrabold text-indigo-600">{w.level}</span>
                                                            </div>
                                                            <div className="bg-white border border-slate-100 rounded-lg px-3 py-2">
                                                                <p className="text-[11px] text-slate-700 leading-snug">{w.text}</p>
                                                                {w.source_links?.length > 0 && (
                                                                    <div className="flex gap-1 mt-1 flex-wrap">
                                                                        {w.source_links.map((sl, sli) => (
                                                                            <span key={sli} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">{sl.label}</span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Recommended Options */}
                                        {rca.recommended_options?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-extrabold uppercase text-slate-500 mb-2">✅ Recommended Options</p>
                                                <div className="space-y-2">
                                                    {rca.recommended_options.map((opt, oi) => (
                                                        <div key={oi} className={`bg-white border rounded-xl p-3 ${oi === 0 ? 'border-emerald-200' : 'border-slate-100'}`}>
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex gap-1.5 flex-wrap mb-1">
                                                                        <span className="text-[10px] font-bold text-slate-500">{opt.rank_label}</span>
                                                                        {opt.metric_pills?.map((mp, mpi) => (
                                                                            <span key={mpi} className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${mp.class === 'pg' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>{mp.label}</span>
                                                                        ))}
                                                                    </div>
                                                                    <p className="text-xs text-slate-800 font-semibold leading-snug">{opt.label}</p>
                                                                </div>
                                                                <button className={`shrink-0 text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg ${oi === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                                                                    {opt.cta_label}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ══ DI Decisions Tab ══ */}
            {tab === 'decisions' && (
                <div className="space-y-3">
                    {decisions.map((dec, i) => {
                        const isOpen = expandedDec === dec.entity_code;
                        return (
                            <div key={dec.entity_code} className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
                                <button className="w-full text-left px-4 py-3" onClick={() => setExpandedDec(isOpen ? null : dec.entity_code)}>
                                    <div className="flex items-start gap-2">
                                        <span className="text-lg shrink-0 mt-0.5">{decTypeIcon(dec.decision_type)}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap gap-1.5 mb-1">
                                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${sevPill(dec.severity)}`}>{dec.severity}</span>
                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">{dec.decision_type?.replace('_', ' ')}</span>
                                                <span className="text-[10px] font-mono text-indigo-500">{dec.entity_code}</span>
                                                <span className="text-[10px] text-slate-400">{dec.entity_type}</span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-900 leading-snug">{dec.title}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Confidence {dec.confidence_pct}%</p>
                                        </div>
                                        <span className="text-slate-400 text-xs shrink-0 mt-1">{isOpen ? '▲' : '▼'}</span>
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="border-t border-slate-100 p-4 space-y-3 bg-slate-50">
                                        {/* Summary */}
                                        <div className="bg-white border border-slate-100 rounded-lg p-3">
                                            <p className="text-[10px] font-extrabold uppercase text-slate-400 mb-1">Situation</p>
                                            <p className="text-[11px] text-slate-700 leading-relaxed">{dec.summary}</p>
                                        </div>
                                        {/* Recommendation */}
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                                            <p className="text-[10px] font-extrabold uppercase text-emerald-600 mb-1">✅ Recommendation</p>
                                            <p className="text-[11px] text-emerald-800 leading-relaxed">{dec.recommendation}</p>
                                        </div>
                                        {/* Sources */}
                                        {dec.contributing_sources?.length > 0 && (
                                            <div className="flex gap-1.5 flex-wrap">
                                                <span className="text-[10px] font-bold text-slate-500 self-center">Sources:</span>
                                                {dec.contributing_sources.map(src => (
                                                    <span key={src} className="text-[10px] bg-slate-100 rounded px-1.5 py-0.5 font-semibold">{srcIcon[src] || '🔗'} {src}</span>
                                                ))}
                                            </div>
                                        )}
                                        {/* Actions */}
                                        {dec.actions?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-extrabold uppercase text-slate-400 mb-1.5">Actions</p>
                                                <div className="flex gap-2 flex-wrap">
                                                    {dec.actions.map((act, ai) => (
                                                        <button key={ai} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg ${actionStyle(act.style)}`}>
                                                            {act.label}
                                                            {act.emp && <span className="ml-1 opacity-70 font-mono">({act.emp})</span>}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ══ Pending Recommendations Tab ══ */}
            {tab === 'recs' && (
                <div className="space-y-2">
                    {recommendations.map((rec, i) => {
                        const isOpen = expandedRec === rec.id;
                        return (
                            <div key={rec.id} className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
                                <button className="w-full text-left px-4 py-3" onClick={() => setExpandedRec(isOpen ? null : rec.id)}>
                                    <div className="flex items-start gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${priPill(rec.priority)}`}>{rec.priority}</span>
                                                <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{rec.category?.replace(/_/g, ' ')}</span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${rec.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-600'}`}>{rec.status}</span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-900 leading-snug">{rec.title}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{rec.target_name}</p>
                                        </div>
                                        <span className="text-slate-400 text-xs shrink-0 mt-1">{isOpen ? '▲' : '▼'}</span>
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="border-t border-slate-100 p-4 space-y-2.5 bg-slate-50">
                                        <p className="text-[11px] text-slate-700 leading-relaxed">{rec.description}</p>
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
                                            <p className="text-[10px] font-extrabold text-emerald-700 mb-0.5">📈 Estimated Impact</p>
                                            <p className="text-[11px] text-emerald-800">{rec.estimated_impact}</p>
                                        </div>
                                        {rec.signals?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-extrabold text-slate-400 uppercase mb-1.5">📡 Signal Evidence</p>
                                                <div className="space-y-1">
                                                    {rec.signals.map((sig, si) => (
                                                        <div key={si} className="flex items-start gap-2 bg-white border border-slate-100 rounded-lg px-2.5 py-1.5">
                                                            <span className="text-[11px] font-mono text-indigo-600 shrink-0">{sig.split(':')[0]}:</span>
                                                            <span className="text-[11px] text-slate-600">{sig.split(':').slice(1).join(':').trim()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <button className="w-full text-center text-[11px] font-extrabold bg-indigo-600 text-white py-2 rounded-lg">
                                            Accept Recommendation
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ══ ITSM Label Patterns Tab ══ */}
            {tab === 'labels' && (
                <div className="space-y-2">
                    <SecTitle icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Detected Bottleneck Patterns" />
                    {labelCounts.map((lc, i) => (
                        <div key={i} className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
                            <span className={`text-[18px] shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${pilCls(lc.severity_pill)}`}>{lc.count}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900">{lc.label?.replace(/_/g, ' ')}</p>
                            </div>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${pilCls(lc.severity_pill)}`}>
                                {lc.severity_pill === 'pr' ? 'RED' : lc.severity_pill === 'pa' ? 'AMBER' : 'GREEN'}
                            </span>
                        </div>
                    ))}
                </div>
            )}
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


/* ── Portfolio Overview Renderer ── */
const PortfolioRenderer = ({ data }) => {
    const s = data.summary || {};
    const stages = data.stage_distribution || [];
    const projects = data.projects || [];
    const rcas = data.rca_highlights || [];
    const burnout = data.burnout_engineers || [];
    const [expandedRca, setExpandedRca] = React.useState(null);

    const totalStage = stages.reduce((a, b) => a + b.count, 0) || 1;

    const hpillCls = pill => {
        const v = String(pill || '').toLowerCase();
        if (v === 'pg') return 'bg-green-100 text-green-800';
        if (v === 'pa') return 'bg-amber-100 text-amber-800';
        if (v === 'pr') return 'bg-red-100 text-red-800';
        return 'bg-slate-100 text-slate-600';
    };
    const hpillLabel = pill => {
        if (pill === 'pg') return 'HEALTHY';
        if (pill === 'pa') return 'AT RISK';
        if (pill === 'pr') return 'CRITICAL';
        return pill?.toUpperCase() || '—';
    };
    const rcaSevCls = sev => {
        if (sev === 'CRITICAL') return { border: 'border-l-red-600', badge: 'bg-red-600 text-white' };
        if (sev === 'HIGH') return { border: 'border-l-orange-500', badge: 'bg-orange-500 text-white' };
        if (sev === 'MEDIUM') return { border: 'border-l-amber-400', badge: 'bg-amber-400 text-gray-900' };
        return { border: 'border-l-slate-300', badge: 'bg-slate-200 text-slate-700' };
    };

    return (
        <div className="space-y-5">
            {/* ── Summary Banner ── */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-4 h-4 opacity-80" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">Portfolio Overview</p>
                </div>
                <div className="flex items-end gap-3 mb-4">
                    <p className="text-4xl font-extrabold leading-none">{s.portfolio_dtif ?? '—'}</p>
                    <div>
                        <p className="text-sm font-semibold opacity-80">Portfolio DTIF</p>
                        <p className="text-xs opacity-60">Target: {s.dtif_target}% · Gap: <span className="font-bold text-red-300">{s.dtif_gap}%</span></p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                    <BStat label="Projects On Track" value={`${s.projects_on_track} / ${s.total_projects}`} />
                    <BStat label="Pipeline Value" value={s.pipeline_value_cr != null ? `₹${s.pipeline_value_cr}Cr` : '—'} />
                    <BStat label="Active Deals" value={`${s.active_deals} (${s.at_risk_deals} at risk)`} />
                    <BStat label="Revenue at Risk" value={s.revenue_risk_fmt || '—'} />
                    <BStat label="SLA Compliance" value={s.sla_compliance_pct != null ? `${s.sla_compliance_pct}%` : '—'} />
                    <BStat label="Open RCAs" value={s.open_rcas?.total ?? '—'} />
                </div>
            </div>

            {/* ── Stage Distribution ── */}
            {stages.length > 0 && (
                <div>
                    <SecTitle icon={<Layers className="w-3.5 h-3.5" />} label="Stage Distribution" />
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                        <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-3">
                            {stages.map(st => (
                                <div key={st.stage} className="h-full" style={{ width: `${(st.count / totalStage) * 100}%`, backgroundColor: st.color }} />
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {stages.map(st => (
                                <div key={st.stage} className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                                    <span className="text-xs text-slate-600 capitalize font-medium">{st.stage}</span>
                                    <span className="text-xs font-bold text-slate-900">{st.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Projects ── */}
            {projects.length > 0 && (
                <div>
                    <SecTitle icon={<Briefcase className="w-3.5 h-3.5" />} label={`${projects.length} Projects`} />
                    <div className="space-y-2.5">
                        {projects.map((p, i) => {
                            const hp = hpillCls(p.health_pill);
                            return (
                                <div key={p.project_code || i} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                                    <div className="px-4 py-3 flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[10px] font-mono font-bold text-slate-400">{p.project_code}</span>
                                                {p.current_stage && <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{p.current_stage}</span>}
                                                {p.open_rca_count > 0 && <span className="text-[10px] bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded">⚠ {p.open_rca_code}</span>}
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 mt-0.5">{p.project_name}</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">{p.client_name}</p>
                                        </div>
                                        <div className="shrink-0 flex flex-col items-end gap-1">
                                            <span className="text-xl font-extrabold text-gray-900">{p.health_score?.toFixed(1)}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hp}`}>{hpillLabel(p.health_pill)}</span>
                                        </div>
                                    </div>
                                    <div className="px-4 pb-3 flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {p.source_badges?.map(b => (
                                                <span key={b.src} className="text-sm" title={b.src}>{b.icon}</span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-400">DTIF {p.dtif_pct?.toFixed(1)}%</span>
                                            {p.deal_value && p.deal_value !== '₹0' && <span className="text-[10px] font-bold text-indigo-600">{p.deal_value}</span>}
                                        </div>
                                    </div>
                                    {/* Health bar */}
                                    <div className="h-1" style={{ background: p.health_pill === 'pg' ? '#22c55e' : p.health_pill === 'pa' ? '#f59e0b' : '#ef4444', width: `${p.health_score || 0}%` }} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── RCA Highlights ── */}
            {rcas.length > 0 && (
                <div>
                    <SecTitle icon={<Flame className="w-3.5 h-3.5" />} label={`${rcas.length} RCA Highlights`} />
                    <div className="space-y-3">
                        {rcas.map((r, i) => {
                            const cls = rcaSevCls(r.severity);
                            const isExp = expandedRca === r.rca_code;
                            const opts = r.recommended_options || [];
                            const why = r.why_chain || [];
                            return (
                                <div key={r.rca_code || i} className={`bg-white border border-l-4 ${cls.border} border-gray-100 rounded-xl shadow-sm overflow-hidden`}>
                                    <button className="w-full px-4 pt-3 pb-3 text-left" onClick={() => setExpandedRca(isExp ? null : r.rca_code)}>
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${cls.badge}`}>{r.severity}</span>
                                                    <span className="text-[10px] font-mono text-slate-400">{r.rca_code}</span>
                                                    <span className="text-[10px] text-slate-400">{r.department}</span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-900 leading-snug">{r.title}</p>
                                            </div>
                                            <div className="shrink-0 flex flex-col items-end gap-1">
                                                {r.dtif_impact_pct != null && <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg">DTIF -{r.dtif_impact_pct}%</span>}
                                                <span className="text-[10px] bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded">{r.financial_risk_fmt}</span>
                                                <span className="text-slate-300 text-xs mt-1">{isExp ? '▲' : '▼'}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            <span className="bg-slate-50 text-slate-500 text-[10px] px-2 py-0.5 rounded-lg">{r.stage} · {r.confidence_pct}% confidence</span>
                                        </div>
                                    </button>
                                    {isExp && (
                                        <div className="border-t border-slate-100">
                                            {why.length > 0 && (
                                                <div className="px-4 py-3 border-b border-slate-100">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">5-Why Chain</p>
                                                    <div className="space-y-2">
                                                        {why.map((w, wi) => (
                                                            <div key={wi} className="flex gap-2">
                                                                <span className="text-[10px] font-extrabold text-indigo-400 shrink-0 mt-0.5">#{w.level}</span>
                                                                <p className="text-xs text-slate-700 leading-relaxed">{w.text}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {opts.length > 0 && (
                                                <div className="px-4 py-3">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Recommended Actions</p>
                                                    <div className="space-y-2">
                                                        {opts.map((o, oi) => (
                                                            <div key={oi} className="bg-white border border-gray-100 rounded-xl p-3 flex items-start justify-between gap-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <span className="text-[10px] font-bold text-indigo-500">{o.rank_label}</span>
                                                                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{o.label}</p>
                                                                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                                                        {o.metric_pills?.map((mp, mi) => (
                                                                            <span key={mi} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hpillCls(mp.class)}`}>{mp.label}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <button className="shrink-0 text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap">{o.cta_label}</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Burnout Risk Engineers ── */}
            {burnout.length > 0 && (
                <div>
                    <SecTitle icon={<Flame className="w-3.5 h-3.5" />} label={`${burnout.length} Engineers at Risk`} />
                    <div className="space-y-2">
                        {burnout.map((e, i) => (
                            <div key={e.emp_code || i} className="bg-white border border-amber-100 rounded-xl px-4 py-3 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{e.name}</p>
                                    <p className="text-[10px] text-slate-400">{e.role?.replace(/_/g, ' ')} · {e.emp_code}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <p className="text-lg font-extrabold text-amber-600">{e.utilization_pct?.toFixed(1)}%</p>
                                        <p className="text-[10px] text-slate-400">Utilization</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hpillCls(e.pill_class)}`}>{e.health_status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {data.as_of && <p className="text-[10px] text-slate-300 text-right font-mono">as of {data.as_of?.slice(0, 16).replace('T', ' ')} UTC</p>}
        </div>
    );
};


/* ── Product Outcomes Renderer ── */
const ProductOutcomesRenderer = ({ data }) => {
    const s = data.summary || {};
    const journeys = data.screen_journeys || [];
    const lowVal = data.low_value_features || [];
    const [expandedProj, setExpandedProj] = React.useState(null);

    const pillCls = pill => {
        const v = String(pill || '').toLowerCase();
        if (v === 'pg') return { bg: 'bg-green-100 text-green-800', bar: '#22c55e' };
        if (v === 'pa') return { bg: 'bg-amber-100 text-amber-800', bar: '#f59e0b' };
        if (v === 'pr') return { bg: 'bg-red-100 text-red-800', bar: '#ef4444' };
        return { bg: 'bg-slate-100 text-slate-600', bar: '#94a3b8' };
    };
    const statusLabel = pill => {
        if (pill === 'pg') return 'HEALTHY';
        if (pill === 'pa') return 'AT RISK';
        if (pill === 'pr') return 'CRITICAL';
        return '—';
    };
    const sentimentCls = s => {
        if (s === 'BLOCKER') return 'bg-red-600 text-white';
        if (s === 'NEGATIVE') return 'bg-red-100 text-red-700';
        if (s === 'POSITIVE') return 'bg-green-100 text-green-700';
        return 'bg-slate-100 text-slate-600';
    };

    return (
        <div className="space-y-5">
            {/* Summary Banner */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <Monitor className="w-4 h-4 opacity-80" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">Product Outcomes</p>
                </div>
                <div className="flex items-end gap-3 mb-4">
                    <p className="text-4xl font-extrabold leading-none">{s.avg_feature_adoption_pct ?? '—'}%</p>
                    <div>
                        <p className="text-sm font-semibold opacity-80">Avg Feature Adoption</p>
                        <p className="text-xs opacity-60">Target: {s.adoption_target_pct}% · Drop-off: <span className="font-bold text-red-300">{s.avg_dropoff_pct}%</span></p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                    <BStat label="Total Features" value={s.total_features} />
                    <BStat label="Critical Screens" value={s.critical_screens} />
                    <BStat label="P1 Defects" value={s.p1_defects} />
                    <BStat label="P2 Defects" value={s.p2_defects} />
                    <BStat label="Low-Value" value={s.low_value_features} />
                    <BStat label="Projects" value={s.projects_with_ui_data} />
                </div>
            </div>

            {/* Low-Value Feature Callout */}
            {lowVal.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <SecTitle icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-600" />} label={`${lowVal.length} Low-Value Features Flagged`} />
                    <div className="space-y-2 mt-2">
                        {lowVal.map((f, i) => (
                            <div key={f.feature_code || i} className="bg-white border border-amber-100 rounded-xl px-3 py-2.5 flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-mono text-slate-400">{f.feature_code}</span>
                                        <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded">{f.project_code}</span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{f.feature_name}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{f.recommendation}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p className="text-sm font-extrabold text-amber-600">{f.completion_pct}%</p>
                                    <p className="text-[10px] text-slate-400">{f.sp_planned} SP</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Project Journeys */}
            {journeys.length > 0 && (
                <div>
                    <SecTitle icon={<Layers className="w-3.5 h-3.5" />} label={`${journeys.length} Project Journeys`} />
                    <div className="space-y-2.5">
                        {journeys.map((j, ji) => {
                            const isExp = expandedProj === j.project_code;
                            const screens = j.screens || [];
                            const critCount = j.critical_screens || 0;
                            const amberCount = j.amber_screens || 0;
                            const greenCount = screens.length - critCount - amberCount;
                            return (
                                <div key={j.project_code || ji} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                                    <button className="w-full px-4 py-3 text-left" onClick={() => setExpandedProj(isExp ? null : j.project_code)}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-extrabold text-slate-800">{j.project_code}</span>
                                                <span className="text-[10px] text-slate-400">{screens.length} features</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {critCount > 0 && <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{critCount} CRIT</span>}
                                                {amberCount > 0 && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{amberCount} AMBER</span>}
                                                {greenCount > 0 && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{greenCount} OK</span>}
                                                <span className="text-slate-300 ml-1">{isExp ? '▲' : '▼'}</span>
                                            </div>
                                        </div>
                                        {/* Adoption mini bar */}
                                        <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                                                style={{ width: `${screens.length ? (screens.reduce((a, x) => a + (x.adoption_pct || 0), 0) / screens.length) : 0}%` }} />
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            avg adoption {screens.length ? (screens.reduce((a, x) => a + (x.adoption_pct || 0), 0) / screens.length).toFixed(1) : 0}%
                                        </p>
                                    </button>
                                    {isExp && (
                                        <div className="border-t border-slate-100">
                                            {screens.map((sc, si) => {
                                                const pc = pillCls(sc.health_pill);
                                                return (
                                                    <div key={sc.feature_code || si} className="px-4 py-3 border-b border-slate-50 last:border-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                                    <span className="text-[10px] font-mono text-slate-400">{sc.feature_code}</span>
                                                                    {sc.p1_bugs > 0 && <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded">P1 BUG</span>}
                                                                    {sc.teams_sentiment === 'BLOCKER' && <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">🚨 BLOCKER</span>}
                                                                </div>
                                                                <p className="text-xs font-semibold text-slate-800 mt-0.5">{sc.feature_name}</p>
                                                                <p className="text-[10px] text-slate-400">{sc.assignee} · {sc.jira_ticket}</p>
                                                            </div>
                                                            <div className="shrink-0 text-right">
                                                                <p className="text-base font-extrabold text-slate-900">{sc.adoption_pct}%</p>
                                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${pc.bg}`}>{statusLabel(sc.health_pill)}</span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                                <div className="h-full rounded-full" style={{ width: `${sc.adoption_pct || 0}%`, backgroundColor: pc.bar }} />
                                                            </div>
                                                            <div className="flex gap-1">
                                                                {sc.src_badges?.map(b => <span key={b.src} className="text-[10px] font-bold text-slate-400" title={b.src}>{b.src === 'JIRA' ? '📋' : b.src === 'GITHUB' ? '🐙' : b.src === 'TEAMS' ? '💬' : b.src === 'FINANCE' ? '💰' : b.src === 'BIOMETRIC' ? '👆' : '•'}</span>)}
                                                            </div>
                                                        </div>
                                                        {sc.open_bugs > 0 && <p className="text-[10px] text-red-500 mt-1">{sc.open_bugs} open bug(s) · {sc.sp_done}/{sc.sp_planned} SP done</p>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {data.as_of && <p className="text-[10px] text-slate-300 text-right font-mono">as of {data.as_of?.slice(0, 16).replace('T', ' ')} UTC</p>}
        </div>
    );
};


/* ── ITSM Factors Renderer ── */
const ITSMFactorsRenderer = ({ data }) => {
    const s = data.summary || {};
    const incidents = data.incidents || [];
    const slaItems = data.sla_countdown || [];
    const threads = data.blocker_threads || [];
    const [expandedInc, setExpandedInc] = React.useState(null);

    const sevCls = sev => {
        if (sev === 'P1' || sev === 'CRITICAL') return { border: 'border-l-red-600', badge: 'bg-red-600 text-white', text: 'text-red-600' };
        if (sev === 'P2' || sev === 'HIGH') return { border: 'border-l-orange-500', badge: 'bg-orange-500 text-white', text: 'text-orange-600' };
        if (sev === 'P3' || sev === 'MEDIUM') return { border: 'border-l-amber-400', badge: 'bg-amber-400 text-gray-900', text: 'text-amber-600' };
        return { border: 'border-l-slate-300', badge: 'bg-slate-200 text-slate-700', text: 'text-slate-500' };
    };
    const pillCls = pill => {
        if (pill === 'pg') return 'bg-green-100 text-green-800';
        if (pill === 'pa') return 'bg-amber-100 text-amber-800';
        if (pill === 'pr') return 'bg-red-100 text-red-800';
        return 'bg-slate-100 text-slate-600';
    };
    const urgencyIcon = u => u === 'CRITICAL' ? '🚨' : u === 'HIGH' ? '⚠️' : u === 'NORMAL' ? '⚡' : '•';

    return (
        <div className="space-y-5">
            {/* Summary Banner */}
            <div className="bg-gradient-to-br from-rose-600 to-red-700 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 opacity-80" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">ITSM Factors</p>
                </div>
                <div className="flex items-end gap-3 mb-4">
                    <p className="text-4xl font-extrabold leading-none">{s.sla_compliance_pct ?? '—'}%</p>
                    <div>
                        <p className="text-sm font-semibold opacity-80">SLA Compliance</p>
                        <p className="text-xs opacity-60">Target: {s.sla_target_pct}% · At Risk: <span className="font-bold text-red-300">{s.at_sla_risk}</span></p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                    <BStat label="Open Incidents" value={s.open_incidents} />
                    <BStat label="P1 Critical" value={s.p1_incidents} />
                    <BStat label="P2 High" value={s.p2_incidents} />
                    <BStat label="MTTA" value={`${s.avg_mtta_hours}h`} />
                    <BStat label="MTTR" value={`${s.avg_mttr_hours}h`} />
                    <BStat label="Change Success" value={`${s.change_success_pct}%`} />
                </div>
                {/* MTTA/MTTR bars */}
                <div className="mt-3 space-y-1.5">
                    <div>
                        <div className="flex justify-between text-[10px] opacity-70 mb-0.5"><span>MTTA {s.avg_mtta_hours}h</span><span>Target {s.mtta_target_hours}h</span></div>
                        <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(100, (s.mtta_target_hours / Math.max(s.avg_mtta_hours, 0.1)) * 100)}%`, backgroundColor: s.avg_mtta_hours <= s.mtta_target_hours ? '#4ade80' : '#fbbf24' }} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] opacity-70 mb-0.5"><span>MTTR {s.avg_mttr_hours}h</span><span>Target {s.mttr_target_hours}h</span></div>
                        <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(100, (s.mttr_target_hours / Math.max(s.avg_mttr_hours, 0.1)) * 100)}%`, backgroundColor: s.avg_mttr_hours <= s.mttr_target_hours ? '#4ade80' : '#fbbf24' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* SLA Countdown */}
            {slaItems.length > 0 && (
                <div>
                    <SecTitle icon={<Clock className="w-3.5 h-3.5" />} label={`${slaItems.length} Milestone SLA Countdowns`} />
                    <div className="space-y-2">
                        {slaItems.map((m, i) => (
                            <div key={m.milestone_code || i} className="bg-white border border-amber-100 border-l-4 border-l-amber-400 rounded-xl px-4 py-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-mono font-bold text-slate-400">{m.milestone_code}</span>
                                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{m.project_code}</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-800 mt-0.5">{m.title}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{m.risk_reason}</p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="text-base font-extrabold text-red-600">{m.days_to_due}d</p>
                                        <p className="text-[10px] text-slate-400">left</p>
                                        <p className="text-[10px] font-bold text-indigo-600 mt-1">{m.amount}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Open Incidents */}
            {incidents.length > 0 && (
                <div>
                    <SecTitle icon={<Flame className="w-3.5 h-3.5" />} label={`${incidents.length} Open Incidents`} />
                    <div className="space-y-3">
                        {incidents.map((inc, i) => {
                            const sc = sevCls(inc.severity);
                            const isExp = expandedInc === inc.incident_id;
                            const why = inc.why_chain || [];
                            const opts = inc.recommended_options || [];
                            const evidence = inc.source_evidence || [];
                            return (
                                <div key={inc.incident_id || i} className={`bg-white border border-l-4 ${sc.border} border-gray-100 rounded-xl shadow-sm overflow-hidden`}>
                                    <button className="w-full px-4 pt-3 pb-3 text-left" onClick={() => setExpandedInc(isExp ? null : inc.incident_id)}>
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${sc.badge}`}>{inc.severity} · {inc.severity_label}</span>
                                                    <span className="text-[10px] font-mono text-slate-400">{inc.incident_id}</span>
                                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{inc.project_code}</span>
                                                </div>
                                                <p className="text-xs font-bold text-slate-900 leading-snug">{inc.title}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">{inc.department} · Age: {inc.age_hours?.toFixed(1)}h · MTTA: {inc.mtta_hours}h</p>
                                            </div>
                                            <div className="shrink-0 flex flex-col items-end gap-1">
                                                {inc.financial_risk && inc.financial_risk !== '₹0' && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{inc.financial_risk}</span>}
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${pillCls(inc.sla_pill)}`}>SLA</span>
                                                <span className="text-slate-300 text-xs">{isExp ? '▲' : '▼'}</span>
                                            </div>
                                        </div>
                                        {evidence.length > 0 && (
                                            <div className="flex gap-1.5 mt-2 flex-wrap">
                                                {evidence.map((e, ei) => (
                                                    <span key={ei} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-lg">{e.icon} {e.description}</span>
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                    {isExp && (
                                        <div className="border-t border-slate-100">
                                            {/* 5-Why */}
                                            {why.length > 0 && (
                                                <div className="px-4 py-3 border-b border-slate-100">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">5-Why Chain</p>
                                                    <div className="space-y-2">
                                                        {why.map((w, wi) => (
                                                            <div key={wi} className="flex gap-2">
                                                                <span className="text-[10px] font-extrabold text-rose-400 shrink-0 mt-0.5">#{w.level}</span>
                                                                <p className="text-xs text-slate-700 leading-relaxed">{w.text}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {/* Recommended actions */}
                                            {opts.length > 0 && (
                                                <div className="px-4 py-3">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Recommended Actions</p>
                                                    <div className="space-y-2">
                                                        {opts.map((o, oi) => (
                                                            <div key={oi} className="bg-slate-50 border border-gray-100 rounded-xl p-3 flex items-start justify-between gap-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <span className="text-[10px] font-bold text-rose-500">{o.rank_label}</span>
                                                                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{o.label}</p>
                                                                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                                                        {o.metric_pills?.map((mp, mi) => (
                                                                            <span key={mi} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{mp.label}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <button className="shrink-0 text-[10px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap">{o.cta_label}</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Blocker Threads */}
            {threads.length > 0 && (
                <div>
                    <SecTitle icon={<MessageSquare className="w-3.5 h-3.5" />} label={`${threads.length} Blocker Threads`} />
                    <div className="space-y-2">
                        {threads.map((t, i) => (
                            <div key={t.thread_id || i} className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <span className="text-[10px] font-mono text-slate-400">{t.project_code}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${urgencyIcon(t.urgency) ? '' : ''}`}>{urgencyIcon(t.urgency)}</span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-800">{t.subject}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{t.days_open}d open · {t.days_no_reply}d no reply</p>
                                </div>
                                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${t.sentiment === 'BLOCKER' ? 'bg-red-600 text-white' : t.sentiment === 'NEGATIVE' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{t.sentiment}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {data.as_of && <p className="text-[10px] text-slate-300 text-right font-mono">as of {data.as_of?.slice(0, 16).replace('T', ' ')} UTC</p>}
        </div>
    );
};


/* ── Client Health Renderer ── */
const ClientHealthRenderer = ({ data }) => {
    const s = data.summary || {};
    const formula = data.score_formula || {};
    const clients = data.clients || [];
    const [expandedClient, setExpandedClient] = React.useState(null);
    const [expandedRca, setExpandedRca] = React.useState({});

    const toggleRca = (clientCode, rcaCode) => {
        setExpandedRca(prev => {
            const key = `${clientCode}::${rcaCode}`;
            return { ...prev, [key]: !prev[key] };
        });
    };

    const pillCls = pill => {
        if (pill === 'pg') return { bg: 'bg-green-100 text-green-800', border: 'border-l-green-500', dot: '#22c55e', ring: 'ring-green-300' };
        if (pill === 'pa') return { bg: 'bg-amber-100 text-amber-800', border: 'border-l-amber-400', dot: '#f59e0b', ring: 'ring-amber-300' };
        if (pill === 'pr') return { bg: 'bg-red-100 text-red-800', border: 'border-l-red-600', dot: '#ef4444', ring: 'ring-red-300' };
        return { bg: 'bg-slate-100 text-slate-600', border: 'border-l-slate-300', dot: '#94a3b8', ring: 'ring-slate-200' };
    };
    const pillLabel = pill => pill === 'pg' ? 'HEALTHY' : pill === 'pa' ? 'AMBER' : pill === 'pr' ? 'CRITICAL' : '—';
    const sentimentCls = sent => {
        if (sent === 'BLOCKER') return 'bg-red-600 text-white';
        if (sent === 'NEGATIVE') return 'bg-red-100 text-red-700';
        if (sent === 'POSITIVE') return 'bg-green-100 text-green-700';
        return 'bg-slate-100 text-slate-600';
    };
    const modStatusCls = st => {
        if (st === 'CRITICAL' || st === 'RED') return 'bg-red-100 text-red-700';
        if (st === 'AMBER') return 'bg-amber-100 text-amber-700';
        if (st === 'GREEN') return 'bg-green-100 text-green-700';
        return 'bg-slate-100 text-slate-600';
    };

    const ScoreBar = ({ label, raw, weighted, color = '#6366f1' }) => (
        <div className="mb-1.5">
            <div className="flex justify-between text-[9px] text-slate-500 mb-0.5">
                <span>{label}</span>
                <span className="font-bold" style={{ color }}>{raw}% → {weighted}pts</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${raw}%`, backgroundColor: color }} />
            </div>
        </div>
    );

    const thresholds = formula.thresholds || {};
    const components = formula.components || [];

    return (
        <div className="space-y-5">
            {/* Summary Banner */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 opacity-80" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-75">Client Solution Health</p>
                </div>
                <div className="flex items-end gap-3 mb-4">
                    <p className="text-4xl font-extrabold leading-none">{s.avg_health_score ?? '—'}</p>
                    <div>
                        <p className="text-sm font-semibold opacity-80">Avg Health Score</p>
                        <p className="text-xs opacity-60">Target: {s.avg_score_target} · SLA Breaches: <span className={`font-bold ${s.sla_breaches > 0 ? 'text-red-300' : 'text-green-300'}`}>{s.sla_breaches}</span></p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2.5 mb-3">
                    <BStat label="Total Clients" value={s.total_clients} />
                    <BStat label="External" value={s.external_clients} />
                    <BStat label="Critical" value={s.critical_clients} />
                    <BStat label="Healthy" value={s.healthy_count} />
                    <BStat label="Amber" value={s.amber_count} />
                    <BStat label="At Risk (₹)" value={s.at_risk_fin_total} />
                </div>
                {/* Score thresholds legend */}
                <div className="flex gap-2 flex-wrap">
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">🟢 ≥{thresholds.green}</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">🟡 {thresholds.amber_min}–{thresholds.green - 1}</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">🔴 ≤{thresholds.red_max}</span>
                </div>
                {s.critical_names?.length > 0 && (
                    <p className="text-[10px] mt-2 opacity-70">⚠️ Critical: {s.critical_names.join(', ')}</p>
                )}
            </div>

            {/* Score Formula */}
            {components.length > 0 && (
                <div className="bg-white border border-indigo-100 rounded-2xl p-4">
                    <SecTitle icon={<Target className="w-3.5 h-3.5 text-indigo-500" />} label="Health Score Formula" />
                    <div className="mt-3 space-y-2">
                        {components.map((c, i) => {
                            const colors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];
                            return (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="flex-1 h-5 rounded-lg overflow-hidden bg-slate-100 relative">
                                        <div className="h-full rounded-lg" style={{ width: `${c.weight_pct}%`, backgroundColor: colors[i % colors.length] }} />
                                        <span className="absolute inset-0 flex items-center px-2 text-[10px] font-bold text-white mix-blend-overlay">{c.name}</span>
                                    </div>
                                    <span className="text-[11px] font-extrabold text-slate-600 w-8 text-right">{c.weight_pct}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Client Cards */}
            {clients.length > 0 && (
                <div>
                    <SecTitle icon={<Briefcase className="w-3.5 h-3.5" />} label={`${clients.length} Client Projects`} />
                    <div className="space-y-3">
                        {clients.map((c) => {
                            const pc = pillCls(c.health_pill);
                            const isExp = expandedClient === c.project_code;
                            const bd = c.score_breakdown || {};
                            const rel = c.client_relationship || {};
                            const mods = c.modules || [];
                            const rcas = c.rca_list || [];
                            const evidence = c.source_evidence || [];

                            return (
                                <div key={c.project_code} className={`bg-white border-l-4 ${pc.border} border border-gray-100 rounded-xl shadow-sm overflow-hidden`}>
                                    {/* Card Header */}
                                    <button className="w-full px-4 pt-3 pb-3 text-left" onClick={() => setExpandedClient(isExp ? null : c.project_code)}>
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                                    <span className="text-[11px] font-extrabold text-slate-800">{c.project_code}</span>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${pc.bg}`}>{pillLabel(c.health_pill)}</span>
                                                    {c.deal_code && <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">{c.deal_value}</span>}
                                                    {rel.blocker_threads > 0 && <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded">🚨 BLOCKER</span>}
                                                </div>
                                                <p className="text-xs font-semibold text-slate-800">{c.project_name}</p>
                                                <p className="text-[10px] text-slate-400">{c.pm_name} · {c.current_stage} · {c.client_name}</p>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="text-2xl font-extrabold" style={{ color: pc.dot }}>{c.health_score}</p>
                                                {c.finance_at_risk && c.finance_at_risk !== '₹0' && (
                                                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded block mt-0.5">{c.finance_at_risk} at risk</span>
                                                )}
                                                <span className="text-slate-300 text-xs block mt-1">{isExp ? '▲' : '▼'}</span>
                                            </div>
                                        </div>
                                        {/* Score mini-bars */}
                                        <div className="mt-2 grid grid-cols-2 gap-x-3">
                                            <ScoreBar label="Sprint DTIF" raw={bd.sprint_dtif} weighted={bd.sprint_dtif_weighted} color="#6366f1" />
                                            <ScoreBar label="Release Conf." raw={bd.release_confidence} weighted={bd.release_conf_weighted} color="#0ea5e9" />
                                            <ScoreBar label="Module Compl." raw={bd.module_completion} weighted={bd.module_comp_weighted} color="#10b981" />
                                            <ScoreBar label="SLA" raw={bd.sla_score} weighted={bd.sla_weighted} color="#f59e0b" />
                                        </div>
                                        {/* Source evidence pills */}
                                        {evidence.length > 0 && (
                                            <div className="flex gap-1.5 mt-2 flex-wrap">
                                                {evidence.map((e, ei) => (
                                                    <span key={ei} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-lg border border-slate-100">
                                                        {e.icon} {e.description}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </button>

                                    {/* Expanded section */}
                                    {isExp && (
                                        <div className="border-t border-slate-100">
                                            {/* Client relationship */}
                                            <div className="px-4 py-3 flex items-center gap-3 border-b border-slate-50 flex-wrap">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Relationship</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sentimentCls(rel.sentiment)}`}>{rel.sentiment}</span>
                                                <span className="text-[10px] text-slate-400">Last contact: {rel.last_contact_days}d ago</span>
                                                <span className="text-[10px] text-slate-400">{rel.open_threads} open threads</span>
                                                {rel.blocker_threads > 0 && <span className="text-[10px] font-bold text-red-600">{rel.blocker_threads} BLOCKER</span>}
                                            </div>

                                            {/* Modules */}
                                            {mods.length > 0 && (
                                                <div className="px-4 py-3 border-b border-slate-100">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{mods.length} Modules</p>
                                                    <div className="space-y-2">
                                                        {mods.map((m, mi) => {
                                                            const mp = pillCls(m.health_pill);
                                                            return (
                                                                <div key={m.module_code || mi} className={`border-l-4 ${mp.border} bg-slate-50 rounded-xl px-3 py-2`}>
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                                <span className="text-[10px] font-mono text-slate-400">{m.module_code}</span>
                                                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${modStatusCls(m.status)}`}>{m.status}</span>
                                                                                {m.finance_at_risk && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">{m.finance_amount}</span>}
                                                                                {m.jira_p1_bugs > 0 && <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded">P1 BUG</span>}
                                                                            </div>
                                                                            <p className="text-[11px] font-semibold text-slate-800 mt-0.5">{m.module_name}</p>
                                                                            <p className="text-[10px] text-slate-400">{m.jira_open_bugs} bugs · last commit {m.last_commit_days}d · PR age {m.pr_age_max}d</p>
                                                                        </div>
                                                                        <div className="shrink-0 text-right">
                                                                            <p className="text-sm font-extrabold" style={{ color: mp.dot }}>{m.health_score}</p>
                                                                            <p className="text-[10px] text-slate-400">{m.completion_pct}%</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-1.5 h-1 rounded-full bg-white overflow-hidden">
                                                                        <div className="h-full rounded-full" style={{ width: `${m.completion_pct}%`, backgroundColor: mp.dot }} />
                                                                    </div>
                                                                    {/* Source badges */}
                                                                    <div className="flex gap-1 mt-1.5">
                                                                        {m.src_badges?.map(b => (
                                                                            <span key={b.src} className="text-[10px] text-slate-400" title={b.src}>{b.icon}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* RCA cards */}
                                            {rcas.length > 0 && (
                                                <div className="px-4 py-3">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{rcas.length} RCA{rcas.length > 1 ? 's' : ''}</p>
                                                    <div className="space-y-3">
                                                        {rcas.map((r) => {
                                                            const rcaKey = `${c.project_code}::${r.rca_code}`;
                                                            const rcaExp = !!expandedRca[rcaKey];
                                                            const sevBg = r.severity === 'CRITICAL' ? 'bg-red-600 text-white' : r.severity === 'HIGH' ? 'bg-orange-500 text-white' : 'bg-amber-400 text-gray-900';
                                                            return (
                                                                <div key={r.rca_code} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                                                                    <button className="w-full px-4 pt-3 pb-3 text-left" onClick={() => toggleRca(c.project_code, r.rca_code)}>
                                                                        <div className="flex items-start justify-between gap-2">
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center gap-1.5 mb-1">
                                                                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${sevBg}`}>{r.severity}</span>
                                                                                    <span className="text-[10px] font-mono text-slate-400">{r.rca_code}</span>
                                                                                </div>
                                                                                <p className="text-[11px] font-bold text-slate-900 leading-snug">{r.title}</p>
                                                                                {r.source_evidence?.length > 0 && (
                                                                                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                                                                        {r.source_evidence.map((e, ei) => (
                                                                                            <span key={ei} className="text-[10px] bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded-lg">{e.icon} {e.description}</span>
                                                                                        ))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <span className="text-slate-300 text-xs shrink-0 mt-1">{rcaExp ? '▲' : '▼'}</span>
                                                                        </div>
                                                                    </button>
                                                                    {rcaExp && (
                                                                        <div className="border-t border-slate-100">
                                                                            {r.why_chain?.length > 0 && (
                                                                                <div className="px-4 py-3 border-b border-slate-100">
                                                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">5-Why Chain</p>
                                                                                    <div className="space-y-2">
                                                                                        {r.why_chain.map((w) => (
                                                                                            <div key={w.level} className="flex gap-2">
                                                                                                <span className="text-[10px] font-extrabold text-indigo-400 shrink-0 mt-0.5">#{w.level}</span>
                                                                                                <p className="text-xs text-slate-700 leading-relaxed">{w.text}</p>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {r.recommended_options?.length > 0 && (
                                                                                <div className="px-4 py-3">
                                                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Recommended Actions</p>
                                                                                    <div className="space-y-2">
                                                                                        {r.recommended_options.map((o) => (
                                                                                            <div key={o.rank} className="bg-slate-50 border border-gray-100 rounded-xl p-3 flex items-start justify-between gap-2">
                                                                                                <div className="flex-1 min-w-0">
                                                                                                    <span className="text-[10px] font-bold text-indigo-500">{o.rank_label}</span>
                                                                                                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{o.label}</p>
                                                                                                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                                                                                        {o.metric_pills?.map((mp, mi) => (
                                                                                                            <span key={mi} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">{mp.label}</span>
                                                                                                        ))}
                                                                                                    </div>
                                                                                                </div>
                                                                                                <button className="shrink-0 text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap">{o.cta_label}</button>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {data.as_of && <p className="text-[10px] text-slate-300 text-right font-mono">as of {data.as_of?.slice(0, 16).replace('T', ' ')} UTC</p>}
        </div>
    );
};


const detectType = p => {
    if (!p) return 'generic';
    if (p.includes('/portfolio/')) return 'portfolio';
    if (p.includes('/deals/')) return 'deals';
    if (p.includes('/rca/')) return 'rca';
    if (p.includes('/opi/')) return 'opi';
    if (p.includes('/recommendations/')) return 'recs';
    if (p.includes('/notifications/')) return 'notif';
    if (p.includes('/pr-aging/')) return 'pr';
    if (p.includes('/command-center/')) return 'engcc';
    if (p.includes('/engineering/')) return 'eng';
    if (p.includes('/decision-actions/') || p.includes('/decision/')) return 'decision';
    if (p.includes('/product/')) return 'product';
    if (p.includes('/itsm/')) return 'itsm';
    if (p.includes('/client-health/')) return 'clienthealth';
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
        case 'portfolio': return <PortfolioRenderer data={payload} />;
        case 'deals': return <DealsRenderer data={payload} />;
        case 'rca': return <RcaRenderer data={payload} />;
        case 'opi': return <OpiRenderer data={payload} />;
        case 'recs': return <RecsRenderer data={payload} />;
        case 'notif': return <NotifRenderer data={payload} />;
        case 'pr': return <PrRenderer data={payload} />;
        case 'engcc': return <CommandCenterEngRenderer data={payload} />;
        case 'eng': return <EngRenderer data={payload} />;
        case 'decision': return <DecisionRenderer data={payload} />;
        case 'product': return <ProductOutcomesRenderer data={payload} />;
        case 'itsm': return <ITSMFactorsRenderer data={payload} />;
        case 'clienthealth': return <ClientHealthRenderer data={payload} />;
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
    const [expanded, setExpanded] = React.useState(false);
    const icon = ICON_MAP[section.icon] || <Briefcase className="w-4 h-4" />;

    /* Status-driven color bar */
    const statusBarColor = section.overall_status === 'critical' ? '#ef4444'
        : section.overall_status === 'warning' ? '#f97316'
            : section.overall_status === 'healthy' ? '#22c55e'
                : '#94a3b8';

    const badgeCls = {
        healthy: 'bg-green-100 text-green-700',
        warning: 'bg-amber-100 text-amber-700',
        critical: 'bg-red-100 text-red-700'
    }[section.overall_status] || 'bg-slate-100 text-slate-600';

    /* Title click — same as drill_down button */
    const handleTitleClick = () => {
        if (section.drill_down) onCardDrill(section.drill_down.api, section.drill_down.label);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all self-start">
            {/* Status-colored top bar */}
            <div className="h-1.5" style={{ backgroundColor: statusBarColor }} />

            {/* Header row — always visible */}
            <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <span style={{ color: statusBarColor }}>{icon}</span>
                    {/* Clickable title fires drill-down */}
                    <button
                        onClick={handleTitleClick}
                        className="text-sm font-bold text-gray-900 truncate text-left hover:text-indigo-700 hover:underline transition-colors focus:outline-none"
                        title={section.drill_down?.label || section.label}
                    >
                        {section.label}
                    </button>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-lg font-extrabold text-gray-900">{section.overall_score}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeCls}`}>{section.overall_status?.toUpperCase()}</span>
                </div>
            </div>

            {/* "more" toggle + action pills on same row */}
            <div className="px-4 pb-2 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                    {section.itsm_action_pills?.slice(0, 3).map(p => (
                        <button key={p.id} onClick={() => onActionClick && onActionClick(p.id, p.label)}
                            className="flex items-center gap-1 text-[10px] font-semibold border border-gray-200 rounded-full px-2 py-0.5 text-gray-500 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">
                            {p.label}{isCEO && <ChevronRight className="w-2.5 h-2.5 opacity-60" />}
                        </button>
                    ))}
                    {(section.itsm_action_pills?.length || 0) > 3 &&
                        <span className="text-[10px] text-slate-400 self-center">+{section.itsm_action_pills.length - 3} more</span>}
                </div>
                <button
                    onClick={() => setExpanded(prev => !prev)}
                    className="text-[10px] font-semibold text-indigo-500 hover:text-indigo-700 shrink-0 transition-colors focus:outline-none"
                >
                    {expanded ? 'less ↑' : 'more ↓'}
                </button>
            </div>

            {/* Collapsible sub-items */}
            {expanded && (
                <div className="border-t border-gray-100 px-4 py-1">
                    {section.sub_items?.map(item => <SubItemRow key={item.id} item={item} onDrill={onSubDrill} />)}
                </div>
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
                <div className="max-w-2xl mx-auto mb-8">
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
                    <div className="max-w-2xl mx-auto mb-10">
                        <p className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-4">CEO Executive Dashboard</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 items-start">
                            {sections.map(s => <SectionCard key={s.id} section={s} onSubDrill={handleDrill} onCardDrill={handleDrill} onActionClick={onActionClick} isCEO={isCEO} />)}
                        </div>
                    </div>
                )}

            </main>
            <DrillDownPanel open={panel.open} title={panel.title} apiPath={panel.api} onClose={() => setPanel({ open: false, title: '', api: '' })} />
        </div>
    );
};
export default ITSMSearchPage;
