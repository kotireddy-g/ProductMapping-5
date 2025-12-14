import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { getPriorityColor } from '../../data/rcaData';
import { getRCAList } from '../../services/rcaService';

const RootCausesSection = ({ data, selectedTimePeriod = 'today' }) => {
    const [rcaData, setRcaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertData, setAlertData] = useState(null);

    // Fetch RCA data from API
    useEffect(() => {
        const fetchRCAData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getRCAList();
                if (response.success) {
                    setRcaData(response.data);
                }
            } catch (err) {
                console.error('Error fetching RCA data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRCAData();
    }, []);

    // Handle clicking on Preventive Recommendations
    const handlePreventiveClick = (item) => {
        setAlertData({
            title: '192.168.1.111 says',
            message: `Alert sent to Purchase Team:\n\nAction: ${item.preventiveRecommendations}\nPriority: ${item.priority.toUpperCase()}\n\nThe purchase team has been notified to take action.`,
            team: 'Purchase Team'
        });
        setShowAlert(true);
    };

    // Handle clicking on Actions
    const handleActionClick = (item) => {
        setAlertData({
            title: '192.168.1.111 says',
            message: `Alert sent to Pharma Team:\n\nAction: ${item.actions}\nPriority: ${item.priority.toUpperCase()}\n\nThe pharmacy team has been notified to prioritize based on ${item.priority} priority level.`,
            team: 'Pharma Team'
        });
        setShowAlert(true);
    };

    // Handle alert OK button
    const handleAlertOk = () => {
        setShowAlert(false);
        setToastMessage(`✓ Notification sent to ${alertData.team} successfully`);
        setShowToast(true);

        // Auto-hide toast after 4 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 4000);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Root Causes Analysis
            </h2>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading RCA data...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="text-center py-12 text-red-600">
                    <p>Error loading RCA data: {error}</p>
                </div>
            )}

            {/* Table */}
            {!loading && !error && (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-100 border-b border-slate-300">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Reason</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Why</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Medicine Type</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Demand</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Supplied</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Forecast</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Preventive Recommendations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rcaData.map((item) => {
                                    const colors = getPriorityColor(item.priority);
                                    return (
                                        <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-800">{item.reason}</td>
                                            <td className="px-4 py-3 text-blue-600 text-xs">{item.why}</td>
                                            <td className="px-4 py-3 text-slate-700">{item.medicineType}</td>
                                            <td className="px-4 py-3 font-semibold text-slate-900">{item.demand}</td>
                                            <td className="px-4 py-3 font-semibold text-slate-900">{item.supplied}</td>
                                            <td className="px-4 py-3 font-semibold text-slate-900">{item.forecast}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleActionClick(item)}
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.badge} hover:opacity-80 transition-opacity`}
                                                >
                                                    {item.actions}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handlePreventiveClick(item)}
                                                    className="text-green-600 hover:text-green-800 hover:underline cursor-pointer text-xs"
                                                >
                                                    {item.preventiveRecommendations}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="mt-4 flex items-center gap-6 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>{rcaData.filter(item => item.priority === 'critical' || item.priority === 'urgent').length} High Priority Issues</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span>{rcaData.filter(item => item.priority === 'normal').length} Medium Priority Issues</span>
                        </div>
                    </div>
                </>
            )}

            {/* Custom Alert Modal */}
            {showAlert && alertData && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">{alertData.title}</h3>
                        <div className="text-gray-300 text-sm whitespace-pre-line mb-6">
                            {alertData.message}
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleAlertOk}
                                className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
                    <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]">
                        <CheckCircle className="w-6 h-6 flex-shrink-0" />
                        <p className="font-medium">{toastMessage}</p>
                        <button
                            onClick={() => setShowToast(false)}
                            className="ml-auto p-1 hover:bg-green-700 rounded transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RootCausesSection;
