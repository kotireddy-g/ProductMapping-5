import React, { useState, useRef, useEffect } from 'react';
import {
    ChevronDown,
    Check,
    Sparkles,
    BarChart3,
    Users,
    Star,
    TrendingUp,
    Package,
    Bed
} from 'lucide-react';

const modules = [
    { id: 'otif', name: 'OTIF', available: true, icon: BarChart3, color: 'text-blue-600' },
    { id: 'staff-allocation', name: 'Staff Allocation', available: false, icon: Users, color: 'text-purple-600' },
    { id: 'customer-satisfaction', name: 'Customer Satisfaction', available: false, icon: Star, color: 'text-yellow-600' },
    { id: 'resource-utilization', name: 'Resource Utilization', available: false, icon: TrendingUp, color: 'text-green-600' },
    { id: 'order-management', name: 'Order Management', available: false, icon: Package, color: 'text-orange-600' },
    { id: 'bed-management', name: 'Bed Management', available: false, icon: Bed, color: 'text-indigo-600' }
];

const ModuleSelector = ({ onModuleChange }) => {
    const [selectedModule, setSelectedModule] = useState('otif');
    const [isOpen, setIsOpen] = useState(false);
    const [showComingSoonModal, setShowComingSoonModal] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleModuleSelect = (module) => {
        if (module.available) {
            setSelectedModule(module.id);
            setIsOpen(false);
            if (onModuleChange) {
                onModuleChange(module.id);
            }
        } else {
            setIsOpen(false);
            setShowComingSoonModal(true);
        }
    };

    const selectedModuleData = modules.find(m => m.id === selectedModule);

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm"
                >
                    {selectedModuleData && <selectedModuleData.icon className={`w-5 h-5 ${selectedModuleData.color}`} />}
                    <span className="font-semibold">{selectedModuleData?.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                            <h3 className="text-white font-bold text-sm">Select Module</h3>
                            <p className="text-blue-100 text-xs mt-0.5">Choose your workspace</p>
                        </div>

                        <div className="py-2 max-h-96 overflow-y-auto">
                            {modules.map((module) => (
                                <button
                                    key={module.id}
                                    onClick={() => handleModuleSelect(module)}
                                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-blue-50 transition-colors ${selectedModule === module.id ? 'bg-blue-50' : ''
                                        } ${!module.available ? 'opacity-75' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${module.available ? 'bg-blue-50' : 'bg-slate-100'}`}>
                                            <module.icon className={`w-5 h-5 ${module.color}`} />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-slate-800 text-sm">{module.name}</div>
                                            {!module.available && (
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <Sparkles className="w-3 h-3 text-amber-500" />
                                                    <span className="text-xs text-amber-600 font-medium">Coming Soon</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {selectedModule === module.id && module.available && (
                                        <Check className="w-5 h-5 text-blue-600" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Coming Soon Modal */}
            {showComingSoonModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-50"
                        onClick={() => setShowComingSoonModal(false)}
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                            {/* Header with gradient */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-center">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <Sparkles className="w-10 h-10 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Exciting Features Ahead!</h2>
                                <p className="text-blue-100 text-sm">We're building something amazing</p>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-6">
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                                    <p className="text-slate-700 text-center leading-relaxed">
                                        🚀 <span className="font-semibold">Great news!</span> This module is currently under development and will be available soon.
                                    </p>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-green-600 text-sm">✓</span>
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            <span className="font-semibold text-slate-800">OTIF Module</span> is fully operational and ready to use
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Sparkles className="w-3 h-3 text-amber-600" />
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            <span className="font-semibold text-slate-800">Additional modules</span> are being crafted with care
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-purple-600 text-sm">🎯</span>
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            Stay tuned for <span className="font-semibold text-slate-800">powerful new features</span>
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowComingSoonModal(false)}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    Got it, thanks!
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
        </>
    );
};

export default ModuleSelector;
