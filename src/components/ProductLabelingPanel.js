import React, { useState } from 'react';
import { CheckCircle, XCircle, Edit2, AlertCircle } from 'lucide-react';

function ProductLabelingPanel({ rlProducts, onProductSelect }) {
  const [products, setProducts] = useState(rlProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleApprove = (id) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, status: 'approved', updatedAt: new Date().toLocaleString() } : p
      )
    );
  };

  const handleReject = (id) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, status: 'rejected', updatedAt: new Date().toLocaleString() } : p
      )
    );
  };

  const handleUpdate = (id) => {
    setSelectedProduct(products.find((p) => p.id === id));
  };

  const filteredProducts = products.filter((p) =>
    filterStatus === 'all' ? true : p.status === filterStatus
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 border-green-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'rejected':
        return <XCircle size={20} className="text-red-600" />;
      case 'pending':
        return <AlertCircle size={20} className="text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Labeling (RL)</h2>
        <p className="text-slate-600">
          Review and approve/reject products labeled by Reinforcement Learning system
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="text-sm text-slate-600 mb-1">Total Products</div>
          <div className="text-3xl font-bold text-slate-900">{products.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-4">
          <div className="text-sm text-yellow-700 mb-1">Pending Review</div>
          <div className="text-3xl font-bold text-yellow-600">
            {products.filter((p) => p.status === 'pending').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
          <div className="text-sm text-green-700 mb-1">Approved</div>
          <div className="text-3xl font-bold text-green-600">
            {products.filter((p) => p.status === 'approved').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
          <div className="text-sm text-red-700 mb-1">Rejected</div>
          <div className="text-3xl font-bold text-red-600">
            {products.filter((p) => p.status === 'rejected').length}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <div className="text-slate-400 text-lg">No products found</div>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`rounded-lg shadow-sm border p-6 transition-all hover:shadow-md ${getStatusColor(product.status)}`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(product.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                      <p className="text-sm text-slate-600">{product.category}</p>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 mb-4">
                    <div>
                      <div className="text-xs text-slate-600 mb-1">SKU</div>
                      <div className="font-semibold text-slate-900">{product.sku}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Confidence</div>
                      <div className="font-semibold text-slate-900">{product.confidence}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Suggested Label</div>
                      <div className="font-semibold text-slate-900">{product.suggestedLabel}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Status</div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(product.status)}`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <div className="text-xs text-slate-600 mb-1">RL Analysis</div>
                    <p className="text-sm text-slate-700">{product.description}</p>
                  </div>

                  {/* Metadata */}
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span>Created: {product.createdAt}</span>
                    <span>Updated: {product.updatedAt}</span>
                  </div>
                </div>

                {/* Actions */}
                {product.status === 'pending' && (
                  <div className="flex flex-col gap-2 min-w-max">
                    <button
                      onClick={() => handleApprove(product.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(product.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                    <button
                      onClick={() => handleUpdate(product.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                      <Edit2 size={16} />
                      Update
                    </button>
                  </div>
                )}

                {product.status !== 'pending' && (
                  <div className="flex flex-col gap-2 min-w-max">
                    <button
                      onClick={() => handleUpdate(product.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Update Product Label</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  defaultValue={selectedProduct.name}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Label
                </label>
                <input
                  type="text"
                  defaultValue={selectedProduct.suggestedLabel}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes
                </label>
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
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  // Handle update logic here
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductLabelingPanel;
