/**
 *
 * @param {string} str String representation of a quarter date in the format of YYYY-QX
 * @returns quarter date in format QX-YY
 */

const formatQuarter = str => {
  const [year, quarterNum] = str.split('-Q');
  return `Q${quarterNum}-${year.slice(2, 4)}`;
};

export default formatQuarter;
