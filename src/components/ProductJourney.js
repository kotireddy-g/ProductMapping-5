import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PerformanceMetrics from './PerformanceMetrics';
import BouncingBubbles from './BouncingBubbles';
import { mockProductData } from '../data/mockData';

function ProductJourney({
  filterType,
  selectedCategory,
  selectedLocation,
  searchQuery,
  onProductClick,
}) {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  // Filter products based on selected filters
  const filteredProducts = mockProductData.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesLocation =
      selectedLocation === 'all' || product.location === selectedLocation;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesLocation && matchesSearch;
  });

  const currentProduct = filteredProducts[currentProductIndex];

  const handleNext = () => {
    if (currentProductIndex < filteredProducts.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentProductIndex > 0) {
      setCurrentProductIndex(currentProductIndex - 1);
    }
  };

  if (filteredProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
        <div className="text-slate-400 text-lg">No products found matching your filters</div>
      </div>
    );
  }

  const timeHeaders = ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  return (
    <div className="space-y-8">
      {/* Product Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{currentProduct.name}</h2>
            <p className="text-sm text-slate-600 mt-1">
              {currentProduct.category} • {currentProduct.location}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={currentProductIndex === 0}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentProductIndex + 1}
              </div>
              <div className="text-xs text-slate-500">of {filteredProducts.length}</div>
            </div>
            <button
              onClick={handleNext}
              disabled={currentProductIndex === filteredProducts.length - 1}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-xs text-slate-600 mb-1">SKU</div>
            <div className="font-semibold text-slate-900">{currentProduct.sku}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-xs text-slate-600 mb-1">Unit</div>
            <div className="font-semibold text-slate-900">{currentProduct.unit}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-xs text-slate-600 mb-1">Status</div>
            <div className="font-semibold">
              <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-xs text-slate-600 mb-1">Last Updated</div>
            <div className="font-semibold text-slate-900 text-sm">2 hours ago</div>
          </div>
        </div>

        {/* Time Headers with Performance Metrics */}
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {timeHeaders.map((header) => (
              <div key={header} className="flex-shrink-0 w-40">
                <div className="bg-blue-50 rounded-t-lg p-3 border-b border-blue-200">
                  <h3 className="font-semibold text-slate-900 text-sm">{header}</h3>
                </div>
                <PerformanceMetrics
                  timeframe={header}
                  product={currentProduct}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bouncing Bubbles Visualization */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Performance Status - {currentProduct.name}
        </h3>
        <BouncingBubbles
          product={currentProduct}
          onBubbleClick={() => onProductClick(currentProduct)}
        />
      </div>

      {/* Click Hint */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-sm text-blue-900">
          💡 Click on any bubble or product to view detailed trend analysis and performance metrics
        </p>
      </div>
    </div>
  );
}

export default ProductJourney;
