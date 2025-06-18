import React, { useEffect, useState } from "react";
import { convertFromTree } from "./utility";
import './ShowJson.css'
export default function ShowJson({
  treeData,
  setTreeData,
  setBlocks,
  setOrder,
  editingKey,
}) {
  const [jsonText, setJsonText] = useState(JSON.stringify(treeData, null, 2));

  useEffect(() => {
    console.log("use effect in show json");
    setJsonText(JSON.stringify(treeData, null, 2));
  }, [treeData]);

  const handleChange = (e) => {
    const newText = e.target.value;
    setJsonText(newText);
    try {
      const parsed = JSON.parse(newText);
      if (Array.isArray(parsed)) {
        setTreeData(parsed);
        const { blocks: newBlocks, order: newOrder } = convertFromTree(parsed);
        setBlocks(newBlocks);
        setOrder(newOrder);
      }
    } catch (err) {
      console.error(err);
    }
  };
  console.log("json text : ", jsonText);
  return (
    <>
      <div
        style={{
          //   border: "2px solid black",
          height: "100%",
          width: "100%",
          padding: "1rem",
          boxSizing: "border-box",
          // marginTop: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3>JSON View</h3>

          {editingKey && (
            // <div
            //   style={{
            //     // color: "red",
            //     fontWeight: "bold",
            //   }}
            // >
            //   🔴 Editing... ({editingKey})
            // </div>
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
            boxSizing: "border-box",
            backgroundColor: "black",
            color: "white",
          }}
          value={jsonText}
          onChange={handleChange}
        />
      </div>
    </>
  );
}
