import React from 'react';
import { User, Package, TrendingUp, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const vendors = [
  { id: 1, name: 'MedSupply Corp', skus: 24, value: 2450000, otif: 94, status: 'reliable' },
  { id: 2, name: 'PharmaCare Ltd', skus: 18, value: 1890000, otif: 88, status: 'warning' },
  { id: 3, name: 'Global Meds Inc', skus: 32, value: 3200000, otif: 96, status: 'reliable' },
  { id: 4, name: 'HealthFirst Supplies', skus: 45, value: 4200000, otif: 92, status: 'reliable' },
  { id: 5, name: 'Surgical Solutions', skus: 28, value: 1200000, otif: 78, status: 'critical' },
  { id: 6, name: 'ICU Essentials', skus: 15, value: 950000, otif: 98, status: 'reliable' },
  { id: 7, name: 'Daycare Pharma', skus: 22, value: 1800000, otif: 91, status: 'reliable' },
  { id: 8, name: 'Implant Tech', skus: 12, value: 680000, otif: 85, status: 'warning' }
];

const VendorList = ({ selectedLabel, onVendorClick }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'reliable':
        return { 
          icon: CheckCircle, 
          color: 'text-green-600', 
          bg: 'bg-green-100',
          border: 'border-green-300',
          label: 'Reliable'
        };
      case 'warning':
        return { 
          icon: AlertTriangle, 
          color: 'text-yellow-600', 
          bg: 'bg-yellow-100',
          border: 'border-yellow-300',
          label: 'Warning'
        };
      case 'critical':
        return { 
          icon: XCircle, 
          color: 'text-red-600', 
          bg: 'bg-red-100',
          border: 'border-red-300',
          label: 'Critical'
        };
      default:
        return { 
          icon: CheckCircle, 
          color: 'text-slate-600', 
          bg: 'bg-slate-100',
          border: 'border-slate-300',
          label: 'Unknown'
        };
    }
  };

  const getOtifColor = (otif) => {
    if (otif >= 90) return 'text-green-600 bg-green-100';
    if (otif >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatValue = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Vendor Performance</h3>
        <span className="text-sm text-slate-500">{vendors.length} vendors</span>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        {vendors.map((vendor) => {
          const status = getStatusConfig(vendor.status);
          const StatusIcon = status.icon;
          
          return (
            <div
              key={vendor.id}
              onClick={() => onVendorClick && onVendorClick(vendor)}
              className={`flex-shrink-0 w-56 p-4 bg-white rounded-xl border-2 ${status.border} 
                cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 text-sm truncate">{vendor.name}</h4>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${status.bg} ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                    <Package className="w-3 h-3" />
                    <span className="text-xs">SKUs</span>
                  </div>
                  <span className="font-bold text-slate-700">{vendor.skus}</span>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs">Value</span>
                  </div>
                  <span className="font-bold text-slate-700">{formatValue(vendor.value)}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">OTIF Score</span>
                  <span className={`px-2 py-0.5 rounded text-sm font-bold ${getOtifColor(vendor.otif)}`}>
                    {vendor.otif}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      vendor.otif >= 90 ? 'bg-green-500' : 
                      vendor.otif >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${vendor.otif}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VendorList;