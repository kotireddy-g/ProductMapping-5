import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

const UploadModal = ({ isOpen, onClose, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');

  if (!isOpen) return null;

  const handleUpload = () => {
    setUploading(true);
    setStatus('uploading');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('success');
          setUploading(false);
          setTimeout(() => {
            if (onUploadComplete) onUploadComplete();
            onClose();
          }, 1500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
        onClick={onClose}
      >
        <div 
          className="bg-slate-800 rounded-2xl w-full max-w-md p-6 border border-slate-700"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Upload Forecast Data</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {status === 'idle' && (
            <>
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-slate-500 transition-colors">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-white font-medium mb-2">Drop your forecast file here</p>
                <p className="text-slate-400 text-sm mb-4">Supports CSV, XLSX, or JSON format</p>
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Browse Files
                </button>
              </div>

              <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-slate-400 text-sm">
                  <span className="text-white font-medium">Note:</span> Upload new forecast data to update the dashboard with latest predictions and insights.
                </p>
              </div>
            </>
          )}

          {status === 'uploading' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Upload className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-white font-medium mb-4">Uploading forecast data...</p>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-slate-400 text-sm mt-2">{progress}% complete</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white font-medium mb-2">Upload Successful!</p>
              <p className="text-slate-400 text-sm">Dashboard is being updated with new data...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadModal;
