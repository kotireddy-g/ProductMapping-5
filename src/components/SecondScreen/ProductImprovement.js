import React, { useState } from 'react';
import { CheckCircle, XCircle, Edit2, AlertCircle, Search, Filter } from 'lucide-react';

const improvementProducts = [
  { id: 1, name: 'Paracetamol 500mg', category: 'General', suggestedLabel: 'Over-Stocking', confidence: 0.92, status: 'pending', description: 'Excess inventory detected', updatedAt: null },
  { id: 2, name: 'Amoxicillin 250mg', category: 'Emergency', suggestedLabel: 'Under-Stocking', confidence: 0.88, status: 'pending', description: 'Below optimal levels', updatedAt: null },
  { id: 3, name: 'Insulin Glargine', category: 'Ward', suggestedLabel: 'Expiry Risk', confidence: 0.95, status: 'approved', description: 'Near expiry batch detected', updatedAt: '2025-12-01' },
  { id: 4, name: 'Metformin 850mg', category: 'General', suggestedLabel: 'High Velocity', confidence: 0.85, status: 'pending', description: 'Fast moving product', updatedAt: null },
  { id: 5, name: 'Ceftriaxone 1g', category: 'Emergency', suggestedLabel: 'Stockout Risk', confidence: 0.91, status: 'rejected', description: 'Critical low levels', updatedAt: '2025-11-30' },
  { id: 6, name: 'Omeprazole 20mg', category: 'Daycare', suggestedLabel: 'Cost Overrun', confidence: 0.78, status: 'pending', description: 'Budget exceeded', updatedAt: null },
  { id: 7, name: 'Atorvastatin 10mg', category: 'Ward', suggestedLabel: 'Slow Moving', confidence: 0.89, status: 'pending', description: 'Declining consumption', updatedAt: null },
  { id: 8, name: 'Adrenaline 1mg/ml', category: 'Emergency', suggestedLabel: 'Emergency Shortage', confidence: 0.97, status: 'approved', description: 'Critical shortage detected', updatedAt: '2025-12-02' }
];

const ProductImprovement = ({ selectedLabel }) => {
  const [products, setProducts] = useState(improvementProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleApprove = (id) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, status: 'approved', updatedAt: new Date().toLocaleString() } : p
    ));
  };

  const handleReject = (id) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, status: 'rejected', updatedAt: new Date().toLocaleString() } : p
    ));
  };

  const filteredProducts = products.filter(p => {
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.suggestedLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLabel = !selectedLabel || p.suggestedLabel.toLowerCase().includes(selectedLabel.name?.toLowerCase() || '');
    return matchesStatus && matchesSearch && matchesLabel;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-50 border-green-200';
      case 'rejected': return 'bg-red-50 border-red-200';
      case 'pending': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={20} className="text-green-600" />;
      case 'rejected': return <XCircle size={20} className="text-red-600" />;
      case 'pending': return <AlertCircle size={20} className="text-yellow-600" />;
      default: return null;
    }
  };

  const stats = {
    pending: products.filter(p => p.status === 'pending').length,
    approved: products.filter(p => p.status === 'approved').length,
    rejected: products.filter(p => p.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Improvement</h2>
        <p className="text-slate-600">
          Review and approve/reject AI-suggested product improvements and label recommendations
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
              <p className="text-sm text-yellow-600">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-800">{stats.approved}</p>
              <p className="text-sm text-green-600">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-800">{stats.rejected}</p>
              <p className="text-sm text-red-600">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products or labels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`p-4 rounded-lg border-2 transition-all ${getStatusColor(product.status)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {getStatusIcon(product.status)}
                <div>
                  <h3 className="font-semibold text-slate-900">{product.name}</h3>
                  <p className="text-sm text-slate-500">{product.category}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(product.status)}`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {product.suggestedLabel}
                    </span>
                    <span className="text-xs text-slate-500">
                      Confidence: {(product.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{product.description}</p>
                  {product.updatedAt && (
                    <p className="text-xs text-slate-400 mt-1">Updated: {product.updatedAt}</p>
                  )}
                </div>
              </div>
              
              {product.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(product.id)}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-1"
                  >
                    <CheckCircle size={14} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(product.id)}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-1"
                  >
                    <XCircle size={14} />
                    Reject
                  </button>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-1"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Update Product Label</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
                <input
                  type="text"
                  defaultValue={selectedProduct.name}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Suggested Label</label>
                <input
                  type="text"
                  defaultValue={selectedProduct.suggestedLabel}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  defaultValue={selectedProduct.description}
                  rows="4"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImprovement;