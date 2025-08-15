// colabcms/src/App.js

import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import TabManager from "./components/TabManager";

function App() {
  const [currentTab, setCurrentTab] = useState(1);

  return (
    <Container>
      <h1 className="mt-3">React CMS</h1>
      <TabManager onTabChange={setCurrentTab} />
      <div className="mt-3">
        <h4>Currently Active Tab: {currentTab}</h4>
        {/* Later, we'll render TabContent here */}
      </div>
    </Container>
  );
}

export default App;
