import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

const EnhancedKPITrendGraph = ({ trendData, goal, status, unit }) => {
    const [timePeriod, setTimePeriod] = useState('daily');

    // Comprehensive null checks
    if (!trendData) {
        return <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No trend data available</div>;
    }

    // Check if history exists and is an array
    if (!trendData.history || !Array.isArray(trendData.history) || trendData.history.length === 0) {
        return <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No historical data available</div>;
    }

    // Prepare chart data
    const historicalData = trendData.history.map((item, index) => ({
        date: item.date,
        value: item.value,
        index: index,
        type: 'historical'
    }));

    // Get forecast data with overlap (only if forecast exists)
    let forecastData = [];
    if (trendData.forecast && trendData.forecast.dates && trendData.forecast.values) {
        const forecastStartIndex = trendData.history.length - (trendData.forecast.overlapPoints || 3);
        forecastData = trendData.forecast.dates.map((date, index) => ({
            date: date,
            forecast: trendData.forecast.values[index],
            index: forecastStartIndex + index,
            type: 'forecast'
        }));
    }

    // Combine data for the chart
    const chartData = [];

    // Add all historical points
    historicalData.forEach(item => {
        chartData.push({
            date: item.date,
            value: item.value,
            index: item.index
        });
    });

    // Add forecast points (starting from overlap)
    forecastData.forEach((item, i) => {
        const existingIndex = chartData.findIndex(d => d.date === item.date);
        if (existingIndex >= 0) {
            // Overlap point - add forecast value
            chartData[existingIndex].forecast = item.forecast;
        } else {
            // Pure forecast point
            chartData.push({
                date: item.date,
                forecast: item.forecast,
                index: item.index
            });
        }
    });

    // Sort by index
    chartData.sort((a, b) => a.index - b.index);

    // Filter data based on time period
    const getFilteredData = () => {
        const totalPoints = chartData.length;
        switch (timePeriod) {
            case 'daily':
                // Show last 20 days
                return chartData.slice(Math.max(0, totalPoints - 20));
            case 'weekly':
                // Show every 7th point (roughly weekly)
                return chartData.filter((_, i) => i % 7 === 0 || i === totalPoints - 1);
            case 'monthly':
                // Show every 30th point (roughly monthly)
                return chartData.filter((_, i) => i % 30 === 0 || i === totalPoints - 1);
            default:
                return chartData;
        }
    };

    const filteredData = getFilteredData();

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">{new Date(data.date).toLocaleDateString()}</p>
                    {data.value !== undefined && (
                        <p className="text-sm font-semibold text-pink-600">
                            Current: {data.value.toFixed(1)}{unit}
                        </p>
                    )}
                    {data.forecast !== undefined && (
                        <p className="text-sm font-semibold text-orange-600">
                            Forecast: {data.forecast.toFixed(1)}{unit}
                        </p>
                    )}
                    {goal && (
                        <p className="text-xs text-blue-600 mt-1 font-semibold">
                            Goal: {goal.value}{goal.unit}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    // Format date for X-axis
    const formatXAxis = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    // Calculate Y-axis domain to ensure goal line is visible and trends are more curved
    const allValues = [
        ...filteredData.map(d => d.value).filter(v => v !== undefined),
        ...filteredData.map(d => d.forecast).filter(v => v !== undefined),
        goal?.value
    ].filter(v => v !== undefined && v !== null);

    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const range = maxValue - minValue;

    // Use much smaller padding (3-5% instead of 15%) to make curves more visible
    const padding = range > 0 ? range * 0.05 : 1;
    const yMin = Math.max(0, minValue - padding);
    const yMax = maxValue + padding;

    return (
        <div>
            {/* Time Period Selector */}
            <div className="flex items-center gap-2 mb-3">
                <button
                    onClick={() => setTimePeriod('daily')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${timePeriod === 'daily'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Daily
                </button>
                <button
                    onClick={() => setTimePeriod('weekly')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${timePeriod === 'weekly'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Weekly
                </button>
                <button
                    onClick={() => setTimePeriod('monthly')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${timePeriod === 'monthly'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Monthly
                </button>
            </div>

            {/* Chart */}
            <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={filteredData}
                        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />

                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: '#6b7280' }}
                            tickFormatter={formatXAxis}
                            stroke="#d1d5db"
                            tickLine={false}
                        />

                        <YAxis
                            tick={{ fontSize: 10, fill: '#6b7280' }}
                            stroke="#d1d5db"
                            tickLine={false}
                            domain={[yMin, yMax]}
                            tickCount={6}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        {/* Goal line */}
                        {goal && (
                            <ReferenceLine
                                y={goal.value}
                                stroke="#3b82f6"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                            />
                        )}

                        {/* Historical line - Pink/Red */}
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#ec4899"
                            strokeWidth={2.5}
                            dot={{ r: 3, fill: '#ec4899' }}
                            activeDot={{ r: 5 }}
                            connectNulls={false}
                        />

                        {/* Forecast line - Orange/Yellow */}
                        <Line
                            type="monotone"
                            dataKey="forecast"
                            stroke="#f59e0b"
                            strokeWidth={2.5}
                            strokeDasharray="5 5"
                            dot={{ r: 3, fill: '#f59e0b', strokeDasharray: '' }}
                            activeDot={{ r: 5 }}
                            connectNulls={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default EnhancedKPITrendGraph;
