// colabcms/src/App.js
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import TabManager from "./components/TabManager";
import Login from "./components/Login";
import { logSheet } from "./utils/sheetUtils";
import logoutIcon from "./utils/assets/Logoutbtn.png"; // Assuming you have a logout icon


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
      
    <TabManager user={user} onLogout={handleLogout} />


    </Container>
  );
}

export default App;