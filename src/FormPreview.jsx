import React, { useState } from "react";
import { convertToTree, generateNewId } from "./utility";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function FormPreview({
  blocks,
  order,
  setOrder,
  setBlocks,
  setTreeData,
  editingKey,
  setEditingKey,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [modalParentKey, setModalParentKey] = useState("root");
  const [newFieldData, setNewFieldData] = useState({
    label: "",
    placeholder: "",
    type: "text",
  });

  const handleEditClick = (key) => {
    setEditingKey(key);
  };

  // const handleEditChange = (key, field, value) => {
  //   setBlocks((prev) => {
  //     const updated = {
  //       ...prev,
  //       [key]: {
  //         ...prev[key],
  //         [field]: value,
  //       },
  //     };
  
  //     // ✅ Also update treeData after every change
  //     setTreeData(convertToTree(updated, order));
  
  //     return updated;
  //   });
    
  // };
  // const handleEditChange = (key, field, value) => {
  //   setBlocks((prev) => {
  //     console.log("prev : ",prev)
  //     const updated = {
  //       ...prev,
  //       [key]: {
  //         ...prev[key],
  //         [field]: value,
  //       },
  //     };
  
  //     // 🔁 If value changed, reset dependents
  //     if (field === "value") {
  //       Object.entries(prev).forEach(([otherKey, otherBlock]) => {
  //         console.log({otherBlock,otherKey})
  //         if (
  //           Array.isArray(otherBlock.depends_on) &&
  //           otherBlock.depends_on.includes(key)
  //         ) {
  //           updated[otherKey] = {
  //             ...updated[otherKey],
  //             value: "", // Reset dependent value
  //           };
  //         }
  //       });
  //     }
  
  //     // Update the treeData as well
  //     setTreeData(convertToTree(updated, order));
  //     return updated;
  //   });
  // };
  console.log('blocks : ',blocks)
  const handleEditChange = (key, field, value) => {
    setBlocks((prev) => {
      const updated = {
        ...prev,
        [key]: {
          ...prev[key],
          [field]: value,
        },
      };
  
      // Only if changing `value` field
      if (field === "value") {
        // Step 1: Build reverse dependency graph
        const reverseDepMap = {};
        for (const [k, b] of Object.entries(updated)) {
          if (b.depends_on) {
            for (const dep of b.depends_on) {
              if (!reverseDepMap[dep]) reverseDepMap[dep] = [];
              reverseDepMap[dep].push(k);
            }
          }
        }
  
        // Step 2: Recursively clear all dependents of this key
        const clearDependents = (targetKey) => {
          if (!reverseDepMap[targetKey]) return;
  
          for (const depKey of reverseDepMap[targetKey]) {
            if (updated[depKey]?.value !== "") {
              updated[depKey].value = "";
            }
            clearDependents(depKey); // Recursively clear further
          }
        };
  
        clearDependents(key);
      }
  
      setTreeData(convertToTree(updated, order));
      return updated;
    });
  };
    

  const saveEdit = () => {
    setTreeData(convertToTree(blocks, order));
    setEditingKey(null);
  };

  const handleDragEnd = (result, parentKey) => {
    if (!result.destination) return;

    const newOrder = Array.from(order[parentKey]);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);

    setOrder((prev) => {
      const updatedOrder = { ...prev, [parentKey]: newOrder };
      setTreeData(convertToTree(blocks, updatedOrder));
      return updatedOrder;
    });
  };

  const handleAddField = () => {
    const id = generateNewId();
    const newKey = `${modalParentKey}.${id}`;

    const updatedBlocks = {
      ...blocks,
      [newKey]: {
        label: newFieldData.label,
        type: newFieldData.type,
        ...(newFieldData.type !== "group" && {
          placeholder: newFieldData.placeholder,
        }),
      },
    };
    if(newFieldData.type !== 'group')
        updatedBlocks.value = "";

    const updatedOrder = {
      ...order,
      [modalParentKey]: [...(order[modalParentKey] || []), id],
    };

    setBlocks(updatedBlocks);
    setOrder(updatedOrder);
    setTreeData(convertToTree(updatedBlocks, updatedOrder));

    // Reset
    setNewFieldData({ label: "", placeholder: "", type: "text" });
    setOpenModal(false);
  };

  

  const renderFormFields = (parentKey = "root") => {
    const childrenKeys = order[parentKey];
    if (!childrenKeys || childrenKeys.length === 0) return null;

    return (
      <DragDropContext onDragEnd={(result) => handleDragEnd(result, parentKey)}>
        <Droppable droppableId={parentKey}>
          {(provided) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ listStyle: "none", paddingLeft: "1rem" }}
            >
              {childrenKeys.map((key, index) => {
                const fullKey =
                  parentKey === "root" ? key : `${parentKey}.${key}`;
                const block = blocks[fullKey];
                // Check depends_on logic
                if (block?.depends_on?.length > 0) {
                  const shouldRender = block.depends_on.every((depKey) => {
                    const depBlock = blocks[depKey];
                    return depBlock && depBlock.value !== "";
                  });
                  if (!shouldRender) return null;
                }

                return (
                  <Draggable key={key} draggableId={key} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          marginBottom: "1rem",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <div
                          style={{
                            border: "1px solid #ccc",
                            padding: "1rem",
                            borderRadius: "8px",
                            backgroundColor: "#f9f9f9",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            position: "relative",
                          }}
                        >
                          <span
                            style={{
                              cursor: "grab",
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                              fontSize: "1.2rem",
                              userSelect: "none",
                            }}
                          >
                            ☰
                          </span>

                          {editingKey === fullKey ? (
                            <>
                              <input
                                type="text"
                                value={block?.label || ""}
                                onChange={(e) =>
                                  handleEditChange(
                                    fullKey,
                                    "label",
                                    e.target.value
                                  )
                                }
                                placeholder="Label"
                                style={{
                                  marginBottom: "0.3rem",
                                  width: "80%",
                                  display: "block",
                                }}
                              />
                              {block.type !== "group" && (
                                <input
                                  type="text"
                                  value={block?.placeholder || ""}
                                  onChange={(e) =>
                                    handleEditChange(
                                      fullKey,
                                      "placeholder",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Placeholder"
                                  style={{
                                    marginBottom: "0.3rem",
                                    width: "80%",
                                    display: "block",
                                  }}
                                />
                              )}
                              <button onClick={saveEdit}>Save</button>
                            </>
                          ) : (
                            <>
                              <label style={{ fontWeight: "bold" }}>
                                {block?.label || fullKey}
                              </label>
                              <button
                                style={{ marginLeft: "12px" }}
                                onClick={() => handleEditClick(fullKey)}
                              >
                                Edit
                              </button>

                              {/* Only for group */}
                              {block?.type === "group" && (
                                <button
                                  style={{ marginLeft: "10px" }}
                                  onClick={() => {
                                    setModalParentKey(fullKey);
                                    setOpenModal(true);
                                  }}
                                >
                                  ➕ Add Field
                                </button>
                              )}
                              <br />

                              {block?.type !== "group" && (
                                <input
                                  placeholder={block?.placeholder || ""}
                                  style={{
                                    width: "80%",
                                    padding: "0.5rem",
                                    marginTop: "0.3rem",
                                  }}
                                  type={block?.type || "text"}
                                  onChange={(e) =>
                                    handleEditChange(
                                      fullKey,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                  value={block?.value || ""}
                                />
                              )}
                            </>
                          )}

                          {/* Children - only for group */}
                          {block?.type === "group" && renderFormFields(fullKey)}
                        </div>
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    );
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
      <h3>Form Preview (Draggable)</h3>
      {renderFormFields("root")}

      {/* Modal */}
      {openModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              minWidth: "300px",
            }}
          >
            <h3>Add New Field</h3>
            <input
              type="text"
              placeholder="Label"
              value={newFieldData.label}
              onChange={(e) =>
                setNewFieldData({ ...newFieldData, label: e.target.value })
              }
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
            {newFieldData.type !== "group" && (
              <input
                type="text"
                placeholder="Placeholder"
                value={newFieldData.placeholder}
                onChange={(e) =>
                  setNewFieldData({
                    ...newFieldData,
                    placeholder: e.target.value,
                  })
                }
                style={{ width: "100%", marginBottom: "0.5rem" }}
              />
            )}
            <select
              value={newFieldData.type}
              onChange={(e) =>
                setNewFieldData({ ...newFieldData, type: e.target.value })
              }
              style={{ width: "100%", marginBottom: "0.5rem" }}
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
              <option value="date">Date</option>
              <option value="group">Group</option>
            </select>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <button onClick={() => setOpenModal(false)}>Cancel</button>
              <button onClick={handleAddField}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
