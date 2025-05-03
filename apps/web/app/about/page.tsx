"use client";
import ProtectedRoute from '../Components/ProtectedRoute';

function AboutContent() {
  const features = [
    {
      title: "Smart Matching",
      description: "Our advanced algorithm finds the perfect match based on your preferences and interests.",
      icon: "💖"
    },
    {
      title: "Secure Chat",
      description: "End-to-end encrypted messaging ensures your conversations stay private.",
      icon: "🔒"
    },
    {
      title: "Real Connections",
      description: "Focus on building meaningful relationships with verified profiles.",
      icon: "🤝"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "5K+", label: "Successful Matches" },
    { number: "98%", label: "User Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#DB1A5A]/20 to-zinc-950" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold mb-6">About Echo</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connecting hearts through meaningful conversations and shared interests.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-zinc-900 p-6 rounded-xl hover:shadow-lg hover:shadow-[#DB1A5A]/20 transition-all duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-[#DB1A5A]">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-[#DB1A5A] mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="bg-zinc-900 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-[#DB1A5A]">Our Mission</h2>
          <p className="text-gray-300 text-lg mb-4">
            At Echo, we believe in creating meaningful connections that go beyond superficial swipes. 
            Our platform is designed to help you find someone who truly resonates with your values, 
            interests, and life goals.
          </p>
          <p className="text-gray-300 text-lg">
            We're committed to providing a safe, inclusive space where you can be yourself and 
            connect with others who appreciate you for who you are.
          </p>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8 text-[#DB1A5A]">Join Our Community</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Be part of a growing community of individuals looking for meaningful connections. 
            Start your journey today and find someone who truly understands you.
          </p>
          <button className="bg-[#DB1A5A] text-white px-8 py-3 rounded-lg hover:bg-[#B81A4D] transition-colors">
            Get Started
          </button>
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
