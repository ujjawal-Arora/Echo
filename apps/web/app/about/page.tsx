"use client";
import ProtectedRoute from '../Components/ProtectedRoute';

function AboutContent() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center p-8">
        <h1 className="text-4xl font-bold text-[#DB1A5A] mb-6">About Echo</h1>
        <p className="text-xl text-gray-300 mb-8">
          Echo is a modern dating platform designed to help you find meaningful connections.
          We believe in creating authentic relationships through our innovative matching system.
        </p>
        <div className="bg-zinc-900 p-6 rounded-xl">
          <p className="text-gray-400">
            Join our community and start your journey to find your perfect match today.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <AboutContent />
    </ProtectedRoute>
  );
}
