import percentile from 'percentile';

const handleBinning = ({ geoJSON, colors, indicator, numOfBins }) => {
  const binArray = [];
  const pRange = Math.floor(100 / numOfBins);

  const valueArray = geoJSON.features
    .map(feature => feature.properties[indicator])
    .sort((a, b) => parseFloat(a) - parseFloat(b));
  // console.log(valueArray, colors[0]);
  for (let i = 0; i < numOfBins; i++) {
    let p = null;
    const m = i + 1;
    if (i !== numOfBins - 1) {
      p = percentile(pRange * m, valueArray);
    } else p = valueArray[valueArray.length - 1]; // Using percentile(100, valueArray) cause issues with pop_asian and other cases

    binArray.push({
      label: p,
      percentile: p,
      color: colors[i]
    });
  }
  return binArray;
};

export { handleBinning };
