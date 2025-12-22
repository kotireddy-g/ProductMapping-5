import React, { useState, useCallback, useEffect } from 'react';
import { TrendingUp, RotateCcw, Loader } from 'lucide-react';
import hpiSimulationService from '../../services/hpiSimulationService';

const HPISimulationTab = ({ baselineData }) => {
    // Slider configuration - OTIF only (values are already percentages)
    const sliderConfigs = [
        {
            key: 'otifPct',
            label: 'OTIF %',
            min: 0,
            max: 100,
            step: 0.01,
            unit: '%',
            color: '#3b82f6'
        }
    ];

    // Initialize baseline from props or defaults (values are already percentages)
    const initialBaseline = {
        otifPct: baselineData?.otifPct || 92.36,
        revenueNorm: baselineData?.revenueNorm || 1.0,
        costEfficiencyNorm: baselineData?.costEfficiencyNorm || 1.0,
        patientSatisfaction: baselineData?.patientSatisfaction || 96.18,
        hpi: baselineData?.hpi || 86.47
    };
    const [baseline] = useState(initialBaseline);
    const [simulated, setSimulated] = useState({ ...initialBaseline });
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Debounced simulation function
    const runSimulation = useCallback(async (metrics) => {
        setLoading(true);
        setError(null);

        try {
            const result = await hpiSimulationService.runSimulation({
                baseline: {
                    otifPct: baseline.otifPct,
                    revenueNorm: baseline.revenueNorm,
                    costEfficiencyNorm: baseline.costEfficiencyNorm,
                    patientSatisfaction: baseline.patientSatisfaction
                },
                scenarios: [{
                    label: 'User Simulation',
                    otifPct: metrics.otifPct,
                    revenueNorm: metrics.revenueNorm,
                    costEfficiencyNorm: metrics.costEfficiencyNorm,
                    patientSatisfaction: metrics.patientSatisfaction
                }],
                beds: 500,
                occupancyRate: 0.85,
                revenuePerBedDay: 4000,
                costPerBedDay: 3200
            });

            if (result.success) {
                console.log('HPI Simulation Result:', result.data);
                setResults(result.data);
            } else {
                console.error('HPI Simulation Error:', result.error);
                setError(result.error);
            }
        } catch (err) {
            console.error('HPI Simulation Exception:', err);
            setError('Failed to run simulation. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [baseline]);

    // Debounce timer
    useEffect(() => {
        const timer = setTimeout(() => {
            runSimulation(simulated);
        }, 500);

        return () => clearTimeout(timer);
    }, [simulated, runSimulation]);

    // Handle slider change
    const handleSliderChange = (key, value) => {
        setSimulated(prev => ({ ...prev, [key]: value }));
    };

    // Reset to baseline
    const handleReset = () => {
        setSimulated({ ...baseline });
    };

    // Get scenario results
    const scenario = results?.scenarios?.[0];
    const linkedImpacts = scenario?.linkedImpacts || {};

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    HPI Simulation
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    Interactive "what-if" analysis - Adjust OTIF to see impact on Hospital Performance Index
                </p>
            </div>

            {/* HPI Score Comparison */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">HPI Score Comparison</h3>
                <div className="flex items-center justify-center gap-8">
                    {/* Baseline */}
                    <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">Baseline</div>
                        <div className="text-5xl font-bold text-gray-800">
                            {baseline.hpi.toFixed(2)}
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-4xl text-gray-400">→</div>

                    {/* Simulated */}
                    <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">Simulated</div>
                        {loading ? (
                            <div className="text-5xl font-bold text-gray-400 flex items-center justify-center">
                                <Loader className="w-12 h-12 animate-spin" />
                            </div>
                        ) : (
                            <div className={`text-5xl font-bold ${scenario?.hpi > baseline.hpi ? 'text-green-600' : scenario?.hpi < baseline.hpi ? 'text-red-600' : 'text-gray-800'}`}>
                                {scenario?.hpi?.toFixed(2) || baseline.hpi.toFixed(2)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Delta */}
                {scenario && !loading && (
                    <div className="text-center mt-4">
                        <span className={`text-xl font-semibold ${scenario.deltaHpi > 0 ? 'text-green-600' : scenario.deltaHpi < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            {scenario.deltaHpi > 0 ? '+' : ''}
                            {scenario.deltaHpi.toFixed(2)}
                            {' '}({scenario.deltaHpi > 0 ? '+' : ''}
                            {((scenario.deltaHpi / baseline.hpi) * 100).toFixed(1)}%)
                            {scenario.deltaHpi > 0 ? ' ↑' : scenario.deltaHpi < 0 ? ' ↓' : ''}
                        </span>
                    </div>
                )}

                {error && (
                    <div className="text-center mt-4">
                        <span className="text-sm text-red-600">{error}</span>
                    </div>
                )}
            </div>

            {/* Sliders Section */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Adjust Metrics</h3>
                <div className="space-y-6">
                    {sliderConfigs.map(config => {
                        const value = simulated[config.key];
                        const baselineValue = baseline[config.key];
                        const percentage = ((value - config.min) / (config.max - config.min)) * 100;

                        return (
                            <div key={config.key}>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        {config.label}
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500">
                                            Baseline: {baselineValue.toFixed(2)}{config.unit}
                                        </span>
                                        <span className="text-sm font-bold" style={{ color: config.color }}>
                                            → {value.toFixed(2)}{config.unit}
                                        </span>
                                    </div>
                                </div>

                                <div className="relative">
                                    <input
                                        type="range"
                                        min={config.min}
                                        max={config.max}
                                        step={config.step}
                                        value={value}
                                        onChange={(e) => handleSliderChange(config.key, parseFloat(e.target.value))}
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, ${config.color} 0%, ${config.color} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
                                        }}
                                    />
                                </div>

                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>{config.min.toFixed(0)}{config.unit}</span>
                                    <span>{config.max.toFixed(0)}{config.unit}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Reset Button */}
                <button
                    onClick={handleReset}
                    className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset to Baseline
                </button>
            </div>

        </div>
    );
};

export default HPISimulationTab;
