import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

function Chat({ username, onLogout }) {
  const [messages, setMessages] = useState([
    { from: "me", text: "Hey there! 👋" },
    { from: "xyz", text: "Hi! How are you?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { from: "me", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold text-blue-400">ChatApp</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-300">Logged in as: {username}</span>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Chat Area */}
      <main className="flex-1 flex">
        {/* Sidebar (Active Users) */}
        <aside className="hidden md:flex flex-col w-60 bg-gray-800 p-4 border-r border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Active Users</h2>
          <ul className="space-y-2">
            <li className="text-gray-300">xyz</li>
            <li className="text-gray-300">abc</li>
            <li className="text-gray-300">guest123</li>
          </ul>
        </aside>

        {/* Messages Section */}
        <section className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.from === "me"
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-gray-700 text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex items-center p-4 bg-gray-800 border-t border-gray-700">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-500 hover:bg-blue-600 p-3 rounded"
            >
              <FaPaperPlane />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Chat;
