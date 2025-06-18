import "./App.css";
import ShowJson from "./ShowJson";
import FormPreview from "./FormPreview";
import { useState } from "react";
import { convertToTree, convertFromTree } from "./utility";

function App() {
  const [editingKey, setEditingKey] = useState(null);

  const initialBlocks = {
    A: { label: "Root1", placeholder: "Sample A" },
    B: { label: "Root2", placeholder: "Sample B" },
    "A.A1": { label: "Child A1", placeholder: "Child of A" },
    "A.A2": { label: "Child A2", placeholder: "Child of A" },
    "A.A1.A1a": { label: "Child A1a", placeholder: "Child of A.A1" },
    "A.A1.A1a.A1a1": { label: "Child A1a1", placeholder: "Child of A.A1.A1a" },
    "B.B1": { label: "Child B1", placeholder: "Child of B" },
  };

  // const initialOrder = {
  //   root: ["A", "B"],
  //   A: ["A.A1", "A.A2"],
  //   "A.A1": ["A.A1.A1a"],
  //   "A.A1.A1a": ["A.A1.A1a.A1a1"],
  //   B: ["B.B1"],
  // };
  const initialOrder = {
    root: ["A", "B"],
    A: ["A1", "A2"],
    "A1": ["A1a"],
    "A1a": ["A1a1"],
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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100%", gap: "2rem" }}>
      <ShowJson treeData={treeData} setTreeData={handleTreeDataUpdate} setBlocks={setBlocks} setOrder={setOrder} editingKey={editingKey} />
      <div style={{ border: "1px solid black", height: "100vh" }} />
      <FormPreview blocks={blocks} order={order} setBlocks={setBlocks} setTreeData={setTreeData} editingKey={editingKey} setEditingKey={setEditingKey}/>
    </div>
  );
}

export default App;
