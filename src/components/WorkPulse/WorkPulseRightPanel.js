import { useState, useMemo } from 'react';
import { LIVE_ROWS, EMPLOYEES } from '../../data/workPulseDashboardData';

const C = {
    accent: '#0284C7', surface: '#fff', bg: '#F8FAFC', border: '#E2E8F0',
    text: '#0F172A', text2: '#475569', text3: '#94A3B8',
};

const SOURCE_COLOR = {
    Jira: { bg: '#EFF6FF', color: '#0284C7' },
    GitHub: { bg: '#FFFBEB', color: '#D97706' },
    'MS Teams': { bg: '#EEF2FF', color: '#6366F1' },
    Slack: { bg: '#FDF2F8', color: '#EC4899' },
    Email: { bg: '#ECFDF5', color: '#059669' },
    HRM: { bg: '#F0FDF4', color: '#16A34A' },
    ERP: { bg: '#FFF7ED', color: '#EA580C' },
    Biometric: { bg: '#FDF4FF', color: '#9333EA' },
    'Google Drive': { bg: '#FFF7ED', color: '#F59E0B' },
    Salesforce: { bg: '#F0F9FF', color: '#0EA5E9' },
    Camera: { bg: '#F1F5F9', color: '#475569' },
};

function SourceBadge({ source }) {
    const s = SOURCE_COLOR[source] || { bg: '#F1F5F9', color: '#64748B' };
    return (
        <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 600, background: s.bg, color: s.color }}>
            {source}
        </span>
    );
}

function StatusBadge({ status }) {
    const map = {
        'Open': { bg: '#EFF6FF', color: '#0284C7' },
        'In Progress': { bg: '#FFFBEB', color: '#D97706' },
        'Done': { bg: '#ECFDF5', color: '#059669' },
        'Blocked': { bg: '#FEE2E2', color: '#DC2626' },
        'Review': { bg: '#EEF2FF', color: '#6366F1' },
        'Merged': { bg: '#ECFDF5', color: '#059669' },
        'Failed': { bg: '#FEE2E2', color: '#DC2626' },
    };
    const s = map[status] || { bg: '#F1F5F9', color: '#64748B' };
    return (
        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>
            {status}
        </span>
    );
}

function PriorityBadge({ priority }) {
    const map = { Critical: '#B91C1C', High: '#DC2626', Medium: '#D97706', Low: '#059669' };
    const color = map[priority] || '#94A3B8';
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
            {priority}
        </span>
    );
}

function FilterDropdown({ label, options, value, onChange }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    padding: '4px 10px', borderRadius: 6, border: `1px solid ${value ? C.accent : C.border}`,
                    background: value ? `${C.accent}10` : C.surface, color: value ? C.accent : C.text2,
                    fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                }}
            >
                {value || label} <span style={{ fontSize: 9 }}>▼</span>
            </button>
            {open && (
                <div style={{
                    position: 'absolute', top: '110%', left: 0, zIndex: 100,
                    background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: 140, overflow: 'hidden',
                }}>
                    <div
                        onClick={() => { onChange(null); setOpen(false); }}
                        style={{ padding: '7px 12px', fontSize: 12, cursor: 'pointer', color: C.text3 }}
                    >
                        All
                    </div>
                    {options.map(opt => (
                        <div
                            key={opt}
                            onClick={() => { onChange(opt); setOpen(false); }}
                            style={{
                                padding: '7px 12px', fontSize: 12, cursor: 'pointer',
                                background: value === opt ? `${C.accent}10` : 'transparent',
                                color: value === opt ? C.accent : C.text,
                            }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Video Popup ─────────────────────────────────────────────────────────────
function VideoPopup({ row, onClose }) {
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 2000,
                background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24,
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#0F172A', borderRadius: 16, overflow: 'hidden',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
                    maxWidth: 720, width: '100%',
                    display: 'flex', flexDirection: 'column',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 20 }}>📷</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif' }}>{row.id} — Camera Feed</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#DC262620', border: '1px solid #DC262650', borderRadius: 999, padding: '2px 8px' }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.5s infinite' }} />
                                <span style={{ fontSize: 9.5, fontWeight: 700, color: '#EF4444', letterSpacing: '0.08em' }}>LIVE</span>
                            </span>
                        </div>
                        <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 3 }}>{row.summary.replace('📷 ', '')}</div>
                    </div>
                    <button onClick={onClose} style={{
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.08)', color: '#fff',
                        width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
                        fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>✕</button>
                </div>
                {/* Video */}
                <div style={{ position: 'relative', background: '#000' }}>
                    <video
                        src="/workpulse/IMG_0544.MOV"
                        controls
                        autoPlay
                        style={{ width: '100%', maxHeight: '60vh', display: 'block' }}
                    />
                </div>
                {/* Footer info */}
                <div style={{ padding: '10px 18px', display: 'flex', gap: 16 }}>
                    {[['Camera', row.id], ['Zone', 'Floor B / Entrance'], ['Updated', row.updated], ['Priority', row.priority]].map(([k, v]) => (
                        <div key={k}>
                            <div style={{ fontSize: 9.5, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>{k}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#CBD5E1', marginTop: 1 }}>{v}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function RightPanel({ sourceFilter, onEmployeeClick }) {
    const [statusFilter, setStatusFilter] = useState(null);
    const [priorityFilter, setPriorityFilter] = useState(null);
    const [sourceFilterLocal, setSourceFilterLocal] = useState(null);
    const [videoRow, setVideoRow] = useState(null);

    const allStatuses = [...new Set(LIVE_ROWS.map(r => r.status))];
    const allPriorities = ['Critical', 'High', 'Medium', 'Low'];
    const allSources = [...new Set(LIVE_ROWS.map(r => r.source))];

    const filtered = useMemo(() => {
        let rows = [...LIVE_ROWS];
        if (sourceFilter && sourceFilter.source) {
            rows = rows.filter(r => r.source === sourceFilter.source);
        } else if (sourceFilter && sourceFilter.category === 'database') {
            const dbSources = ['Google Drive', 'Email', 'MS Teams', 'Slack'];
            rows = rows.filter(r => dbSources.includes(r.source));
        } else if (sourceFilter && sourceFilter.category === 'reality') {
            const realSources = ['Jira', 'GitHub', 'ERP', 'Salesforce', 'Zoho Financial', 'HRM', 'Biometric', 'Camera'];
            rows = rows.filter(r => realSources.includes(r.source));
        }
        if (statusFilter) rows = rows.filter(r => r.status === statusFilter);
        if (priorityFilter) rows = rows.filter(r => r.priority === priorityFilter);
        if (sourceFilterLocal) rows = rows.filter(r => r.source === sourceFilterLocal);
        return rows;
    }, [sourceFilter, statusFilter, priorityFilter, sourceFilterLocal]);

    const handleEmpClick = (name) => {
        const emp = EMPLOYEES.find(e => e.name === name);
        if (emp && onEmployeeClick) onEmployeeClick(emp);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg }}>
            {/* Header */}
            <div style={{ padding: '14px 16px 10px', borderBottom: `1px solid ${C.border}`, flexShrink: 0, background: C.surface }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span className="syne" style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Live</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 999, padding: '1px 7px' }}>
                        <span className="live-dot" style={{ width: 5, height: 5 }} />
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#059669', letterSpacing: '0.07em' }}>LIVE</span>
                    </span>
                    <span style={{ fontSize: 11, color: C.text3 }}>
                        {filtered.length} records · All Sources
                    </span>
                </div>
                {/* Filters */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <FilterDropdown label="Status" options={allStatuses} value={statusFilter} onChange={setStatusFilter} />
                    <FilterDropdown label="Priority" options={allPriorities} value={priorityFilter} onChange={setPriorityFilter} />
                    <FilterDropdown label="Source" options={allSources} value={sourceFilterLocal} onChange={setSourceFilterLocal} />
                    {(statusFilter || priorityFilter || sourceFilterLocal) && (
                        <button
                            onClick={() => { setStatusFilter(null); setPriorityFilter(null); setSourceFilterLocal(null); }}
                            style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #FECACA', background: '#FFF5F5', color: '#DC2626', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                        >
                            ✕ Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                        <tr style={{ background: '#F8FAFC', position: 'sticky', top: 0, zIndex: 10 }}>
                            {['ID', 'Summary', 'Assignee', 'Status', 'Priority', 'Source', 'Updated', ''].map(h => (
                                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: C.text3, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((row, i) => (
                            <tr
                                key={row.id + i}
                                style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.1s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                                onMouseLeave={e => e.currentTarget.style.background = ''}
                            >
                                <td style={{ padding: '7px 10px', fontWeight: 700, color: C.accent, whiteSpace: 'nowrap' }}>{row.id}</td>
                                <td style={{ padding: '7px 10px', color: C.text, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.summary}>{row.summary}</td>
                                <td style={{ padding: '7px 10px', whiteSpace: 'nowrap' }}>
                                    {row.assignee === 'Security AI' ? (
                                        <span style={{ fontSize: 11, color: '#475569', fontStyle: 'italic' }}>Security AI</span>
                                    ) : (
                                        <span
                                            onClick={() => handleEmpClick(row.assignee)}
                                            style={{ color: C.accent, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline dotted' }}
                                        >
                                            {row.assignee}
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: '7px 10px' }}><StatusBadge status={row.status} /></td>
                                <td style={{ padding: '7px 10px' }}><PriorityBadge priority={row.priority} /></td>
                                <td style={{ padding: '7px 10px' }}><SourceBadge source={row.source} /></td>
                                <td style={{ padding: '7px 10px', color: C.text3, whiteSpace: 'nowrap' }}>{row.updated}</td>
                                {/* Camera video button */}
                                <td style={{ padding: '7px 8px', whiteSpace: 'nowrap' }}>
                                    {row.hasVideo && (
                                        <button
                                            onClick={() => setVideoRow(row)}
                                            title="View camera footage"
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                                padding: '3px 10px', border: '1px solid #DC262640',
                                                background: '#FEF2F2', color: '#DC2626',
                                                borderRadius: 6, fontSize: 10.5, fontWeight: 700,
                                                cursor: 'pointer', transition: 'all 0.12s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                                        >
                                            ▶ View
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: C.text3 }}>
                                    No records match the selected filters
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Video popup */}
            {videoRow && <VideoPopup row={videoRow} onClose={() => setVideoRow(null)} />}
        </div>
    );
}
