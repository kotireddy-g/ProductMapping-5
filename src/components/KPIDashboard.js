import React, { useState, useEffect } from 'react';
import { kpiData as mockKpiData } from '../data/kpiData';
import kpiService from '../services/kpiService';
import itsmKpiService from '../services/itsmKpiService';
import EnhancedKPICard from './KPI/EnhancedKPICard';

const KPIDashboard = ({ onNavigate, selectedModule = 'otif', isITSM = false }) => {
    const [kpiData, setKpiData] = useState(mockKpiData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch KPI data — swap service for ITSM, same response shape expected
    useEffect(() => {
        const fetchKPIData = async () => {
            try {
                setLoading(true);
                // ITSM uses itsmKpiService (same path /kpi/all, module=itsm baked in)
                // Pharma uses kpiService with optional module param
                const svc = isITSM ? itsmKpiService : kpiService;
                const moduleParam = (!isITSM && selectedModule !== 'otif') ? selectedModule : null;
                const response = await svc.getAllKPIs(moduleParam);
                if (response.success && response.data) {
                    setKpiData(response.data);
                    setError(null);
                }
            } catch (err) {
                console.error('Failed to fetch KPI data:', err);
                setError('Failed to load KPI data. Using cached data.');
            } finally {
                setLoading(false);
            }
        };

        fetchKPIData();
    }, [selectedModule, isITSM]);

    const handleKPIClick = (kpiKey, kpiName, kpiDataObj) => {
        if (onNavigate) {
            onNavigate('kpi-detail', { id: kpiKey, name: kpiName, data: kpiDataObj });
        }
    };

    // Determine if data is array-style (ITSM dynamic list) or object-style (pharma named keys)
    const isArrayData = Array.isArray(kpiData);

    return (
        <div className="mb-16">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                    {isITSM ? 'ITSM Key Performance Indicators' : 'Key Performance Indicators (Priority)'}
                </h2>
                <p className="text-gray-600 mt-2">
                    {isITSM
                        ? 'DTIF, OPI, and operational metrics for your ITSM pipeline'
                        : 'Critical pharmacy performance metrics and trends'}
                </p>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 mt-4">Loading KPI data...</p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-sm">{error}</p>
                </div>
            )}

            {/* KPI Grid - array shape (ITSM dynamic list from API) */}
            {!loading && isArrayData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {kpiData.map((kpi, idx) => (
                        <EnhancedKPICard
                            key={kpi.id || kpi.kpiId || idx}
                            kpiKey={kpi.id || kpi.kpiId || `kpi-${idx}`}
                            data={kpi}
                            isPriority={idx < 4}
                            onClick={() => handleKPIClick(kpi.id || kpi.kpiId || `kpi-${idx}`, kpi.title, kpi)}
                        />
                    ))}
                </div>
            )}

            {/* KPI Grid - object shape (pharma named keys, unchanged) */}
            {!loading && !isArrayData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {['otif', 'stockHealth', 'expiryRisk', 'forecastAccuracy', 'fulfillmentTime', 'revenueProtection']
                        .filter(key => kpiData[key])
                        .map((key, idx) => (
                            <EnhancedKPICard
                                key={key}
                                kpiKey={key}
                                data={kpiData[key]}
                                isPriority={idx < 3}
                                onClick={() => handleKPIClick(key, kpiData[key].title, kpiData[key])}
                            />
                        ))}
                </div>
            )}

            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 italic">Use search bar for other KPIs</p>
            </div>
        </div>
    );
};

export default KPIDashboard;
