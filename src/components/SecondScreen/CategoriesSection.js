import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

const categoriesData = [
  { id: 1, name: 'Emergency Medicines', allocated: 1500, actual: 1850, department: 'Emergency Ward' },
  { id: 2, name: 'OT Medicines', allocated: 1200, actual: 1100, department: 'Operation Theater' },
  { id: 3, name: 'Ward Medicines', allocated: 2000, actual: 2200, department: 'General Ward' },
  { id: 4, name: 'Daycare Medicines', allocated: 800, actual: 750, department: 'Daycare Unit' },
  { id: 5, name: 'General Medicines', allocated: 3000, actual: 3450, department: 'Pharmacy Store' },
  { id: 6, name: 'Implant Medicines', allocated: 400, actual: 380, department: 'Surgical Wing' },
  { id: 7, name: 'ICU Medicines', allocated: 600, actual: 720, department: 'ICU' },
  { id: 8, name: 'Pediatric Medicines', allocated: 500, actual: 480, department: 'Pediatric Unit' }
];

const functionsData = [
  { id: 1, name: 'ICU', allocated: 800, actual: 920, category: 'Critical Care' },
  { id: 2, name: 'Emergency Ward', allocated: 1200, actual: 1450, category: 'Emergency' },
  { id: 3, name: 'Operation Theater', allocated: 1500, actual: 1380, category: 'Surgical' },
  { id: 4, name: 'General Ward', allocated: 2000, actual: 2150, category: 'Inpatient' },
  { id: 5, name: 'Outpatient Pharmacy', allocated: 1800, actual: 1750, category: 'Outpatient' },
  { id: 6, name: 'Research Lab', allocated: 300, actual: 340, category: 'Research' },
  { id: 7, name: 'Daycare Unit', allocated: 600, actual: 580, category: 'Daycare' },
  { id: 8, name: 'Pediatric Unit', allocated: 450, actual: 520, category: 'Pediatric' }
];

const DataTable = ({ title, data, type }) => {
  const [sortField, setSortField] = useState('variance');
  const [sortDirection, setSortDirection] = useState('desc');

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVariance = a.actual - a.allocated;
      const bVariance = b.actual - b.allocated;
      
      if (sortField === 'variance') {
        return sortDirection === 'desc' 
          ? Math.abs(bVariance) - Math.abs(aVariance)
          : Math.abs(aVariance) - Math.abs(bVariance);
      }
      if (sortField === 'quantity') {
        return sortDirection === 'desc' ? b.actual - a.actual : a.actual - b.actual;
      }
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getVarianceColor = (allocated, actual) => {
    const variance = actual - allocated;
    const percentage = (variance / allocated) * 100;
    
    if (Math.abs(percentage) < 5) return 'text-green-600 bg-green-100';
    if (variance > 0) return 'text-red-600 bg-red-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getProgressWidth = (allocated, actual) => {
    const max = Math.max(allocated, actual);
    return {
      allocated: (allocated / max) * 100,
      actual: (actual / max) * 100
    };
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => toggleSort('variance')}
            className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
              sortField === 'variance' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Variance
            {sortField === 'variance' && (sortDirection === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
          </button>
          <button
            onClick={() => toggleSort('quantity')}
            className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
              sortField === 'quantity' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Quantity
            {sortField === 'quantity' && (sortDirection === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-slate-100">
        {sortedData.map((item, index) => {
          const variance = item.actual - item.allocated;
          const progress = getProgressWidth(item.allocated, item.actual);
          
          return (
            <div 
              key={item.id} 
              className={`px-4 py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-slate-800 text-sm">{item.name}</span>
                  <span className="text-xs text-slate-400 ml-2">
                    {type === 'categories' ? item.department : item.category}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getVarianceColor(item.allocated, item.actual)}`}>
                  {variance > 0 ? '+' : ''}{variance.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-500">Allocated: {item.allocated.toLocaleString()}</span>
                    <span className="text-slate-500">Actual: {item.actual.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute h-full bg-slate-300 rounded-full"
                      style={{ width: `${progress.allocated}%` }}
                    />
                    <div 
                      className={`absolute h-full rounded-full ${
                        variance > 0 ? 'bg-red-400' : variance < 0 ? 'bg-yellow-400' : 'bg-green-400'
                      }`}
                      style={{ width: `${progress.actual}%`, opacity: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CategoriesSection = ({ selectedLabel }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <DataTable 
        title="Affected Categories" 
        data={categoriesData} 
        type="categories"
      />
      <DataTable 
        title="Affected Functions" 
        data={functionsData} 
        type="functions"
      />
    </div>
  );
};

export default CategoriesSection;