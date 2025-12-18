import React, { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Download, Users, ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-react';
import supplierForecastService from '../../services/supplierForecastService';
import VendorDetailsModal from '../DecisionActions/VendorDetailsModal';

const SupplierForecastReport = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [notification, setNotification] = useState(null); // Notification state

  const tabs = [
    { id: 'all', label: 'All Items' },
    { id: 'critical', label: 'Critical' },
    { id: 'surging', label: 'Surging' },
    { id: 'expiry_risk', label: 'Expiry Risk' }
  ];

  // Fetch data when component mounts, tab changes, or page changes
  useEffect(() => {
    fetchReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await supplierForecastService.getSupplierForecastReport(activeTab, currentPage, itemsPerPage);
      if (response.success) {
        setReportData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch supplier forecast report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTagColor = (color) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDemandColor = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'red': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle vendor recommendation
  const handleVendorRecommend = (vendor, medicine) => {
    // Update the table data with the new current vendor
    setReportData(prevData => ({
      ...prevData,
      items: prevData.items.map(item =>
        item.id === medicine.id
          ? { ...item, vendorName: vendor.vendorName }
          : item
      )
    }));

    // Show success notification
    setNotification({
      message: `Vendor "${vendor.vendorName}" recommended for "${medicine.medicineName}"`,
      type: 'success'
    });

    // Auto-hide notification after 4 seconds
    setTimeout(() => setNotification(null), 4000);

    // Close the modal
    setShowVendorModal(false);
  };

  const getInventoryColor = (color) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExpiryRiskColor = (color) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'green': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVendorClick = (item) => {
    setSelectedItem(item);
    setShowVendorModal(true);
  };

  const items = reportData?.items || [];
  const summary = reportData?.summary || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Supplier Forecast Report</h1>
              <p className="text-sm text-gray-500">Comprehensive supplier and inventory analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.label}
              {summary && (
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {tab.id === 'all' && summary.totalItems}
                  {tab.id === 'critical' && summary.criticalCount}
                  {tab.id === 'surging' && summary.surgingCount}
                  {tab.id === 'expiry_risk' && summary.expiryRiskCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tag
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Demand
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inventory
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry Risk
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Vendor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Additional Vendors
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent Confidence
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Raise PR
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.product}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTagColor(item.tag?.color)}`}>
                          {item.tag?.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{item.category}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDemandColor(item.demand?.color)}`}>
                          {item.demand?.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInventoryColor(item.inventory?.color)}`}>
                          {item.inventory?.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {item.stock?.current} / {item.stock?.required}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.expiryRisk?.daysRemaining}d to expiry
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExpiryRiskColor(item.expiryRisk?.color)}`}>
                          {item.expiryRisk?.level}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{item.vendorName}</div>
                      </td>
                      <td className="px-4 py-4">
                        {item.vendorCount > 0 ? (
                          <button
                            onClick={() => handleVendorClick(item)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Users className="w-4 h-4" />
                            <span>{item.vendorCount} Vendors</span>
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">No additional vendors</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => {
                            // Find the current vendor from the vendors list
                            const currentVendor = item.vendors?.find(v => v.vendorName === item.vendorName);
                            if (currentVendor) {
                              setSelectedItem({
                                ...item,
                                vendors: [currentVendor] // Show only the current vendor
                              });
                              setShowVendorModal(true);
                            }
                          }}
                          className="flex items-center hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors cursor-pointer"
                        >
                          <div className="text-sm text-gray-900 mr-2">{Number(item.agentConfidence).toFixed(2)}%</div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${item.agentConfidence}%` }}
                            ></div>
                          </div>
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          disabled={!item.raisePR?.enabled}
                          className={`px-3 py-1 rounded text-xs font-medium ${item.raisePR?.enabled
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          title={item.raisePR?.reason}
                        >
                          {item.raisePR?.enabled ? 'Raise PR' : 'Disabled'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && reportData?.pagination && (
        <div className="p-6 pt-0">
          <div className="bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
            <div className="flex items-center justify-between">
              {/* Items info */}
              <div className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {((currentPage - 1) * itemsPerPage) + 1}
                </span>
                {' '}-{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, reportData.pagination.totalItems)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{reportData.pagination.totalItems}</span>
                {' '}items
              </div>

              {/* Pagination controls */}
              <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!reportData.pagination.hasPreviousPage}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${reportData.pagination.hasPreviousPage
                    ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const totalPages = reportData.pagination.totalPages;
                    const pages = [];
                    const maxVisible = 5;

                    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

                    if (endPage - startPage < maxVisible - 1) {
                      startPage = Math.max(1, endPage - maxVisible + 1);
                    }

                    // First page
                    if (startPage > 1) {
                      pages.push(
                        <button
                          key={1}
                          onClick={() => handlePageChange(1)}
                          className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        >
                          1
                        </button>
                      );
                      if (startPage > 2) {
                        pages.push(
                          <span key="ellipsis1" className="px-2 text-gray-500">...</span>
                        );
                      }
                    }

                    // Page numbers
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${i === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          {i}
                        </button>
                      );
                    }

                    // Last page
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(
                          <span key="ellipsis2" className="px-2 text-gray-500">...</span>
                        );
                      }
                      pages.push(
                        <button
                          key={totalPages}
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        >
                          {totalPages}
                        </button>
                      );
                    }

                    return pages;
                  })()}
                </div>

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!reportData.pagination.hasNextPage}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${reportData.pagination.hasNextPage
                    ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Details Modal */}
      {showVendorModal && selectedItem && (
        <VendorDetailsModal
          isOpen={showVendorModal}
          onClose={() => {
            setShowVendorModal(false);
            setSelectedItem(null);
          }}
          medicine={{
            id: selectedItem.id,
            medicineName: selectedItem.product
          }}
          vendors={selectedItem.vendors || []}
          showRecommendButton={true}
          onRecommend={handleVendorRecommend}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[350px] max-w-md">
            <CheckCircle size={24} className="flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm leading-relaxed">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-white hover:text-green-100 transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierForecastReport;
