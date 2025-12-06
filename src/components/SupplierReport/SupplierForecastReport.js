import React, { useState } from 'react';
import { ArrowLeft, Filter, Download } from 'lucide-react';

const SupplierForecastReport = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('All Items');
  
  const tabs = ['All Items', 'Critical', 'Surging', 'Expiry Risk'];
  
  const supplierData = [
    {
      id: 1,
      product: 'Amoxicillin 250mg Tablet',
      tag: 'Fast-Moving',
      category: 'Antibiotic',
      demand: 'Surging',
      inventory: 'Critical',
      stock: '61 / 135',
      stockDetail: '55d to expiry',
      expiryRisk: 'High',
      supplier: 'Cipla',
      vendorName: 'Cipla Pharmaceuticals Ltd',
      aiConfidence: '87%',
      raisePR: false
    },
    {
      id: 2,
      product: 'Amoxicillin 500mg Tablet',
      tag: 'Fast-Moving',
      category: 'Antibiotic',
      demand: 'Surging',
      inventory: 'Critical',
      stock: '57 / 120',
      stockDetail: '70d to expiry',
      expiryRisk: 'High',
      supplier: 'Cipla',
      vendorName: 'Cipla Pharmaceuticals Ltd',
      aiConfidence: '89%',
      raisePR: false
    },
    {
      id: 3,
      product: 'Azithromycin 250mg Tablet',
      tag: 'Medium',
      category: 'Antibiotic',
      demand: 'Stable',
      inventory: 'Healthy',
      stock: '47 / 105',
      stockDetail: '90d to expiry',
      expiryRisk: 'Medium',
      supplier: 'Sun Pharma',
      vendorName: 'Sun Pharmaceutical Industries',
      aiConfidence: '94%',
      raisePR: false
    },
    {
      id: 4,
      product: 'Cephalexin 500mg Capsule',
      tag: 'Medium',
      category: 'Antibiotic',
      demand: 'Surging',
      inventory: 'Critical',
      stock: '54 / 130',
      stockDetail: '55d to expiry',
      expiryRisk: 'High',
      supplier: 'Lupin',
      vendorName: 'Lupin Pharmaceuticals Inc',
      aiConfidence: '84%',
      raisePR: false
    },
    {
      id: 5,
      product: 'Fluoroquinolone 250mg Tablet',
      tag: 'Medium',
      category: 'Antibiotic',
      demand: 'Stable',
      inventory: 'Healthy',
      stock: '44 / 100',
      stockDetail: '90d to expiry',
      expiryRisk: 'Medium',
      supplier: 'Cipla',
      vendorName: 'Cipla Pharmaceuticals Ltd',
      aiConfidence: '92%',
      raisePR: false
    },
    {
      id: 6,
      product: 'Metronidazole 400mg Tablet',
      tag: 'Slow',
      category: 'Antibiotic',
      demand: 'Surging',
      inventory: 'Critical',
      stock: '63 / 140',
      stockDetail: '45d to expiry',
      expiryRisk: 'Medium',
      supplier: 'Alkem',
      vendorName: 'Alkem Laboratories Ltd',
      aiConfidence: '83%',
      raisePR: false
    },
    {
      id: 7,
      product: 'Tetracycline 500mg Capsule',
      tag: 'Slow',
      category: 'Antibiotic',
      demand: 'Stable',
      inventory: 'Healthy',
      stock: '48 / 110',
      stockDetail: '55d to expiry',
      expiryRisk: 'Low',
      supplier: 'Sun Pharma',
      vendorName: 'Sun Pharmaceutical Industries',
      aiConfidence: '79%',
      raisePR: false
    },
    {
      id: 8,
      product: 'Chloramphenicol 250mg Capsule',
      tag: 'Slow',
      category: 'Antibiotic',
      demand: 'Stable',
      inventory: 'Healthy',
      stock: '33 / 75',
      stockDetail: '90d to expiry',
      expiryRisk: 'Low',
      supplier: 'Merck',
      vendorName: 'Merck & Co Inc',
      aiConfidence: '76%',
      raisePR: false
    },
    {
      id: 9,
      product: 'Doxycycline 100mg Capsule',
      tag: 'Fast-Moving',
      category: 'Antibiotic',
      demand: 'Surging',
      inventory: 'Critical',
      stock: '55 / 125',
      stockDetail: '40d to expiry',
      expiryRisk: 'Medium',
      supplier: 'GSK',
      vendorName: 'GlaxoSmithKline Plc',
      aiConfidence: '88%',
      raisePR: false
    },
    {
      id: 10,
      product: 'Clindamycin 300mg Capsule',
      tag: 'Occasional',
      category: 'Antibiotic',
      demand: 'Stable',
      inventory: 'Healthy',
      stock: '46 / 105',
      stockDetail: '70d to expiry',
      expiryRisk: 'Low',
      supplier: 'Abbott',
      vendorName: 'Abbott Laboratories',
      aiConfidence: '81%',
      raisePR: false
    },
    {
      id: 11,
      product: 'Amoxicillin-Clavulanic 625mg Tablet',
      tag: 'Fast-Moving',
      category: 'Antibiotic',
      demand: 'Surging',
      inventory: 'Critical',
      stock: '60 / 135',
      stockDetail: '50d to expiry',
      expiryRisk: 'High',
      supplier: 'GSK',
      vendorName: 'GlaxoSmithKline Plc',
      aiConfidence: '90%',
      raisePR: false
    }
  ];

  const getTagColor = (tag) => {
    switch (tag) {
      case 'Fast-Moving': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Slow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Occasional': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'Surging': return 'bg-green-100 text-green-800';
      case 'Stable': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInventoryColor = (inventory) => {
    switch (inventory) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Healthy': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExpiryRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredData = supplierData.filter(item => {
    if (activeTab === 'All Items') return true;
    if (activeTab === 'Critical') return item.inventory === 'Critical';
    if (activeTab === 'Surging') return item.demand === 'Surging';
    if (activeTab === 'Expiry Risk') return item.expiryRisk === 'High';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Supplier Forecast Report</h1>
              <p className="text-sm text-gray-500">Comprehensive supplier and inventory analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tag
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Demand
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inventory
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Risk
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Confidence
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Raise PR
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.product}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTagColor(item.tag)}`}>
                        {item.tag}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{item.category}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDemandColor(item.demand)}`}>
                        {item.demand}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInventoryColor(item.inventory)}`}>
                        {item.inventory}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{item.stock}</div>
                      <div className="text-xs text-gray-500">{item.stockDetail}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExpiryRiskColor(item.expiryRisk)}`}>
                        {item.expiryRisk}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{item.supplier}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{item.vendorName}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900 mr-2">{item.aiConfidence}</div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: item.aiConfidence }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button 
                        disabled
                        className="px-3 py-1 bg-gray-100 text-gray-400 rounded text-xs font-medium cursor-not-allowed"
                      >
                        Disabled
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierForecastReport;
