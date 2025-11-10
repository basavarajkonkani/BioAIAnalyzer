import React, { useState, useEffect } from 'react';
import { validateDNA, validateRNA, validateProtein } from '../../utils/validators';

const SequenceInput = ({ value, onChange, sequenceType, onSubmit }) => {
  const [error, setError] = useState('');

  useEffect(() => {
    // Validate on value change
    if (value.trim()) {
      validateSequence(value);
    } else {
      setError('');
    }
  }, [value, sequenceType]);

  const validateSequence = (sequence) => {
    const cleanSequence = sequence.replace(/\s/g, '');
    
    let isValid = false;
    let validChars = '';

    switch (sequenceType) {
      case 'DNA':
        isValid = validateDNA(cleanSequence);
        validChars = 'A, T, G, C';
        break;
      case 'RNA':
        isValid = validateRNA(cleanSequence);
        validChars = 'A, U, G, C';
        break;
      case 'Protein':
        isValid = validateProtein(cleanSequence);
        validChars = 'standard amino acid codes (A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, V, W, Y)';
        break;
      default:
        isValid = true;
    }

    if (!isValid) {
      setError(`Invalid characters detected. ${sequenceType} sequences can only contain ${validChars}.`);
    } else {
      setError('');
    }

    return isValid;
  };

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey && onSubmit) {
      onSubmit();
    }
  };

  const characterCount = value.replace(/\s/g, '').length;

  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={`Enter ${sequenceType} sequence here...`}
        className={`w-full h-40 p-4 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
        }`}
      />
      <div className="flex justify-between items-center mt-2">
        <div className="text-sm text-gray-600">
          Characters: {characterCount}
        </div>
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SequenceInput;
