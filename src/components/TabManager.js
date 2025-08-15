// colabcms/src/components/TabManager.js

import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import TabContent from "./TabContent";

export default function TabManager() {
  const [tabs, setTabs] = useState([{ id: 1, title: "Tab 1" }]);
  const [activeTab, setActiveTab] = useState(1);

  const addTab = () => {
    const newId = Date.now();
    setTabs([...tabs, { id: newId, title: `Tab ${tabs.length + 1}` }]);
    setActiveTab(newId);
  };

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => {
          if (k === "add-tab") {
            addTab();
          } else {
            setActiveTab(Number(k));
          }
        }}
        id="cms-tabs"
        className="mb-3"
      >
        {tabs.map((tab) => (
          <Tab eventKey={tab.id} title={tab.title} key={tab.id}>
            <TabContent />
          </Tab>
        ))}

        {/* "+" tab */}
        <Tab
          eventKey="add-tab"
          title={
            <span style={{ fontWeight: "bold", fontSize: "18px" }}>+</span>
          }
        />
      </Tabs>
    </div>
  );
}
