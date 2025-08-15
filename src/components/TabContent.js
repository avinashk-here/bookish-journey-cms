// colabcms/src/components/TabContent.js

import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Cell from "./Cell";

export default function TabContent() {
  const [cells, setCells] = useState([{ id: 1, isNew: false }]);

  const addCell = () => {
    const newCell = { id: Date.now(), isNew: true };
    setCells([...cells, newCell]);
  };

  // Remove isNew after 3 seconds
  useEffect(() => {
    const timers = cells
      .filter((cell) => cell.isNew)
      .map((cell) =>
        setTimeout(() => {
          setCells((prevCells) =>
            prevCells.map((c) =>
              c.id === cell.id ? { ...c, isNew: false } : c
            )
          );
        }, 3000)
      );

    return () => timers.forEach(clearTimeout);
  }, [cells]);

  return (
    <div>
      {cells.map(({ id, isNew }, index) => (
        //<Cell key={id} isNew={isNew} isAlternate={index % 2 === 1} />
        <Cell key={id} isNew={isNew} isAlternate={index % 2 === 1} cellIndex={index} />
      ))}

      <Button variant="secondary" onClick={addCell}>
        + New Cell
      </Button>
    </div>
  );
}
