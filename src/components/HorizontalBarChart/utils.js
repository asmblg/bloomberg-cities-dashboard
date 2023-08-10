import getNestedValue from '../../utils/getNestedValue';
import getMostRecentDateKeys from '../../utils/getMostRecentDateKeys';

const handleData = (data, config) => {
  if (data) {
    const nestedData = config?.dataPath ? getNestedValue(data, config.dataPath) : data;
    const mostRecentDateKey = nestedData ? getMostRecentDateKeys(Object.keys(nestedData), 1) : null;
    const dataObj = mostRecentDateKey ? nestedData[mostRecentDateKey[0]] : null;

    if (dataObj) {
      const dataArray = config?.labels?.[0]?.key
        ? config.labels.map(label => ({
          name: label.text || label.key,
          value: dataObj[label.key] || ''
        })).filter(({ value }) => value)
        : Object.keys(dataObj).map(key => ({
          name: key,
          value: dataObj[key]
        }));

      const valueCalculation = config?.valueCalculation;

      switch (valueCalculation) {
        case 'valuesToPercentages': {
          return {dataArr: arrayValuesToPercentage(dataArray), currentAsOf: mostRecentDateKey?.[0]};
        }
        default: {
          return {
            dataArr: dataArray.map(({ name, value }) => ({
              widthValue: `${value}px`,
              value,
              name
            })),
            currentAsOf: mostRecentDateKey
          };
        }
      }
    }
  }
  return {};
};

function arrayValuesToPercentage(data) {
  const total = data.reduce((accumulator, current) => accumulator + current.value || 0, 0);
  console.log(total);
  
  return data.map(({ name, value }) => {
    const percentValue = value ? (value / total) * 100 : null;

    return {
      widthValue: percentValue ? `${parseFloat(percentValue.toFixed(1))}%` : 0,
      value: percentValue ? `${parseFloat(percentValue.toFixed(1))}%` : '',
      name
    };
  });
}

export { handleData };