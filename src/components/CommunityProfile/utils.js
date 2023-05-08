import addCalculatedIndicatorToDataObj from '../../utils/addCalculatedIndicatorToDataObj';

const handleCpData = (data) => {
  const obj = {};
  Object.entries(data).forEach(([key, value]) => {
    Object.keys(value).forEach(year => {
      obj[year] = obj[year] ? { ...obj[year] } : {};
      obj[year][key] = value[year];
    });
  });

  return obj;
};

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

const handleCalculator = (data, indicator) => {
  const calculatedData = indicator.calculator
    ? addCalculatedIndicatorToDataObj(indicator, data)
    : data;
  
  const value = calculatedData?.[indicator.key] || null;
  return value;
};

export { handleCpData, handleDonutDataArray, handleCalculator };
