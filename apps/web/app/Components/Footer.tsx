import React from 'react';
import Link from 'next/link';
import { FaHeart, FaFacebook, FaTwitter, FaInstagram, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className=" mt-5 bg-zinc-800 border-t border-pink-500/30 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-red-500 p-2 rounded-full mr-2">
                <FaHeart className="text-white" />
              </div>
              <h3 className="text-xl font-serif text-white">Echo</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Find your perfect match with our intelligent matching algorithm and connect with like-minded people.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <FaGithub size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-lg font-medium mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/landing" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/swipe" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Find Matches
                </Link>
              </li>
              <li>
                <Link href="/premium" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Premium
                </Link>
              </li>
              <li>
                <Link href="/userdetails" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h4 className="text-lg font-medium mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Dating Tips
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h4 className="text-lg font-medium mb-4 text-white">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <FaEnvelope className="mr-2 text-pink-500" />
                <a href="mailto:support@echo.com" className="hover:text-pink-400 transition-colors">
                  support@echo.com
                </a>
              </li>
              <li className="text-gray-400">
                <p>123 Love Street</p>
                <p>Romance City, RC 12345</p>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Echo Dating. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 