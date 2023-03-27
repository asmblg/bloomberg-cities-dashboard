import percentile from 'percentile';
import incrementDecimalNumber from '../../utils/incrementDecimalNumber';

const handleBinning = ({ geoJSON, colors, indicator, numOfBins }) => {
  const binArray = [];
  const pRange = Math.floor(100 / numOfBins);

  const valueArray = geoJSON.features
    .map(feature => parseFloat(feature.properties[indicator]))
    .sort((a, b) => a - b);

  for (let i = 0; i < numOfBins; i++) {
    let p = null;
    const m = i + 1;
    if (i !== numOfBins - 1) {
      p = percentile(pRange * m, valueArray);
    } else p = percentile(100, valueArray);

    binArray.push({
      label: '',
      percentile: p,
      color: colors[i]
    });
  }
  const arrayWithLabels = [...binArray].map((obj, i) => {
    const prevValue = i !== 0 ? binArray[i - 1].percentile : 0;
    const currentValue = obj.percentile;

    if (i === 0 && prevValue !== currentValue) {
      obj.label = `0 - ${currentValue}`;
    } else if (i !== 0 && prevValue !== currentValue) {
      const isInt = Number.isInteger(prevValue);
      obj.label = `${!isInt ? incrementDecimalNumber(prevValue) : prevValue + 1} - ${currentValue}`;
    } else {
      obj.label = currentValue;
    }
    return obj;
  });
  return arrayWithLabels;
};

export { handleBinning };
