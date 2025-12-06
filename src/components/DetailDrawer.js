import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
  Line,
} from 'recharts';

function DetailDrawer({ product, onClose }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily');

  // Generate trend data
  const generateTrendData = () => {
    const data = [];
    const baseValue = product.consumption || 100;

    for (let i = 0; i < 24; i++) {
      const variance = (Math.random() - 0.5) * 40;
      const expected = baseValue + (Math.sin(i / 24 * Math.PI * 2) * 20);
      const actual = expected + variance;

      data.push({
        time: `${i}:00`,
        expected: Math.round(expected),
        actual: Math.round(actual),
        deviation: Math.round(actual - expected),
      });
    }

    return data;
  };

  const trendData = generateTrendData();

  // Calculate statistics
  const avgConsumption = Math.round(
    trendData.reduce((sum, d) => sum + d.actual, 0) / trendData.length
  );
  const maxConsumption = Math.max(...trendData.map((d) => d.actual));
  const minConsumption = Math.min(...trendData.map((d) => d.actual));
  const overConsumptionCount = trendData.filter((d) => d.actual > d.expected * 1.2).length;
  const underConsumptionCount = trendData.filter((d) => d.actual < d.expected * 0.8).length;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black bg-opacity-50 cursor-pointer"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between border-b border-blue-800">
          <div>
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-blue-100 text-sm mt-1">
              {product.category} • {product.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Key Metrics */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="text-xs text-slate-600 mb-1">Average Consumption</div>
                <div className="text-2xl font-bold text-blue-600">{avgConsumption}</div>
                <div className="text-xs text-slate-500 mt-2">{product.unit}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="text-xs text-slate-600 mb-1">Max Consumption</div>
                <div className="text-2xl font-bold text-green-600">{maxConsumption}</div>
                <div className="text-xs text-slate-500 mt-2">{product.unit}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                <div className="text-xs text-slate-600 mb-1">Min Consumption</div>
                <div className="text-2xl font-bold text-yellow-600">{minConsumption}</div>
                <div className="text-xs text-slate-500 mt-2">{product.unit}</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                <div className="text-xs text-slate-600 mb-1">Anomalies</div>
                <div className="text-2xl font-bold text-red-600">{overConsumptionCount}</div>
                <div className="text-xs text-slate-500 mt-2">Over consumed</div>
              </div>
            </div>
          </div>

          {/* Consumption Status */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Consumption Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-600" />
                  <span className="text-sm font-medium text-slate-900">Over Consumed</span>
                </div>
                <span className="text-lg font-bold text-red-600">{overConsumptionCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <TrendingDown size={18} className="text-yellow-600" />
                  <span className="text-sm font-medium text-slate-900">Under Consumed</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{underConsumptionCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-600" />
                  <span className="text-sm font-medium text-slate-900">Normal</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {24 - overConsumptionCount - underConsumptionCount}
                </span>
              </div>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Trend Analysis</h3>
            <div className="flex gap-2 mb-4 flex-wrap">
              {['hourly', 'daily', 'weekly', 'monthly'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedTimeframe === tf
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tf.charAt(0).toUpperCase() + tf.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Expected vs Actual Consumption</h4>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="expected"
                  fill="#dbeafe"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Expected"
                  isAnimationActive={true}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Actual"
                  dot={{ fill: '#ef4444', r: 3 }}
                  isAnimationActive={true}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Deviation Chart */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Deviation from Expected</h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="deviation"
                  fill="#fca5a5"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name="Deviation"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Product Details */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">SKU</span>
                <span className="font-semibold text-slate-900">{product.sku}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Category</span>
                <span className="font-semibold text-slate-900">{product.category}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Location</span>
                <span className="font-semibold text-slate-900">{product.location}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Unit</span>
                <span className="font-semibold text-slate-900">{product.unit}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Status</span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailDrawer;
