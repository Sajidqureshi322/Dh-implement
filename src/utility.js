
// export const convertToTree = (blocks, order, parentKey = "root", parentPath = "") => {
//   if (!order[parentKey]) return [];

//   return order[parentKey].map((key) => {
//     const fullKey = parentPath ? `${parentPath}.${key}` : key;
//     const block = blocks[fullKey] || {};

//     return {
//       key, // Short key for display
//       fullKey, // Full key for lookup in rendering
//       label: block.label || "",
//       ...(block.type !== "group" && { placeholder: block.placeholder || "" }),
//       type: block.type || "text",
//       children: convertToTree(blocks, order, fullKey, fullKey),
//     };
//   });
// };

export const convertToTree = (
  blocks,
  order,
  parentKey = "root",
  parentPath = ""
) => {
  if (!order[parentKey]) return [];

  return order[parentKey].map((key) => {
    const fullKey = parentPath ? `${parentPath}.${key}` : key;
    const block = blocks[fullKey] || {};
    const type = block.type || "text";

    const node = {
      key,
      label: block.label || "",
      type,
    };

    // Add placeholder only if not group
    if (type !== "group" && block.placeholder) {
      node.placeholder = block.placeholder;
    }

    // Recursively add children ONLY for group and using correct fullKey as parentKey
    if (type === "group" && order[fullKey]) {
      node.children = convertToTree(blocks, order, fullKey, fullKey);
    }

    return node;
  });
};


export const convertFromTree = (treeArray) => {
  const blocks = {};
  const order = {};

  const traverse = (nodes, parentPath = "root") => {
    order[parentPath] = [];

    for (const node of nodes) {
      const { key, fullKey, label, placeholder, type, children = [] } = node;
      const currentFullKey = fullKey || (parentPath === "root" ? key : `${parentPath}.${key}`);
      
      // Save block
      blocks[currentFullKey] = {
        key,
        label,
        type,
      };

      if (type !== "group" && placeholder) {
        blocks[currentFullKey].placeholder = placeholder;
      }

      // Add to order
      const shortKey = key;
      order[parentPath].push(shortKey);

      // Traverse children
      if (children.length > 0) {
        traverse(children, currentFullKey);
      }
    }
  };

  traverse(treeArray);
  return { blocks, order };
};

export const generateNewId = () => {
 
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
