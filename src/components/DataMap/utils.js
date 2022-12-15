import colormap from 'colormap';

const handleColorData = (data, year) => {
  let colors = colormap({
    colormap: 'bathymetry',
    nshades: 72,
    format: 'hex',
    alpha: 1
  });

  const sortedVals = Object.values(data[year]).sort((a, b) => a - b);
  const min = sortedVals[0];
  const max = sortedVals[sortedVals.length - 1];
  const range = max - min;

  const colorObj = {};

  Object.entries(data[year]).forEach(([key, value]) => {
    const distFromMin = value - min;
    const binningRatio = distFromMin / range;
    const indexRange = colors.length - 1;
    const colorIndex = Math.floor(binningRatio * indexRange);
    const color = colors[colorIndex];

    colorObj[key] = color;
  });

  return colorObj;
};

export { handleColorData };
