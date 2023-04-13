import addCalculatedIndicatorToDataObj from '../../utils/addCalculatedIndicatorToDataObj';

const handleDonutDataArray = (indicators, data, colors) => {
  const colorMap = indicators.length <= colors.length ? colors : null;

  if (colorMap) {
    const dataArray = indicators.map((indicator, i) => {
      const obj = {
        name: indicator.label || '',
        color: colors[i]
      };
      const calculatedData = addCalculatedIndicatorToDataObj(indicator, data);
      obj.value = parseFloat(calculatedData[indicator.key]);
      return obj;
    });
    return dataArray;
  }
  return null;
};

export { handleDonutDataArray };
