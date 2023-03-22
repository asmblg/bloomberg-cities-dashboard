/**
 *
 * @param {array} dates array of dates formatted either in YYYY-MM-DD or YYYY-QX
 * @param {number} numOfDates number of dates wanted to be returned
 * @returns Array of two values. First Value: The most recent quarter or the last month in the most recent quarter's date. Second Value: The previous quarter or the last month in previous quarter's date
 */

const getRecentQuarterEndDates = (dates, numOfDates) => {
  // const quarterEndDates = [];
  const regex = /^\d{4}-(Q\d)$/; // checks if date is in YYYY-QX format
  const sortedDates = dates
    .filter(date => {
      const isQuarter = regex.test(date);
      const month = new Date(date).getMonth() + 1;
      return isQuarter || month === 3 || month === 6 || month === 9 || month === 12;
    })
    .sort((a, b) => {
      const isQuarter = regex.test(a) && regex.test(b);

      if (isQuarter) {
        return new Date(b.replace(/Q/g, '')) - new Date(a.replace(/Q/g, ''));
      } else {
        return new Date(b) - new Date(a);
      }
    });

  return sortedDates.slice(0, numOfDates);
};

export default getRecentQuarterEndDates;
