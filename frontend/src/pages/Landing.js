import React, { useState } from "react";
import { FaComments, FaMoon, FaLock, FaSmile } from "react-icons/fa";

function Landing({ onLogin }) {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (username.trim() !== "") onLogin(username);
  };

  // Smooth scroll function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-gray-800 shadow-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-400 cursor-pointer" onClick={() => scrollToSection("hero")}>ChatApp</h1>
        <div className="space-x-4">
          <button onClick={() => scrollToSection("features")} className="hover:text-blue-300">Features</button>
          <button onClick={() => scrollToSection("login")} className="hover:text-blue-300">Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main id="hero" className="flex-1 flex flex-col md:flex-row items-center justify-center p-10 space-y-10 md:space-y-0 md:space-x-10">

        {/* Left: Hero + Features */}
        <div className="flex-1 flex flex-col justify-center max-w-lg space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">Chat with anyone instantly</h2>
          <p className="text-gray-300">
            Stay connected with friends and family in real-time with a secure and private chat.
          </p>

          {/* CTA Button inside hero */}
          <button
            onClick={() => scrollToSection("login")}
            className="bg-blue-500 p-3 rounded-lg text-white font-semibold w-40 hover:bg-blue-600 transition"
          >
            Get Started
          </button>

          {/* Feature Cards 2x2 Grid */}
          <div id="features" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-800 p-4 rounded shadow-md flex flex-col items-center text-center hover:scale-105 transition-transform">
              <FaComments className="text-blue-400 text-3xl mb-2"/>
              <h3 className="text-blue-400 font-semibold">Real-time Chat</h3>
              <p className="text-gray-300 text-sm">Instant messages delivered securely</p>
            </div>
            <div className="bg-gray-800 p-4 rounded shadow-md flex flex-col items-center text-center hover:scale-105 transition-transform">
              <FaMoon className="text-blue-400 text-3xl mb-2"/>
              <h3 className="text-blue-400 font-semibold">Dark Mode</h3>
              <p className="text-gray-300 text-sm">Easy on the eyes for long chats</p>
            </div>
            <div className="bg-gray-800 p-4 rounded shadow-md flex flex-col items-center text-center hover:scale-105 transition-transform">
              <FaLock className="text-blue-400 text-3xl mb-2"/>
              <h3 className="text-blue-400 font-semibold">Secure & Private</h3>
              <p className="text-gray-300 text-sm">Your chats stay confidential</p>
            </div>
            <div className="bg-gray-800 p-4 rounded shadow-md flex flex-col items-center text-center hover:scale-105 transition-transform">
              <FaSmile className="text-blue-400 text-3xl mb-2"/>
              <h3 className="text-blue-400 font-semibold">Easy to Use</h3>
              <p className="text-gray-300 text-sm">Simple and intuitive interface for everyone</p>
            </div>
          </div>
        </div>

        {/* Right: Login Panel */}
        <div id="login" className="flex-1 flex justify-center items-center">
          <div className="bg-gray-700 p-10 rounded-lg shadow-lg w-80 flex flex-col space-y-4">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 rounded bg-gray-600 text-white placeholder-gray-400 focus:outline-blue-400"
            />
            <button
              onClick={handleLogin}
              className="bg-blue-500 p-2 rounded hover:bg-blue-600 text-white"
            >
              Login
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center p-4 mt-auto">
        © 2025 ChatApp. 
      </footer>
    </div>
  );
}

export default Landing;
