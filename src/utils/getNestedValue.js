/**
 *
 * @param {object} obj object with nested value(s)
 * @param {string} string string that represents path to nested value(s)
 * @param {string} mainKey the first key in the string. Will be removed from the string if present
 * @returns nested value(s) or null
 */

const getNestedValue = (object, string, mainKey) => {
  if (object && string) {
    const path = mainKey ? string.replace(`${mainKey}.`, '') : string; // Remove the first key from string because this is only needed in API call
    const keys = path.split('.'); // split string by dot to get nested keys
    let value = { ...object };

    for (const key of keys) {
      if (value && value[key]) {
        value = value[key]; // get value for current key
      } else {
        return null; // key does not exist in object
      }
    }
    return value;
  }
  return null;
};

export default getNestedValue;
