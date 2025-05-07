"use client";
import { useState } from 'react';
import ProtectedRoute from '../Components/ProtectedRoute';

function ExploreContent() {
  const [activeTab, setActiveTab] = useState('trending');

  const tabs = [
    { id: 'trending', label: 'Trending' },
    { id: 'new', label: 'New Matches' },
    { id: 'nearby', label: 'Nearby' }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#DB1A5A] mb-8">Explore</h1>
        
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-4 relative ${
                activeTab === tab.id
                  ? 'text-[#DB1A5A]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#DB1A5A] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="text-center text-gray-400">
          <p>Discover new connections and potential matches in your area.</p>
          <p className="mt-4">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <ExploreContent />
    </ProtectedRoute>
  );
}

