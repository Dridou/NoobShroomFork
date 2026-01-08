const COST_MAIN = [2, 3, 4, 4, 5, 5, 6, 6, 7, 9, 14, 20, 26, 32, 40, 48, 56, 65, 76, 100];
const COST_MID = [18, 22, 27, 31, 36, 40, 49, 59, 68, 72, 81, 90, 99, 108, 122, 135, 149, 171, 189, 216];
const COST_TEN = [153, 193, 233, 277, 313, 357, 430, 550, 667, 787];
const COST_FINAL = [1584];

export const isFinalNodeIndex = (index) => index === 9 || index === 19 || index === 29;

export const getNodeCostTable = (index) => {
  if (isFinalNodeIndex(index)) {
    return COST_FINAL;
  }

  if ([7, 8, 17, 18, 27, 28].includes(index)) {
    return COST_TEN;
  }

  if (
    [0, 1, 2, 10, 11, 12, 20, 21, 22].includes(index)
  ) {
    return COST_MAIN;
  }

  return COST_MID;
};

export const getNodePointStep = (index) => {
  if (isFinalNodeIndex(index)) {
    return 1;
  }

  if ([7, 8, 17, 18, 27, 28].includes(index)) {
    return 5;
  }

  return 10;
};

export const getNodeCost = (index, pointIndex) => {
  const table = getNodeCostTable(index);
  return table[pointIndex] ?? 0;
};
