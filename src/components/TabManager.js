// src/components/TabManager.js
import React, { useState } from "react";
import Cell from "./Cell";              // NEW import
// Tabs, Tab imports removed – we’re not using them any more

export default function TabManager({user}) {
  // Each tab now owns its own cells
  const [tabs, setTabs] = useState([
    { id: 1, title: "Tab 1", cells: [{ cellId: Date.now() }] }
  ]);
  const [activeTab, setActiveTab] = useState(1);

  /* ---------- helpers ---------- */
  const addTab = () => {
    const newId = Date.now();
    setTabs([...tabs, { id: newId, title: `Tab ${tabs.length + 1}`, cells: [{ cellId: Date.now() }] }]);
    setActiveTab(newId);
  };

  const closeTab = (idToClose) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== idToClose);
    setTabs(newTabs);
    if (idToClose === activeTab) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };

  const addCell = (tabId) => {
    setTabs(tabs =>
      tabs.map(tab =>
        tab.id === tabId
          ? { ...tab, cells: [...tab.cells, { cellId: Date.now() }] }
          : tab
      )
    );
  };

  /* ---------- render ---------- */
  const active = tabs.find(t => t.id === activeTab);

  return (
    <div className="d-flex vh-100">
      {/* Main content area */}
      <div className="flex-grow-1 p-3" style={{ marginRight: 220 }}>
        {active.cells.map((c, idx) => (
          <Cell
            key={c.cellId}
            isNew={false}
            isAlternate={idx % 2 === 1}
            cellIndex={idx}
          />
        ))}

        <button
          className="btn btn-outline-primary mt-2"
          onClick={() => addCell(active.id)}
        >
          + Add Cell
        </button>
      </div>

      {/* Right vertical tab list (unchanged look) */}
      <div
        className="d-flex flex-column bg-light border-start p-2"
        style={{ width: 240,
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          overflowY: 'auto'
         }}
      >
        {tabs.map(tab => (
          <div
            key={tab.id}
            className="tab-card d-flex justify-content-between align-items-center mb-2 p-2"
            style={{
              cursor: "pointer",
              backgroundColor: activeTab === tab.id ? "#4D4ACD" : "",
              color: activeTab === tab.id ? "#fff" : "#000"
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.title}</span>
            {tabs.length > 1 && (
              <span
                style={{
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: "bold",
                  color: activeTab === tab.id ? "#fff" : "#6b6b6bff"
                }}
                onClick={e => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                X
              </span>
            )}
          </div>
        ))}
        <div
          className="tab-card text-center mt-2"
          style={{ cursor: "pointer", fontSize: 20, color: "#4D4ACD" }}
          onClick={addTab}
        >
          +
        </div>

        {/* 3. Spacer pushes greeting & logout to bottom */}
       <div className="flex-grow-1" />

       {/* 4. Greeting & Logout */}
       <div className="text-center small mb-1 mt-auto" 
            style={{ color: "#000", fontSize: "0.9rem", fontFamily: "Spline Sans, sans-serif" }}>
         {/* Assuming user.fullName is available */}
         Hi, {user?.fullName || 'Guest'}
       </div>
       <button
          className="btn btn-sm w-100"
          style={{
            color: '#fff',
            backgroundColor: '#000',
            border: '1px solid #000',
            fontFamily: 'Spline Sans, sans-serif',
            cursor: 'pointer'
          }}
          onClick={() => alert('Logout clicked!')}
        >
          Logout
      </button>
      </div>
    </div>
  );
}