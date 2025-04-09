import getNestedValue from '../../utils/getNestedValue';
import getMostRecentDateKeys from '../../utils/getMostRecentDateKeys';

const handleData = (data, config) => {
  if (data) {
    const nestedData = config?.dataPath ? getNestedValue(data, config.dataPath) : data;
    // console.log({nestedData, config});
    const dateKeys =
      nestedData && config.dataPathInfo !== 'no-dates'
        ? getMostRecentDateKeys(Object.keys(nestedData), 1)
        : null;
     
    // console.log({nestedData, dateKeys, config});

    const dataObj = dateKeys
      ? nestedData[dateKeys[0]]
      : config.dataPathInfo === 'no-dates'
        ? nestedData
        : null;

    if (dataObj) {
      const dataArray = config?.labels?.[0]?.key
        ? config.labels.map(label => ({
          name: label.text || label.key,
          value: dataObj[label.key] || ''
        }))
        : Object.keys(dataObj).map(key => ({
          name: key,
          value: dataObj[key]
        }));

      const filteredDataArray = dataArray
        .filter(({ value }) => value)
        .map(({value, name}) => {
          if (typeof value === 'string' || typeof value === 'number') {
            return {value, name}
          } else if (typeof value === 'object') {
            const mostRecentDateKey = Object.keys(value).sort((a, b) => {
              const dateA = a.split('-Q').join('');
              const dateB = b.split('-Q').join('');
              return Number(dateB) - Number(dateA);
            });
            return {
              name,
              value: value[mostRecentDateKey[0]]
            }
          }
        });

        // console.log({ filteredDataArray });

      if (config.sortValues) {
        filteredDataArray
        .sort((a, b) =>
          config.sortValues === 'descending' ? b.value - a.value : a.value - b.value
        );
      };
            

      const valueCalculation = config?.valueCalculation;

      switch (valueCalculation) {
        case 'valuesToPercentages': {
          return { dataArr: arrayValuesToPercentage(filteredDataArray), currentAsOf: dateKeys?.[0] };
        }
        default: {
          return {
            dataArr: calculateBarPercentages(filteredDataArray),
            currentAsOf: dateKeys?.[0]
          };
        }
      }
    }
  }
  return {};
};

function arrayValuesToPercentage(data) {
  const total = data.reduce((accumulator, current) => accumulator + current.value || 0, 0);

  return data.map(({ name, value }) => {
    const percentValue = value ? (value / total) * 100 : null;

    return {
      widthValue: percentValue ? `${parseFloat(percentValue.toFixed(1))}%` : 0,
      value: percentValue ? `${parseFloat(percentValue.toFixed(1))}%` : '',
      name
    };
  });
}

function calculateBarPercentages(array) {
  // Find the highest value
  let maxValue = 0;
  array.forEach(obj => {
    if (obj.value > maxValue) {
      maxValue = obj.value;
    }
  });

  // Calculate and assign bar percentages
  return array.map(obj => ({
    ...obj,
    widthValue: `${(obj.value / maxValue) * 100}%`
  }));
}

export { handleData };
