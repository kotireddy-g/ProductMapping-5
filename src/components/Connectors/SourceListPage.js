import React, { useState } from 'react';
import { CheckCircle2, Plus, ArrowRight, ArrowLeft, Wifi, WifiOff, Loader } from 'lucide-react';

const ALL_SOURCES = [
    {
        id: 'HIS',
        name: 'HIS',
        fullName: 'Hospital Information System',
        desc: 'Patient records, admissions, billing & clinical workflows',
        icon: '🏥',
        color: '#0284C7',
        gradient: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
    },
    {
        id: 'LIS',
        name: 'LIS',
        fullName: 'Laboratory Information System',
        desc: 'Lab orders, test results, sample tracking & quality control',
        icon: '🧪',
        color: '#059669',
        gradient: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)',
    },
    {
        id: 'SAP',
        name: 'SAP',
        fullName: 'SAP ERP',
        desc: 'Procurement, inventory, finance & supply chain management',
        icon: '⚙️',
        color: '#F59E0B',
        gradient: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)',
    },
    {
        id: 'EMR',
        name: 'EMR',
        fullName: 'Electronic Medical Records',
        desc: 'Patient health records, prescriptions & clinical notes',
        icon: '📋',
        color: '#8B5CF6',
        gradient: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)',
    },
    {
        id: 'PACS',
        name: 'PACS',
        fullName: 'Picture Archiving System',
        desc: 'Medical imaging storage, retrieval & radiology workflows',
        icon: '🩻',
        color: '#EC4899',
        gradient: 'linear-gradient(135deg,#FDF2F8,#FCE7F3)',
    },
    {
        id: 'LIMS',
        name: 'LIMS',
        fullName: 'Lab Info Mgmt System',
        desc: 'Research samples, compliance, QA tracking & reporting',
        icon: '🔬',
        color: '#14B8A6',
        gradient: 'linear-gradient(135deg,#F0FDFA,#CCFBF1)',
    },
    {
        id: 'Biometrics',
        name: 'Biometrics',
        fullName: 'Biometric Systems',
        desc: 'Staff attendance, access control & identity verification',
        icon: '👁️',
        color: '#F97316',
        gradient: 'linear-gradient(135deg,#FFF7ED,#FFEDD5)',
    },
    {
        id: 'ERP',
        name: 'ERP',
        fullName: 'Enterprise Resource Planning',
        desc: 'Operations, HR, assets & cross-department integrations',
        icon: '🏗️',
        color: '#6366F1',
        gradient: 'linear-gradient(135deg,#EEF2FF,#E0E7FF)',
    },
];

const CONNECT_STEPS = [
    { icon: '🔐', text: 'Authenticating credentials…' },
    { icon: '🔗', text: 'Establishing secure connection…' },
    { icon: '✅', text: 'Connection successful!' },
];

export default function SourceListPage({ initialConnected = [], onContinue, onBack }) {
    const [connected, setConnected] = useState(new Set(initialConnected));
    const [connecting, setConnecting] = useState(null); // id of source being connected
    const [connectStep, setConnectStep] = useState(0);

    const startConnect = (id) => {
        if (connected.has(id) || connecting) return;
        setConnecting(id);
        setConnectStep(0);

        // Step 1
        setTimeout(() => setConnectStep(1), 900);
        // Step 2
        setTimeout(() => setConnectStep(2), 1800);
        // Done
        setTimeout(() => {
            setConnected(prev => new Set([...prev, id]));
            setConnecting(null);
            setConnectStep(0);
        }, 2600);
    };

    const handleContinue = () => {
        const arr = [...connected];
        // Persist in localStorage
        localStorage.setItem('connectedSources', JSON.stringify(arr));
        onContinue && onContinue(arr);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg,#EFF6FF 0%,#F0F9FF 50%,#ECFDF5 100%)',
            fontFamily: "'DM Sans',system-ui,sans-serif",
            padding: '32px 24px',
        }}>
            {/* Header */}
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                    {onBack && (
                        <button
                            onClick={onBack}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6, background: '#fff',
                                border: '1px solid #E2E8F0', borderRadius: 10, padding: '8px 14px',
                                fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#0284C7'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
                        >
                            <ArrowLeft size={15} /> Back
                        </button>
                    )}
                    <div>
                        <h1 style={{
                            fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 26,
                            color: '#0F172A', letterSpacing: '-0.03em', margin: 0,
                        }}>
                            Healthcare Data Sources
                        </h1>
                        <p style={{ fontSize: 14, color: '#64748B', margin: '4px 0 0' }}>
                            Select and connect sources to power your analytics
                        </p>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            background: '#ECFDF5', border: '1px solid #A7F3D0',
                            borderRadius: 999, padding: '4px 12px',
                            fontSize: 12, fontWeight: 700, color: '#059669',
                            display: 'flex', alignItems: 'center', gap: 5,
                        }}>
                            <span style={{
                                width: 7, height: 7, borderRadius: '50%', background: '#059669',
                                display: 'inline-block', animation: 'pulse-ledge 2s infinite',
                            }} />
                            {connected.size} Connected
                        </div>
                    </div>
                </div>

                {/* Source Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                    gap: 16,
                    marginBottom: 32,
                }}>
                    {ALL_SOURCES.map(src => {
                        const isConnected = connected.has(src.id);
                        const isConnecting = connecting === src.id;

                        return (
                            <div
                                key={src.id}
                                style={{
                                    background: '#FFFFFF',
                                    border: `2px solid ${isConnected ? src.color + '50' : '#E2E8F0'}`,
                                    borderRadius: 16,
                                    padding: '20px 22px',
                                    display: 'flex', alignItems: 'center', gap: 16,
                                    position: 'relative', overflow: 'hidden',
                                    transition: 'all 0.25s',
                                    boxShadow: isConnected ? `0 4px 20px ${src.color}18` : '0 2px 8px rgba(0,0,0,0.06)',
                                }}
                            >
                                {/* Background gradient tint */}
                                {isConnected && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        background: src.gradient, opacity: 0.35,
                                        pointerEvents: 'none',
                                    }} />
                                )}

                                {/* Icon */}
                                <div style={{
                                    width: 52, height: 52, borderRadius: 14,
                                    background: src.gradient,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 26, flexShrink: 0, position: 'relative',
                                    border: `1.5px solid ${src.color}25`,
                                }}>
                                    {src.icon}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                        <span style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', fontFamily: "'Syne',sans-serif" }}>
                                            {src.name}
                                        </span>
                                        <span style={{ fontSize: 11, color: src.color, fontWeight: 600 }}>{src.fullName}</span>
                                    </div>
                                    <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.5 }}>{src.desc}</p>

                                    {/* Connection animation steps */}
                                    {isConnecting && (
                                        <div style={{
                                            marginTop: 8, display: 'flex', alignItems: 'center', gap: 6,
                                            fontSize: 11, color: src.color, fontWeight: 600,
                                            animation: 'fadeInUp 0.2s ease both',
                                        }}>
                                            <Loader size={12} style={{ animation: 'spinMe 1s linear infinite' }} />
                                            {CONNECT_STEPS[connectStep]?.text}
                                        </div>
                                    )}
                                </div>

                                {/* Action button */}
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    {isConnected ? (
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 5,
                                            background: '#ECFDF5', border: '1px solid #A7F3D0',
                                            borderRadius: 8, padding: '7px 12px',
                                            fontSize: 12, fontWeight: 700, color: '#059669',
                                        }}>
                                            <CheckCircle2 size={14} />
                                            Connected
                                        </div>
                                    ) : isConnecting ? (
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 5,
                                            background: `${src.color}12`, border: `1px solid ${src.color}30`,
                                            borderRadius: 8, padding: '7px 12px',
                                            fontSize: 12, fontWeight: 700, color: src.color,
                                        }}>
                                            <Loader size={14} style={{ animation: 'spinMe 1s linear infinite' }} />
                                            Connecting
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => startConnect(src.id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 5,
                                                background: `linear-gradient(135deg,${src.color},${src.color}CC)`,
                                                border: 'none', borderRadius: 8,
                                                padding: '8px 14px', fontSize: 12, fontWeight: 700, color: '#fff',
                                                cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
                                                transition: 'all 0.15s',
                                                boxShadow: `0 2px 10px ${src.color}35`,
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <Plus size={13} />
                                            Connect
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom action bar */}
                <div style={{
                    background: '#FFFFFF', borderRadius: 16,
                    border: '1px solid #E2E8F0',
                    padding: '20px 28px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                }}>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                            {connected.size > 0
                                ? `${connected.size} source${connected.size > 1 ? 's' : ''} connected and ready`
                                : 'Connect at least one source to continue'}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                            {connected.size > 0 ? [...connected].join(' · ') : 'Click "Connect" on any source above'}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {connected.size > 0 && (
                            <button
                                onClick={startConnect.bind(null, ALL_SOURCES.find(s => !connected.has(s.id))?.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    background: '#F8FAFC', border: '1.5px solid #E2E8F0',
                                    borderRadius: 10, padding: '11px 20px', fontSize: 13, fontWeight: 600,
                                    color: '#374151', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0284C7'; e.currentTarget.style.color = '#0284C7'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#374151'; }}
                            >
                                <Wifi size={15} />
                                Connect More
                            </button>
                        )}
                        <button
                            onClick={handleContinue}
                            disabled={connected.size === 0}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: connected.size > 0
                                    ? 'linear-gradient(135deg,#0284C7,#0369A1)'
                                    : '#E2E8F0',
                                color: connected.size > 0 ? '#fff' : '#94A3B8',
                                border: 'none', borderRadius: 10,
                                padding: '11px 24px', fontSize: 13, fontWeight: 700,
                                cursor: connected.size > 0 ? 'pointer' : 'not-allowed',
                                fontFamily: "'DM Sans',sans-serif",
                                boxShadow: connected.size > 0 ? '0 4px 16px rgba(2,132,199,0.3)' : 'none',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { if (connected.size > 0) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            Continue to Dashboard
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes pulse-ledge {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.6; transform:scale(1.3); }
        }
        @keyframes spinMe { to { transform:rotate(360deg); } }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(4px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
        </div>
    );
}
