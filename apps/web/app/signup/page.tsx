"use client"
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FaGoogle, FaGithub, FaHeart, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; 
import toast, { Toaster } from 'react-hot-toast';

const SignUp = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading('Creating your account...');
  
    const payload = {
      username,
      email,
      password,
    };
  
    try {
      const response = await axios.post('http://localhost:5173/api/signup', payload); 
      console.log('User signed up successfully:', response.data);
      const data = response.data as { token: string; message: string; user: any };
      const token = data.token;
      const userId = data.user.id;
      
      if (response.status === 201 && token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('email', email);
        toast.success('Account created successfully!', { id: loadingToast });
        router.push('/userdetails');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error signing up. Please try again.';
      toast.error(errorMessage, { id: loadingToast });
      console.error('Error signing up:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
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
          
          <h2 className="text-3xl text-white font-serif text-center mb-2">Join Our Community</h2>
          <p className="text-gray-400 text-center mb-6">Find your perfect match today</p>
          
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-pink-500" />
              </div>
              <input
                type="text"
                value={username}
                placeholder='Choose a username'
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-700/50 text-white pl-10 pr-3 py-3 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-pink-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Your email address'
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Create a password'
                className="w-full bg-zinc-700/50 text-white pl-10 pr-3 py-3 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg hover:from-pink-600 hover:to-red-600 transition duration-300 font-medium shadow-lg shadow-pink-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-gray-400 text-center">
            <p>
              Already have an account?{' '}
              <Link href="/signin" className="text-pink-400 hover:text-pink-300 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-white text-gray-800 py-3 rounded-lg hover:bg-gray-100 transition duration-300 flex items-center justify-center text-lg font-medium shadow-md"
            >
              <FaGoogle className="mr-3 text-red-500" /> Sign up with Google
            </button>
            <button
              onClick={handleGithubSignIn}
              className="w-full bg-zinc-700 text-white py-3 rounded-lg hover:bg-zinc-600 transition duration-300 flex items-center justify-center text-lg font-medium shadow-md"
            >
              <FaGithub className="mr-3" /> Sign up with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
