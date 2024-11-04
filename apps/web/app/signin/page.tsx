"use client"
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 
import { FaGoogle, FaGithub } from 'react-icons/fa'; 

const SignIn = () => {
  const router = useRouter(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:5173/api/signin", {
        email,  
        password,
      });
  
      const { token ,user}:any = response.data;
  
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("id",user.id)
        localStorage.setItem("email", email);
        console.log("Token stored in localStorage");
  
        // router.push("/userdetails");
      } else {
        console.error("Sign-in failed: No token returned.");
      }
    } catch (error) {
      console.error("Error signing in:", error);
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
      <div className="bg-transparent border p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-white font-semibold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="block text-gray-100 mb-2">Email</label>
            <input
              type="email"
              value={email}
              placeholder='xyz@example.com'

              onChange={(e) => setEmail(e.target.value)}
              className="w-full  bg-transparent text-white px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-100 mb-2">Password</label>
            <input
              type="password"
              value={password}
              placeholder='password@123'

              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-white px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-gray-500  text-center">
          <p>
            Don't have an account?{' '}
            <Link href="/signup" className="text-indigo-600 hover:underline">
              Sign Up
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

export default SignIn;
