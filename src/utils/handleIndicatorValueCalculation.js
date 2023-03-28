import getMostRecentDateKeys from './getMostRecentDateKeys';
import calculateInversePercent from './calculateInversePercent';
import addPercentages from './addPercentages';

/**
 *
 * @param {object} config Configuration for indicator from manifest
 * @param {object} data Data object from database
 * @returns calculated value
 */

const handleIndicatorValueCalculation = ({ config, data }) => {
  if (config.type && config.initialValue && data[config.initialValue]) {
    const [mostRecentDate] = getMostRecentDateKeys(Object.keys(data[config.initialValue]));
    let value = data[config.initialValue][mostRecentDate] || null;

    if (value) {
      switch (config.type) {
        case 'inversePercent': {
          const otherVal = data[config.otherValue]?.[mostRecentDate] || null;
          value = calculateInversePercent(value, otherVal || null);
          break;
        }
        case 'addPercentages': {
          const otherVal = data[config.otherValue]?.[mostRecentDate] || null;
  
          if (otherVal) {
            value = addPercentages(value, otherVal, 1);
          }
          break;
        }
        case 'sumOfMultiple': {
          if (config.otherValues && config.otherValues[0]) {
            value = parseFloat(value);
            config.otherValues.forEach(indicator => {
              if (data[indicator][mostRecentDate]) {
                value += parseFloat(data[indicator][mostRecentDate]);
              }
            });
          }
          break;
        }
        case 'differenceFromTotal': {
          value = parseFloat(value);
          if (config.addTo && data[config.addTo]?.[mostRecentDate]) {
            value += parseFloat(data[config.addTo][mostRecentDate]);
          }

          if (config.subtractFrom && data[config.subtractFrom]?.[mostRecentDate]) {
            value = parseFloat(data[config.subtractFrom][mostRecentDate]) - value;
          }
          break;
        }
        default: {
          break;
        }
      }
      return value;
    } 
    return null;
  }
  return null;
};

export default handleIndicatorValueCalculation;
