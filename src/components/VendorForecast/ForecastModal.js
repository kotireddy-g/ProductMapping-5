import React, { useState, useMemo } from 'react';
import { X, Download, Search, ChevronDown, ChevronUp, TrendingUp, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Pharmaceutical inventory data matching the screenshot
const pharmaceuticalData = [
  {
    id: 1,
    product: 'Amoxicillin 250mg Tablet',
    category: 'Antibiotic',
    demand: 'Surging',
    inventory: 'Critical',
    stock: '61 / 135',
    expiryRisk: 'High',
    supplier: 'Cipla',
    aiConfidence: '87%'
  },
  {
    id: 2,
    product: 'Amoxicillin 500mg Tablet',
    category: 'Antibiotic',
    demand: 'Surging',
    inventory: 'Critical',
    stock: '57 / 120',
    expiryRisk: 'High',
    supplier: 'Cipla',
    aiConfidence: '89%'
  },
  {
    id: 3,
    product: 'Azithromycin 250mg Tablet',
    category: 'Antibiotic',
    demand: 'Stable',
    inventory: 'Healthy',
    stock: '47 / 105',
    expiryRisk: 'Medium',
    supplier: 'Sun Pharma',
    aiConfidence: '86%'
  },
  {
    id: 4,
    product: 'Cephalexin 500mg Capsule',
    category: 'Antibiotic',
    demand: 'Surging',
    inventory: 'Critical',
    stock: '54 / 130',
    expiryRisk: 'High',
    supplier: 'Lupin',
    aiConfidence: '84%'
  },
  {
    id: 5,
    product: 'Fluoroquinolone 250mg Tablet',
    category: 'Antibiotic',
    demand: 'Stable',
    inventory: 'Healthy',
    stock: '44 / 100',
    expiryRisk: 'Medium',
    supplier: 'Cipla',
    aiConfidence: '82%'
  },
  {
    id: 6,
    product: 'Metronidazole 400mg Tablet',
    category: 'Antibiotic',
    demand: 'Surging',
    inventory: 'Critical',
    stock: '63 / 140',
    expiryRisk: 'Medium',
    supplier: 'Alkem',
    aiConfidence: '85%'
  },
  {
    id: 7,
    product: 'Tetracycline 500mg Capsule',
    category: 'Antibiotic',
    demand: 'Stable',
    inventory: 'Healthy',
    stock: '48 / 110',
    expiryRisk: 'Low',
    supplier: 'Sun Pharma',
    aiConfidence: '79%'
  },
  {
    id: 8,
    product: 'Chloramphenicol 250mg Capsule',
    category: 'Antibiotic',
    demand: 'Stable',
    inventory: 'Healthy',
    stock: '33 / 75',
    expiryRisk: 'Low',
    supplier: 'Merck',
    aiConfidence: '76%'
  },
  {
    id: 9,
    product: 'Doxycycline 100mg Capsule',
    category: 'Antibiotic',
    demand: 'Surging',
    inventory: 'Critical',
    stock: '55 / 125',
    expiryRisk: 'Medium',
    supplier: 'GSK',
    aiConfidence: '88%'
  },
  {
    id: 10,
    product: 'Clindamycin 300mg Capsule',
    category: 'Antibiotic',
    demand: 'Stable',
    inventory: 'Healthy',
    stock: '46 / 105',
    expiryRisk: 'Low',
    supplier: 'Abbott',
    aiConfidence: '83%'
  },
  {
    id: 11,
    product: 'Amoxicillin-Clavulanic 625mg Tablet',
    category: 'Antibiotic',
    demand: 'Surging',
    inventory: 'Critical',
    stock: '60 / 135',
    expiryRisk: 'High',
    supplier: 'GSK',
    aiConfidence: '90%'
  }
];

const ForecastModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Items');
  const [currentTab, setCurrentTab] = useState('All Items');

  const tabs = ['All Items', 'Critical', 'Surging', 'Expiry Risk'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical':
        return 'bg-red-100 text-red-700';
      case 'Healthy':
        return 'bg-green-100 text-green-700';
      case 'Surging':
        return 'bg-blue-100 text-blue-700';
      case 'Stable':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getExpiryRiskColor = (risk) => {
    switch (risk) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredData = useMemo(() => {
    let data = [...pharmaceuticalData];

    if (searchQuery) {
      data = data.filter(item => 
        item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (currentTab !== 'All Items') {
      if (currentTab === 'Critical') {
        data = data.filter(item => item.inventory === 'Critical');
      } else if (currentTab === 'Surging') {
        data = data.filter(item => item.demand === 'Surging');
      } else if (currentTab === 'Expiry Risk') {
        data = data.filter(item => item.expiryRisk === 'High');
      }
    }

    return data;
  }, [searchQuery, currentTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[95%] max-w-7xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Supplier Forecast</h2>
            <p className="text-sm text-slate-500">Pharmaceutical Inventory Management</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 border-b border-slate-200 bg-white">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 sticky top-0">
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Demand</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Inventory</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Expiry Risk</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Supplier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">AI Confidence</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{item.product}</td>
                  <td className="px-4 py-3 text-slate-600">{item.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.demand)}`}>
                      {item.demand}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.inventory)}`}>
                      {item.inventory}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExpiryRiskColor(item.expiryRisk)}`}>
                      {item.expiryRisk}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.supplier}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-slate-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-600 rounded-full" 
                          style={{ width: item.aiConfidence }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-600">{item.aiConfidence}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <p className="text-sm text-slate-500">
            Showing {filteredData.length} items
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForecastModal;