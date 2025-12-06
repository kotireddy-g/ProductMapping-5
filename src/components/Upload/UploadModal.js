import React, { useState, useRef } from 'react';
import { X, Upload, File, CheckCircle, AlertCircle } from 'lucide-react';

const UploadModal = ({ isOpen, onClose, onUploadComplete }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    // Filter for Excel files
    const excelFiles = files.filter(file => 
      file.name.endsWith('.xlsx') || 
      file.name.endsWith('.xls') || 
      file.name.endsWith('.csv')
    );
    setSelectedFiles(excelFiles);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const startUpload = () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress over 10 seconds
    const totalDuration = 10000; // 10 seconds in milliseconds
    const interval = 100; // Update every 100ms for smoother progress
    const increment = 100 / (totalDuration / interval);
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setUploadComplete(true);
          setTimeout(() => {
            onUploadComplete();
            handleClose();
          }, 2000);
          return 100;
        }
        return newProgress;
      });
    }, interval);
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadComplete(false);
    setIsDragOver(false);
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getEstimatedTime = () => {
    const remaining = 100 - uploadProgress;
    const timeLeft = (remaining / 100) * 10; // seconds
    const seconds = Math.floor(timeLeft);
    return `${seconds}s`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Upload Data Files</h2>
            <p className="text-sm text-slate-500 mt-1">
              Upload Excel or CSV files to update OTIF data
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            disabled={isUploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!isUploading && !uploadComplete && (
            <>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-700 mb-2">
                  Drop files here or click to browse
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Supports Excel (.xlsx, .xls) and CSV files
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">
                    Selected Files ({selectedFiles.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={startUpload}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Upload Files
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {isUploading && !uploadComplete && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                Processing Files...
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Analyzing data and updating OTIF metrics
              </p>
              
              <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-slate-600">
                <span>{Math.round(uploadProgress)}% complete</span>
                <span>Est. time remaining: {getEstimatedTime()}</span>
              </div>
              
              <div className="mt-6 text-xs text-slate-500">
                <p>• Validating data integrity</p>
                <p>• Updating inventory metrics</p>
                <p>• Recalculating OTIF percentages</p>
                <p>• Generating new insights</p>
              </div>
            </div>
          )}

          {uploadComplete && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                Upload Complete!
              </h3>
              <p className="text-sm text-slate-500">
                Data has been successfully processed and OTIF metrics updated
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
