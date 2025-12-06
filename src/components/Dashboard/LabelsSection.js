import React, { useState } from 'react';
import { Tag, TrendingUp, FileCheck, AlertTriangle, Stethoscope, Thermometer, DollarSign, RefreshCw, ChevronRight } from 'lucide-react';
import KPICard from './KPICard';
import { coreLabels, labelKPIs } from '../../data/unifiedPharmaData';

const iconMap = {
  TrendingUp,
  FileCheck,
  AlertTriangle,
  Stethoscope,
  Thermometer,
  DollarSign,
  RefreshCw
};

const LabelsSection = ({ onNavigateToRCA }) => {
  const [selectedCoreLabel, setSelectedCoreLabel] = useState(coreLabels[0]);
  const [selectedSubLabel, setSelectedSubLabel] = useState(coreLabels[0]?.subLabels[0] || null);

  const handleCoreLabelClick = (label) => {
    setSelectedCoreLabel(label);
    setSelectedSubLabel(label.subLabels[0] || null);
  };

  const handleSubLabelClick = (subLabel) => {
    setSelectedSubLabel(subLabel);
    if (onNavigateToRCA) {
      onNavigateToRCA({ 
        type: 'label', 
        coreLabel: selectedCoreLabel,
        subLabel: subLabel 
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <h3 className="text-slate-800 font-semibold mb-4">7 Core Labels</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {coreLabels.map((label) => {
            const IconComponent = iconMap[label.icon] || Tag;
            const isSelected = selectedCoreLabel?.id === label.id;
            
            return (
              <div
                key={label.id}
                onClick={() => handleCoreLabelClick(label)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: label.color + '20' }}
                  >
                    <IconComponent className="w-4 h-4" style={{ color: label.color }} />
                  </div>
                </div>
                <p className="text-slate-800 text-sm font-medium leading-tight mb-2">
                  {label.name.split(' / ').map((part, i) => (
                    <span key={i}>
                      {part}
                      {i === 0 && label.name.includes('/') && <span className="text-slate-400"> / </span>}
                    </span>
                  ))}
                </p>
                <div className="flex items-center justify-between">
                  <span 
                    className="text-lg font-bold"
                    style={{ color: label.color }}
                  >
                    {label.count}
                  </span>
                  <span className="text-slate-500 text-xs">products</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCoreLabel && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedCoreLabel.color }}
              />
              <h3 className="text-slate-800 font-semibold">{selectedCoreLabel.name}</h3>
            </div>
            <span className="text-slate-500 text-sm">{selectedCoreLabel.subLabels.length} sub-labels</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {selectedCoreLabel.subLabels.map((subLabel) => {
              const isSelected = selectedSubLabel?.id === subLabel.id;
              
              return (
                <div
                  key={subLabel.id}
                  onClick={() => handleSubLabelClick(subLabel)}
                  className={`p-4 rounded-lg cursor-pointer transition-all border ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="text-2xl font-bold"
                      style={{ color: selectedCoreLabel.color }}
                    >
                      {subLabel.count}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-slate-800 text-xs font-medium mb-1">{subLabel.name}</p>
                  <p className="text-slate-500 text-xs truncate">{subLabel.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {labelKPIs.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>
    </div>
  );
};

export default LabelsSection;
