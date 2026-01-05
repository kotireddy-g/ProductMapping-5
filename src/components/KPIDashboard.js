import React, { useState, useEffect } from 'react';
import { kpiData as mockKpiData } from '../data/kpiData';
import kpiService from '../services/kpiService';
import EnhancedKPICard from './KPI/EnhancedKPICard';

const KPIDashboard = ({ onNavigate, selectedModule = 'otif' }) => {
    const [kpiData, setKpiData] = useState(mockKpiData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch KPI data from API on component mount and when module changes
    useEffect(() => {
        const fetchKPIData = async () => {
            try {
                setLoading(true);
                // Convert module ID to API format
                const moduleParam = selectedModule === 'otif' ? null : selectedModule;
                const response = await kpiService.getAllKPIs(moduleParam);

                if (response.success && response.data) {
                    setKpiData(response.data);
                    setError(null);
                }
            } catch (err) {
                console.error('Failed to fetch KPI data:', err);
                setError('Failed to load KPI data. Using cached data.');
                // Keep using mock data as fallback
            } finally {
                setLoading(false);
            }
        };

        fetchKPIData();
    }, [selectedModule]);

    const handleKPIClick = (kpiKey, kpiName) => {
        if (onNavigate) {
            onNavigate('kpi-detail', { id: kpiKey, name: kpiName });
        }
    };

    return (
        <div className="mb-16">
            {/* KPI Dashboard Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Key Performance Indicators (Priority)</h2>
                <p className="text-gray-600 mt-2">Critical pharmacy performance metrics and trends</p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 mt-4">Loading KPI data...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-sm">{error}</p>
                </div>
            )}

            {/* KPI Grid - 2 columns for enhanced cards */}
            {!loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <EnhancedKPICard
                        kpiKey="otif"
                        data={kpiData.otif}
                        isPriority={true}
                        onClick={() => handleKPIClick('otif', kpiData.otif.title)}
                    />
                    <EnhancedKPICard
                        kpiKey="stockHealth"
                        data={kpiData.stockHealth}
                        isPriority={true}
                        onClick={() => handleKPIClick('stockHealth', kpiData.stockHealth.title)}
                    />
                    <EnhancedKPICard
                        kpiKey="expiryRisk"
                        data={kpiData.expiryRisk}
                        isPriority={true}
                        onClick={() => handleKPIClick('expiryRisk', kpiData.expiryRisk.title)}
                    />
                    <EnhancedKPICard
                        kpiKey="forecastAccuracy"
                        data={kpiData.forecastAccuracy}
                        isPriority={false}
                        onClick={() => handleKPIClick('forecastAccuracy', kpiData.forecastAccuracy.title)}
                    />
                    <EnhancedKPICard
                        kpiKey="fulfillmentTime"
                        data={kpiData.fulfillmentTime}
                        isPriority={false}
                        onClick={() => handleKPIClick('fulfillmentTime', kpiData.fulfillmentTime.title)}
                    />
                    <EnhancedKPICard
                        kpiKey="revenueProtection"
                        data={kpiData.revenueProtection}
                        isPriority={false}
                        onClick={() => handleKPIClick('revenueProtection', kpiData.revenueProtection.title)}
                    />
                </div>
            )}

            {/* Footer Text */}
            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 italic">Use search bar for other KPIs</p>
            </div>
        </div>
    );
};

export default KPIDashboard;
