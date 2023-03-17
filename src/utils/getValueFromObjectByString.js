/**
 *
 * @param {string} key
 * @param {object} object
 * @param {string} string
 * @returns data object
 */

const getValueFromObjectByString = (key, object, string) => {
  let obj = { ...object };
  let str = string.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  str = str.replace(/^\./, ''); // strip a leading dot
  const arr = str.split('.').filter(str => str !== key);

  for (let index = 0; index < arr.length; index++) {
    let value = arr[index];
    if (value in obj) {
      obj = obj[value];
    } else {
      return;
    }
  }
  return obj;
};

export default getValueFromObjectByString;
