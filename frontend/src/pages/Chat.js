import React, { useState, useEffect, useRef } from "react";

function Chat({ username }) {
  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  // 1️⃣ Fetch current user ID based on username
  useEffect(() => {
    const fetchUserId = async () => {
      const res = await fetch(`http://127.0.0.1:8000/login?username=${username}`);
      const data = await res.json();
      setUserId(data.userId);
    };
    fetchUserId();
  }, [username]);

  // 2️⃣ Fetch all users (for selection)
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("http://127.0.0.1:8000/users");
      const data = await res.json();
      // Remove current user from list
      setUsers(data.filter((u) => u.username !== username));
    };
    fetchUsers();
  }, [username]);

  // 3️⃣ WebSocket setup
  useEffect(() => {
    if (!userId || !recipient) return;

    ws.current = new WebSocket(`ws://127.0.0.1:8000/ws/${userId}`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (
        (data.sender_id === userId && data.recipient_id === recipient.id) ||
        (data.sender_id === recipient.id && data.recipient_id === userId)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    return () => ws.current?.close();
  }, [userId, recipient]);

  // 4️⃣ Fetch messages with selected recipient
  useEffect(() => {
    if (!userId || !recipient) return;
    const fetchMessages = async () => {
      const res = await fetch(`http://127.0.0.1:8000/messages/${userId}/${recipient.id}`);
      const data = await res.json();
      setMessages(data);
    };
    fetchMessages();
  }, [recipient, userId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    if (ws.current.readyState === WebSocket.OPEN) {
      const message = {
        sender_id: userId,
        recipient_id: recipient.id,
        content: input,
      };
      ws.current.send(JSON.stringify(message));
      setMessages((prev) => [...prev, { ...message, timestamp: new Date() }]);
      setInput("");
    }
  };

  return (
    <div className="chat-container flex flex-col h-full p-4 bg-gray-900 text-white">
      <h2>Welcome, {username}</h2>

      {!recipient && (
        <div>
          <p>Select a user to chat with:</p>
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => setRecipient(u)}
              className="bg-blue-500 m-1 p-2 rounded hover:bg-blue-600"
            >
              {u.username}
            </button>
          ))}
        </div>
      )}

      {recipient && (
        <>
          <h3>Chatting with {recipient.username}</h3>
          <div className="messages flex-1 overflow-y-auto mb-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 my-1 rounded ${
                  msg.sender_id === userId ? "bg-blue-500 self-end" : "bg-gray-700 self-start"
                }`}
              >
                {msg.content}
                <div className="text-xs text-gray-300">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>

          <div className="input flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-l bg-gray-800 text-white focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 px-4 rounded-r hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Chat;
