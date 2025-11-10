import { useState } from 'react';
import SequenceTabs from '../components/dashboard/SequenceTabs';
import SequenceInput from '../components/dashboard/SequenceInput';
import FileUpload from '../components/dashboard/FileUpload';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ResultsDisplay from '../components/dashboard/ResultsDisplay';
import ToastContainer from '../components/common/ToastContainer';
import useToast from '../hooks/useToast';
import { analyzeSequence, uploadFile } from '../services/api';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('DNA');
  const [sequenceInput, setSequenceInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputMethod, setInputMethod] = useState('text'); // 'text' or 'file'
  
  // Toast notifications
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSequenceInput('');
    setSelectedFile(null);
    setError(null);
    setAnalysisResults(null);
  };

  const handleSequenceChange = (value) => {
    setSequenceInput(value);
    setInputMethod('text');
    setSelectedFile(null);
    setError(null);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setInputMethod('file');
    setSequenceInput('');
    setError(null);
  };

  const handleAnalyze = async () => {
    setError(null);
    setAnalysisResults(null);

    // Validation
    if (inputMethod === 'text' && !sequenceInput.trim()) {
      setError('Please enter a sequence to analyze');
      return;
    }

    if (inputMethod === 'file' && !selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setIsLoading(true);

    // Ensure minimum display duration of 300ms
    const startTime = Date.now();

    try {
      let results;

      if (inputMethod === 'text') {
        // Analyze text input
        results = await analyzeSequence({
          sequence: sequenceInput.trim(),
          type: activeTab
        });
      } else {
        // Upload file
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('type', activeTab);
        results = await uploadFile(formData);
      }

      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 300) {
        await new Promise(resolve => setTimeout(resolve, 300 - elapsedTime));
      }

      setAnalysisResults(results);
      
      // Show success notification
      showSuccess('Analysis completed successfully!');
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during analysis';
      setError(errorMessage);
      
      // Show error notification
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sequence Analysis</h1>
      <p className="text-sm sm:text-base text-gray-600 mb-6">
        Analyze DNA, RNA, or protein sequences to get detailed insights
      </p>

      {/* Sequence Type Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <SequenceTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Input Section */}
        <div className="mt-6 space-y-6">
          {/* Text Input */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">
              Enter Sequence Manually
            </h3>
            <SequenceInput
              value={sequenceInput}
              onChange={handleSequenceChange}
              sequenceType={activeTab}
              onSubmit={handleAnalyze}
            />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">
              Upload Sequence File
            </h3>
            <FileUpload onFileSelect={handleFileSelect} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm sm:text-base">
              {error}
            </div>
          )}

          {/* Analyze Button */}
          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || (!sequenceInput.trim() && !selectedFile)}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-medium text-white transition-colors text-sm sm:text-base ${
                isLoading || (!sequenceInput.trim() && !selectedFile)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Sequence'}
            </button>
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-md p-8 sm:p-12">
          <LoadingSpinner size="lg" />
          <p className="text-center text-gray-600 mt-4 text-sm sm:text-base">
            Processing your sequence...
          </p>
        </div>
      )}

      {/* Results Display */}
      {analysisResults && !isLoading && (
        <ResultsDisplay results={analysisResults} />
      )}
      </div>
    </>
  );
}

export default Dashboard;
