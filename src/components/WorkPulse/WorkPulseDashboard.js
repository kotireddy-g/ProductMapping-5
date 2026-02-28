import React, { useState, useEffect } from 'react';
import { Activity, ArrowLeft } from 'lucide-react';
import WorkPulseLeftPanel from './WorkPulseLeftPanel';
import WorkPulseRightPanel from './WorkPulseRightPanel';
import WorkPulseFeedPanel from './WorkPulseFeedPanel';
import WorkPulseKPIDrawer from './WorkPulseKPIDrawer';
import WorkPulseEmployeeModal from './WorkPulseEmployeeModal';

// CSS vars that PulseIQ components rely on injected inline
const CSS_VARS = `
  :root {
    --bg-base: #F4F6FA;
    --bg-surface: #FFFFFF;
    --bg-surface-2: #F8FAFC;
    --bg-header: #FFFFFF;
    --border: #E2E8F0;
    --border-strong: #CBD5E1;
    --accent-cyan: #0284C7;
    --text-primary: #0F172A;
    --text-secondary: #475569;
    --text-muted: #94A3B8;
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.6; transform:scale(1.3); }
  }
  .live-dot {
    width:7px; height:7px; border-radius:50%;
    background:#059669; display:inline-block;
    animation:pulse-dot 2s infinite;
  }
  .syne { font-family:'Syne',sans-serif; }
  @keyframes feedCardIn {
    from { opacity:0; transform:translateY(-8px) scale(0.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
`;

export default function WorkPulseDashboard({ onBack }) {
    const [kpiDetail, setKpiDetail] = useState(null);
    const [sourceFilter, setSourceFilter] = useState(null);
    const [employeeDetail, setEmployeeDetail] = useState(null);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: '100%', background: '#F4F6FA', overflow: 'hidden',
            fontFamily: "'DM Sans',system-ui,sans-serif",
        }}>
            <style>{CSS_VARS}</style>

            {/* Header */}
            <header style={{
                height: 60, flexShrink: 0,
                background: '#FFFFFF',
                borderBottom: '1px solid #E2E8F0',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px', position: 'relative', zIndex: 10,
            }}>
                {/* Left: back + logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <button
                        onClick={onBack}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: '#F1F5F9', border: '1px solid #E2E8F0',
                            borderRadius: 8, padding: '6px 12px',
                            fontSize: 12, fontWeight: 600, color: '#374151',
                            cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#0284C7'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
                    >
                        <ArrowLeft size={14} /> Back
                    </button>
                    <div style={{ width: 1, height: 24, background: '#E2E8F0' }} />
                    <img
                        src="https://experienceflow.ai/wp-content/uploads/2024/05/Logo-with-Tagline-240px.svg"
                        alt="Experienceflow"
                        style={{ height: 32, objectFit: 'contain' }}
                    />
                    <div style={{ width: 1, height: 24, background: '#E2E8F0' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{
                            width: 26, height: 26, borderRadius: 7,
                            background: 'linear-gradient(135deg,#0284C7,#0369A1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(2,132,199,0.28)',
                        }}>
                            <Activity size={13} color="#fff" strokeWidth={2.5} />
                        </div>
                        <span className="syne" style={{ fontWeight: 800, fontSize: 14, color: '#0F172A', letterSpacing: '-0.02em' }}>
                            WorkPulse <span style={{ color: '#0284C7' }}>Live</span>
                        </span>
                    </div>
                </div>

                {/* Right: clock + LIVE badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>{timeStr}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>{dateStr}</div>
                    </div>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: '#ECFDF5', border: '1px solid #A7F3D0',
                        borderRadius: 999, padding: '4px 10px',
                    }}>
                        <span className="live-dot" />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', letterSpacing: '0.07em' }}>LIVE</span>
                    </div>
                </div>
            </header>

            {/* Main 3-panel layout */}
            <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
                {/* Left Panel — 38% */}
                <div style={{ width: '38%', borderRight: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <WorkPulseLeftPanel
                        onKPIClick={setKpiDetail}
                        onSourceFilter={(src, cat) => setSourceFilter(src ? { source: src } : cat ? { category: cat } : null)}
                    />
                </div>
                {/* Live Panel — 42% */}
                <div style={{ width: '42%', borderRight: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <WorkPulseRightPanel
                        sourceFilter={sourceFilter}
                        onEmployeeClick={setEmployeeDetail}
                    />
                </div>
                {/* Feed Panel — 20% */}
                <div style={{ width: '20%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <WorkPulseFeedPanel />
                </div>
            </div>

            {/* KPI Drawer */}
            {kpiDetail && (
                <WorkPulseKPIDrawer kpi={kpiDetail} onClose={() => setKpiDetail(null)} />
            )}

            {/* Employee Modal */}
            {employeeDetail && (
                <WorkPulseEmployeeModal employee={employeeDetail} onClose={() => setEmployeeDetail(null)} />
            )}
        </div>
    );
}
