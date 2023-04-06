import getMostRecentDateKeys from './getMostRecentDateKeys';
/**
 *
 * @param {object} data object with nested objects with keys that are years
 * @returns {object} new object with values that correspond to the most recent year in data parameter
 */
const getAllNestedValuesByYear = data => {
  const dataObj = {};

  if (data) {
    Object.entries(data).forEach(([key, valueObj]) => {
      const mostRecentYear = getMostRecentDateKeys(Object.keys(valueObj), 1);
      dataObj[key] = valueObj[mostRecentYear];
    });
  }
  return dataObj;
};

export default getAllNestedValuesByYear;
