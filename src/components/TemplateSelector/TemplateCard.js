import React from 'react';
import TemplatePreview from './TemplatePreview';

const TemplateCard = ({ template, isActive, onApply }) => {
    return (
        <div
            className={`
        border-2 rounded-xl overflow-hidden transition-all
        hover:shadow-2xl hover:-translate-y-1 duration-200
        ${isActive ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
      `}
        >
            {/* Card Header */}
            <div className={`px-6 py-4 ${isActive ? 'bg-blue-100' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{template.icon}</span>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{template.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        </div>
                    </div>
                    {isActive && (
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                            ACTIVE
                        </span>
                    )}
                </div>
            </div>

            {/* Preview */}
            <div className="p-6 bg-white">
                <TemplatePreview layout={template.layout} />
            </div>

            {/* Action Button */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                    onClick={onApply}
                    disabled={isActive}
                    className={`
            w-full py-3 rounded-lg font-semibold transition-colors
            ${isActive
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }
          `}
                >
                    {isActive ? '✓ Currently Active' : 'Apply Template'}
                </button>
            </div>
        </div>
    );
};

export default TemplateCard;
