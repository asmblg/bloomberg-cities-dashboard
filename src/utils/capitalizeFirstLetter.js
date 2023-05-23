/**
 *
 * @param {string} str
 * @returns str with a capital first letter and remaining letters lowercase
 */

const capitalizeFirstLetter = str => {
  str = str.toLowerCase();
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
};

export default capitalizeFirstLetter;
