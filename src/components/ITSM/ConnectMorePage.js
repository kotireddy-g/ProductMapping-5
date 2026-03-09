import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, X } from 'lucide-react';

const ALL_SOURCES = [
    { id: 'jira', name: 'Jira', emoji: '🔵', desc: 'Project & ticket tracking', fields: ['baseUrl', 'clientId', 'clientSecret'] },
    { id: 'github', name: 'GitHub', emoji: '⚫', desc: 'Code repository & CI/CD', fields: ['token'] },
    { id: 'saperp', name: 'SAP ERP', emoji: '🔷', desc: 'Enterprise resource planning', fields: ['clientId', 'clientSecret'] },
    { id: 'slack', name: 'Slack', emoji: '🟣', desc: 'Team communication', fields: ['clientId', 'clientSecret'] },
    { id: 'salesforce', name: 'Salesforce', emoji: '☁️', desc: 'CRM & customer data', fields: ['clientId', 'clientSecret'] },
    { id: 'servicenow', name: 'ServiceNow', emoji: '🟢', desc: 'ITSM platform', fields: ['baseUrl', 'clientId', 'clientSecret'] },
    { id: 'pagerduty', name: 'PagerDuty', emoji: '🔴', desc: 'Incident management', fields: ['token'] },
    { id: 'azuredevops', name: 'Azure DevOps', emoji: '🔵', desc: 'Dev pipeline & boards', fields: ['clientId', 'clientSecret'] },
    { id: 'zendesk', name: 'Zendesk', emoji: '🟡', desc: 'Customer support tickets', fields: ['token'] },
    { id: 'monday', name: 'Monday.com', emoji: '🌈', desc: 'Work OS & project mgmt', fields: ['token'] },
];

const FIELD_LABELS = {
    baseUrl: 'Base URL',
    clientId: 'Client ID',
    clientSecret: 'Client Secret',
    token: 'Personal Access Token',
};

const STEPS = ['Select Source', 'Enter Credentials', 'Connecting', 'Success'];

const ConnectMorePage = ({ connectedSources = [], onComplete, onBack }) => {
    const [step, setStep] = useState(0);
    const [selected, setSelected] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [connectingPhase, setConnectingPhase] = useState('connecting'); // 'connecting' | 'syncing' | 'done'
    const [newlyConnected, setNewlyConnected] = useState([...connectedSources]);

    const handleSourceClick = (source) => {
        if (newlyConnected.includes(source.id)) return; // already connected
        setSelected(source);
        setFormValues({});
        setStep(1);
    };

    const handleConnect = (e) => {
        e.preventDefault();
        setStep(2);
        setConnectingPhase('connecting');

        setTimeout(() => setConnectingPhase('syncing'), 2200);
        setTimeout(() => {
            setConnectingPhase('done');
            setNewlyConnected((prev) => [...prev, selected.id]);
            setTimeout(() => setStep(3), 600);
        }, 4500);
    };

    const handleConnectAnother = () => {
        setSelected(null);
        setFormValues({});
        setConnectingPhase('connecting');
        setStep(0);
    };

    const handleContinue = () => {
        onComplete(newlyConnected);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
                <button
                    onClick={step === 0 ? onBack : handleConnectAnother}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Connect Data Sources</h1>
                    <p className="text-xs text-gray-400">
                        {step === 0 ? 'Choose a source to integrate with your ITSM workspace' : STEPS[step]}
                    </p>
                </div>
            </header>

            {/* Step indicator */}
            <div className="max-w-3xl mx-auto px-6 pt-6 pb-2">
                <div className="flex items-center gap-2">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s}>
                            <div className={`flex items-center gap-2 text-xs font-semibold transition-colors ${i <= step ? 'text-blue-600' : 'text-gray-300'
                                }`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < step ? 'bg-blue-600 text-white' :
                                        i === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                                            'bg-gray-200 text-gray-400'
                                    }`}>
                                    {i < step ? '✓' : i + 1}
                                </div>
                                <span className="hidden sm:inline">{s}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-0.5 rounded ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-6 py-8">

                {/* ── Step 0: Source Grid ─────────────────────────────────────────── */}
                {step === 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {ALL_SOURCES.map((src) => {
                            const connected = newlyConnected.includes(src.id);
                            return (
                                <button
                                    key={src.id}
                                    onClick={() => handleSourceClick(src)}
                                    disabled={connected}
                                    className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 text-center ${connected
                                            ? 'border-green-200 bg-green-50 cursor-default'
                                            : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                                        }`}
                                >
                                    {connected && (
                                        <CheckCircle2 className="w-5 h-5 text-green-500 absolute top-3 right-3" />
                                    )}
                                    <span className="text-4xl">{src.emoji}</span>
                                    <div>
                                        <p className={`font-bold text-sm ${connected ? 'text-green-700' : 'text-gray-800'}`}>
                                            {src.name}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5 leading-tight">{src.desc}</p>
                                        {connected && (
                                            <p className="text-xs text-green-600 font-semibold mt-1">✓ Connected</p>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ── Step 1: Credentials Form ────────────────────────────────────── */}
                {step === 1 && selected && (
                    <div className="max-w-md mx-auto">
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                            {/* Source header */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                                <span className="text-4xl">{selected.emoji}</span>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                                    <p className="text-sm text-gray-400">{selected.desc}</p>
                                </div>
                            </div>

                            <form onSubmit={handleConnect} className="space-y-4">
                                {selected.fields.map((field) => (
                                    <div key={field}>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                                            {FIELD_LABELS[field]}
                                        </label>
                                        <input
                                            type={field === 'clientSecret' || field === 'token' ? 'password' : 'text'}
                                            placeholder={
                                                field === 'baseUrl' ? `https://${selected.name.toLowerCase()}.example.com` : `Enter ${FIELD_LABELS[field]}`
                                            }
                                            value={formValues[field] || ''}
                                            onChange={(e) => setFormValues((prev) => ({ ...prev, [field]: e.target.value }))}
                                            required
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                    </div>
                                ))}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleConnectAnother}
                                        className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Connect →
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── Step 2: Connecting Animation ────────────────────────────────── */}
                {step === 2 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-8">
                        <div className="relative">
                            {/* Outer ring pulse */}
                            <div
                                className={`absolute inset-0 rounded-full ${connectingPhase === 'done' ? 'bg-green-400' : 'bg-blue-400'
                                    } opacity-20 animate-ping`}
                            />
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg ${connectingPhase === 'done' ? 'bg-green-600' : 'bg-blue-600'
                                }`}>
                                {connectingPhase === 'done' ? (
                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                ) : (
                                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                                )}
                            </div>
                        </div>

                        <div className="text-center">
                            <span className="text-4xl mb-4 block">{selected?.emoji}</span>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {connectingPhase === 'connecting' && `Connecting to ${selected?.name}…`}
                                {connectingPhase === 'syncing' && `Syncing data from ${selected?.name}…`}
                                {connectingPhase === 'done' && 'Successfully connected!'}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                {connectingPhase === 'connecting' && 'Authenticating with OAuth 2.0 credentials…'}
                                {connectingPhase === 'syncing' && 'Fetching tickets, projects & metrics…'}
                                {connectingPhase === 'done' && `${selected?.name} data is now available in your workspace.`}
                            </p>
                        </div>

                        {/* Progress bar */}
                        {connectingPhase !== 'done' && (
                            <div className="w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-2 rounded-full bg-blue-500 transition-all duration-[2200ms] ease-in-out ${connectingPhase === 'syncing' ? 'w-full' : 'w-1/3'
                                        }`}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* ── Step 3: Success ──────────────────────────────────────────────── */}
                {step === 3 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-6">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {selected?.name} Connected!
                            </h2>
                            <p className="text-gray-500 text-sm max-w-sm">
                                Your {selected?.name} workspace is now synced. Data will refresh automatically every 15 minutes.
                            </p>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={handleConnectAnother}
                                className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                + Connect Another Source
                            </button>
                            <button
                                onClick={handleContinue}
                                className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-700 transition-colors"
                            >
                                Continue →
                            </button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default ConnectMorePage;
