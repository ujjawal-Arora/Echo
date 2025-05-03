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
      <div className="max-w-6xl mx-auto">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Cards */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-[#DB1A5A]/20 transition-all duration-300">
              <div className="relative h-64">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold">User {item}</h3>
                  <p className="text-gray-400">Location</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Travel', 'Music', 'Art'].map((interest) => (
                    <span key={interest} className="px-3 py-1 bg-[#DB1A5A]/10 text-[#DB1A5A] rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                </p>
                <button className="w-full bg-[#DB1A5A] text-white py-2 rounded-lg hover:bg-[#B81A4D] transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
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

