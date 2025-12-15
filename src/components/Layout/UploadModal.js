import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Zap, Trash2 } from 'lucide-react';
import uploadService from '../../services/uploadService';

const UploadModal = ({ isOpen, onClose, onUploadComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, file-selected, uploading, processing, success, error
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // File validation
  const validateAndSetFiles = (files) => {
    if (!files || files.length === 0) return;

    const validFiles = [];
    const errors = [];

    // Check file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];

    Array.from(files).forEach((file, index) => {
      // Check file type
      if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx')) {
        errors.push(`${file.name}: Invalid file type (must be .xlsx)`);
        return;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: File too large (max 10MB)`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    } else {
      setError('');
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setUploadStatus('file-selected');
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    validateAndSetFiles(files);
  };

  // File input handler
  const handleFileInput = (e) => {
    const files = e.target.files;
    validateAndSetFiles(files);
  };

  // Browse files
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Remove file
  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    if (selectedFiles.length === 1) {
      setUploadStatus('idle');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit handler - Two-step API process
  const handleSubmit = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    try {
      // Step 1: Upload file
      setUploadStatus('uploading');
      setCurrentStep(1);
      setUploadProgress(0);
      setError('');

      // Simulate progress for upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload all files sequentially
      const uploadResults = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const uploadResponse = await uploadService.uploadWorkbook(file, 1);

        if (!uploadResponse.upload_id) {
          throw new Error(`Upload failed for ${file.name}. No upload ID received.`);
        }

        uploadResults.push(uploadResponse);
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Small delay before step 2
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 2: Process all uploads
      setCurrentStep(2);
      setUploadStatus('processing');

      // Process each upload
      for (const uploadResponse of uploadResults) {
        await uploadService.processUpload(
          uploadResponse.upload_id,
          1,
          'last_30_days'
        );
      }

      // If we get here, processing was successful
      // Success!
      setUploadStatus('success');

      // Auto-close and refresh after 2 seconds
      setTimeout(() => {
        if (onUploadComplete) {
          // Pass the last process response or a generic success indicator
          onUploadComplete(uploadResults[uploadResults.length - 1]);
        }
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus('error');
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  // Close handler
  const handleClose = () => {
    setSelectedFiles([]);
    setUploadStatus('idle');
    setCurrentStep(1);
    setUploadProgress(0);
    setError('');
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Upload Forecast Data</h2>
            <p className="text-sm text-gray-500 mt-1">Upload Excel file to update dashboard</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Idle State - Upload Area */}
          {uploadStatus === 'idle' && (
            <>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-600 text-lg">
                  Drag & drop your Excel files here
                </p>
                <p className="text-gray-500 text-sm mb-4">or</p>
                <button
                  onClick={handleBrowseClick}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold text-gray-800">Supported format:</span> Excel (.xlsx)
                  <br />
                  <span className="font-semibold text-gray-800">Maximum size:</span> 10MB
                </p>
              </div>
            </>
          )}

          {/* File Selected State */}
          {uploadStatus === 'file-selected' && selectedFiles.length > 0 && (
            <>
              <div className="space-y-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="border-2 border-blue-200 bg-blue-50 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileSpreadsheet className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-semibold truncate">{file.name}</p>
                        <p className="text-gray-500 text-sm mt-1">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </>
          )}

          {/* Uploading State - Step 1 */}
          {uploadStatus === 'uploading' && (
            <div className="py-8">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <Upload className="w-16 h-16 text-blue-600 animate-bounce" />
                  <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>

              <p className="text-gray-800 font-bold text-lg text-center mb-2">
                Uploading file...
              </p>
              <p className="text-gray-500 text-sm text-center mb-6">
                Step 1 of 2 • Please wait
              </p>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-gray-600 text-sm text-center mt-3 font-semibold">
                {uploadProgress}% complete
              </p>
            </div>
          )}

          {/* Processing State - Step 2 */}
          {uploadStatus === 'processing' && (
            <div className="py-8">
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-20 h-20">
                  {/* Outer ring */}
                  <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  {/* Middle ring */}
                  <div className="absolute inset-2 border-4 border-cyan-500 border-b-transparent rounded-full animate-spin-reverse" />
                  {/* Inner icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-yellow-500 animate-pulse" />
                  </div>
                </div>
              </div>

              <p className="text-gray-800 font-bold text-lg text-center mb-2">
                Processing data & recomputing KPIs...
              </p>
              <p className="text-gray-500 text-sm text-center mb-6">
                Step 2 of 2 • This may take a few moments
              </p>

              {/* Animated dots */}
              <div className="flex justify-center gap-2">
                <div
                  className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          )}

          {/* Success State */}
          {uploadStatus === 'success' && (
            <div className="py-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <p className="text-gray-800 font-bold text-xl mb-2">Upload Successful!</p>
              <p className="text-gray-600">Dashboard is being updated with new data...</p>
            </div>
          )}

          {/* Error State */}
          {uploadStatus === 'error' && (
            <>
              <div className="py-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-red-600" />
                </div>
                <p className="text-gray-800 font-bold text-xl mb-2">Upload Failed</p>
                <p className="text-gray-600 mb-6">{error}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setUploadStatus('file-selected');
                    setError('');
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </>
          )}

          {/* Validation Error */}
          {error && uploadStatus === 'idle' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Add custom animation for reverse spin */}
      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default UploadModal;
