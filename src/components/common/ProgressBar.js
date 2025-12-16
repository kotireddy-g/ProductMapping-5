import React from 'react';

const ProgressBar = ({ value, label, count, color = 'blue', showPercentage = true, description }) => {
    const getColorClasses = () => {
        switch (color) {
            case 'green':
                return {
                    bg: 'bg-green-500',
                    lightBg: 'bg-green-100',
                    text: 'text-green-700'
                };
            case 'blue':
                return {
                    bg: 'bg-blue-500',
                    lightBg: 'bg-blue-100',
                    text: 'text-blue-700'
                };
            case 'purple':
                return {
                    bg: 'bg-purple-500',
                    lightBg: 'bg-purple-100',
                    text: 'text-purple-700'
                };
            case 'amber':
                return {
                    bg: 'bg-amber-500',
                    lightBg: 'bg-amber-100',
                    text: 'text-amber-700'
                };
            case 'red':
                return {
                    bg: 'bg-red-500',
                    lightBg: 'bg-red-100',
                    text: 'text-red-700'
                };
            default:
                return {
                    bg: 'bg-blue-500',
                    lightBg: 'bg-blue-100',
                    text: 'text-blue-700'
                };
        }
    };

    const colors = getColorClasses();

    return (
        <div className="w-full">
            {label && (
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">{label}</span>
                    {showPercentage && (
                        <span className={`text-sm font-bold ${colors.text}`}>
                            {value.toFixed(1)}%
                        </span>
                    )}
                </div>
            )}

            {count && (
                <div className="text-xs text-slate-600 mb-2">
                    {count.toLocaleString()} orders
                </div>
            )}

            <div className={`w-full h-2 ${colors.lightBg} rounded-full overflow-hidden`}>
                <div
                    className={`h-full ${colors.bg} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${Math.min(value, 100)}%` }}
                />
            </div>

            {description && (
                <div className="text-xs text-slate-500 mt-1 italic">
                    {description}
                </div>
            )}
        </div>
    );
};

export default ProgressBar;
