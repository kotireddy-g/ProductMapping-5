import React from 'react';
import { getWidgetLabel } from '../../config/dashboardTemplates';

const TemplatePreview = ({ layout }) => {
    // Get all rows in order
    const rows = Object.keys(layout).sort();

    return (
        <div className="space-y-2">
            {rows.map((rowKey, index) => {
                const widgets = layout[rowKey];
                return widgets.map(widget => (
                    <div
                        key={`${rowKey}-${widget}`}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
                    >
                        {/* Number Badge */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                            {index + 1}
                        </div>

                        {/* Component Label */}
                        <div className="flex-1">
                            <span className="text-sm font-semibold text-gray-800">
                                {getWidgetLabel(widget)}
                            </span>
                        </div>
                    </div>
                ));
            })}
        </div>
    );
};

export default TemplatePreview;
