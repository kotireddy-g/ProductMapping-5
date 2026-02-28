import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Mic, MicOff, LogOut } from 'lucide-react';
import { searchSuggestions } from '../../data/landingPageData';
import { parseSearchQuery } from '../../utils/searchParser';

const GlobalSearchBar = ({
    onNavigate,
    onNavigateToWorkPulse,
    dashboardData = { departments: [], forecastAreas: [], decisionActions: [] },
    onActionSelect,
    onLogout,
    currentUser
}) => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    // Generate filtered search suggestions
    const filteredSuggestions = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();
        const allSuggestions = [
            ...searchSuggestions.otif.map(s => ({ text: s, category: 'OTIF' })),
            ...searchSuggestions.medicines.map(s => ({ text: s, category: 'Medicine' })),
            ...searchSuggestions.actions.map(s => ({ text: s, category: 'Action' })),
            ...searchSuggestions.labels.map(s => ({ text: s, category: 'Label' }))
        ];

        return allSuggestions
            .filter(s => s.text.toLowerCase().includes(query))
            .slice(0, 8);
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setShowSuggestions(true);
    };

    // Handle intelligent search
    const handleSearch = (query) => {
        if (!query || query.trim().length === 0) return;

        // Parse the search query
        const searchResult = parseSearchQuery(query, dashboardData);

        // Handle navigation based on search result type
        switch (searchResult.type) {
            case 'department':
                // Navigate to Command Center with department
                if (onNavigate) {
                    onNavigate('otif-detail', searchResult.data);
                }
                break;

            case 'forecast':
                // Navigate to Forecast Details
                if (onNavigate) {
                    onNavigate('forecast-detail', searchResult.data);
                }
                break;

            case 'decision_action':
                if (searchResult.data.type === 'main') {
                    // Show subcategory popup for main action
                    if (onActionSelect) {
                        onActionSelect(searchResult.data.mainAction);
                    }
                } else if (searchResult.data.type === 'sub') {
                    // Navigate directly to Decision Actions page
                    if (onNavigate) {
                        onNavigate('action-detail', {
                            ...searchResult.data.mainAction,
                            subcategory: searchResult.data.subAction,
                            mainAction: searchResult.data.mainAction.id,
                            subAction: searchResult.data.subAction.id
                        });
                    }
                }
                break;

            case 'no_match':
                // Show user-friendly message
                alert(`Sorry, we couldn't find any results for "${query}".\n\nTry searching for:\n• Department names (ICU, Ward, OPD)\n• Forecast queries (ICU forecast, OPD prediction)\n• Decision actions (Fast moving, Stockout, Usage Velocity)`);
                break;

            default:
                break;
        }

        // Clear search and hide suggestions
        setSearchQuery('');
        setShowSuggestions(false);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.text);
        setShowSuggestions(false);

        // Use intelligent search for suggestions too
        handleSearch(suggestion.text);
    };

    // Handle Enter key press in search
    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(searchQuery);
        }
    };

    // Voice search functionality
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
                setShowSuggestions(true);
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleVoiceSearch = () => {
        if (!recognitionRef.current) {
            alert('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
                {/* Search Bar Container */}
                <div className="flex-1 relative">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyPress={handleSearchKeyPress}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder={t('search.placeholder')}
                        className="w-full pl-14 pr-16 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm bg-white transition-all"
                    />

                    {/* Voice Search Button */}
                    <button
                        onClick={toggleVoiceSearch}
                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all ${isListening
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-black text-white hover:bg-gray-800'
                            }`}
                        title={isListening ? 'Stop listening' : 'Start voice search'}
                    >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    {/* Auto-suggestions Dropdown */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-80 overflow-y-auto">
                            {filteredSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="px-5 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-800 font-medium">{suggestion.text}</span>
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                            {suggestion.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* LIVE WorkPulse Button */}
                <button
                    onClick={() => onNavigateToWorkPulse && onNavigateToWorkPulse()}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        background: 'linear-gradient(135deg,#0F172A,#1E293B)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        borderRadius: 10, padding: '10px 16px',
                        cursor: 'pointer', transition: 'all 0.2s',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                        flexShrink: 0,
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    title="Open WorkPulse Live Dashboard"
                >
                    <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#22C55E',
                        boxShadow: '0 0 0 3px rgba(34,197,94,0.25)',
                        animation: 'pulse-dot 2s infinite',
                        flexShrink: 0,
                    }} />
                    <span style={{
                        fontSize: 12, fontWeight: 800, color: '#FFFFFF',
                        letterSpacing: '0.06em',
                        fontFamily: "'Syne',system-ui,sans-serif",
                    }}>LIVE</span>
                </button>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );
};

export default GlobalSearchBar;
