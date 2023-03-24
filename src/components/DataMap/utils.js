import percentile from 'percentile';
const handleBinning = ({ geoJSON, colors, indicator, numOfBins }) => {
  const binArray = [];
  const pRange = Math.floor(100/numOfBins);

  const valueArray = geoJSON.features.map(feature => 
    feature.properties[indicator]).sort();

  console.log(valueArray);

  for (let i=0; i<numOfBins; i++) {
    let p = null;
    const m = i + 1; 
    if (i !== (numOfBins - 1)) {
      p = percentile(pRange * m, valueArray);
    } else (
      p = 100
    );
    binArray.push({
      percentile: p,
      color: colors[i]
    });
  }

  console.log(binArray);

  
  return binArray;

};

export { handleBinning };
