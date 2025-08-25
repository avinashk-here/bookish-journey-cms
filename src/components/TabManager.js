// src/components/TabManager.js
import React, { useState } from "react";
import Cell from "./Cell";
import models from "../data/models.json";
import prompts from "../data/prompts.json";

export default function TabManager({ user, onLogout }) {
  const makeCell = () => ({
    cellId: Date.now(),
    context: "",
    model: models[0].value,
    prompt: prompts[0].value,
    output: "",
    loading: false,
    isCustomPrompt: false,
    savedPrompts: JSON.parse(localStorage.getItem("savedPrompts") || "[]"),
  });

  const [tabs, setTabs] = useState([
    { id: 1, title: "Tab 1", cells: [makeCell()] },
  ]);
  const [activeTab, setActiveTab] = useState(1);

  const updateCell = (tabId, cellId, patch) =>
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              cells: tab.cells.map((c) =>
                c.cellId === cellId ? { ...c, ...patch } : c
              ),
            }
          : tab
      )
    );

  const addTab = () => {
    const newId = Date.now();
    setTabs((prev) => [
      ...prev,
      { id: newId, title: `Tab ${prev.length + 1}`, cells: [makeCell()] },
    ]);
    setActiveTab(newId);
  };

  const closeTab = (idToClose) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((t) => t.id !== idToClose);
    setTabs(newTabs);
    if (idToClose === activeTab) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };

  const addCell = (tabId) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId
          ? { ...tab, cells: [...tab.cells, makeCell()] }
          : tab
      )
    );
  };

  const active = tabs.find((t) => t.id === activeTab);

  return (
    <div className="d-flex vh-100">
      <div className="flex-grow-1 p-3" style={{ marginRight: 220 }}>
        {active?.cells.map((c, idx) => (
          <Cell
            key={c.cellId}
            data={c}
            onChange={(patch) => updateCell(active.id, c.cellId, patch)}
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

      <div
        className="d-flex flex-column bg-light border-start p-2"
        style={{
          width: 240,
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="tab-card d-flex justify-content-between align-items-center mb-2 p-2"
            style={{
              cursor: "pointer",
              backgroundColor: activeTab === tab.id ? "#4D4ACD" : "",
              color: activeTab === tab.id ? "#fff" : "#000",
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
                  color: activeTab === tab.id ? "#fff" : "#6b6b6bff",
                }}
                onClick={(e) => {
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

        <div className="flex-grow-1" />
        <div
          className="text-center small mb-1 mt-auto"
          style={{
            color: "#000",
            fontSize: "0.9rem",
            fontFamily: "Spline Sans, sans-serif",
          }}
        >
          Hi, {user?.fullName || "Guest"}
        </div>
        <button
          className="btn btn-sm w-100"
          style={{
            color: "#fff",
            backgroundColor: "#000",
            border: "1px solid #000",
            fontFamily: "Spline Sans, sans-serif",
            cursor: "pointer",
          }}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}