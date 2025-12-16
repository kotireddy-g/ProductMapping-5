import React, { useState, useEffect } from 'react';
import { X, Eye, Package, AlertTriangle } from 'lucide-react';
import VendorDetailsModal from '../DecisionActions/VendorDetailsModal';
import ProductJourneyModal from '../ForecastReview/ProductJourneyModal';
import forecastService from '../../services/forecastService';

const ForecastMedicineDetailsModal = ({ isOpen, onClose, departmentId, timePeriod, locationName }) => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedVendors, setSelectedVendors] = useState(null);
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [showFlowModal, setShowFlowModal] = useState(false);
    const [selectedFlowItem, setSelectedFlowItem] = useState(null);

    useEffect(() => {
        console.log('ForecastMedicineDetailsModal useEffect triggered:', { isOpen, departmentId, timePeriod });
        if (isOpen && departmentId && timePeriod) {
            fetchMedicineDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, departmentId, timePeriod]);

    const fetchMedicineDetails = async () => {
        console.log('Fetching medicine details for:', { departmentId, timePeriod });
        try {
            setLoading(true);
            setError(null);
            const response = await forecastService.getForecastMedicineDetails(departmentId, timePeriod);
            console.log('Medicine details response:', response);
            if (response.success) {
                setMedicines(response.data.medicines || []);
            } else {
                setError('Failed to load medicine details');
            }
        } catch (err) {
            console.error('Error fetching medicine details:', err);
            setError('Error loading medicine details');
        } finally {
            setLoading(false);
        }
    };

    const handleVendorClick = (vendors) => {
        setSelectedVendors(vendors);
        setShowVendorModal(true);
    };

    const handleFlowClick = (item) => {
        setSelectedFlowItem(item);
        setShowFlowModal(true);
    };

    const getAlertColor = (alert) => {
        switch (alert?.toUpperCase()) {
            case 'CRITICAL':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'HIGH':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'MONITORING':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getOTIFColor = (otif) => {
        if (otif >= 95) return 'text-green-600';
        if (otif >= 90) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">
                                {locationName} - Forecast Details
                            </h2>
                            <p className="text-sm text-slate-600 mt-1">
                                Period: {timePeriod} | Medicines: {medicines.length}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-slate-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-auto p-6">
                        {loading && (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                <p className="mt-4 text-slate-600">Loading medicine details...</p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                                {error}
                            </div>
                        )}

                        {!loading && !error && medicines.length === 0 && (
                            <div className="text-center py-12 text-slate-600">
                                No medicines found for this location and period.
                            </div>
                        )}

                        {!loading && !error && medicines.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Category</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">SKU/Medicine</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">Alert</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">Tag</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Location</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">OTIF</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">Daily Demand</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">Supply</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">Stock Available</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">Forecast</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase">Agent Suggestion</th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase">Vendor Count</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {medicines.map((medicine, index) => (
                                            <tr key={medicine.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                                                {/* Category */}
                                                <td className="px-4 py-4">
                                                    <span className="text-sm font-semibold text-slate-800">{medicine.category}</span>
                                                </td>

                                                {/* SKU/Medicine */}
                                                <td className="px-4 py-4">
                                                    <div>
                                                        <div className="text-xs text-slate-500">{medicine.sku}</div>
                                                        <div className="text-sm font-semibold text-slate-800">{medicine.medicineName}</div>
                                                    </div>
                                                </td>

                                                {/* Alert */}
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getAlertColor(medicine.alert)}`}>
                                                        {medicine.alert}
                                                    </span>
                                                </td>

                                                {/* Tag */}
                                                <td className="px-4 py-4 text-center">
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                                                        {medicine.tag}
                                                    </span>
                                                </td>

                                                {/* Location */}
                                                <td className="px-4 py-4">
                                                    <span className="text-sm text-slate-700">{medicine.location}</span>
                                                </td>

                                                {/* OTIF */}
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`text-lg font-bold ${getOTIFColor(medicine.otif)}`}>
                                                        {medicine.otif}%
                                                    </span>
                                                </td>

                                                {/* Daily Demand */}
                                                <td className="px-4 py-4 text-center">
                                                    <span className="text-sm font-semibold text-slate-800">{medicine.dailyDemand}</span>
                                                </td>

                                                {/* Supply */}
                                                <td className="px-4 py-4 text-center">
                                                    <span className="text-sm font-semibold text-slate-800">{medicine.supply}</span>
                                                </td>

                                                {/* Stock Available */}
                                                <td className="px-4 py-4 text-center">
                                                    <span className="text-sm font-semibold text-slate-800">{medicine.stockAvailable}</span>
                                                </td>

                                                {/* Forecast */}
                                                <td className="px-4 py-4 text-center">
                                                    <span className="text-sm font-bold text-green-700">{medicine.forecast}</span>
                                                </td>

                                                {/* Agent Suggestion */}
                                                <td className="px-4 py-4">
                                                    <div className="max-w-xs">
                                                        <span className="text-xs text-slate-700">{medicine.agentSuggestion}</span>
                                                    </div>
                                                </td>

                                                {/* Vendor Count */}
                                                <td className="px-4 py-4 text-center">
                                                    <button
                                                        onClick={() => handleVendorClick(medicine.vendors)}
                                                        className="px-3 py-1 bg-slate-700 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
                                                    >
                                                        {medicine.vendorCount}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Vendor Details Modal */}
            <VendorDetailsModal
                isOpen={showVendorModal}
                onClose={() => setShowVendorModal(false)}
                vendors={selectedVendors}
            />

            {/* Product Journey Modal */}
            <ProductJourneyModal
                isOpen={showFlowModal}
                onClose={() => setShowFlowModal(false)}
                selectedItem={selectedFlowItem}
            />
        </>
    );
};

export default ForecastMedicineDetailsModal;
