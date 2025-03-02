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
    <div className="p-6">
      <div>
        <div className="tabs flex justify-center space-x-4 pb-2">
          <button
            onClick={() => handleTabClick('searchDocuments')}
            className={`px-4 py-2 rounded ${
              activeTab === 'searchDocuments'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Search Documents
          </button>
          <button
            onClick={() => handleTabClick('searchClients')}
            className={`px-4 py-2 rounded ${
              activeTab === 'searchClients'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Search Clients
          </button>
          <button
            onClick={() => handleTabClick('addDocument')}
            className={`px-4 py-2 rounded ${
              activeTab === 'addDocument'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Add Document
          </button>
          <button
            onClick={() => handleTabClick('registerClient')}
            className={`px-4 py-2 rounded ${
              activeTab === 'registerClient'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Register Client
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 'searchDocuments' && (
            <SearchDocuments />
          )}

          {activeTab === 'searchClients' && (
            <SearchClients />
          )}

          {activeTab === 'addDocument' && (
            <AddDocument/>
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
