import React, { useState } from 'react';
import SearchDocuments from './SearchDocuments';
import SearchClients from './SearchClients';
import AddDocument from './AddDocument';
import RegisterClient from './RegisterClient';
import Navbar from '../../components/Navbar';

const LibrarianDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('searchDocuments');
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="tabs flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 pb-4">
            <button
              onClick={() => handleTabClick('searchDocuments')}
              className={`w-full sm:w-auto px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'searchDocuments'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Search Documents
            </button>
            <button
              onClick={() => handleTabClick('searchClients')}
              className={`w-full sm:w-auto px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'searchClients'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Search Clients
            </button>
            <button
              onClick={() => handleTabClick('addDocument')}
              className={`w-full sm:w-auto px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'addDocument'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Add Document
            </button>
            <button
              onClick={() => handleTabClick('registerClient')}
              className={`w-full sm:w-auto px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'registerClient'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Register Client
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'searchDocuments' && (
              <SearchDocuments />
            )}
            {activeTab === 'searchClients' && (
              <SearchClients />
            )}
            {activeTab === 'addDocument' && (
              <AddDocument />
            )}
            {activeTab === 'registerClient' && (
              <RegisterClient />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LibrarianDashboard;