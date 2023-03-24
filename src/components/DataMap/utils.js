const handleColorData = ({ data, colors }) => {
  const [mostRecentYear] = Object.keys(data).sort((a, b) => a - b);
  const sortedVals = Object.values(data[mostRecentYear])
    .filter(a => a >= 0)
    .sort((a, b) => a - b);
  const min = sortedVals[0];
  const max = sortedVals[sortedVals.length - 1];
  const range = max - min;

  const colorObj = {};

  Object.entries(data[mostRecentYear]).forEach(([key, value]) => {
    const distFromMin = value - min;
    const binningRatio = distFromMin / range;
    const indexRange = colors.length - 1;
    const colorIndex = Math.floor(binningRatio * indexRange);
    const color = colors[colorIndex];

    colorObj[key] = color;
  });

  return { colorObj: colorObj, min: min, max: max };
};

export { handleColorData };
