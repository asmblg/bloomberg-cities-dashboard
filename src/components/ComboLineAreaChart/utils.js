import getNestedValue from '../../utils/getNestedValue';
import sortDatesArray from '../../utils/sortDatesArray';

const dataPathConstructor = ({
  basePathKey,
  categoryKey,
  indicatorKey
}) =>
  `${basePathKey}.${categoryKey}.${indicatorKey}`.replace(/\.\.+/, '.');

const handleData = ({
  data,
  basePathKey,
  categoryKey,
  indicatorKey,
  dataSelection
}) => {
  const dataPath = dataPathConstructor({
    basePathKey,
    categoryKey,
    indicatorKey
  });
  // Handle data selection if total, string, or array
  const dataArray = [];
  const nestedData = getNestedValue(data, dataPath);
  if (dataSelection && nestedData) {
    if (dataSelection === 'total') {
      const dataObj = {};
      Object.values(nestedData).forEach(values => {
        Object.entries(values).forEach(([key, nestedValue]) => {
          const date = new Date(key);
          const year = date.getFullYear();
          const month = date.getMonth();
          const quarter = month >= 0 && month <= 2 ?
            1
            : month >= 3 && month <= 5 ?
              2
              : month >= 6 && month <= 8 ?
                3
                : month >= 9 && month <= 11 ?
                  4
                  : null;

          const dateKey = `${year}-Q${quarter}`;

          if (!isNaN(parseInt(nestedValue))) {
            if (!dataObj[dateKey]) {
              dataObj[dateKey] = parseInt(nestedValue);
            } else {
              dataObj[dateKey] += parseInt(nestedValue);
            }
          }
        });
      });
      Object.entries(dataObj)
        .forEach(([key, value]) => {
          const formattedObj = {};
          formattedObj.name = key;
          formattedObj[dataSelection] = value;
          dataArray.push(formattedObj);
        });
    } else if (!Array.isArray(dataSelection)) {
      const selectedData = nestedData[dataSelection];
      const dataObj = {};

      if (selectedData) {
        Object.entries(selectedData).forEach(([key, nestedValue]) => {
          const date = new Date(key);
          const year = date.getFullYear();
          const month = date.getMonth();
          const quarter = month >= 0 && month <= 2 ?
            1
            : month >= 3 && month <= 5 ?
              2
              : month >= 6 && month <= 8 ?
                3
                : month >= 9 && month <= 11 ?
                  4
                  : null;

          const dateKey = `${year}-Q${quarter}`;

          if (!isNaN(parseInt(nestedValue))) {
            if (!dataObj[dateKey]) {
              dataObj[dateKey] = parseInt(nestedValue);
            } else {
              dataObj[dateKey] += parseInt(nestedValue);
            }
          }
        });
        Object.entries(dataObj)
          .forEach(([key, value]) => {
            const formattedObj = {};
            formattedObj.name = key;
            formattedObj[dataSelection] = value;
            dataArray.push(formattedObj);
          });
      }
    } else if (Array.isArray(dataSelection)) {
      const dataObj = {};
      dataSelection.forEach(({
        key: selectionKey
      }) => {
        if (nestedData[selectionKey]) {
          // dataObj[selectionKey] = {};

          const nestedValues = nestedData[selectionKey];
          Object.entries(nestedValues).forEach(([key, nestedValue]) => {
            const date = new Date(key);
            const year = date.getFullYear();
            const month = date.getMonth();
            const quarter = month >= 0 && month <= 2 ?
              1
              : month >= 3 && month <= 5 ?
                2
                : month >= 6 && month <= 8 ?
                  3
                  : month >= 9 && month <= 11 ?
                    4
                    : null;

            const dateKey = `${year}-Q${quarter}`;

            if (!isNaN(parseInt(nestedValue))) {
              if (!dataObj[dateKey]) {
                dataObj[dateKey] = {};
              }
              if (!dataObj[dateKey][selectionKey]) {
                dataObj[dateKey][selectionKey] = parseInt(nestedValue);
              } else {
                dataObj[dateKey][selectionKey] += parseInt(nestedValue);
              }
            }
          });
        }
      });
      // console.log(dataObj);
      Object.entries(dataObj)
        .forEach(([key, values]) => {
          const formattedObj = {};
          formattedObj.name = key;
          Object.entries(values).forEach(([nestedKey, nestedValue]) =>
            formattedObj[nestedKey] = nestedValue
          );
          dataArray.push(formattedObj);
        });
    }
  }

  const sortedArray = sortDatesArray(dataArray, 'ascending', 'name');

  return sortedArray;
};


export { handleData };