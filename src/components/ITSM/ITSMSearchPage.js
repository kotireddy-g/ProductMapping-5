import React, { useState, useEffect } from 'react';
import { Search, Mic, Plus, CheckCircle2, ChevronRight } from 'lucide-react';

const DATA_SOURCES = [
    { id: 'jira', name: 'Jira', logo: '🔵' },
    { id: 'github', name: 'GitHub', logo: '⚫' },
    { id: 'saperp', name: 'SAP ERP', logo: '🔷' },
    { id: 'slack', name: 'Slack', logo: '🟣' },
    { id: 'salesforce', name: 'Salesforce', logo: '☁️' },
];

const ACTIONS = [
    'SLA BREACH IMMINENT',
    'MTTA SPIKE',
    'BACKLOG BURNUP',
    'REOPEN SURGE REWORK TAX',
    'MTTR AT RISK',
    'TICKET AGING HOTSPOT',
    'WIP OVERLOAD FLOW STALL',
    'ESCALATION FATIGUE',
];

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
};

const formatDate = () =>
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const ITSMSearchPage = ({
    currentUser,
    connectedSources = [],
    onSearch,       // (query) => void — for admin DTIF search
    onActionClick,  // (action) => void — for CEO
    onConnectMore,  // () => void
    onLogout,
}) => {
    const [query, setQuery] = useState('');
    const isCEO = currentUser?.role === 'itsm-ceo';

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        onSearch && onSearch(query.trim());
    };

    const isConnected = (id) => connectedSources.includes(id);

    return (
        <div className="min-h-screen bg-white flex flex-col">

            {/* Top bar */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                        </svg>
                    </div>
                    <span className="font-bold text-gray-800 text-base tracking-tight">ExperienceFlow</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                        {isCEO ? '👔 CEO' : '🛠 ITSM Admin'}&nbsp;
                        <span className="font-medium text-gray-700">{currentUser?.name || currentUser?.email?.split('@')[0]}</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 flex flex-col items-center px-6 pt-20 pb-12">
                {/* Greeting */}
                <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                    {getGreeting()}!
                </h1>
                <p className="text-gray-400 text-base mb-10">Today is {formatDate()}.</p>

                {/* Search bar */}
                <form onSubmit={handleSearch} className="w-full max-w-2xl mb-8">
                    <div className="flex items-center border border-gray-200 rounded-2xl px-5 py-3 shadow-sm bg-white hover:shadow-md transition-shadow gap-3">
                        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask anything for business…"
                            className="flex-1 text-gray-700 text-base outline-none bg-transparent placeholder-gray-300"
                        />
                        <button
                            type="button"
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            title="Voice search"
                        >
                            <Mic className="w-5 h-5 text-gray-400" />
                        </button>
                        <button
                            type="submit"
                            className="ml-1 px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Data Sources */}
                <div className="w-full max-w-2xl mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-gray-400 tracking-widest">DATA SOURCES</p>
                        <button
                            onClick={onConnectMore}
                            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors border border-blue-200 hover:border-blue-400 rounded-lg px-3 py-1.5 hover:bg-blue-50"
                        >
                            <Plus className="w-3.5 h-3.5" /> Connect More
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {DATA_SOURCES.map((src) => (
                            <div
                                key={src.id}
                                className="relative flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white shadow-xs hover:shadow-sm transition-all"
                            >
                                <span className="text-lg">{src.logo}</span>
                                <span className="text-sm font-semibold text-gray-700">{src.name}</span>
                                {isConnected(src.id) && (
                                    <CheckCircle2 className="w-4 h-4 text-green-500 absolute -top-1.5 -right-1.5" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="w-full max-w-2xl">
                    <p className="text-xs font-bold text-gray-400 tracking-widest mb-3">ACTIONS</p>
                    <div className="flex flex-wrap gap-2">
                        {ACTIONS.map((action) => (
                            <button
                                key={action}
                                onClick={() => onActionClick && onActionClick(action)}
                                className="flex items-center gap-1 border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200"
                            >
                                {action}
                                {isCEO && <ChevronRight className="w-3 h-3 opacity-60" />}
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ITSMSearchPage;
