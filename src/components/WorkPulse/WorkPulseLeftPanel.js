import { useState } from 'react';
import { globalKPIs, SOURCE_HIERARCHY, SOURCE_KPIS } from '../../data/workPulseDashboardData';

// ── Inline sparkline (self-contained, no overflow) ───────────────────────────
function Spark({ data, color, w = 64, h = 24 }) {
    const mn = Math.min(...data), mx = Math.max(...data);
    const range = mx - mn || 1;
    const pad = 2;
    const pts = data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = pad + (1 - (v - mn) / range) * (h - pad * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    return (
        <svg
            viewBox={`0 0 ${w} ${h}`}
            width={w} height={h}
            style={{ display: 'block', overflow: 'hidden', flexShrink: 0 }}
        >
            <polyline
                fill="none"
                stroke={color}
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pts}
            />
        </svg>
    );
}

// ── Global KPI card (top 6) ──────────────────────────────────────────────────
function GlobalKPICard({ kpi, onClick }) {
    const up = kpi.trend === 'up';
    return (
        <div
            onClick={onClick}
            style={{
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderLeft: `3px solid ${kpi.color}`,
                borderRadius: 10,
                padding: '10px 11px 8px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                overflow: 'hidden',
                transition: 'box-shadow 0.15s, border-color 0.15s',
                minHeight: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 2px 12px ${kpi.color}25`; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; }}
        >
            {/* Label */}
            <div style={{
                fontSize: 9.5, fontWeight: 700, color: '#64748B',
                letterSpacing: '0.05em', textTransform: 'uppercase',
                lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
                {kpi.label}
            </div>
            <div style={{ fontSize: 8.5, color: '#CBD5E1', lineHeight: 1 }}>{kpi.sublabel}</div>

            {/* Value */}
            <div style={{
                fontSize: 17, fontWeight: 800, color: kpi.color,
                letterSpacing: '-0.02em', lineHeight: 1.1,
            }}>
                {kpi.value}
            </div>

            {/* Trend + spark in a row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden' }}>
                <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: up ? '#059669' : '#DC2626',
                    flexShrink: 0,
                }}>
                    {up ? '▲' : '▼'} {kpi.delta}
                </span>
                <Spark data={kpi.spark} color={kpi.color} w={60} h={22} />
            </div>
        </div>
    );
}

// ── Source KPI card (bottom section) ────────────────────────────────────────
function SourceKPICard({ kpi, onClick }) {
    const up = kpi.trend === 'up';
    return (
        <div
            onClick={onClick}
            style={{
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderLeft: `3px solid ${kpi.color}`,
                borderRadius: 8,
                padding: '9px 10px 7px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                overflow: 'hidden',
                transition: 'box-shadow 0.15s',
                minHeight: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 2px 10px ${kpi.color}20`; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; }}
        >
            <div style={{
                fontSize: 9, fontWeight: 700, color: '#64748B',
                letterSpacing: '0.05em', textTransform: 'uppercase',
                lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
                {kpi.name}
            </div>
            <div style={{ fontSize: 8, color: '#CBD5E1', lineHeight: 1 }}>{kpi.category}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: kpi.color, letterSpacing: '-0.02em' }}>
                {kpi.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden' }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: up ? '#059669' : '#DC2626', flexShrink: 0 }}>
                    {up ? '▲' : '▼'} {kpi.delta}
                </span>
                <Spark data={kpi.spark} color={kpi.color} w={56} h={20} />
            </div>
        </div>
    );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function LeftPanel({ onKPIClick, onSourceFilter }) {
    const [topTab, setTopTab] = useState('all');
    const [subSource, setSubSource] = useState(null);

    const handleTopTab = (tab) => {
        setTopTab(tab);
        setSubSource(null);
        onSourceFilter && onSourceFilter(null, tab);
    };

    const handleSubSource = (src) => {
        const next = subSource === src ? null : src;
        setSubSource(next);
        onSourceFilter && onSourceFilter(next, topTab);
    };

    const currentSubSources = SOURCE_HIERARCHY[topTab]?.subSources || [];

    const activeKPIs = subSource
        ? (SOURCE_KPIS[subSource] || [])
        : topTab === 'all'
            ? Object.values(SOURCE_KPIS).flat().slice(0, 8)
            : currentSubSources.flatMap(s => SOURCE_KPIS[s] || []).slice(0, 8);

    const tabStyle = (tab) => ({
        padding: '5px 14px',
        border: 'none',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
        background: topTab === tab ? '#0284C7' : '#F1F5F9',
        color: topTab === tab ? '#fff' : '#475569',
    });

    const subBtnStyle = (src) => ({
        padding: '3px 10px',
        border: `1px solid ${subSource === src ? '#0284C7' : '#E2E8F0'}`,
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 500,
        cursor: 'pointer',
        background: subSource === src ? '#EFF6FF' : '#fff',
        color: subSource === src ? '#0284C7' : '#64748B',
        transition: 'all 0.12s',
        whiteSpace: 'nowrap',
    });

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: '#F8FAFC',
            overflow: 'hidden',
        }}>

            {/* ── TOP: Global workforce KPIs ─────────────────────────────── */}
            <div style={{
                flexShrink: 0,
                padding: '12px 14px 10px',
                borderBottom: '1px solid #E2E8F0',
            }}>
                {/* Title row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                        <h2 className="syne" style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                            Global Workforce KPIs
                        </h2>
                        <div style={{ fontSize: 9.5, color: '#94A3B8', marginTop: 1 }}>Click any card for details</div>
                    </div>
                    <span style={{
                        fontSize: 9.5, color: '#059669',
                        background: '#ECFDF5', border: '1px solid #A7F3D0',
                        borderRadius: 4, padding: '2px 7px', fontWeight: 600,
                    }}>
                        ● Syncing
                    </span>
                </div>

                {/* 3×2 grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridTemplateRows: 'repeat(2, auto)',
                    gap: 7,
                }}>
                    {globalKPIs.map(kpi => (
                        <GlobalKPICard
                            key={kpi.id}
                            kpi={kpi}
                            onClick={() => onKPIClick && onKPIClick(kpi)}
                        />
                    ))}
                </div>
            </div>

            {/* ── BOTTOM: Source Intelligence ─────────────────────────────── */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '10px 14px 12px',
                gap: 8,
                minHeight: 0,
                overflow: 'hidden',
            }}>
                {/* Section title */}
                <h2 className="syne" style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#0F172A', flexShrink: 0 }}>
                    Source Intelligence
                </h2>

                {/* Top 3 filter buttons */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {['all', 'database', 'reality'].map(tab => (
                        <button key={tab} onClick={() => handleTopTab(tab)} style={tabStyle(tab)}>
                            {SOURCE_HIERARCHY[tab].label}
                        </button>
                    ))}
                </div>

                {/* Sub-source chip buttons */}
                {topTab !== 'all' && currentSubSources.length > 0 && (
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: 5, flexShrink: 0,
                    }}>
                        {currentSubSources.map(src => (
                            <button key={src} onClick={() => handleSubSource(src)} style={subBtnStyle(src)}>
                                {src}
                            </button>
                        ))}
                    </div>
                )}

                {/* KPI cards — scrollable area */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    minHeight: 0,
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 7,
                        paddingBottom: 4,
                    }}>
                        {activeKPIs.map(kpi => (
                            <SourceKPICard
                                key={kpi.id}
                                kpi={kpi}
                                onClick={() => onKPIClick && onKPIClick(kpi)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
