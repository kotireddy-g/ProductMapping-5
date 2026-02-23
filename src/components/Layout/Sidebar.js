import React, { useState } from 'react';
import {
    LayoutDashboard,
    Zap,
    TrendingUp,
    Target,
    Library,
    Activity,
    Users,
    Package,
    ShoppingCart,
    Bed,
    Bell,
    Globe,
    FileText,
    User,
    Settings,
    ChevronDown,
    ChevronRight,
    Briefcase
} from 'lucide-react';
import ExperienceFlowLogo from '../../assets/experienceflow-logo.svg';

const Sidebar = ({
    selectedModule,
    onModuleChange,
    currentScreen,
    onNavigate,
    onScrollToSection,
    onNotificationClick,
    onTemplateClick,
    unreadNotificationCount = 0,
    activeSection = 'top' // Track which section is active
}) => {
    const [expandedSections, setExpandedSections] = useState({
        currentStatus: true,
        library: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const modules = [
        { id: 'otif', name: 'OTIF', icon: Activity },
        { id: 'staff-allocation', name: 'Staff Allocation', icon: Users },
        { id: 'customer-satisfaction', name: 'Customer Satisfaction', icon: Target },
        { id: 'resource-utilization', name: 'Resource Utilization', icon: Package },
        { id: 'order-management', name: 'Order Management', icon: ShoppingCart },
        { id: 'bed-management', name: 'Bed Management', icon: Bed }
    ];

    // Get the display name for the selected module
    const getModuleDisplayName = () => {
        const module = modules.find(m => m.id === selectedModule);
        return module ? module.name : 'OTIF';
    };

    return (
        <div className="w-64 bg-white h-screen flex flex-col border-r border-gray-200 overflow-y-auto">
            {/* Logo Section */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <img
                        src={ExperienceFlowLogo}
                        alt="ExperienceFlow"
                        className="w-10 h-10 rounded-xl"
                    />
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">ExperienceFlow</h1>
                        <p className="text-xs text-gray-500">Hospital Pharma Procurement</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 py-4">
                {/* Current Status Section - Dark Button */}
                <div className="px-4 mb-2">
                    <button
                        onClick={() => {
                            if (onScrollToSection) {
                                onScrollToSection('top');
                            }
                        }}
                        className={`w-full rounded-lg px-4 py-2.5 flex items-center justify-between transition-colors ${activeSection === 'top'
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <LayoutDashboard size={18} />
                            <span className="text-sm font-medium">Current Status</span>
                        </div>
                        <span className="bg-orange-500 text-white text-[10px] px-2 py-1 rounded font-semibold whitespace-nowrap">
                            {getModuleDisplayName()}
                        </span>
                    </button>
                </div>

                {/* New Actions */}
                <div className="px-4 mb-2">
                    <button
                        onClick={() => {
                            if (onScrollToSection) {
                                onScrollToSection('decisions');
                            }
                        }}
                        className={`w-full px-4 py-2.5 flex items-center gap-2 transition-colors text-left rounded-lg ${activeSection === 'decisions'
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Zap size={18} />
                        <span className="text-sm font-medium">New Actions</span>
                    </button>
                </div>

                {/* Forecast */}
                <div className="px-4 mb-2">
                    <button
                        onClick={() => {
                            if (onScrollToSection) {
                                onScrollToSection('forecast');
                            }
                        }}
                        className={`w-full px-4 py-2.5 flex items-center gap-2 transition-colors text-left rounded-lg ${activeSection === 'forecast'
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <TrendingUp size={18} />
                        <span className="text-sm font-medium">Forecast</span>
                    </button>
                </div>

                {/* Objectives */}
                <div className="px-4 mb-2">
                    <button
                        onClick={() => {
                            if (onScrollToSection) {
                                onScrollToSection('kpis');
                            }
                        }}
                        className={`w-full px-4 py-2.5 flex items-center gap-2 transition-colors text-left rounded-lg ${activeSection === 'kpis'
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Target size={18} />
                        <span className="text-sm font-medium">Objectives</span>
                    </button>
                </div>

                {/* Work Pulse */}
                <div className="px-4 mb-2">
                    <button
                        onClick={() => window.open('http://192.168.1.111:8011/', '_blank')}
                        className="w-full px-4 py-2.5 flex items-center gap-2 transition-colors text-left rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        <Briefcase size={18} />
                        <span className="text-sm font-medium">Work Pulse</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-gray-200"></div>

                {/* Library Section - Light Gray Background */}
                <div className="mb-2 bg-gray-50 mx-2 rounded-lg">
                    <button
                        onClick={() => toggleSection('library')}
                        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-100 transition-colors rounded-lg"
                    >
                        <div className="flex items-center gap-2 text-gray-700">
                            <Library size={18} />
                            <span className="text-sm font-medium">Library</span>
                        </div>
                        {expandedSections.library ? (
                            <ChevronDown size={16} className="text-gray-500" />
                        ) : (
                            <ChevronRight size={16} className="text-gray-500" />
                        )}
                    </button>

                    {/* Module List */}
                    {expandedSections.library && (
                        <div className="pb-2 px-2">
                            {modules.map((module) => {
                                const Icon = module.icon;
                                const isActive = selectedModule === module.id;

                                return (
                                    <button
                                        key={module.id}
                                        onClick={() => onModuleChange && onModuleChange(module.id)}
                                        className={`w-full px-3 py-2 flex items-center gap-2 transition-colors rounded-lg text-sm ${isActive
                                            ? 'bg-black text-white font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon size={16} />
                                        <span>{module.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-gray-200"></div>

                {/* Add Objectives */}
                <button className="w-full px-4 py-2.5 flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors text-left">
                    <Target size={18} />
                    <span className="text-sm font-medium">Add Objectives</span>
                </button>

                {/* Add Metrics */}
                <button className="w-full px-4 py-2.5 flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors text-left">
                    <FileText size={18} />
                    <span className="text-sm font-medium">Add Metrics</span>
                </button>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-200 bg-white">
                {/* Notifications */}
                <button
                    onClick={() => onNotificationClick && onNotificationClick()}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-2 text-gray-700">
                        <Bell size={18} />
                        <span className="text-sm font-medium">Notifications</span>
                    </div>
                    {unreadNotificationCount > 0 && (
                        <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                        </span>
                    )}
                </button>

                {/* Supplier Forecast Report */}
                <button
                    onClick={() => onNavigate && onNavigate('supplier-report')}
                    className="w-full px-4 py-3 flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                    <FileText size={18} />
                    <span className="text-sm font-medium">Supplier Forecast Report</span>
                </button>

                {/* Language */}
                <button className="w-full px-4 py-3 flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors text-left">
                    <Globe size={18} />
                    <span className="text-sm font-medium">Language</span>
                </button>

                {/* Template */}
                <button
                    onClick={() => onTemplateClick && onTemplateClick()}
                    className="w-full px-4 py-3 flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                    <FileText size={18} />
                    <span className="text-sm font-medium">Template</span>
                </button>

                {/* Profile */}
                <button className="w-full px-4 py-3 flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors text-left">
                    <User size={18} />
                    <span className="text-sm font-medium">Profile</span>
                </button>

                {/* Settings */}
                <button className="w-full px-4 py-3 flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors text-left">
                    <Settings size={18} />
                    <span className="text-sm font-medium">Settings</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
