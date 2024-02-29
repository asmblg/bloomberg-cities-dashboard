import getNestedValue from '../../utils/getNestedValue';
import sortDatesArray from '../../utils/sortDatesArray';
import padDate from '../../utils/padDate';
import moment from 'moment';

const dataPathConstructor = ({
  basePathKey,
  categoryKey,
  indicatorKey
}) =>
  `${basePathKey}.${categoryKey}.${indicatorKey}`.replace(/\.\.+/, '.');


const getQuarterDateKey = key => {
  let date = new Date(key);
  if (Object.prototype.toString.call(date) === '[object Date]') {
    if (isNaN(date)) {
      date = new Date(padDate(key));
    }
  }
  // const year = date.getFullYear();
  // const month = date.getMonth();
  const year = moment(date.getTime()).utc().year();
  const quarter = moment(date.getTime()).utc().quarter();
  // const quarter = month >= 0 && month <= 2 ?
  //   1
  //   : month >= 3 && month <= 5 ?
  //     2
  //     : month >= 6 && month <= 8 ?
  //       3
  //       : month >= 9 && month <= 11 ?
  //         4
  //         : null;



  return `${year}-Q${quarter}`;

};


const handleData = ({
  data,
  totalFilter,
  basePathKey,
  categoryKey,
  indicatorKey,
  dataSelection,
  average,
  calculator,
  trendValue
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
      Object.entries(nestedData)
        .filter(([key,]) => totalFilter ? totalFilter.includes(key): true)
        .forEach(([,values]) => {
          Object.entries(values).forEach(([key, nestedValue]) => {

            const dateKey = getQuarterDateKey(key);

            if (!isNaN(Number(nestedValue))) {
              if (average){
                if (!dataObj[dateKey]) {
                  dataObj[dateKey] = [Number(nestedValue)];
                } else {
                  dataObj[dateKey].push(Number(nestedValue));
                }
              } else if (!dataObj[dateKey]) {
                dataObj[dateKey] = Number(nestedValue);
              } else {
                dataObj[dateKey] += Number(nestedValue);
              }
            }
          });
        });
      // console.log(dataObj);
      Object.entries(dataObj)
        .forEach(([key, value]) => {
          const formattedObj = {};
          formattedObj.name = key;
          if (average) {
            formattedObj[dataSelection] = value[0] ? value.reduce((a,b) => a + b, 0)/value.length : null;
          } else {
            formattedObj[dataSelection] = value;
          }
          dataArray.push(formattedObj);
        });
    } else if (!Array.isArray(dataSelection)) {
      const selectedData = nestedData[dataSelection];
      const dataObj = {};

      if (selectedData) {
        Object.entries(selectedData).forEach(([key, nestedValue]) => {

          const dateKey = getQuarterDateKey(key);

          // if (!isNaN(Number(nestedValue))) {
          //   if (!dataObj[dateKey]) {
          //     dataObj[dateKey] = Number(nestedValue);
          //   } else {
          //     dataObj[dateKey] += Number(nestedValue);
          //   }
          // }

          if (!isNaN(Number(nestedValue))) {
            if (average){
              if (!dataObj[dateKey]) {
                dataObj[dateKey] = [Number(nestedValue)];
              } else {
                dataObj[dateKey].push(Number(nestedValue));
              }
            } else if (!dataObj[dateKey]) {
              dataObj[dateKey] = Number(nestedValue);
            } else {
              dataObj[dateKey] += Number(nestedValue);
            }
          }
        });
        Object.entries(dataObj)
          .forEach(([key, value]) => {
            const formattedObj = {};
            formattedObj.name = key;
            if (average) {
              formattedObj[dataSelection] = value[0] ? value.reduce((a,b) => a + b, 0)/value.length : null;
            } else {
              formattedObj[dataSelection] = value;
            }
            dataArray.push(formattedObj);
          });
      }
    } else if (Array.isArray(dataSelection)) {
      const dataObj = {};
      dataSelection.forEach(({
        key: selectionKey
      }) => {
        if (nestedData[selectionKey]) {

          const nestedValues = nestedData[selectionKey];
          Object.entries(nestedValues).forEach(([key, nestedValue]) => {

            const dateKey = getQuarterDateKey(key);

            if (!isNaN(Number(nestedValue))) {
              if (!dataObj[dateKey]) {
                dataObj[dateKey] = {};
              }
              if (average){
                if (!dataObj[dateKey][selectionKey]) {
                  dataObj[dateKey][selectionKey] = [Number(nestedValue)];
                } else {
                  dataObj[dateKey][selectionKey].push(Number(nestedValue));
                }
              } else if (!dataObj[dateKey][selectionKey]) {
                dataObj[dateKey][selectionKey] = Number(nestedValue);
              } else {
                dataObj[dateKey][selectionKey] += Number(nestedValue);
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
          Object.entries(values).forEach(([nestedKey, nestedValue]) =>{
            if (average) {
              formattedObj[nestedKey] = nestedValue[0] ? nestedValue.reduce((a,b) => a + b, 0)/nestedValue.length : null;
            } else {
              formattedObj[nestedKey] = nestedValue;
            }  
          // formattedObj[nestedKey] = nestedValue
          });
          dataArray.push(formattedObj);
        });
    }
  }

  if (calculator === 'percentChange') {
    const calculatedArray = [];
    const dataObj = {};
    dataArray.forEach(obj => {
      const dateKey = obj.name;
      delete obj.name;
      dataObj[dateKey] = obj; 
    });

    Object.entries(dataObj).forEach(([dateKey, obj]) => {
      // console.log(dateKey);
      const splitDateKey = dateKey.split('-');
      const dataQuarter = splitDateKey[1].replace(/q/i, '');
      const dataYear = splitDateKey[0];

      const calculatedObj = {
        name: dateKey
      };
      // console.log(dateKey, obj);
      Object.entries(obj).forEach(([valueKey, value]) => {
        // if (trendValue === 'QtQ') {
        const comparisonQuarter = trendValue === 'QtQ' 
          ? Number(dataQuarter) === 1 ? 4 : Number(dataQuarter) - 1
          : Number(dataQuarter);
        const comparisonYear = trendValue === 'QtQ' 
          ? Number(dataQuarter) === 1 ? Number(dataYear) - 1 : dataYear
          : Number(dataYear) - 1;
        const comparisonDateKey = `${comparisonYear}-Q${comparisonQuarter}`;
        const comparisonValue = dataObj?.[comparisonDateKey]?.[valueKey];
        if (comparisonValue) {
          calculatedObj[valueKey] = 100 * ((value - comparisonValue)/comparisonValue);
        }
        // }
      });
      if (Object.keys(calculatedObj)?.[1]) {
        calculatedArray.push(calculatedObj);
      }
    });
    const sortedArray = sortDatesArray(calculatedArray, 'ascending', 'name');
    return sortedArray;
  }

  const sortedArray = sortDatesArray(dataArray, 'ascending', 'name');

  return sortedArray;
};


export { handleData };