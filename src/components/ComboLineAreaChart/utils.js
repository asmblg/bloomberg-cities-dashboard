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
  average
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

            if (!isNaN(parseInt(nestedValue))) {
              if (average){
                if (!dataObj[dateKey]) {
                  dataObj[dateKey] = [parseInt(nestedValue)];
                } else {
                  dataObj[dateKey].push(parseInt(nestedValue));
                }
              } else if (!dataObj[dateKey]) {
                dataObj[dateKey] = parseInt(nestedValue);
              } else {
                dataObj[dateKey] += parseInt(nestedValue);
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

          // if (!isNaN(parseInt(nestedValue))) {
          //   if (!dataObj[dateKey]) {
          //     dataObj[dateKey] = parseInt(nestedValue);
          //   } else {
          //     dataObj[dateKey] += parseInt(nestedValue);
          //   }
          // }

          if (!isNaN(parseInt(nestedValue))) {
            if (average){
              if (!dataObj[dateKey]) {
                dataObj[dateKey] = [parseInt(nestedValue)];
              } else {
                dataObj[dateKey].push(parseInt(nestedValue));
              }
            } else if (!dataObj[dateKey]) {
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

            if (!isNaN(parseInt(nestedValue))) {
              if (!dataObj[dateKey]) {
                dataObj[dateKey] = {};
              }
              if (average){
                if (!dataObj[dateKey][selectionKey]) {
                  dataObj[dateKey][selectionKey] = [parseInt(nestedValue)];
                } else {
                  dataObj[dateKey][selectionKey].push(parseInt(nestedValue));
                }
              } else if (!dataObj[dateKey][selectionKey]) {
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

  const sortedArray = sortDatesArray(dataArray, 'ascending', 'name');

  return sortedArray;
};


export { handleData };