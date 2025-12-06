import React, { useState, useMemo } from 'react';
import { Clock, Info, X } from 'lucide-react';
import TopStats from './Overview/TopStats';
import PharmaChordDiagram from './Overview/PharmaChodDiagram';
import ConsumptionStats from './Overview/ConsumptionStats';
import KPISection from './Overview/KPISection';
import { generateKPIData, generateBottomStats, generateKPIGraphData } from '../data/pharmaChordData';

const OverviewTab = ({ searchQuery }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily');
  const [showGuide, setShowGuide] = useState(false);

  const kpiData = useMemo(() => generateKPIData(selectedTimeframe), [selectedTimeframe]);
  const bottomStats = useMemo(() => generateBottomStats(selectedTimeframe), [selectedTimeframe]);
  const kpiGraphData = useMemo(() => generateKPIGraphData(selectedTimeframe), [selectedTimeframe]);

  const InteractiveGuide = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showGuide ? '' : 'hidden'}`}>
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl max-h-[85vh] overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Understanding the Flow Chart</h2>
            <button
              onClick={() => setShowGuide(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">How to Read the Chart</h3>
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <p><strong>Left Side:</strong> Medicine categories (Emergency, OT, Ward, Daycare, General, Implant)</p>
                <p><strong>Right Side:</strong> Destinations (Areas, Specialities, or Wards based on filter)</p>
                <p><strong>Ribbons:</strong> Show the flow/connection between medicine categories and destinations</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Color Coding (Medicine Categories)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#ef4444'}}></div>
                    <span className="font-semibold">Emergency Medicines</span>
                  </div>
                  <p className="text-sm text-slate-600">Critical medications for emergencies</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#8b5cf6'}}></div>
                    <span className="font-semibold">OT Medicines</span>
                  </div>
                  <p className="text-sm text-slate-600">Surgical and operation theater supplies</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#3b82f6'}}></div>
                    <span className="font-semibold">Ward Medicines</span>
                  </div>
                  <p className="text-sm text-slate-600">Regular ward medications</p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded" style={{backgroundColor: '#06b6d4'}}></div>
                    <span className="font-semibold">Daycare Medicines</span>
                  </div>
                  <p className="text-sm text-slate-600">Outpatient and daycare treatments</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Ribbon Width (Consumption Level)</h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-4 bg-slate-400 rounded"></div>
                  <span className="font-medium">Over Consumption</span>
                  <span className="text-sm text-slate-500">Higher than expected usage</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-2 bg-slate-400 rounded"></div>
                  <span className="font-medium">Normal</span>
                  <span className="text-sm text-slate-500">Within expected range</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-1 bg-slate-400 rounded"></div>
                  <span className="font-medium">Under Consumption</span>
                  <span className="text-sm text-slate-500">Below expected usage</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Interactive Features</h3>
              <div className="bg-green-50 rounded-lg p-4 space-y-2">
                <p><strong>Filter dropdown:</strong> Switch between Areas, Specialities, or Wards</p>
                <p><strong>Hover over ribbons:</strong> See detailed flow information</p>
                <p><strong>Hover over categories:</strong> Highlight all connections for that category</p>
                <p><strong>Timeframe selector:</strong> View data for different time periods</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowGuide(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <TopStats kpiData={kpiData} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">Product Flow Analysis</h2>
          <button
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
          >
            <Info className="w-4 h-4" />
            How to use
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <PharmaChordDiagram timeframe={selectedTimeframe} />

      <ConsumptionStats stats={bottomStats} />

      <KPISection kpiGraphData={kpiGraphData} />

      <InteractiveGuide />
    </div>
  );
};

export default OverviewTab;
