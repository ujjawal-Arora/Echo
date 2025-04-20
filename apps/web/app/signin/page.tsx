"use client"
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 
import { FaGoogle, FaGithub, FaHeart, FaEnvelope, FaLock } from 'react-icons/fa'; 
import toast, { Toaster } from 'react-hot-toast';

const SignIn = () => {
  const router = useRouter(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Signing in...');
  
    try {
      const response = await axios.post("http://localhost:5173/api/signin", {
        email,  
        password,
      });
  
      const { token, user }: any = response.data;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("email", email);
        localStorage.setItem("username", user.username);
        toast.success('Successfully signed in!', { id: loadingToast });
        router.push("/landing");
      } else {
        toast.error('Sign-in failed: No token returned.', { id: loadingToast });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error signing in. Please try again.';
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  const handleGoogleSignIn = () => {
    // Google sign-in logic
  };

  const handleGithubSignIn = () => {
    // GitHub sign-in logic
  };

  return (
    <div className="flex bg-gradient-to-br from-zinc-900 to-zinc-950 items-center justify-center min-h-screen p-4">
      <Toaster position="top-center" />
      <div className="relative w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-pink-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-red-500/20 rounded-full blur-xl"></div>
        
        <div className="bg-zinc-800/80 backdrop-blur-sm border border-pink-500/30 p-8 rounded-xl shadow-2xl w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-3 rounded-full">
              <FaHeart className="text-white text-2xl" />
            </div>
          </div>
          
          <h2 className="text-3xl text-white font-serif text-center mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-center mb-6">Your perfect match is waiting for you</p>
          
          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-pink-500" />
              </div>
              <input
                type="email"
                value={email}
                placeholder='xyz@example.com'
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-700/50 text-white pl-10 pr-3 py-3 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-pink-500" />
              </div>
              <input
                type="password"
                value={password}
                placeholder='password@123'
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-700/50 text-white pl-10 pr-3 py-3 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg hover:from-pink-600 hover:to-red-600 transition duration-300 font-medium shadow-lg shadow-pink-500/20"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-gray-400 text-center">
            <p>
              Don't have an account?{' '}
              <Link href="/signup" className="text-pink-400 hover:text-pink-300 font-medium transition-colors">
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-white text-gray-800 py-3 rounded-lg hover:bg-gray-100 transition duration-300 flex items-center justify-center text-lg font-medium shadow-md"
            >
              <FaGoogle className="mr-3 text-red-500" /> Sign in with Google
            </button>
            <button
              onClick={handleGithubSignIn}
              className="w-full bg-zinc-700 text-white py-3 rounded-lg hover:bg-zinc-600 transition duration-300 flex items-center justify-center text-lg font-medium shadow-md"
            >
              <FaGithub className="mr-3" /> Sign in with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;