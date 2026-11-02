// Hàm chuyển mảng phẳng thành mảng cây phân cấp
const createTree = (arr, parentId = null) => {
  const tree = [];
  arr.forEach((item) => {
    const itemParentId = item.parentId ? item.parentId.toString() : null;
    const compareParentId = parentId ? parentId.toString() : null;

    if (itemParentId === compareParentId) {
      const newItem = item.toObject ? item.toObject() : { ...item };
      const children = createTree(arr, item._id);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
};

// Hàm chuyển cây thành danh sách có gạch đầu dòng (để hiện trong dropdown chọn cha)
const createSelectTree = (arr, parentId = null, level = 1) => {
  let result = [];
  arr.forEach((item) => {
    const itemParentId = item.parentId ? item.parentId.toString() : null;
    const compareParentId = parentId ? parentId.toString() : null;

    if (itemParentId === compareParentId) {
      const prefix = Array(level).join('-- ');
      result.push({
        _id: item._id,
        name: `${prefix}${item.name}`
      });
      const children = createSelectTree(arr, item._id, level + 1);
      result = result.concat(children);
    }
  });
  return result;
};

module.exports = {
  createTree,
  createSelectTree
};