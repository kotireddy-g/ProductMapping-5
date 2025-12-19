import React from 'react';
import { getWidgetLabel } from '../../config/dashboardTemplates';

const TemplatePreview = ({ layout }) => {
    return (
        <div className="space-y-2">
            {Object.entries(layout).map(([rowKey, widgets]) => (
                <div key={rowKey} className="flex gap-2">
                    {widgets.map(widget => (
                        <div
                            key={widget}
                            className={`
                h-12 rounded bg-gradient-to-br from-blue-100 to-blue-200
                border border-blue-300 flex items-center justify-center
                ${widgets.length === 1 ? 'flex-1' : 'flex-1'}
              `}
                            style={{
                                flex: widgets.length === 1 ? '1' : `1 1 ${100 / widgets.length}%`
                            }}
                        >
                            <span className="text-xs font-semibold text-blue-700">
                                {getWidgetLabel(widget)}
                            </span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TemplatePreview;
