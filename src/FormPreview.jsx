// Inside FormPreview.jsx

import React, { useState } from "react";
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
  dropdownValues,
  setDropdownValues,
}) {
  const [code, setCode] = useState("// Write your JS code here\n");
  const [dynamicDropdowns, setDynamicDropdowns] = useState([]);
  const [dropdownData, setDropdownData] = useState({});

  const handleProcessCode = () => {
    try {
      // eslint-disable-next-line no-new-func
      const func = new Function("dropdownData", code);
      const result = func(dropdownData);
      if (Array.isArray(result)) {
        setDynamicDropdowns(result);
        setDropdownData({});
        alert("Dropdowns generated successfully.");
      } else {
        alert("JS code must return an array of dropdown configs.");
      }
    } catch (err) {
      alert("Error in JS code: " + err.message);
    }
  };

  const handleDropdownChange = (key, value) => {
   const updatedData = { ...dropdownData, [key]: value };

// Reset dependent dropdowns
dynamicDropdowns.forEach((dropdown) => {
  if (dropdown.dependsOn === key) {
    updatedData[dropdown.key] = ""; // Clear child value
  }
});

setDropdownData(updatedData);

  };

  const locationDataArray = [
    {
      country: "India",
      states: [
        {
          state: "Maharashtra",
          cities: [
            {
              city: "Pune",
              villages: ["Baner", "Hinjewadi"],
            },
            {
              city: "Mumbai",
              villages: ["Andheri", "Borivali"],
            },
          ],
        },
        {
          state: "Gujarat",
          cities: [
            {
              city: "Surat",
              villages: ["Adajan", "Katargam"],
            },
          ],
        },
      ],
    },
    {
      country: "USA",
      states: [
        {
          state: "California",
          cities: [
            {
              city: "SanFrancisco",
              villages: ["Downtown", "SOMA"],
            },
            {
              city: "LA",
              villages: ["Hollywood", "Venice"],
            },
          ],
        },
      ],
    },
  ];

  const getStates = (country) => {
    return (
      locationDataArray.find((c) => c.country === country)?.states || []
    ).map((s) => s.state);
  };

  const getCities = (country, state) => {
    const states = locationDataArray.find((c) => c.country === country)?.states || [];
    const stateObj = states.find((s) => s.state === state);
    return (stateObj?.cities || []).map((c) => c.city);
  };

  const getVillages = (country, state, city) => {
    const states = locationDataArray.find((c) => c.country === country)?.states || [];
    const stateObj = states.find((s) => s.state === state);
    const cityObj = stateObj?.cities.find((c) => c.city === city);
    return cityObj?.villages || [];
  };

  const dropdownFields = [
    {
      key: "country",
      label: "Country",
      options: locationDataArray.map((c) => c.country),
      dependsOn: null,
    },
    {
      key: "state",
      label: "State",
      options: dropdownValues.country ? getStates(dropdownValues.country) : [],
      dependsOn: "country",
    },
    {
      key: "city",
      label: "City",
      options:
        dropdownValues.country && dropdownValues.state
          ? getCities(dropdownValues.country, dropdownValues.state)
          : [],
      dependsOn: "state",
    },
    {
      key: "village",
      label: "Village",
      options:
        dropdownValues.country &&
        dropdownValues.state &&
        dropdownValues.city
          ? getVillages(
              dropdownValues.country,
              dropdownValues.state,
              dropdownValues.city
            )
          : [],
      dependsOn: "city",
    },
  ];

  const updateDropdown = (key, value) => {
    const newValues = { ...dropdownValues, [key]: value };
    const keysToReset = dropdownFields
      .filter(
        (field) =>
          field.dependsOn === key || field.dependsOn?.startsWith(key)
      )
      .map((field) => field.key);

    for (let resetKey of keysToReset) {
      newValues[resetKey] = "";
    }

    setDropdownValues(newValues);
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
              {childrenKeys.map((key, index) => {
                const fullKey =
                  parentKey === "root" ? key : `${parentKey}.${key}`;
                const block = blocks[fullKey];

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
                          <label style={{ fontWeight: "bold" }}>
                            {block?.label || fullKey}
                          </label>
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
                            />
                          )}
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
    <div style={{ height: "100%", width: "100%", padding: "1rem", overflowY: "auto" }}>
      <h3>Form Preview (Draggable)</h3>
      {renderFormFields("root")}

      {/* Location Dropdowns */}
      <div style={{ marginTop: "2rem", width: "80%" }}>
        <h3>Location Selector</h3>
        {dropdownFields.map((field) => {
          const show = !field.dependsOn || dropdownValues[field.dependsOn] !== "";

          return (
            show && (
              <div key={field.key} style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.3rem" }}>
                  {field.label}
                </label>
                <select
                  value={dropdownValues[field.key]}
                  onChange={(e) => updateDropdown(field.key, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem",
                    fontSize: "1rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )
          );
        })}
      </div>

      {/* JS Code Editor */}
      <div style={{ marginTop: "2rem", width: "80%" }}>
        <h3>Custom JavaScript Editor</h3>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={10}
          style={{
            width: "100%",
            padding: "1rem",
            fontFamily: "monospace",
            fontSize: "1rem",
            backgroundColor: "#1e1e1e",
            color: "#dcdcdc",
            borderRadius: "6px",
            border: "1px solid #555",
          }}
        />

        <button
          onClick={handleProcessCode}
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}  
        >
          Process Code
        </button>

        {/* Dynamic Dropdowns */}
        {dynamicDropdowns.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Dynamic Dropdowns</h3>
            {dynamicDropdowns.map((dropdown) => {
              const shouldShow =
                !dropdown.dependsOn ||
                dropdownData[dropdown.dependsOn] === dropdown.value;

              return (
                shouldShow && (
                  <div key={dropdown.key} style={{ marginBottom: "1rem" }}>
                    <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.3rem" }}>
                      {dropdown.key}:
                    </label>
                    <select
                      value={dropdownData[dropdown.key] || ""}
                      onChange={(e) => handleDropdownChange(dropdown.key, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.6rem",
                        fontSize: "1rem",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="">Select</option>
                      {dropdown.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
