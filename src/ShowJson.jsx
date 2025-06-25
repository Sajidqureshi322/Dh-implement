import React, { useEffect, useState } from "react";
import { convertFromTree } from "./utility";
import "./ShowJson.css";

export default function ShowJson({
  treeData,
  setTreeData,
  setBlocks,
  setOrder,
  editingKey,
  dropdownValues,
}) {
  const [jsonText, setJsonText] = useState("");

  useEffect(() => {
    const combined = {
      formFields: treeData,
      selectedLocation: dropdownValues,
    };
    setJsonText(JSON.stringify(combined, null, 2));
  }, [treeData, dropdownValues]);

  const handleChange = (e) => {
    const newText = e.target.value;
    setJsonText(newText);
    try {
      const parsed = JSON.parse(newText);
      if (Array.isArray(parsed.formFields)) {
        setTreeData(parsed.formFields);
        const { blocks: newBlocks, order: newOrder } = convertFromTree(
          parsed.formFields
        );
        setBlocks(newBlocks);
        setOrder(newOrder);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ height: "100%", width: "100%", padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3>JSON View</h3>
        {editingKey && (
          <div className="editing-indicator">
            <span className="dot-loader" /> Editing...
          </div>
        )}
      </div>
      <textarea
        placeholder="Enter JSON here..."
        style={{
          width: "100%",
          height: "100%",
          resize: "none",
          padding: "0.5rem",
          fontSize: "1rem",
          backgroundColor: "black",
          color: "white",
        }}
        value={jsonText}
        onChange={handleChange}
      />
    </div>
  );
}
