import React from 'react';
import Link from 'next/link';

const BuyProMessage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-zinc-800 p-8 rounded-xl shadow-lg border border-pink-500/30">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-serif text-pink-400">
          Love Awaits in Premium
        </h2>

        <p className="text-xl text-gray-300 font-light italic">
          "In the garden of love, the rarest flowers bloom in our premium garden..."
        </p>

        <div className="space-y-4">
          <p className="text-gray-300">
            Unlock unlimited matches and discover your perfect match with our premium features:
          </p>

          <ul className="text-left text-gray-300 space-y-2">
            <li className="flex items-center">
              <span className="text-pink-400 mr-2">❤️</span>
              Unlimited daily matches
            </li>
            <li className="flex items-center">
              <span className="text-pink-400 mr-2">✨</span>
              See who likes you
            </li>
            <li className="flex items-center">
              <span className="text-pink-400 mr-2">🌟</span>
              Advanced filters
            </li>
            <li className="flex items-center">
              <span className="text-pink-400 mr-2">💫</span>
              Priority in search results
            </li>
          </ul>
        </div>

        <Link 
          href="/premium" 
          className="inline-block mt-6 px-8 py-3 bg-[#DB1A5A] text-white rounded-full font-semibold hover:bg-transparent hover:text-[#DB1A5A] border-2 border-[#DB1A5A] transition-all duration-300 shadow-lg"
        >
          Upgrade to Premium
        </Link>

        <p className="text-sm text-gray-400 mt-4">
          Join thousands of happy couples who found love through our premium service
        </p>
      </div>
    </div>
  );
};

export default BuyProMessage;
