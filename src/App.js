// colabcms/src/App.js
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import TabManager from "./components/TabManager";
import Login from "./components/Login";
import { logSheet } from "./utils/sheetUtils";


function App() {
  const [user, setUser] = useState(null);

     const handleLogout = async () => {
      await logSheet({
     CreatorName: user.fullName,
     CreatorUserName: user.userId,
     LogoutTime: new Date().toISOString()
   });
     setUser(null);
   };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <Container className="text-center mt-4">
      <h1>Welcome, {user.fullName}</h1>
      <button onClick={handleLogout} className="btn btn-outline-danger mb-3">
        Logout
      </button>
      <TabManager />
    </Container>
  );
}

export default App;