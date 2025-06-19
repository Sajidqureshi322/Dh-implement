// import React from "react";
// import { convertToTree } from "./utility";

// const renderFormFields = (
//   blocks,
//   order,
//   parentKey = "root",
//   onEditClick,
//   editingKey,
//   handleEditChange,
//   saveEdit
// ) => {
//   const childrenKeys = order[parentKey];
//   if (!childrenKeys || childrenKeys.length === 0) return null;

//   return (
//     <ul style={{ listStyle: "none", paddingLeft: "1rem" }}>
//       {childrenKeys.map((key) => (
//         <li key={parentKey + "." + key} style={{ marginBottom: "1rem" }}>
//           <div
//             style={{
//               border: "1px solid #ccc",
//               padding: "1rem",
//               borderRadius: "8px",
//               backgroundColor: "#f9f9f9",
//               marginBottom: "0.5rem",
//             }}
//           >
//             {editingKey === key ? (
//               <>
//                 <input
//                   type="text"
//                   value={blocks[key]?.label || ""}
//                   onChange={(e) =>
//                     handleEditChange(key, "label", e.target.value)
//                   }
//                   placeholder="Label"
//                   style={{ marginBottom: "0.3rem", width: "80%" }}
//                 />
//                 <br />
//                 <input
//                   type="text"
//                   value={blocks[key]?.placeholder || ""}
//                   onChange={(e) =>
//                     handleEditChange(key, "placeholder", e.target.value)
//                   }
//                   placeholder="Placeholder"
//                   style={{ marginBottom: "0.3rem", width: "80%" }}
//                 />
//                 <br />
//                 <button onClick={saveEdit}>Save</button>
//               </>
//             ) : (
//               <>
//                 <label style={{ fontWeight: "bold" }}>
//                   {blocks[key]?.label || key}
//                 </label>
//                 <button
//                   style={{ marginLeft: "12px" }}
//                   onClick={() => onEditClick(key)}
//                 >
//                   Edit
//                 </button>
//                 <br />
//                 <input
//                   placeholder={blocks[key]?.placeholder || ""}
//                   style={{
//                     width: "80%",
//                     padding: "0.5rem",
//                     marginTop: "0.3rem",
//                   }}
//                 />
//               </>
//             )}
//             {renderFormFields(
//               blocks,
//               order,
//               key,
//               onEditClick,
//               editingKey,
//               handleEditChange,
//               saveEdit
//             )}
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// };

// export default function FormPreview({ blocks, order, setBlocks,setTreeData,editingKey,setEditingKey}) {

//   const handleEditClick = (key) => {
//     setEditingKey(key);
//   };

//   const handleEditChange = (key, field, value) => {
//     setBlocks((prev) => ({
//       ...prev,
//       [key]: {
//         ...prev[key],
//         [field]: value,
//       },
//     }));
//   };

//   const saveEdit = () => {
//     setTreeData(convertToTree(blocks,order))
//     setEditingKey(null);
//   };

//   return (
//     <div
//       style={{
//         height: "100%",
//         width: "100%",
//         padding: "1rem",
//         overflowY: "auto",
//       }}
//     >
//       <h3>Form Preview</h3>
//       {/* {renderFormFields(blocks, order,'root',handleClick)} */}
//       {renderFormFields(
//         blocks,
//         order,
//         "root",
//         handleEditClick,
//         editingKey,
//         handleEditChange,
//         saveEdit
//       )}
//     </div>
//   );
// }

import React from "react";
import { convertToTree } from "./utility";
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
              {childrenKeys.map((key, index) => (
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
                          position:'relative'
                        }}
                      >
                        <span
                          {...provided.dragHandleProps}
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
                        {editingKey === key ? (
                          <>
                            <input
                              type="text"
                              value={blocks[key]?.label || ""}
                              onChange={(e) =>
                                handleEditChange(key, "label", e.target.value)
                              }
                              placeholder="Label"
                              style={{
                                marginBottom: "0.3rem",
                                width: "80%",
                                display: "block",
                              }}
                            />
                            <input
                              type="text"
                              value={blocks[key]?.placeholder || ""}
                              onChange={(e) =>
                                handleEditChange(
                                  key,
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
                            <button onClick={saveEdit}>Save</button>
                          </>
                        ) : (
                          <>
                            <label style={{ fontWeight: "bold" }}>
                              {blocks[key]?.label || key}
                            </label>
                            <button
                              style={{ marginLeft: "12px" }}
                              onClick={() => handleEditClick(key)}
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

                        {/* Render children recursively */}
                        {renderFormFields(key)}
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
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
    </div>
  );
}
