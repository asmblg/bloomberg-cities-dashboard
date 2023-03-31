import getMostRecentDateKeys from '../../utils/getMostRecentDateKeys';
import sortDatesArray from '../../utils/sortDatesArray';

const handleDataArrayAndOtherDataKeys = ({
  data,
  mainLine,
  selectedIndicator,
  config,
  compareLine
}) => {
  const mainLineData = data[mainLine][selectedIndicator.key];
  const otherKeys = [];
  const dateKeys = getMostRecentDateKeys(Object.keys(mainLineData), config.dataLength);
  
  const dataArr = sortDatesArray(dateKeys, 'ascending').map(key => {
    const obj = {
      key,
      main: mainLineData[key] 
    };

    if (compareLine && data[compareLine]?.[selectedIndicator.key]) {
      obj.compare = data[compareLine][selectedIndicator.key][key];
    }
    // console.log(config.displayAllCities);
    if (config.displayAllCities) {
      const otherLines = Object.keys(data).filter(key => key !== mainLine && key !== compareLine);

      otherLines.forEach(city => {
        otherKeys.push(city);
        obj[city] = data[city][selectedIndicator.key][key];
      });
    }
    return obj;
  });

  return {
    dataArr,
    keys: otherKeys
  };
};

const handleIndicators = (data, config) => {
  const returnObj = {};

  if (!config.preselectedIndicator) {
    const indicatorsArr = Object.keys(data).map(key => ({
      short_name: key,
      key
    }));
  
    if (indicatorsArr[0]) {
      returnObj.indicatorsArray = indicatorsArr;
      returnObj.currentIndicator = indicatorsArr[indicatorsArr.length - 1];
    }
  } else {
    returnObj.currentIndicator = {
      key: config.preselectedIndicator,
      short_name: config.preselectedIndicator
    };
  }
  return returnObj;
};

const handleTicks = (array, tickCount) => {
  const values = [];
  
  array.forEach(obj => {
    const dataKeys = Object.keys(obj).filter(key => key !== 'key');
    dataKeys.forEach(key => {
      values.push(parseFloat(obj[key]));
    });
    // console.log(dataKeys);
  });
  
  const sortedValues = values.sort((a, b) => b - a);
  const tickInterval = Math.ceil(sortedValues[0] / tickCount);
  console.log(tickInterval);
  const ticks = [];
  for (let i = 0; i <= tickCount; i++) {
    ticks.push(i * tickInterval);
  }
  return ticks;
};

export { handleDataArrayAndOtherDataKeys, handleIndicators, handleTicks };