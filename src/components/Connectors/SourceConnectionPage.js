import React from 'react';
import { Database, Plus, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

// Healthcare source icons (emoji-based for zero dependencies)
const SOURCE_META = {
    HIS: { icon: '🏥', label: 'Hospital Information System', color: '#0284C7' },
    LIS: { icon: '🧪', label: 'Laboratory Information System', color: '#059669' },
    SAP: { icon: '⚙️', label: 'SAP ERP', color: '#F59E0B' },
    EMR: { icon: '📋', label: 'Electronic Medical Records', color: '#8B5CF6' },
    PACS: { icon: '🩻', label: 'Picture Archiving System', color: '#EC4899' },
    LIMS: { icon: '🔬', label: 'Lab Info Mgmt System', color: '#14B8A6' },
    Biometrics: { icon: '👁️', label: 'Biometric Systems', color: '#F97316' },
    ERP: { icon: '🏗️', label: 'Enterprise Resource Planning', color: '#6366F1' },
};

export default function SourceConnectionPage({ connectedSources = [], onConnectSource, onConnectMore, onContinue }) {
    const hasConnections = connectedSources.length > 0;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #ECFDF5 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
            fontFamily: "'DM Sans', system-ui, sans-serif",
        }}>
            {/* Logo */}
            <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <img
                    src="https://experienceflow.ai/wp-content/uploads/2024/05/Logo-with-Tagline-240px.svg"
                    alt="ExperienceFlow"
                    style={{ height: 40, objectFit: 'contain', marginBottom: 12 }}
                />
                <h1 style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28,
                    color: '#0F172A', letterSpacing: '-0.03em', margin: 0,
                }}>
                    Connect Your Data Sources
                </h1>
                <p style={{ fontSize: 15, color: '#64748B', marginTop: 8, maxWidth: 480, textAlign: 'center' }}>
                    {hasConnections
                        ? `${connectedSources.length} source${connectedSources.length > 1 ? 's' : ''} connected — add more or continue to your dashboard`
                        : 'Connect your healthcare data sources to get started with real-time insights'}
                </p>
            </div>

            {/* Main Card */}
            <div style={{
                background: '#FFFFFF',
                borderRadius: 20,
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                padding: 40,
                maxWidth: 640,
                width: '100%',
            }}>
                {!hasConnections ? (
                    /* No sources yet */
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: 20,
                            background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px',
                        }}>
                            <Database size={36} color="#0284C7" />
                        </div>
                        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: '#0F172A', margin: '0 0 8px' }}>
                            No Sources Connected Yet
                        </h2>
                        <p style={{ fontSize: 14, color: '#64748B', marginBottom: 32 }}>
                            Connect HIS, LIS, SAP, EMR and other healthcare systems to unlock AI-powered insights.
                        </p>
                        <button
                            onClick={onConnectSource}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                background: 'linear-gradient(135deg, #0284C7, #0369A1)',
                                color: '#fff', border: 'none', borderRadius: 12,
                                padding: '14px 32px', fontSize: 15, fontWeight: 700,
                                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                boxShadow: '0 4px 20px rgba(2,132,199,0.35)',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Plus size={18} />
                            Connect Source
                        </button>
                    </div>
                ) : (
                    /* Has sources */
                    <div>
                        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: '#0F172A', margin: '0 0 20px' }}>
                            Connected Sources
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 28 }}>
                            {connectedSources.map((src) => {
                                const meta = SOURCE_META[src] || { icon: '🔌', label: src, color: '#64748B' };
                                return (
                                    <div key={src} style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        background: `${meta.color}08`,
                                        border: `1.5px solid ${meta.color}30`,
                                        borderRadius: 12, padding: '12px 16px',
                                    }}>
                                        <span style={{ fontSize: 24 }}>{meta.icon}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{src}</div>
                                            <div style={{ fontSize: 11, color: '#64748B' }}>{meta.label}</div>
                                        </div>
                                        <CheckCircle2 size={18} color="#059669" />
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={onConnectMore}
                                style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    background: '#F8FAFC', border: '1.5px solid #E2E8F0',
                                    borderRadius: 12, padding: '13px 20px', fontSize: 14, fontWeight: 600,
                                    color: '#0F172A', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0284C7'; e.currentTarget.style.color = '#0284C7'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#0F172A'; }}
                            >
                                <Plus size={16} />
                                Connect More
                            </button>
                            <button
                                onClick={onContinue}
                                style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    background: 'linear-gradient(135deg, #0284C7, #0369A1)',
                                    color: '#fff', border: 'none', borderRadius: 12,
                                    padding: '13px 20px', fontSize: 14, fontWeight: 700,
                                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                                    boxShadow: '0 4px 16px rgba(2,132,199,0.3)',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                Continue
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Feature hints */}
            {!hasConnections && (
                <div style={{ marginTop: 32, display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['HIS · LIS · SAP', 'EMR · PACS · LIMS', 'Biometrics · ERP'].map(txt => (
                        <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B' }}>
                            <Zap size={14} color="#0284C7" />
                            {txt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
