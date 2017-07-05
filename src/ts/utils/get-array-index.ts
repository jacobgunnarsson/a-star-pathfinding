export const getArrayIndex = (array: any[], ...index: number[]): any => {
  let currentLevel = array;

  while (currentLevel && index.length > 0) {
    const thisIndex = index.shift();

    currentLevel = currentLevel[thisIndex] ? currentLevel[thisIndex] : undefined;
  }

  return currentLevel;
};
