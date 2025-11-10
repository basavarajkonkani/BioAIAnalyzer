import React, { useState, useRef } from 'react';
import { validateFileExtension } from '../../utils/validators';

const FileUpload = ({ onFileSelect, acceptedFormats = ['.fasta', '.fa', '.gb', '.gbk'] }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  const validateFile = (file) => {
    // Check file extension
    if (!validateFileExtension(file.name, acceptedFormats)) {
      setError('Unsupported file format. Please upload FASTA or GenBank files');
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 10MB limit');
      return false;
    }

    setError('');
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

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

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={acceptedFormats.join(',')}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-2">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          
          {selectedFile ? (
            <div className="text-sm">
              <p className="font-medium text-gray-700 break-all px-2">{selectedFile.name}</p>
              <p className="text-gray-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm sm:text-base text-gray-700 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs sm:text-sm text-gray-500 px-2">
                FASTA or GenBank files (.fasta, .fa, .gb, .gbk)
              </p>
              <p className="text-xs text-gray-400">
                Maximum file size: 10MB
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {selectedFile && !error && (
        <button
          onClick={handleRemove}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Remove file
        </button>
      )}
    </div>
  );
};

export default FileUpload;
