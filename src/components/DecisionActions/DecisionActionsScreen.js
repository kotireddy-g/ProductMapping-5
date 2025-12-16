import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Info, Eye, CheckCircle } from 'lucide-react';
import ProductJourneyModal from '../ForecastReview/ProductJourneyModal';
import VendorDetailsModal from './VendorDetailsModal';
import { getDecisionActionsData } from '../../services/decisionActionsService';
import { getTranslatedActionName } from '../../utils/translationHelpers';

const DecisionActionsScreen = ({ actionType, onBack, mainAction, subAction }) => {
    const { t } = useTranslation();
    const [humanFeedback, setHumanFeedback] = useState({});
    const [tags, setTags] = useState({});
    const [showFlowModal, setShowFlowModal] = useState(false);
    const [selectedFlowItem, setSelectedFlowItem] = useState(null);
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [selectedMedicineVendors, setSelectedMedicineVendors] = useState(null);
    const [medicineData, setMedicineData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Alert definitions for tooltips
    const alertDefinitions = {
        'CRITICAL': {
            color: 'bg-red-100 text-red-800 border-red-400',
            definition: 'Patient safety risk now or within 24 hours'
        },
        'HIGH': {
            color: 'bg-orange-100 text-orange-800 border-orange-400',
            definition: 'OTIF/Cost risk within 2-7 days'
        },
        'MEDIUM': {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-400',
            definition: 'Trend/optimization, fix in weekly review'
        },
        'MONITORING': {
            color: 'bg-green-100 text-green-800 border-green-400',
            definition: 'Track medicine usage'
        }
    };

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            if (!mainAction || !subAction) {
                setError('Missing action parameters');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await getDecisionActionsData(mainAction, subAction);

                if (response.success && response.data) {
                    setMedicineData(response.data);
                } else {
                    setError('Failed to load data');
                }
            } catch (err) {
                console.error('Error fetching decision actions data:', err);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [mainAction, subAction]);

    // Sample data for fallback (removed, now using API)
    const sampleData = [
        {
            id: 1,
            category: 'Life-saving',
            sku: 'PAR-500-B2401',
            medicineName: 'Paracetamol 500mg',
            batchCode: 'B2401-EXP-06/2025',
            expiry: '06/2025',
            velocity: 'Fast-moving',
            drugLabel: 'Analgesic',
            alert: 'CRITICAL',
            flow: ['Supplier', 'Central Pharmacy', 'ICU', 'Patient'],
            tag: 'Must Have',
            location: 'ICU',
            otif: 75,
            dailyDemand: 450,
            supply: 380,
            stockAvailable: 1200,
            safetyLevel: 85,
            forecast: 12,
            agentSuggestion: 'Emergency Order - Stock critically low',
            humanFeedback: ''
        },
        {
            id: 2,
            category: 'Surgical',
            sku: 'PRO-200-B2402',
            medicineName: 'Propofol 200mg',
            batchCode: 'B2402-EXP-08/2025',
            expiry: '08/2025',
            velocity: 'Medium-moving',
            drugLabel: 'Anesthetic',
            alert: 'HIGH',
            flow: ['Supplier', 'Central Pharmacy', 'OT'],
            tag: 'Patient Based',
            location: 'OT',
            otif: 88,
            dailyDemand: 120,
            supply: 110,
            stockAvailable: 450,
            safetyLevel: 78,
            forecast: 15,
            agentSuggestion: 'Reorder within 3 days',
            humanFeedback: ''
        },
        {
            id: 3,
            category: 'Fast-moving',
            sku: 'AMO-250-B2403',
            medicineName: 'Amoxicillin 250mg',
            batchCode: 'B2403-EXP-12/2025',
            expiry: '12/2025',
            velocity: 'Fast-moving',
            drugLabel: 'Antibiotic',
            alert: 'MEDIUM',
            flow: ['Supplier', 'Central Pharmacy', 'Ward', 'OPD'],
            tag: 'General',
            location: 'Ward',
            otif: 92,
            dailyDemand: 280,
            supply: 270,
            stockAvailable: 2100,
            safetyLevel: 92,
            forecast: 8,
            agentSuggestion: 'Monitor weekly trends',
            humanFeedback: ''
        },
        {
            id: 4,
            category: 'Critical',
            sku: 'INS-100-B2404',
            medicineName: 'Insulin Glargine 100IU',
            batchCode: 'B2404-EXP-05/2025',
            expiry: '05/2025',
            velocity: 'Slow-moving',
            drugLabel: 'Antidiabetic',
            alert: 'CRITICAL',
            flow: ['Supplier', 'Central Pharmacy', 'Pharmacy'],
            tag: 'Must Have',
            location: 'Pharmacy',
            otif: 68,
            dailyDemand: 85,
            supply: 60,
            stockAvailable: 320,
            safetyLevel: 72,
            forecast: 18,
            agentSuggestion: 'Urgent Order - Approaching expiry',
            humanFeedback: ''
        },
        {
            id: 5,
            category: 'General',
            sku: 'ASP-75-B2405',
            medicineName: 'Aspirin 75mg',
            batchCode: 'B2405-EXP-10/2025',
            expiry: '10/2025',
            velocity: 'Fast-moving',
            drugLabel: 'Antiplatelet',
            alert: 'MONITORING',
            flow: ['Supplier', 'Central Pharmacy', 'OPD'],
            tag: 'General',
            location: 'OPD',
            otif: 96,
            dailyDemand: 320,
            supply: 315,
            stockAvailable: 3500,
            safetyLevel: 95,
            forecast: 5,
            agentSuggestion: 'Stock levels optimal',
            humanFeedback: ''
        },
        {
            id: 6,
            category: 'Restricted',
            sku: 'MOR-10-B2406',
            medicineName: 'Morphine Sulfate 10mg',
            batchCode: 'B2406-EXP-07/2025',
            expiry: '07/2025',
            velocity: 'Slow-moving',
            drugLabel: 'Opioid Analgesic',
            alert: 'HIGH',
            flow: ['Supplier', 'Central Pharmacy', 'ICU'],
            tag: 'Patient Based',
            location: 'ICU',
            otif: 82,
            dailyDemand: 45,
            supply: 40,
            stockAvailable: 180,
            safetyLevel: 80,
            forecast: 10,
            agentSuggestion: 'Increase safety stock',
            humanFeedback: ''
        },
        {
            id: 7,
            category: 'Life-saving',
            sku: 'EPI-1-B2407',
            medicineName: 'Epinephrine 1mg',
            batchCode: 'B2407-EXP-04/2025',
            expiry: '04/2025',
            velocity: 'Medium-moving',
            drugLabel: 'Emergency Drug',
            alert: 'CRITICAL',
            flow: ['Supplier', 'Central Pharmacy', 'ER'],
            tag: 'Must Have',
            location: 'ER',
            otif: 71,
            dailyDemand: 60,
            supply: 48,
            stockAvailable: 220,
            safetyLevel: 75,
            forecast: 20,
            agentSuggestion: 'Emergency reorder required',
            humanFeedback: ''
        },
        {
            id: 8,
            category: 'Surgical',
            sku: 'ROC-50-B2408',
            medicineName: 'Rocuronium 50mg',
            batchCode: 'B2408-EXP-09/2025',
            expiry: '09/2025',
            velocity: 'Medium-moving',
            drugLabel: 'Muscle Relaxant',
            alert: 'MEDIUM',
            flow: ['Supplier', 'Central Pharmacy', 'OT'],
            tag: 'Patient Based',
            location: 'OT',
            otif: 89,
            dailyDemand: 95,
            supply: 90,
            stockAvailable: 520,
            safetyLevel: 88,
            forecast: 12,
            agentSuggestion: 'Review in weekly meeting',
            humanFeedback: ''
        }
    ];

    const handleTagChange = (id, value) => {
        setTags(prev => ({ ...prev, [id]: value }));
    };

    const handleFeedbackChange = (id, value) => {
        setHumanFeedback(prev => ({ ...prev, [id]: value }));
    };

    const handleViewFlow = (medicine) => {
        // Format data to match ProductJourneyModal expected structure
        const formattedItem = {
            sku: medicine.medicineName,
            forecast: `${medicine.dailyDemand} units`,
            medicineName: medicine.medicineName,
            category: medicine.category,
            location: medicine.location
        };
        setSelectedFlowItem(formattedItem);
        setShowFlowModal(true);
    };

    const getOTIFColor = (otif) => {
        if (otif >= 95) return 'text-green-700 bg-green-50 font-bold';
        if (otif >= 85) return 'text-yellow-700 bg-yellow-50 font-bold';
        return 'text-red-700 bg-red-50 font-bold';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-[1600px] mx-auto px-6 py-6">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold">{t('common.back')}</span>
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-800 mb-2">
                                {t('decisionActions.title')}: {actionType?.name ? getTranslatedActionName(actionType.name, t) : t('decisionActions.title')}
                            </h1>
                            <p className="text-slate-600">
                                {actionType?.description || 'Items with abnormal usage patterns or velocity changes'}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                                <span className="text-sm text-slate-600">Total Items:</span>
                                <span className="ml-2 text-xl font-bold text-blue-700">{medicineData.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="max-w-[1600px] mx-auto px-6 py-12">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-slate-600 font-semibold">Loading decision actions data...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="max-w-[1600px] mx-auto px-6 py-12">
                    <div className="bg-red-50 rounded-xl shadow-lg border-2 border-red-200 p-12 text-center">
                        <div className="text-red-600 text-5xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Data</h3>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            {!loading && !error && (
                <div className="max-w-[1600px] mx-auto px-6 py-4">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gradient-to-r from-slate-100 to-slate-50 sticky top-0">
                                    <tr className="border-b-2 border-slate-300">
                                        <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                            Category
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                            SKU/Medicine
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                            Alert
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                            Flow
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                            Tag
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                            Location
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                            OTIF
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                            Daily Demand
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                            Supply
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                            Stock Available
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                            Forecast%
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                            Preferred Vendor
                                        </th>
                                        <th className="px-4 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                            Vendor Count
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                            Agent Suggestion
                                        </th>
                                        <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">
                                            Human Feedback
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {medicineData.map((medicine, index) => (
                                        <tr
                                            key={medicine.id}
                                            className={`transition - all hover: bg - blue - 50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} `}
                                        >
                                            {/* Category */}
                                            <td className="px-4 py-4">
                                                <span className="font-semibold text-slate-800 px-3 py-1 bg-slate-100 rounded-full text-xs">
                                                    {medicine.category}
                                                </span>
                                            </td>

                                            {/* SKU/Medicine */}
                                            <td className="px-4 py-4">
                                                <div className="space-y-1.5">
                                                    <div className="font-bold text-slate-900">{medicine.medicineName}</div>
                                                    <div className="text-xs text-slate-600">
                                                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">SKU: {medicine.sku}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-600">
                                                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">Batch: {medicine.batchCode}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                                            {medicine.velocity}
                                                        </span>
                                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                                                            {medicine.drugLabel}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Alert */}
                                            <td className="px-4 py-4">
                                                <div className="relative group">
                                                    <div className={`px - 3 py - 2 rounded - lg border - 2 font - bold text - xs inline - flex items - center gap - 1.5 shadow - sm ${alertDefinitions[medicine.alert].color} `}>
                                                        {medicine.alert}
                                                        <Info size={14} />
                                                    </div>
                                                    <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-20 bg-slate-900 text-white text-xs rounded-lg px-4 py-3 whitespace-nowrap shadow-xl border border-slate-700">
                                                        <div className="font-semibold mb-1">{medicine.alert}</div>
                                                        <div className="text-slate-300">{alertDefinitions[medicine.alert].definition}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Flow */}
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => handleViewFlow(medicine)}
                                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-xs hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                                                >
                                                    <Eye size={14} />
                                                    View Flow
                                                </button>
                                            </td>

                                            {/* Tag */}
                                            <td className="px-4 py-4">
                                                <select
                                                    value={tags[medicine.id] || medicine.tag}
                                                    onChange={(e) => handleTagChange(medicine.id, e.target.value)}
                                                    className="px-3 py-2 border-2 border-slate-300 rounded-lg text-xs bg-white text-slate-700 font-semibold hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                >
                                                    <option value="Must Have">Must Have</option>
                                                    <option value="Patient Based">Patient Based</option>
                                                    <option value="General">General</option>
                                                </select>
                                            </td>

                                            {/* Location */}
                                            <td className="px-4 py-4">
                                                <span className="text-slate-800 font-semibold">{medicine.location}</span>
                                            </td>

                                            {/* OTIF */}
                                            <td className="px-4 py-4 text-center">
                                                <span className={`px - 3 py - 2 rounded - lg text - sm ${getOTIFColor(medicine.otif)} `}>
                                                    {Number(medicine.otif).toFixed(2)}%
                                                </span>
                                            </td>

                                            {/* Daily Demand */}
                                            <td className="px-4 py-4 text-center">
                                                <span className="font-bold text-blue-700 text-base">{medicine.dailyDemand}</span>
                                            </td>

                                            {/* Supply */}
                                            <td className="px-4 py-4 text-center">
                                                <span className="font-bold text-green-700 text-base">{medicine.supply}</span>
                                            </td>

                                            {/* Stock Available */}
                                            <td className="px-4 py-4 text-center">
                                                <span className="font-bold text-purple-700 text-base">{medicine.stockAvailable}</span>
                                            </td>

                                            {/* Forecast */}
                                            <td className="px-4 py-4 text-center">
                                                <span className="font-bold text-amber-700 text-base">{Number(medicine.forecast).toFixed(2)}%</span>
                                            </td>

                                            {/* Preferred Vendor */}
                                            <td className="px-4 py-4">
                                                <span className="text-slate-700 text-sm font-mono">
                                                    {medicine.preferredVendor || 'N/A'}
                                                </span>
                                            </td>

                                            {/* Vendor Count */}
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    onClick={() => {
                                                        setSelectedMedicineVendors({ medicine, vendors: medicine.vendors || [] });
                                                        setShowVendorModal(true);
                                                    }}
                                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-colors cursor-pointer shadow-md hover:shadow-lg"
                                                >
                                                    {medicine.vendorCount || 0}
                                                </button>
                                            </td>

                                            {/* Agent Suggestion */}
                                            <td className="px-4 py-4">
                                                <div className="max-w-xs">
                                                    <span className="text-slate-700 text-xs leading-relaxed">{medicine.agentSuggestion}</span>
                                                </div>
                                            </td>


                                            {/* Human Feedback */}
                                            <td className="px-4 py-4">
                                                <select
                                                    value={humanFeedback[medicine.id] || ''}
                                                    onChange={(e) => handleFeedbackChange(medicine.id, e.target.value)}
                                                    className="px-3 py-2 border-2 border-slate-300 rounded-lg text-xs bg-white text-slate-700 font-semibold hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-44 transition-all"
                                                >
                                                    <option value="">Select Reason</option>
                                                    <option value="Supplier Delay">Supplier Delay</option>
                                                    <option value="High Demand">High Demand</option>
                                                    <option value="Quality Issue">Quality Issue</option>
                                                    <option value="Regulatory Hold">Regulatory Hold</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>


                            {/* Empty State - Context-Aware Message */}
                            {medicineData.length === 0 && (
                                <>
                                    {/* Case 1: Expected items but API returned empty - Data Sync Issue */}
                                    {actionType?.subcategory?.count > 0 ? (
                                        <div className="py-16 px-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
                                            <div className="max-w-md mx-auto">
                                                <div className="text-6xl mb-4">🔄</div>
                                                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                                                    Data Sync in Progress
                                                </h3>
                                                <p className="text-slate-600 text-lg mb-2">
                                                    We're currently updating the inventory data for this category.
                                                </p>
                                                <p className="text-slate-500 text-sm mb-4">
                                                    Expected {actionType.subcategory.count} item{actionType.subcategory.count !== 1 ? 's' : ''} to display. Please refresh in a moment or contact support if this persists.
                                                </p>
                                                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                                                    <Info size={16} className="text-blue-600" />
                                                    <span>System is processing latest updates</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Case 2: Truly no items - Positive Message */
                                        <div className="py-16 px-6 text-center bg-gradient-to-br from-green-50 to-blue-50">
                                            <div className="max-w-md mx-auto">
                                                <div className="text-6xl mb-4">✨</div>
                                                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                                                    Great News! Everything Looks Good
                                                </h3>
                                                <p className="text-slate-600 text-lg mb-2">
                                                    No items require attention in this category at the moment.
                                                </p>
                                                <p className="text-slate-500 text-sm">
                                                    Your inventory is well-managed and all stock levels are optimal. Keep up the excellent work!
                                                </p>
                                                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                                                    <CheckCircle size={16} className="text-green-600" />
                                                    <span>All systems operating normally</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {/* Product Journey Modal */}
            <ProductJourneyModal
                isOpen={showFlowModal}
                onClose={() => setShowFlowModal(false)}
                selectedItem={selectedFlowItem}
            />

            {/* Vendor Details Modal */}
            <VendorDetailsModal
                isOpen={showVendorModal}
                onClose={() => setShowVendorModal(false)}
                medicine={selectedMedicineVendors?.medicine}
                vendors={selectedMedicineVendors?.vendors || []}
            />
        </div>

    );
};

export default DecisionActionsScreen;
