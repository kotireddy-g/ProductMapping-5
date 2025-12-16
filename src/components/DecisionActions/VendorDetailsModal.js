import React from 'react';
import { X, Star, MapPin, Phone, Mail, Award, Clock, DollarSign, Package, TrendingUp } from 'lucide-react';

const VendorDetailsModal = ({ isOpen, onClose, medicine, vendors }) => {
    if (!isOpen || !vendors || vendors.length === 0) return null;

    // Helper function to render star rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`full-${i}`} size={14} fill="#FCD34D" stroke="#FCD34D" />);
        }
        if (hasHalfStar) {
            stars.push(<Star key="half" size={14} fill="#FCD34D" stroke="#FCD34D" className="opacity-50" />);
        }
        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<Star key={`empty-${i}`} size={14} stroke="#D1D5DB" />);
        }
        return stars;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Vendor Details</h2>
                        <p className="text-blue-100 text-sm mt-1">
                            {medicine?.medicineName || 'Medicine'} - {vendors.length} Vendor{vendors.length > 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-white" />
                    </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        {vendors.map((vendor, index) => {
                            const isPreferred = vendor.preferred === true;

                            return (
                                <div
                                    key={vendor.vendorCode || index}
                                    className={`border-2 rounded-xl overflow-hidden transition-all ${isPreferred
                                            ? 'border-green-400 bg-green-50'
                                            : 'border-slate-200 bg-white hover:border-blue-300'
                                        }`}
                                >
                                    {/* Vendor Header */}
                                    <div className={`px-6 py-4 ${isPreferred ? 'bg-green-100' : 'bg-slate-50'} border-b-2 ${isPreferred ? 'border-green-200' : 'border-slate-200'}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-xl font-bold text-slate-800">
                                                        {vendor.vendorName}
                                                    </h3>
                                                    {isPreferred && (
                                                        <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                                            <Award size={12} />
                                                            PREFERRED
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 font-mono">
                                                    {vendor.vendorCode}
                                                </p>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border-2 border-slate-200">
                                                <div className="flex gap-0.5">
                                                    {renderStars(vendor.rating)}
                                                </div>
                                                <span className="text-lg font-bold text-slate-700">
                                                    {vendor.rating.toFixed(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vendor Details - Table Format */}
                                    <div className="p-6">
                                        <div className="grid grid-cols-3 gap-6">
                                            {/* Column 1: Contact & Location */}
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 pb-2 border-b border-slate-200">Contact</h4>
                                                    <div className="space-y-2.5">
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-slate-400 text-xs mt-0.5">👤</span>
                                                            <div className="flex-1">
                                                                <div className="text-xs text-slate-500">Contact Person</div>
                                                                <div className="text-sm font-semibold text-slate-800">{vendor.contactPerson}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <Mail size={12} className="text-slate-400 mt-0.5" />
                                                            <div className="flex-1">
                                                                <div className="text-xs text-slate-500">Email</div>
                                                                <a href={`mailto:${vendor.contactEmail}`} className="text-sm text-blue-600 hover:underline break-all">
                                                                    {vendor.contactEmail}
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-2">
                                                            <Phone size={12} className="text-slate-400 mt-0.5" />
                                                            <div className="flex-1">
                                                                <div className="text-xs text-slate-500">Phone</div>
                                                                <div className="text-sm font-semibold text-slate-800">{vendor.contactPhone}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 pb-2 border-b border-slate-200">Location</h4>
                                                    <div className="flex items-start gap-2">
                                                        <MapPin size={12} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                                        <div className="text-sm text-slate-700">
                                                            <div className="font-semibold">{vendor.city}, {vendor.state}</div>
                                                            <div className="text-xs text-slate-500 mt-0.5">{vendor.country}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Column 2: Performance & Pricing */}
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 pb-2 border-b border-slate-200">Performance</h4>
                                                    <div className="space-y-2.5">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-slate-600">OTIF:</span>
                                                            <span className={`font-bold text-sm ${vendor.otifPct >= 95 ? 'text-green-600' : vendor.otifPct >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                                {vendor.otifPct.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-slate-600">On-Time:</span>
                                                            <span className="font-semibold text-sm text-slate-700">{vendor.sla.onTimePct.toFixed(1)}%</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-slate-600">In-Full:</span>
                                                            <span className="font-semibold text-sm text-slate-700">{vendor.sla.inFullPct.toFixed(1)}%</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 pb-2 border-b border-slate-200">Pricing & Terms</h4>
                                                    <div className="space-y-2.5">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-slate-600">Unit Price:</span>
                                                            <span className="font-bold text-sm text-slate-800">
                                                                {vendor.currency} {vendor.unitPrice.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-slate-600">Credit Days:</span>
                                                            <span className="font-semibold text-sm text-slate-700">{vendor.creditDays} days</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-slate-600">Lead Time:</span>
                                                            <span className="font-semibold text-sm text-slate-700">{vendor.leadTimeDays} days</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Column 3: Capacity & Delivery */}
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 pb-2 border-b border-slate-200">Capacity</h4>
                                                    <div className="space-y-2.5">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-slate-600">Min Order:</span>
                                                            <span className="font-semibold text-sm text-slate-700">{vendor.minOrderQty.toFixed(0)}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-slate-600">Max/Month:</span>
                                                            <span className="font-semibold text-sm text-slate-700">{vendor.maxMonthlyCapacity.toFixed(0)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 pb-2 border-b border-slate-200">Delivery</h4>
                                                    <div className="space-y-2.5">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-slate-600">Last:</span>
                                                            <span className="font-semibold text-sm text-slate-700">{vendor.lastDeliveryDate}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-slate-600">Next:</span>
                                                            <span className="font-semibold text-sm text-slate-700">{vendor.nextCommitDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Capabilities */}
                                        {vendor.capabilities && vendor.capabilities.length > 0 && (
                                            <div className="mt-5 pt-5 border-t border-slate-200">
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Capabilities</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {vendor.capabilities.map((cap, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded"
                                                        >
                                                            {cap.replace(/_/g, ' ')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Remarks */}
                                        {vendor.remarks && (
                                            <div className="mt-3 text-sm text-slate-600 italic">
                                                "{vendor.remarks}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VendorDetailsModal;
