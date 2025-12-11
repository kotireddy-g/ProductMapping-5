import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const ForecastInternalDetailsScreen = ({ forecastData, onBack }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('Today');
    const [selectedCategory, setSelectedCategory] = useState('ICU 24/7');
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [whatIfScenario, setWhatIfScenario] = useState('do-nothing');

    const periods = ['Today', 'Next 7 Days', 'Next 14 Days', 'Next 21 Days', 'Next 30 Days'];
    const categories = ['ICU 24/7', 'OT', 'Emergency', 'General Ward', 'Pharmacy'];

    // Internal departments based on selected category
    const getInternalDepartments = () => {
        if (selectedCategory === 'ICU 24/7') {
            return [
                { id: 1, name: 'NICU', demand: 450, stockAvailable: 1200, forecast: 520, additional: 70, status: 'critical' },
                { id: 2, name: 'ICCU', demand: 380, stockAvailable: 950, forecast: 420, additional: 40, status: 'warning' },
                { id: 3, name: 'MICU', demand: 320, stockAvailable: 800, forecast: 350, additional: 30, status: 'normal' },
                { id: 4, name: 'SICU', demand: 290, stockAvailable: 720, forecast: 310, additional: 20, status: 'normal' },
                { id: 5, name: 'PICU', demand: 210, stockAvailable: 550, forecast: 240, additional: 30, status: 'warning' }
            ];
        }
        return [
            { id: 1, name: `${selectedCategory} - Unit 1`, demand: 300, stockAvailable: 800, forecast: 350, additional: 50, status: 'normal' },
            { id: 2, name: `${selectedCategory} - Unit 2`, demand: 250, stockAvailable: 650, forecast: 280, additional: 30, status: 'normal' }
        ];
    };

    const medicines = [
        'Paracetamol 500mg',
        'Propofol 200mg',
        'Insulin Glargine 100IU',
        'Morphine Sulfate 10mg',
        'Epinephrine 1mg'
    ];

    // Calculate What-If results
    const getWhatIfResults = () => {
        if (!selectedMedicine) return null;

        const scenarios = {
            'do-nothing': {
                otif: { value: 75, change: -12, direction: 'down' },
                cost: { value: 0, label: 'No Additional Cost' },
                revenue: { value: -100000, label: 'Loss' },
                patientSatisfaction: { value: -30, direction: 'down' }
            },
            'order-additional': {
                otif: { value: 92, change: +5, direction: 'up' },
                cost: { value: 300000, label: 'Extra' },
                revenue: { value: 450000, label: 'Gain' },
                patientSatisfaction: { value: +15, direction: 'up' }
            },
            'wait-7-days': {
                otif: { value: 80, change: -7, direction: 'down' },
                cost: { value: 50000, label: 'Minimal' },
                revenue: { value: -50000, label: 'Loss' },
                patientSatisfaction: { value: -15, direction: 'down' }
            }
        };

        return scenarios[whatIfScenario];
    };

    const recommendations = [
        {
            id: 1,
            title: 'Best (Agent Suggested)',
            badge: 'RECOMMENDED',
            action: 'Order now with Supplier',
            details: 'Immediate order for 30% excess to ensure safety stock',
            impact: {
                otif: '+12%',
                cost: 'RM 250,000',
                timeline: '2-3 days delivery'
            },
            color: 'bg-green-50 border-green-500'
        },
        {
            id: 2,
            title: 'Option 2',
            badge: 'ALTERNATIVE',
            action: 'Redistribute from General Ward',
            details: 'Transfer excess stock from low-priority departments',
            impact: {
                otif: '+8%',
                cost: 'RM 5,000 (transfer cost)',
                timeline: 'Immediate'
            },
            color: 'bg-blue-50 border-blue-500'
        },
        {
            id: 3,
            title: 'Option 3',
            badge: 'COST-EFFECTIVE',
            action: 'Partial order + Wait',
            details: 'Order 50% now, monitor for 7 days before next order',
            impact: {
                otif: '+5%',
                cost: 'RM 125,000',
                timeline: '7-10 days'
            },
            color: 'bg-yellow-50 border-yellow-500'
        },
        {
            id: 4,
            title: 'Option 4',
            badge: 'RISK ASSESSMENT',
            action: 'Monitor closely',
            details: 'Daily monitoring with emergency order protocol ready',
            impact: {
                otif: '+2%',
                cost: 'RM 0 (monitoring only)',
                timeline: 'Ongoing'
            },
            color: 'bg-orange-50 border-orange-500'
        }
    ];

    const results = getWhatIfResults();
    const departments = getInternalDepartments();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-[1600px] mx-auto px-6 py-6">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-4 transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold">Back to Dashboard</span>
                    </button>

                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-4xl font-bold text-slate-800">
                            Forecast Internal Details
                        </h1>

                        {/* Periodic Filters - Moved to Right */}
                        <div className="flex items-center gap-3">
                            {periods.map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${selectedPeriod === period
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-500'
                                        }`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Filter Buttons */}
                    <div className="flex items-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${selectedCategory === category
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                                    : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-purple-500'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
                {/* Internal Department Table */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800">
                            {selectedCategory} - Internal Departments
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b-2 border-slate-300">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Internal Department
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Demand
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Stock Available
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Forecast
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Additional
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {departments.map((dept, index) => (
                                    <tr key={dept.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${dept.status === 'critical' ? 'bg-red-500' :
                                                    dept.status === 'warning' ? 'bg-yellow-500' :
                                                        'bg-green-500'
                                                    }`}></div>
                                                <span className="font-bold text-slate-900">{dept.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-blue-700 text-lg">{dept.demand}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-purple-700 text-lg">{dept.stockAvailable}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-bold text-green-700 text-lg">{dept.forecast}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`font-bold text-lg ${dept.additional > 50 ? 'text-red-600' : dept.additional > 30 ? 'text-orange-600' : 'text-green-600'}`}>
                                                +{dept.additional}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                                                    Order
                                                </button>
                                                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">
                                                    Redistribute
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* What-If Analysis Section */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-amber-100 to-amber-50 border-b border-amber-200">
                        <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
                            <AlertCircle size={28} />
                            WHAT-IF Analysis
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Medicine Selection */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Select Medicine:
                            </label>
                            <select
                                value={selectedMedicine}
                                onChange={(e) => setSelectedMedicine(e.target.value)}
                                className="w-full md:w-96 px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">-- Select a medicine --</option>
                                {medicines.map((medicine) => (
                                    <option key={medicine} value={medicine}>{medicine}</option>
                                ))}
                            </select>
                        </div>

                        {/* Scenario Checkboxes */}
                        {selectedMedicine && (
                            <>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                        <input
                                            type="radio"
                                            name="scenario"
                                            value="do-nothing"
                                            checked={whatIfScenario === 'do-nothing'}
                                            onChange={(e) => setWhatIfScenario(e.target.value)}
                                            className="w-5 h-5 text-blue-600"
                                        />
                                        <span className="font-semibold text-slate-800">Do Nothing</span>
                                    </label>

                                    <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                        <input
                                            type="radio"
                                            name="scenario"
                                            value="order-additional"
                                            checked={whatIfScenario === 'order-additional'}
                                            onChange={(e) => setWhatIfScenario(e.target.value)}
                                            className="w-5 h-5 text-blue-600"
                                        />
                                        <span className="font-semibold text-slate-800">Order Additional</span>
                                    </label>

                                    <label className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                        <input
                                            type="radio"
                                            name="scenario"
                                            value="wait-7-days"
                                            checked={whatIfScenario === 'wait-7-days'}
                                            onChange={(e) => setWhatIfScenario(e.target.value)}
                                            className="w-5 h-5 text-blue-600"
                                        />
                                        <span className="font-semibold text-slate-800">Wait 7 Days</span>
                                    </label>
                                </div>

                                {/* Results */}
                                {results && (
                                    <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                                        <h3 className="text-lg font-bold text-slate-800 mb-4">Results:</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* OTIF */}
                                            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                                <div className="text-xs text-slate-600 mb-1">OTIF</div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-bold text-slate-900">{results.otif.value}%</span>
                                                    <div className={`flex items-center gap-1 ${results.otif.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {results.otif.direction === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                                        <span className="font-semibold">{results.otif.change > 0 ? '+' : ''}{results.otif.change}%</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Cost */}
                                            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                                <div className="text-xs text-slate-600 mb-1">Cost</div>
                                                <div className="text-xl font-bold text-orange-700">
                                                    {results.cost.value > 0 ? `RM ${results.cost.value.toLocaleString()}` : 'RM 0'}
                                                </div>
                                                <div className="text-xs text-slate-600 mt-1">{results.cost.label}</div>
                                            </div>

                                            {/* Revenue */}
                                            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                                <div className="text-xs text-slate-600 mb-1">Revenue</div>
                                                <div className={`text-xl font-bold ${results.revenue.value >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                    {results.revenue.value >= 0 ? '+' : ''}RM {Math.abs(results.revenue.value).toLocaleString()}
                                                </div>
                                                <div className="text-xs text-slate-600 mt-1">{results.revenue.label}</div>
                                            </div>

                                            {/* Patient Satisfaction */}
                                            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                                <div className="text-xs text-slate-600 mb-1">Patient Satisfaction</div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-2xl font-bold ${results.patientSatisfaction.direction === 'up' ? 'text-green-700' : 'text-red-700'}`}>
                                                        {results.patientSatisfaction.value > 0 ? '+' : ''}{results.patientSatisfaction.value}%
                                                    </span>
                                                    {results.patientSatisfaction.direction === 'up' ? <TrendingUp size={20} className="text-green-600" /> : <TrendingDown size={20} className="text-red-600" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Recommendations Section */}
                {selectedMedicine && (
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-green-100 to-green-50 border-b border-green-200">
                            <h2 className="text-2xl font-bold text-green-900">
                                Recommended Actions based on selected What-If Medicine
                            </h2>
                            <p className="text-sm text-green-700 mt-1">
                                Medicine: <span className="font-semibold">{selectedMedicine}</span>
                            </p>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recommendations.map((rec) => (
                                <div key={rec.id} className={`p-5 rounded-xl border-2 ${rec.color} hover:shadow-lg transition-all`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-bold text-slate-900">{rec.title}</h3>
                                        <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-slate-700 border border-slate-300">
                                            {rec.badge}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="font-semibold text-slate-800">{rec.action}</div>
                                        <p className="text-sm text-slate-600">{rec.details}</p>

                                        <div className="mt-4 pt-4 border-t border-slate-200 space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">OTIF Impact:</span>
                                                <span className="font-bold text-green-700">{rec.impact.otif}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Cost:</span>
                                                <span className="font-bold text-orange-700">{rec.impact.cost}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Timeline:</span>
                                                <span className="font-bold text-blue-700">{rec.impact.timeline}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition-colors">
                                        Select This Option
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForecastInternalDetailsScreen;
