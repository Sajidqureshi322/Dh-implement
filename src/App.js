import "./App.css";
import ShowJson from "./ShowJson";
import FormPreview from "./FormPreview";
import { useState } from "react";
import { convertToTree, convertFromTree } from "./utility";

function App() {
  const [editingKey, setEditingKey] = useState(null);

  const initialBlocks = {
    A: { Key:'A',label: "Root1", type: "group" },
    "A.A1": { label: "Child A1", type: "group" },
    "A.A1.A1a": { label: "Child A1a", type: "group" },
    "A.A1.A1a.A1a1": {
      label: "Child A1a1",
      placeholder: "Inside A1a1",
      type: "text",
    },
    "A.A2": {
      label: "Child A2",
      placeholder: "Child of A",
      type: "text",
    },
    B: { label: "Root2", type: "group" },
    "B.B1": {
      label: "Child B1",
      placeholder: "Child of B",
      type: "text",
    },
  };
  
  const initialOrder = {
    root: ["A", "B"],
    A: ["A1", "A2"],
    "A.A1": ["A1a"],
    "A.A1.A1a": ["A1a1"],
    B: ["B1"],
  };
  
  const [blocks, setBlocks] = useState(initialBlocks);
  const [order, setOrder] = useState(initialOrder);
  const [treeData, setTreeData] = useState(
    convertToTree(initialBlocks, initialOrder)
  );

  const handleTreeDataUpdate = (newTreeData) => {
    setTreeData(newTreeData);
    const { blocks: newBlocks, order: newOrder } = convertFromTree(newTreeData);
    setBlocks(newBlocks);
    setOrder(newOrder);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        gap: "2rem",
      }}
    >
      <ShowJson
        treeData={treeData}
        setTreeData={handleTreeDataUpdate}
        setBlocks={setBlocks}
        setOrder={setOrder}
        editingKey={editingKey}
      />
      <div style={{ border: "1px solid black", height: "100vh" }} />
      <FormPreview
        blocks={blocks}
        order={order}
        setOrder={setOrder}
        setBlocks={setBlocks}
        setTreeData={setTreeData}
        editingKey={editingKey}
        setEditingKey={setEditingKey}
      />
    </div>
  );
}

export default App;
