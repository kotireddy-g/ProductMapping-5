import React, { useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import {
    ComposedChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ReferenceArea,
    ResponsiveContainer
} from 'recharts';
import {
    formatValueWithUnit,
    formatChartDate,
    calculateYAxisDomain,
    getStatusColors
} from '../../utils/numberFormatters';

/**
 * Enhanced KPI Card Component
 * Displays KPI with metrics, trend chart, and forecast data
 */
const EnhancedKPICard = ({ kpiKey, data, isPriority = false, onClick }) => {
    const [timePeriod, setTimePeriod] = useState('daily');

    // Prepare chart data combining historical and forecast
    // IMPORTANT: All hooks must be called before any conditional returns
    const chartData = useMemo(() => {
        if (!data || !data.trendData) return [];

        const historical = data.trendData.history || [];
        const forecast = data.trendData.forecast;

        // If no forecast, just return historical data
        if (!forecast || !forecast.dates || !forecast.values) {
            return historical.map(item => ({
                date: item.date,
                value: item.value,
                type: 'historical'
            }));
        }

        // Create a map of all dates to their data
        const dataMap = new Map();

        // Add all historical data
        historical.forEach(item => {
            dataMap.set(item.date, {
                date: item.date,
                value: item.value,
                type: 'historical'
            });
        });

        // Add forecast data - this will overlap with some historical dates
        forecast.dates.forEach((date, idx) => {
            const existing = dataMap.get(date);
            if (existing) {
                // This is an overlap point - add forecast value to existing entry
                existing.forecastValue = forecast.values[idx];
                existing.type = 'overlap';
            } else {
                // This is a pure forecast point
                dataMap.set(date, {
                    date: date,
                    forecastValue: forecast.values[idx],
                    type: 'forecast'
                });
            }
        });

        // Convert map to sorted array
        const sortedData = Array.from(dataMap.values()).sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

        // Fill gaps between historical and forecast data
        const filledData = [];
        for (let i = 0; i < sortedData.length; i++) {
            filledData.push(sortedData[i]);

            // Check if there's a gap to the next data point
            if (i < sortedData.length - 1) {
                const currentDate = new Date(sortedData[i].date);
                const nextDate = new Date(sortedData[i + 1].date);
                const daysDiff = Math.round((nextDate - currentDate) / (1000 * 60 * 60 * 24));

                // If there's a gap of more than 1 day, fill it
                if (daysDiff > 1) {
                    const currentHasValue = sortedData[i].value !== undefined;
                    const nextHasValue = sortedData[i + 1].value !== undefined;
                    const currentHasForecast = sortedData[i].forecastValue !== undefined;
                    const nextHasForecast = sortedData[i + 1].forecastValue !== undefined;

                    // Interpolate missing dates
                    for (let day = 1; day < daysDiff; day++) {
                        const interpolatedDate = new Date(currentDate);
                        interpolatedDate.setDate(interpolatedDate.getDate() + day);
                        const dateStr = interpolatedDate.toISOString().split('T')[0];

                        const ratio = day / daysDiff;
                        const interpolatedPoint = {
                            date: dateStr,
                            type: 'interpolated'
                        };

                        // Interpolate value if both points have value
                        if (currentHasValue && nextHasValue) {
                            interpolatedPoint.value =
                                sortedData[i].value + (sortedData[i + 1].value - sortedData[i].value) * ratio;
                        }

                        // Interpolate forecast if both points have forecast
                        if (currentHasForecast && nextHasForecast) {
                            interpolatedPoint.forecastValue =
                                sortedData[i].forecastValue + (sortedData[i + 1].forecastValue - sortedData[i].forecastValue) * ratio;
                        }

                        // If transitioning from value to forecast, interpolate both
                        if (currentHasValue && !nextHasValue && nextHasForecast) {
                            interpolatedPoint.value =
                                sortedData[i].value + (sortedData[i + 1].forecastValue - sortedData[i].value) * ratio;
                            interpolatedPoint.forecastValue = interpolatedPoint.value;
                        }

                        filledData.push(interpolatedPoint);
                    }
                }
            }
        }

        return filledData;
    }, [data]);

    // Calculate Y-axis domain
    const yAxisDomain = useMemo(() => {
        const allValues = chartData.flatMap(item =>
            [item.value, item.forecastValue].filter(v => v !== undefined)
        );
        if (allValues.length === 0) return [0, 100];

        return calculateYAxisDomain(allValues, 5);
    }, [chartData]);

    // NOW we can do early returns after all hooks are called
    if (!data) return null;

    const statusColors = getStatusColors(data.status);

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || payload.length === 0) return null;

        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                <p className="text-sm font-semibold text-gray-800 mb-2">
                    {formatChartDate(label)}
                </p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-600">{entry.name}:</span>
                        <span className="font-semibold text-gray-900">
                            {formatValueWithUnit(entry.value, data.unit)}
                        </span>
                    </div>
                ))}
                <div className="flex items-center gap-2 text-xs mt-1 pt-1 border-t border-gray-100">
                    <div className="w-3 h-0.5 bg-blue-500" style={{ borderTop: '2px dashed #3b82f6' }} />
                    <span className="text-gray-600">Goal:</span>
                    <span className="font-semibold text-gray-900">
                        {formatValueWithUnit(data.target, data.unit)}
                    </span>
                </div>
            </div>
        );
    };

    // Format Y-axis tick
    const formatYAxis = (value) => {
        return formatValueWithUnit(value, data.unit);
    };

    return (
        <div
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer p-6"
            onClick={onClick}
        >
            {/* Header: Status Indicator + Priority Star */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: statusColors.indicator }}
                    />
                    <span className={`text-sm font-semibold ${statusColors.textClass}`}>
                        {statusColors.text}
                    </span>
                </div>
                {isPriority && (
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                )}
            </div>

            {/* Title and Subtitle */}
            <div className="mb-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {data.title}
                </h3>
                <p className="text-sm text-gray-600">
                    {data.subtitle}
                </p>
            </div>

            {/* Metrics Section - 5 columns */}
            <div className="grid grid-cols-5 gap-3 bg-gray-50 rounded-lg p-4 mb-5">
                {/* Goal */}
                <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase mb-1">Goal</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {formatValueWithUnit(data.target, data.unit)}
                    </div>
                </div>

                {/* YTD (Current) */}
                <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase mb-1">YTD</div>
                    <div className={`text-2xl font-bold ${data.current >= data.target ? 'text-green-700' : 'text-red-700'
                        }`}>
                        {formatValueWithUnit(data.current, data.unit)}
                    </div>
                </div>

                {/* Baseline */}
                <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase mb-1">Baseline</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {data.trendData?.history?.[0]?.value
                            ? formatValueWithUnit(data.trendData.history[0].value, data.unit)
                            : '0'}
                    </div>
                </div>

                {/* L QTR */}
                <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase mb-1">L QTR</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {formatValueWithUnit(data.target, data.unit)}
                    </div>
                </div>

                {/* Current (QTD) */}
                <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase mb-1">Current</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {formatValueWithUnit(data.current, data.unit)}
                    </div>
                </div>
            </div>

            {/* Time Period Selector */}
            <div className="flex gap-2 mb-4">
                {['daily', 'monthly', 'yearly'].map((period) => (
                    <button
                        key={period}
                        onClick={(e) => {
                            e.stopPropagation();
                            setTimePeriod(period);
                        }}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timePeriod === period
                                ? 'bg-teal-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                ))}
            </div>

            {/* Area Chart */}
            <div className="mt-4">
                <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart
                        data={chartData}
                        margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
                    >
                        <defs>
                            {/* Historical area gradient */}
                            <linearGradient id={`historical-${kpiKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05} />
                            </linearGradient>
                            {/* Forecast area gradient */}
                            <linearGradient id={`forecast-${kpiKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                        {/* X-Axis */}
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatChartDate}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                            interval="preserveStartEnd"
                        />

                        {/* Y-Axis */}
                        <YAxis
                            domain={yAxisDomain}
                            tickFormatter={formatYAxis}
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                            width={60}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        {/* Background zones */}
                        <ReferenceArea
                            y1={yAxisDomain[0]}
                            y2={data.target}
                            fill="#fef2f2"
                            fillOpacity={0.3}
                        />
                        <ReferenceArea
                            y1={data.target}
                            y2={yAxisDomain[1]}
                            fill="#f0fdf4"
                            fillOpacity={0.3}
                        />

                        {/* Goal line */}
                        <ReferenceLine
                            y={data.target}
                            stroke="#3b82f6"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            label={{
                                value: `Goal: ${formatValueWithUnit(data.target, data.unit)}`,
                                position: 'right',
                                fill: '#3b82f6',
                                fontSize: 11,
                                fontWeight: 600
                            }}
                        />

                        {/* Historical data area */}
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#14b8a6"
                            strokeWidth={2}
                            fill={`url(#historical-${kpiKey})`}
                            dot={{ fill: '#14b8a6', r: 4 }}
                            name="Trend"
                            connectNulls
                        />

                        {/* Forecast data area */}
                        <Area
                            type="monotone"
                            dataKey="forecastValue"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fill={`url(#forecast-${kpiKey})`}
                            dot={{ fill: '#f59e0b', r: 4 }}
                            name="Forecast"
                            connectNulls
                        />
                    </ComposedChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-teal-500" />
                        <span className="text-xs text-gray-600">Trend</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span className="text-xs text-gray-600">Forecast</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-0.5 bg-blue-500" style={{ borderTop: '2px dashed #3b82f6' }} />
                        <span className="text-xs text-gray-600">Goal</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedKPICard;
