export const convertToTree = (blocks, order, parentKey = "root") => {
  if (!order[parentKey]) return [];

  return order[parentKey].map((key) => ({
    key,
    label: blocks[key]?.label || "",
    placeholder: blocks[key]?.placeholder || "",
    children: convertToTree(blocks, order, key),
  }));
};
export const convertFromTree = (treeArray) => {
  const blocks = {};
  const order = {};

  const traverse = (nodes, parentKey = "root") => {
    order[parentKey] = [];

    for (const node of nodes) {
      const { key, label, placeholder, children = [] } = node;
      blocks[key] = { label, placeholder };
      order[parentKey].push(key);

      if (children.length > 0) {
        traverse(children, key);
      }
    }
  };

  traverse(treeArray);
  return { blocks, order };
};
