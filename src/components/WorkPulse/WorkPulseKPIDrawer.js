import { useEffect, useRef, useState } from 'react';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// Extend sparkData to 24 realistic points, keeping the same numeric scale
function expandData(sparkData) {
    const base = sparkData[0];
    const final = sparkData[sparkData.length - 1];
    const spread = sparkData.reduce((acc, v, i, arr) => i === 0 ? acc : Math.max(acc, Math.abs(v - arr[i - 1])), 0);
    const noiseScale = Math.max(spread * 0.4, Math.abs(base) * 0.02, 0.2);
    const points = [];
    for (let i = 0; i < 24; i++) {
        const progress = i / 23;
        const linear = base + (final - base) * progress;
        const noise = (Math.random() - 0.5) * noiseScale;
        points.push(parseFloat((linear + noise).toFixed(2)));
    }
    points[0] = base;
    points[23] = final;
    return points;
}

const DAYS = ['Feb 2', 'Feb 3', 'Feb 4', 'Feb 5', 'Feb 6', 'Feb 7', 'Feb 8', 'Feb 9',
    'Feb 10', 'Feb 11', 'Feb 12', 'Feb 13', 'Feb 14', 'Feb 15', 'Feb 16', 'Feb 17',
    'Feb 18', 'Feb 19', 'Feb 20', 'Feb 21', 'Feb 22', 'Feb 23', 'Feb 24', 'Feb 25'];

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div style={{
            background: '#fff', border: '1px solid #E2E8F0',
            borderRadius: 8, padding: '10px 14px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        }}>
            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>{payload[0].value}</div>
        </div>
    );
}

export default function KPIDrawer({ kpi, onClose }) {
    const [exiting, setExiting] = useState(false);
    const overlayRef = useRef();

    const close = () => {
        setExiting(true);
        setTimeout(onClose, 260);
    };

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') close(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const chartData = expandData(kpi.sparkData || kpi.spark || [50, 52, 54, 56, 58, 60, 62]).map((v, i) => ({ date: DAYS[i], value: v }));
    const color = kpi.color || '#0284C7';

    const trendIcon = kpi.trend === 'up'
        ? <TrendingUp size={16} color="#059669" />
        : kpi.trend === 'down'
            ? <TrendingDown size={16} color="#DC2626" />
            : <Minus size={16} color="#94A3B8" />;

    const trendColor = kpi.trend === 'up' ? '#059669' : kpi.trend === 'down' ? '#DC2626' : '#94A3B8';
    const trendBg = kpi.trend === 'up' ? '#ECFDF5' : kpi.trend === 'down' ? '#FEF2F2' : '#F8FAFC';

    const minVal = Math.min(...chartData.map(d => d.value));
    const maxVal = Math.max(...chartData.map(d => d.value));
    const rangePad = Math.max((maxVal - minVal) * 0.2, Math.abs(minVal) * 0.05, 0.5);
    // Nice domain boundaries
    const domainMin = parseFloat((minVal - rangePad).toFixed(1));
    const domainMax = parseFloat((maxVal + rangePad).toFixed(1));
    const tickFmt = v => {
        if (Math.abs(v) >= 1000) return (v / 1000).toFixed(1) + 'k';
        if (Number.isInteger(v)) return v;
        return v.toFixed(1);
    };

    return (
        <>
            {/* Overlay */}
            <div
                ref={overlayRef}
                className={exiting ? 'drawer-overlay-exit' : 'drawer-overlay'}
                onClick={close}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(15,23,42,0.3)',
                    zIndex: 100,
                    backdropFilter: 'blur(2px)',
                }}
            />

            {/* Drawer Panel */}
            <div
                className={exiting ? 'drawer-panel-exit' : 'drawer-panel'}
                style={{
                    position: 'fixed', top: 0, right: 0, bottom: 0,
                    width: 520,
                    background: '#fff',
                    boxShadow: '-8px 0 48px rgba(0,0,0,0.14)',
                    zIndex: 101,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px 24px 16px',
                    borderBottom: '1px solid #F1F5F9',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                    flexShrink: 0,
                }}>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                            KPI Detail View
                        </div>
                        <h2 className="syne" style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>
                            {kpi.label}
                        </h2>
                    </div>
                    <button
                        onClick={close}
                        style={{
                            background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8,
                            width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#64748B', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#0F172A'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#64748B'; }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

                    {/* KPI summary row */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
                        {/* Current value */}
                        <div style={{
                            flex: 1, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 20px',
                        }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                                Current Value
                            </div>
                            <div className="syne" style={{ fontSize: 32, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1 }}>
                                {kpi.value}
                            </div>
                        </div>
                        {/* Trend */}
                        <div style={{
                            flex: 1, background: trendBg, border: `1px solid ${color}30`, borderRadius: 12, padding: '16px 20px',
                        }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                                vs. Last Week
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {trendIcon}
                                <span style={{ fontSize: 22, fontWeight: 700, color: trendColor, fontFamily: 'Syne, sans-serif' }}>
                                    {kpi.change || kpi.delta}
                                </span>
                            </div>
                            {kpi.changeLabel && (
                                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{kpi.changeLabel}</div>
                            )}
                        </div>
                    </div>

                    {/* Chart */}
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 16 }}>
                            30-Day Trend  <span style={{ fontSize: 11, fontWeight: 400, color: '#94A3B8' }}>(Feb 2 – Feb 25, 2026)</span>
                        </div>
                        <div style={{ height: 240 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id={`drawer-grad-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                                            <stop offset="100%" stopColor={color} stopOpacity={0.01} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 10, fill: '#94A3B8' }}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={5}
                                    />
                                    <YAxis
                                        domain={[domainMin, domainMax]}
                                        tickFormatter={tickFmt}
                                        tick={{ fontSize: 10, fill: '#94A3B8' }}
                                        tickLine={false}
                                        axisLine={false}
                                        width={40}
                                        tickCount={5}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 2' }} />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke={color}
                                        strokeWidth={2}
                                        fill={`url(#drawer-grad-${kpi.id})`}
                                        dot={false}
                                        activeDot={{ r: 5, fill: color, stroke: '#fff', strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
                        {[
                            { label: 'Period High', val: tickFmt(maxVal) },
                            { label: 'Period Low', val: tickFmt(minVal) },
                            { label: 'Data Points', val: '24' },
                        ].map(stat => (
                            <div key={stat.label} style={{
                                background: '#F8FAFC', border: '1px solid #E2E8F0',
                                borderRadius: 10, padding: '12px 14px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                                    {stat.label}
                                </div>
                                <div className="syne" style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>
                                    {stat.val}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Insight blurb */}
                    <div style={{
                        background: `${color}0d`, border: `1px solid ${color}25`,
                        borderLeft: `3px solid ${color}`,
                        borderRadius: 8, padding: '14px 16px',
                    }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>💡 Insight</div>
                        <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                            {kpi.trend === 'up'
                                ? `${kpi.label} has been consistently improving over the past period, showing a ${kpi.change} gain. This positive trajectory aligns with the current sprint goals.`
                                : kpi.trend === 'down' && ['Idle Time', 'No-Shows Today', 'Avg Resolution', 'Failed Scans', 'Code Review Cycle', 'Avg Response Time'].some(d => kpi.label.includes(d.split(' ')[0]))
                                    ? `${kpi.label} has improved (decreased) by ${kpi.change} — this is a positive trend indicating efficiency gains across the team.`
                                    : `${kpi.label} has declined by ${kpi.change} over the observed period. Review team utilization and identify any blockers.`
                            }
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
