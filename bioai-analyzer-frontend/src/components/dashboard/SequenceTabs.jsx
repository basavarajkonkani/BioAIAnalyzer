import React from 'react';

const SequenceTabs = ({ activeTab, onTabChange }) => {
  const tabs = ['DNA', 'RNA', 'Protein'];

  return (
    <div className="flex flex-wrap sm:flex-nowrap space-x-1 border-b border-gray-300">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 font-medium text-sm sm:text-base transition-colors ${
            activeTab === tab
              ? 'bg-blue-500 text-white border-b-2 border-blue-500'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default SequenceTabs;
