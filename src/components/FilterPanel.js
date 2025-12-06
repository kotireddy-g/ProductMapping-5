import React from 'react';
import { Filter } from 'lucide-react';
import { categories, locations } from '../data/mockData';

function FilterPanel({
  filterType,
  setFilterType,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
}) {
  const filterOptions = [
    { value: 'all-products', label: 'All Products' },
    { value: 'individual-product', label: 'Individual Product' },
    { value: 'category', label: 'Product Category' },
    { value: 'functions', label: 'Functions' },
    { value: 'restaurants', label: 'Restaurants' },
    { value: 'hotels', label: 'Hotels' },
    { value: 'areas', label: 'Areas' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter size={20} className="text-blue-600" />
        <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Filter Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            View Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Location/Area
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 flex flex-col justify-center">
          <div className="text-sm text-slate-600 mb-1">Active Products</div>
          <div className="text-3xl font-bold text-blue-600">247</div>
          <div className="text-xs text-slate-500 mt-2">Across all locations</div>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
