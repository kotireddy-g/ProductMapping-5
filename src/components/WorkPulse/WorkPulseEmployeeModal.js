import { useState } from 'react';
import { getEmployeeDetail } from '../../data/workPulseDashboardData';

// ─── Light theme tokens ───────────────────────────────────────────────────────
const C = {
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F5F9',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    text: '#0F172A',
    text2: '#475569',
    text3: '#94A3B8',
    accent: '#0284C7',
    green: '#059669',
    amber: '#D97706',
    red: '#DC2626',
    indigo: '#6366F1',
};

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Spark({ data, color, w = 80, h = 32 }) {
    const mn = Math.min(...data), mx = Math.max(...data), range = mx - mn || 1;
    const pad = 3;
    const pts = data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = pad + (1 - (v - mn) / range) * (h - pad * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const area = `M${pts[0]} ${pts.join(' L')} L${w - pad},${h - pad} L${pad},${h - pad} Z`;
    return (
        <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: 'block', overflow: 'hidden', flexShrink: 0 }}>
            <defs>
                <linearGradient id={`sg${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#sg${color.replace('#', '')})`} />
            <polyline fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" points={pts.join(' ')} />
        </svg>
    );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ emp, size = 80 }) {
    const initials = emp.name.split(' ').map(w => w[0]).join('').substring(0, 2);
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: `linear-gradient(135deg, ${emp.color}, ${emp.color}CC)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.32, fontWeight: 800, color: '#fff',
            boxShadow: `0 4px 16px ${emp.color}40`, flexShrink: 0,
            border: `3px solid ${emp.color}30`,
        }}>
            {initials}
        </div>
    );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusPill({ label, color, bg }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 999,
            fontSize: 10.5, fontWeight: 700,
            background: bg, color,
            border: `1px solid ${color}30`,
        }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
            {label}
        </span>
    );
}

// ─── KPI card ─────────────────────────────────────────────────────────────────
function KPICard({ kpi, onViewDetails }) {
    const statusMap = {
        up: { label: 'On Target', color: C.green, bg: '#ECFDF5' },
        down: { label: 'At Risk', color: C.red, bg: '#FEF2F2' },
        flat: { label: 'Stable', color: C.amber, bg: '#FFFBEB' },
    };
    const st = statusMap[kpi.trend] || statusMap.flat;
    return (
        <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: '12px 14px',
            display: 'flex', flexDirection: 'column', gap: 6,
            flex: 1, minWidth: 0, overflow: 'hidden',
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.text2, lineHeight: 1.3, flex: 1 }}>{kpi.label}</div>
                <span style={{
                    fontSize: 9.5, fontWeight: 700, whiteSpace: 'nowrap',
                    padding: '2px 7px', borderRadius: 999,
                    background: st.bg, color: st.color,
                }}>
                    {st.label}
                </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: '-0.02em', lineHeight: 1 }}>
                {kpi.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: kpi.trend === 'up' ? C.green : C.red }}>
                        {kpi.delta} vs Last week
                    </div>
                    <button
                        onClick={() => onViewDetails && onViewDetails(kpi)}
                        style={{
                            border: 'none', background: 'none', padding: 0,
                            fontSize: 10.5, color: C.accent, cursor: 'pointer',
                            fontWeight: 600, marginTop: 2,
                            display: 'flex', alignItems: 'center', gap: 3,
                        }}
                    >
                        View Details ›
                    </button>
                </div>
                <Spark data={kpi.spark} color={C.accent} w={76} h={34} />
            </div>
        </div>
    );
}

// ─── Action row ───────────────────────────────────────────────────────────────
function ActionRow({ action }) {
    const prioColors = {
        'P1/Urgent': { color: C.red, bg: '#FEF2F2' },
        'P2/High': { color: C.amber, bg: '#FFFBEB' },
        'P3/Medium': { color: C.indigo, bg: '#EEF2FF' },
    };
    const pc = prioColors[action.prio] || prioColors['P3/Medium'];
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 12px', borderRadius: 8,
            background: C.bg, border: `1px solid ${C.border}`,
        }}>
            <span style={{
                fontSize: 9, fontWeight: 700, padding: '2px 7px',
                borderRadius: 4, background: pc.bg, color: pc.color,
                flexShrink: 0,
            }}>
                {action.prio}
            </span>
            <span style={{ fontSize: 12, color: C.text, fontWeight: 600, flex: 1 }}>{action.title}</span>
            <span style={{ fontSize: 10, color: C.text3, flexShrink: 0 }}>→</span>
            <span style={{
                fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                background: action.statusBg || '#FEF2F2', color: action.statusColor || C.red,
                flexShrink: 0, whiteSpace: 'nowrap',
            }}>
                {action.status}
            </span>
            {action.cta && (
                <button style={{
                    border: `1px solid ${C.accent}40`, background: `${C.accent}10`,
                    color: C.accent, padding: '3px 10px', borderRadius: 5,
                    fontSize: 10, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
                }}>
                    {action.cta}
                </button>
            )}
        </div>
    );
}

// ─── Project row ──────────────────────────────────────────────────────────────
function ProjectRow({ proj }) {
    const trackColors = {
        'On Track': { color: C.green, bg: '#ECFDF5' },
        'Off Track': { color: C.red, bg: '#FEF2F2' },
        'At Risk': { color: C.amber, bg: '#FFFBEB' },
    };
    const tc = trackColors[proj.track] || trackColors['On Track'];
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8,
            background: C.bg, border: `1px solid ${C.border}`,
        }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: proj.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{proj.name}</div>
                <div style={{ fontSize: 10.5, color: C.text3, marginTop: 1 }}>
                    <span style={{ color: tc.color, fontWeight: 600 }}>{proj.track}</span>
                    {' · '}{proj.done}% Done
                    {proj.blocker && <span style={{ color: C.red }}> · {proj.blocker}</span>}
                    {proj.next && <span> · Next: <span style={{ color: C.accent }}>{proj.next}</span></span>}
                </div>
            </div>
            <div style={{ width: 80, background: C.border, borderRadius: 999, height: 5, flexShrink: 0 }}>
                <div style={{ width: `${proj.done}%`, background: proj.color, borderRadius: 999, height: '100%' }} />
            </div>
            <span style={{ fontSize: 10, color: '#94A3B8' }}>›</span>
        </div>
    );
}

// ─── WIP task pill ────────────────────────────────────────────────────────────
function WIPTask({ task }) {
    const stColors = {
        'To Do': { border: C.border, dot: C.text3 },
        'In Progress': { border: C.accent + '60', dot: C.accent },
        'Review': { border: C.indigo + '60', dot: C.indigo },
        'Blocked': { border: C.red + '60', dot: C.red },
    };
    const sc = stColors[task.status] || stColors['To Do'];
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '7px 10px', borderRadius: 7,
            background: C.surface, border: `1px solid ${sc.border}`,
            marginBottom: 5, cursor: 'default',
        }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
            <span style={{ fontSize: 10.5, fontWeight: 700, color: C.accent, flexShrink: 0 }}>{task.id}</span>
            <span style={{ fontSize: 10.5, color: C.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.label}</span>
            {task.flag && (
                <span style={{ fontSize: 9, fontWeight: 700, color: task.flag === 'blocked' ? C.red : C.amber, background: task.flag === 'blocked' ? '#FEF2F2' : '#FFFBEB', padding: '1px 6px', borderRadius: 3 }}>
                    {task.flag === 'blocked' ? 'Blocked' : 'Stalled'}
                </span>
            )}
        </div>
    );
}

// ─── Activity row ─────────────────────────────────────────────────────────────
function ActivityRow({ act, emp }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '10px 0', borderBottom: `1px solid ${C.borderLight}`,
        }}>
            <Avatar emp={emp} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{act.label}</div>
                {act.sub && <div style={{ fontSize: 10.5, color: C.text3, marginTop: 2 }}>{act.sub}</div>}
            </div>
            <div style={{ fontSize: 10.5, color: C.text3, whiteSpace: 'nowrap', flexShrink: 0 }}>
                <div>{act.date}</div>
                <div style={{ textAlign: 'right' }}>{act.time}</div>
            </div>
        </div>
    );
}

// ─── Generate rich detail from employee ───────────────────────────────────────
function buildModalData(emp, detail) {
    // 4 KPI cards
    const kpis = detail.kpis.slice(0, 4);

    // Actions
    const actions = [
        { prio: 'P1/Urgent', title: `Review PR #${2400 + Math.floor(Math.random() * 100)}`, status: 'Overdue by 12h', statusColor: C.red, statusBg: '#FEF2F2', cta: 'NUDGE' },
        { prio: 'P1/Urgent', title: `Resolve PROD Incident`, status: 'SLA Breach in 1h', statusColor: C.red, statusBg: '#FEF2F2' },
        { prio: 'P2/High', title: `Clarify Requirement for TASK-${1020 + Math.floor(Math.random() * 10)}`, status: 'Waiting on Details', statusColor: C.amber, statusBg: '#FFFBEB', cta: 'SEND REMINDER' },
    ];

    // Projects
    const projects = [
        { name: 'CRM Upgrade', track: 'Off Track', done: 65, blocker: '2 Blockers ⚠', color: C.red },
        { name: 'E-Commerce Platform', track: 'On Track', done: 80, next: 'UI Testing', color: C.green },
        { name: 'Client Portal Dev', track: 'At Risk', done: 45, blocker: 'Scope Creep Warning', color: C.amber },
    ];

    // WIP tasks
    const wipTasks = [
        { id: 'TASK-1045', label: 'Code Review Update', status: 'Review' },
        { id: 'BUG-891', label: 'API Fix Delayed', status: 'Blocked', flag: 'blocked' },
        { id: 'PR-567', label: 'Waiting 3d', status: 'In Progress' },
        { id: 'Issue-77', label: 'Deployed — Stalled 5d', status: 'Blocked', flag: 'stalled' },
        { id: 'TASK-125', label: 'UI Refactor', status: 'To Do' },
    ];

    // Dependency
    const deps = [
        { id: 'TASK-289', person: 'Ali', days: '3d', task: 'Clarify Requirements', dir: '←' },
        { id: 'BUG-789', person: 'Maria', days: '5d', task: 'Waiting on QA', dir: '←' },
        { id: 'PR-301', person: 'John', days: '1d', task: 'Awaiting Review', dir: '←' },
    ];

    // Activity timeline
    const activities = [
        { label: 'PR #567 · Code Review Comments', sub: null, date: 'Today', time: '10:15 AM' },
        { label: 'TASK-1023 Requirements Discussion', sub: 'Waiting on: Sarah', date: 'Yesterday', time: '3:45 PM' },
        { label: 'CRM Upgrade Dependency Alert', sub: 'Ticket Updated in Jira', date: 'Aug 11', time: '10:20 AM' },
    ];

    return { kpis, actions, projects, wipTasks, deps, activities };
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, right }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text }}>{title}</h3>
            {right}
        </div>
    );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
    return (
        <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: '14px 16px',
            ...style,
        }}>
            {children}
        </div>
    );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export default function EmployeeModal({ emp, onClose }) {
    const [weekLabel] = useState('Aug 10–16, 2024');
    const detail = getEmployeeDetail(emp);
    const modal = buildModalData(emp, detail);

    const availability = 'On Duty';
    const workload = 'High';
    const risk = 'At Risk';

    return (
        /* Backdrop */
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                padding: '24px 16px', overflowY: 'auto',
            }}
        >
            {/* Modal panel */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: C.bg, borderRadius: 16,
                    width: '100%', maxWidth: 660,
                    boxShadow: '0 24px 80px rgba(0,0,0,0.14)',
                    display: 'flex', flexDirection: 'column', gap: 12,
                    padding: '0 0 20px', overflow: 'hidden',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    position: 'relative',
                }}
            >
                {/* ── HEADER BAND ────────────────────────────────────────── */}
                <div style={{
                    background: C.surface, padding: '18px 20px 14px',
                    borderBottom: `1px solid ${C.border}`,
                    position: 'relative',
                }}>
                    {/* Close */}
                    <button onClick={onClose} style={{
                        position: 'absolute', top: 14, right: 14,
                        border: `1px solid ${C.border}`, background: C.bg,
                        borderRadius: 8, width: 30, height: 30,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', fontSize: 14, color: C.text3,
                    }}>✕</button>

                    {/* Top row: avatar + name + status pills */}
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <Avatar emp={emp} size={72} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                                <h2 className="syne" style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: '-0.02em' }}>
                                    {emp.name}
                                </h2>
                                {/* Status pills */}
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: 11, color: C.text3 }}>Availability:</span>
                                    <StatusPill label={availability} color={C.green} bg="#ECFDF5" />
                                    <span style={{ fontSize: 11, color: C.text3, marginLeft: 4 }}>Workload:</span>
                                    <StatusPill label={workload} color={C.amber} bg="#FFFBEB" />
                                    <span style={{ fontSize: 11, color: C.text3, marginLeft: 4 }}>Risk:</span>
                                    <StatusPill label={risk} color={C.red} bg="#FEF2F2" />
                                </div>
                            </div>
                            <div style={{ fontSize: 13, color: C.text2, marginTop: 2 }}>{emp.designation} – {emp.role}</div>

                            {/* Info chips */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 11, color: C.text3 }}>🏢 Team: <strong style={{ color: C.text2 }}>{emp.dept} Squad</strong></span>
                                <span style={{ fontSize: 11, color: C.text3 }}>📍 <strong style={{ color: C.text2 }}>Bangalore</strong></span>
                                <span style={{ fontSize: 11, color: C.text3 }}>🛠 <strong style={{ color: C.text2 }}>
                                    {emp.dept === 'Engineering' ? 'React, Node.js, AWS' :
                                        emp.dept === 'Sales' ? 'SFDC, HubSpot, Outreach' :
                                            emp.dept === 'Finance' ? 'Zoho, SAP, Excel' :
                                                emp.dept === 'HR' ? 'Workday, BambooHR, DISC' :
                                                    'Jira, Confluence, G-Suite'}
                                </strong></span>
                            </div>

                            {/* Date nav */}
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                marginTop: 10, border: `1px solid ${C.border}`,
                                borderRadius: 8, padding: '4px 10px', background: C.bg,
                            }}>
                                <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.text3, fontSize: 12 }}>‹</button>
                                <span style={{ fontSize: 11, fontWeight: 600, color: C.text2 }}>Weekly · {weekLabel}</span>
                                <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.text3, fontSize: 12 }}>›</button>
                                <span style={{ fontSize: 12, color: C.text3 }}>⊞</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BODY ───────────────────────────────────────────────── */}
                <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

                    {/* ── KPI CARDS (4 in a row) ─────────────────────────── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                        {modal.kpis.map((kpi, i) => (
                            <KPICard key={i} kpi={kpi} />
                        ))}
                    </div>

                    {/* ── ACTION PENDINGS + PROJECTS (side by side) ──────── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {/* Action Pendings */}
                        <Card>
                            <SectionHeader
                                title="Action Pendings"
                                right={
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        {['P1/Urgent', 'My Actions', 'Waiting on Others'].map(t => (
                                            <span key={t} style={{ fontSize: 9, fontWeight: 600, color: C.text3, cursor: 'pointer' }}>{t}</span>
                                        ))}
                                    </div>
                                }
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {modal.actions.map((a, i) => <ActionRow key={i} action={a} />)}
                            </div>
                        </Card>

                        {/* Projects Involved */}
                        <Card>
                            <SectionHeader title="Projects Involved" right={<span style={{ fontSize: 11, color: C.accent, cursor: 'pointer' }}>›› See All</span>} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {modal.projects.map((p, i) => <ProjectRow key={i} proj={p} />)}
                            </div>
                        </Card>
                    </div>

                    {/* ── WORK IN PROGRESS + DEPENDENCY STATUS ──────────── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {/* Work in Progress */}
                        <Card>
                            <SectionHeader title="Work in Progress" />
                            {/* Column tabs */}
                            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                                {['To Do', 'In Progress', 'Review (2)', 'Blocked (1)'].map(t => (
                                    <span key={t} style={{
                                        fontSize: 9.5, fontWeight: 700,
                                        padding: '2px 8px', borderRadius: 4,
                                        background: t.includes('Blocked') ? '#FEF2F2' : t.includes('Review') ? '#EEF2FF' : C.surfaceAlt,
                                        color: t.includes('Blocked') ? C.red : t.includes('Review') ? C.indigo : C.text2,
                                        cursor: 'pointer',
                                    }}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                            {modal.wipTasks.map((t, i) => <WIPTask key={i} task={t} />)}
                        </Card>

                        {/* Dependency Status */}
                        <Card>
                            <SectionHeader title="Dependency Status" />
                            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                                {['Blocked By Me 2', 'Blocked (1)', 'Done'].map(t => (
                                    <span key={t} style={{
                                        fontSize: 9.5, fontWeight: 700,
                                        padding: '2px 8px', borderRadius: 4,
                                        background: t.includes('Blocked') ? '#FEF2F2' : C.surfaceAlt,
                                        color: t.includes('Blocked') ? C.red : C.text2,
                                    }}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                            {modal.deps.map((dep, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '8px 10px', borderRadius: 7,
                                    background: C.bg, border: `1px solid ${C.border}`, marginBottom: 5,
                                }}>
                                    <div style={{
                                        width: 30, height: 30, borderRadius: '50%',
                                        background: C.accent + '20', color: C.accent,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 10, fontWeight: 700, flexShrink: 0,
                                    }}>
                                        {dep.person[0]}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: C.accent }}>{dep.id}</span>
                                            <span style={{ fontSize: 11, color: C.text2 }}>{dep.person}</span>
                                            <span style={{ fontSize: 10, fontWeight: 700, color: C.red }}>({dep.days})</span>
                                        </div>
                                        <div style={{ fontSize: 10, color: C.text3 }}>{dep.task} {dep.dir}</div>
                                    </div>
                                    <span style={{ fontSize: 12, color: C.text3 }}>›</span>
                                </div>
                            ))}
                        </Card>
                    </div>

                    {/* ── ACTIVITY TIMELINE ─────────────────────────────── */}
                    <Card>
                        <SectionHeader title="Activity Timeline" />
                        {modal.activities.map((act, i) => (
                            <ActivityRow key={i} act={act} emp={emp} />
                        ))}
                    </Card>
                </div>
            </div>
        </div>
    );
}
