import React, { useState } from "react";
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";

function App() {
  const [username, setUsername] = useState(""); // store logged-in username

  return username ? (
    <Chat username={username} /> // pass username to Chat
  ) : (
    <Landing onLogin={setUsername} /> // show landing page if not logged in
  );
}

export default App;
