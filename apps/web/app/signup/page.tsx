
"use client"
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; 

const SignUp = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
  
   
    const payload = {
      username,
      email,
      password,
    };
  
    try {
      const response = await axios.post('http://localhost:5173/api/signup', payload); 
      console.log('User signed up successfully:', response.data);
      const data = response.data as { token: string; message: string; user: any };
      const token=data.token;
      const userId=data.user.id
      console.log("response of the user",userId);
      if (response.status === 201 && token) {
        // Store the token for further use, if needed
        
        localStorage.setItem('token', token);
        localStorage.setItem('userId',userId);
        localStorage.setItem('email',email);


        // Navigate to the user details page
        router.push('/userdetails');
    }
    } catch (error:any) {
      console.error('Error signing up:', error.response?.data || error.message);
    }
  };

  const handleGoogleSignIn = () => {
    // Google sign-in logic
  };

  const handleGithubSignIn = () => {
    // GitHub sign-in logic
  };

  return (
    <div className="flex bg-zinc-950 items-center justify-center h-screen">
      <div className="bg-transpareent p-8 border shadow-xl rounded-lg  w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-gray-100 mb-2">Username</label>
            <input
              type="text"
              value={username}
              placeholder='xyz_1235'

              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent text-white px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block bg-transparent text-gray-100 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='xyz@example.com'
              className="w-full px-3 py-2 bg-transparent text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-100 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='password'

              className="w-full bg-transparent text-white px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-gray-500 text-center">
          <p>
            Already have an account?{' '}
            <Link href="/signin" className="text-red-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition duration-300 flex items-center justify-center text-lg"
          >
            <FaGoogle className="mr-3" /> Sign in with Google
          </button>
          <button
            onClick={handleGithubSignIn}
            className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-900 transition duration-300 flex items-center justify-center text-lg"
          >
            <FaGithub className="mr-3" /> Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
