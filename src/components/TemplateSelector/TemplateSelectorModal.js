import React, { useState } from 'react';
import { X, Layout } from 'lucide-react';
import { DASHBOARD_TEMPLATES } from '../../config/dashboardTemplates';
import TemplateCard from './TemplateCard';

const TemplateSelectorModal = ({ isOpen, onClose, currentTemplate, onTemplateChange }) => {
    if (!isOpen) return null;

    const handleApply = (templateId) => {
        onTemplateChange(templateId);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <Layout size={32} />
                                Choose Your Dashboard Layout
                            </h2>
                            <p className="text-blue-100 mt-2">
                                Select a template that best fits your workflow and preferences
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
                        >
                            <X size={28} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Template Grid */}
                <div className="p-8 overflow-y-auto flex-1">
                    <div className="grid grid-cols-2 gap-6">
                        {Object.values(DASHBOARD_TEMPLATES).map(template => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                isActive={currentTemplate === template.id}
                                onApply={() => handleApply(template.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateSelectorModal;
