import React from "react";
import { convertToTree } from "./utility";

const renderFormFields = (
  blocks,
  order,
  parentKey = "root",
  onEditClick,
  editingKey,
  handleEditChange,
  saveEdit
) => {
  const childrenKeys = order[parentKey];
  if (!childrenKeys || childrenKeys.length === 0) return null;

  return (
    <ul style={{ listStyle: "none", paddingLeft: "1rem" }}>
      {childrenKeys.map((key) => (
        <li key={parentKey + "." + key} style={{ marginBottom: "1rem" }}>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              marginBottom: "0.5rem",
            }}
          >
            {editingKey === key ? (
              <>
                <input
                  type="text"
                  value={blocks[key]?.label || ""}
                  onChange={(e) =>
                    handleEditChange(key, "label", e.target.value)
                  }
                  placeholder="Label"
                  style={{ marginBottom: "0.3rem", width: "80%" }}
                />
                <br />
                <input
                  type="text"
                  value={blocks[key]?.placeholder || ""}
                  onChange={(e) =>
                    handleEditChange(key, "placeholder", e.target.value)
                  }
                  placeholder="Placeholder"
                  style={{ marginBottom: "0.3rem", width: "80%" }}
                />
                <br />
                <button onClick={saveEdit}>Save</button>
              </>
            ) : (
              <>
                <label style={{ fontWeight: "bold" }}>
                  {blocks[key]?.label || key}
                </label>
                <button
                  style={{ marginLeft: "12px" }}
                  onClick={() => onEditClick(key)}
                >
                  Edit
                </button>
                <br />
                <input
                  placeholder={blocks[key]?.placeholder || ""}
                  style={{
                    width: "80%",
                    padding: "0.5rem",
                    marginTop: "0.3rem",
                  }}
                />
              </>
            )}
            {renderFormFields(
              blocks,
              order,
              key,
              onEditClick,
              editingKey,
              handleEditChange,
              saveEdit
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default function FormPreview({ blocks, order, setBlocks,setTreeData,editingKey,setEditingKey}) {

  const handleEditClick = (key) => {
    setEditingKey(key);
  };

  const handleEditChange = (key, field, value) => {
    setBlocks((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const saveEdit = () => {
    setTreeData(convertToTree(blocks,order))
    setEditingKey(null);
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <h3>Form Preview</h3>
      {/* {renderFormFields(blocks, order,'root',handleClick)} */}
      {renderFormFields(
        blocks,
        order,
        "root",
        handleEditClick,
        editingKey,
        handleEditChange,
        saveEdit
      )}
    </div>
  );
}


