import React, { useState } from "react";
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";

function App() {
  const [user, setUser] = useState("");

  return user ? <Chat username={user} /> : <Landing onLogin={setUser} />;
}

export default App;
